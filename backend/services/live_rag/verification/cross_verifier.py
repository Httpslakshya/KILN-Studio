"""
Multi-source factual claim verification and corroboration engine.
Verifies whether at least 2 independent source domains corroborate a claim.
"""

import re
from typing import List, Dict, Any
from backend.utils.logging_config import logger
from backend.services.rag import call_llm


class CrossSourceVerifier:
    """
    Evaluates factual claims extracted from live news items and tests for multi-source consensus.
    Enforces the rule: >= 2 independent source domains must corroborate a claim for 'VERIFIED' status.
    """

    def __init__(self, min_sources_for_verification: int = 2):
        self.min_sources = min_sources_for_verification

    def verify_news_claims(self, query: str, articles: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Extracts key claims from the articles, correlates them across independent publisher domains,
        and returns verified claims, confidence scores, and source citations.
        """
        if not articles:
            return {
                "claims": [],
                "overall_verification_rate": 0.0,
                "corroborated_count": 0,
                "total_claims": 0
            }

        # 1. Build domain mapping and corpus
        domain_articles: Dict[str, List[Dict[str, Any]]] = {}
        for art in articles:
            dom = art.get("source_domain", "unknown-source.org")
            domain_articles.setdefault(dom, []).append(art)

        # 2. Extract atomic claims using LLM with structured output prompt
        claims = self._extract_atomic_claims(query, articles)

        # 3. Corroborate each claim against independent domains
        corroborated_claims = []
        for claim_obj in claims:
            statement = claim_obj.get("statement", "")
            agreeing_domains = self._find_agreeing_domains(statement, articles)
            
            # Add original source domain if not present
            orig_domain = claim_obj.get("primary_domain", "")
            if orig_domain and orig_domain not in agreeing_domains:
                agreeing_domains.append(orig_domain)

            unique_domains = list(set(agreeing_domains))
            domain_count = len(unique_domains)
            
            if domain_count >= self.min_sources:
                status = "VERIFIED"
                confidence = min(0.98, 0.70 + (0.10 * domain_count))
            elif domain_count == 1:
                status = "UNVERIFIED_SINGLE_SOURCE"
                confidence = 0.45
            else:
                status = "DISPUTED_OR_UNCONFIRMED"
                confidence = 0.20

            corroborated_claims.append({
                "statement": statement,
                "status": status,
                "confidence_score": round(confidence, 2),
                "corroborating_domains": unique_domains,
                "domain_count": domain_count,
                "category": claim_obj.get("category", "General"),
                "is_verified": domain_count >= self.min_sources
            })

        verified_count = sum(1 for c in corroborated_claims if c["is_verified"])
        total_claims = len(corroborated_claims)
        rate = round(verified_count / total_claims, 2) if total_claims > 0 else 0.0

        return {
            "claims": corroborated_claims,
            "overall_verification_rate": rate,
            "corroborated_count": verified_count,
            "total_claims": total_claims,
            "independent_domains_consulted": list(domain_articles.keys())
        }

    def _extract_atomic_claims(self, query: str, articles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Uses LLM to distill 4-8 atomic, falsifiable factual assertions from the articles."""
        context_lines = []
        for i, art in enumerate(articles[:8], 1):
            context_lines.append(
                f"[{i}] Publisher: {art.get('source_domain')} | Title: {art.get('title')}\n"
                f"    Snippet: {art.get('summary')}"
            )
        articles_context = "\n\n".join(context_lines)

        system_prompt = """You are a rigorous Fact-Checking Claim Extractor.
Given live news snippets from various sources, extract between 3 to 6 distinct, atomic factual statements or claims.
Output each claim in JSON format as a list of objects with keys:
- "statement": concise, clear, falsifiable factual sentence.
- "category": e.g. "Metric", "Policy", "Event", "Quote", or "Tech".
- "primary_domain": the publisher domain that reported this.

Output ONLY valid JSON without markdown wrapping."""

        user_prompt = f"Query Topic: {query}\n\nLive News Excerpts:\n{articles_context}\n\nExtract atomic claims:"

        try:
            raw_response = call_llm(system_prompt, user_prompt, role="verifier")
            cleaned = self._clean_json_str(raw_response)
            import json
            parsed = json.loads(cleaned)
            if isinstance(parsed, list):
                return parsed
            elif isinstance(parsed, dict) and "claims" in parsed:
                return parsed["claims"]
        except Exception as e:
            logger.warning(f"CrossSourceVerifier: LLM claim extraction failed ({e}), using heuristic fallback.")

        # Fallback: extract sentences directly from top articles
        fallback_claims = []
        for art in articles[:4]:
            title = art.get("title", "")
            if title and len(title) > 20:
                clean_title = re.sub(r" - [^-]+$", "", title)
                fallback_claims.append({
                    "statement": clean_title,
                    "category": "Event",
                    "primary_domain": art.get("source_domain", "news.org")
                })
        return fallback_claims

    def _find_agreeing_domains(self, claim: str, articles: List[Dict[str, Any]]) -> List[str]:
        """
        Finds all unique publisher domains whose article titles or summaries discuss
        the salient entities/keywords of the claim.
        """
        keywords = set(re.findall(r"\b[a-zA-Z0-9]{4,}\b", claim.lower()))
        common_words = {"this", "that", "with", "from", "after", "about", "their", "have", "more", "will", "been", "says", "report"}
        keywords -= common_words

        if not keywords:
            return []

        agreeing_domains = set()
        for art in articles:
            text = f"{art.get('title', '')} {art.get('summary', '')}".lower()
            overlap_count = sum(1 for kw in keywords if kw in text)
            # If at least 40% of salient keywords or at least 2 distinct key terms match
            if overlap_count >= min(2, len(keywords)) or (len(keywords) > 0 and (overlap_count / len(keywords)) >= 0.4):
                dom = art.get("source_domain")
                if dom:
                    agreeing_domains.add(dom)
                    # Also include any co-sources discovered during dedup
                    for co in art.get("co_sources", []):
                        agreeing_domains.add(co)

        return list(agreeing_domains)

    @staticmethod
    def _clean_json_str(text: str) -> str:
        """Strips markdown code fences and whitespace."""
        text = text.strip()
        if text.startswith("```"):
            lines = text.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            text = "\n".join(lines).strip()
        return text
