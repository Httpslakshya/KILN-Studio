"""
Live Verified Agentic RAG Engine.
Combines real-time ingestion, time-decay freshness scoring, semantic deduplication,
multi-source cross-corroboration, and AgentPrahari safety guardrails.
"""

from typing import Dict, Any, List
from datetime import datetime, timezone
from agentprahari import AgentPrahari
from backend.services.live_rag.ingestion.rss_fetcher import LiveRSSFetcher
from backend.services.live_rag.ingestion.dedup_freshness import FreshnessAndDedupEngine
from backend.services.live_rag.verification.cross_verifier import CrossSourceVerifier
from backend.services.rag import call_llm
from backend.utils.logging_config import logger


class LiveVerifiedRAGEngine:
    """
    Production-grade Agentic RAG over live, verified real-time data streams.
    Protected end-to-end by AgentPrahari.
    """

    def __init__(self):
        self.fetcher = LiveRSSFetcher()
        self.freshness_dedup = FreshnessAndDedupEngine(half_life_hours=24.0)
        self.verifier = CrossSourceVerifier(min_sources_for_verification=2)
        # Initialize AgentPrahari with PII, prompt injection, and output secrets checks enabled
        self.guard = AgentPrahari.custom(
            enable_pii=True,
            enable_prompt_injection=True,
            enable_output_secrets=True,
            enable_toxicity=True
        )

    def query(self, user_query: str, max_articles: int = 10) -> Dict[str, Any]:
        """
        Executes an end-to-end Live Verified RAG pipeline:
        1. Guardrail input validation via AgentPrahari.
        2. Real-time RSS & news stream ingestion.
        3. Freshness decay scoring and semantic deduplication.
        4. Cross-source factual verification (>= 2 independent publisher domains).
        5. Citation-grounded synthesis with LLM.
        6. Output guardrail validation.
        """
        logger.info(f"LiveVerifiedRAGEngine: Processing query: '{user_query}'")

        # Step 1: Input Guardrail Check via AgentPrahari
        input_guard_res = self.guard.validate_input(user_query)
        if not input_guard_res.is_valid:
            logger.warning(f"LiveVerifiedRAG: Input blocked by AgentPrahari: {input_guard_res.rejection_reason}")
            return {
                "success": False,
                "error": f"Security Guardrail Blocked Input: {input_guard_res.rejection_reason}",
                "guardrail_audit": {
                    "decision": str(input_guard_res.decision),
                    "violations": [v.message for v in input_guard_res.violations]
                }
            }

        sanitized_query = input_guard_res.sanitized_content or user_query

        # Step 2: Live Ingestion
        raw_articles = self.fetcher.fetch_topic_feed(sanitized_query, max_items=18)
        if not raw_articles:
            return {
                "success": True,
                "query": sanitized_query,
                "answer": f"No recent live news articles could be retrieved for '{sanitized_query}'. Please try a broader news topic or search term.",
                "sources": [],
                "verified_claims": [],
                "metrics": {"articles_ingested": 0, "freshness_avg": 0.0}
            }

        # Step 3: Freshness Scoring & Deduplication
        unique_articles = self.freshness_dedup.process_and_dedup(raw_articles)
        selected_articles = unique_articles[:max_articles]
        
        avg_freshness = round(
            sum(a.get("freshness_score", 0.0) for a in selected_articles) / len(selected_articles), 2
        ) if selected_articles else 0.0

        # Step 4: Cross-Source Corroboration Engine
        verification_report = self.verifier.verify_news_claims(sanitized_query, selected_articles)

        # Step 5: Citation-Grounded LLM Synthesis
        synthesis_result = self._synthesize_grounded_answer(
            query=sanitized_query,
            articles=selected_articles,
            verification_report=verification_report
        )

        # Step 6: Output Guardrail Verification via AgentPrahari
        output_guard_res = self.guard.validate_output(
            output_text=synthesis_result,
            prompt=sanitized_query
        )

        final_answer = output_guard_res.sanitized_content or synthesis_result

        # Build clean source references
        citations = []
        for i, art in enumerate(selected_articles, 1):
            citations.append({
                "index": i,
                "title": art.get("title"),
                "source_name": art.get("source_name"),
                "source_domain": art.get("source_domain"),
                "url": art.get("url"),
                "published_at": art.get("published_at"),
                "freshness_score": art.get("freshness_score"),
                "co_sources": art.get("co_sources", [])
            })

        return {
            "success": True,
            "query": sanitized_query,
            "answer": final_answer,
            "citations": citations,
            "verification": verification_report,
            "metrics": {
                "articles_ingested": len(raw_articles),
                "articles_selected": len(selected_articles),
                "avg_freshness_score": avg_freshness,
                "overall_verification_rate": verification_report.get("overall_verification_rate", 0.0),
                "verified_claims_count": verification_report.get("corroborated_count", 0),
                "total_claims_count": verification_report.get("total_claims", 0)
            },
            "guardrail_audit": {
                "input_decision": str(input_guard_res.decision),
                "input_sanitized": input_guard_res.sanitized_content != user_query,
                "output_decision": str(output_guard_res.decision),
                "violations_count": len(input_guard_res.violations) + len(output_guard_res.violations)
            }
        }

    def _synthesize_grounded_answer(
        self,
        query: str,
        articles: List[Dict[str, Any]],
        verification_report: Dict[str, Any]
    ) -> str:
        """Synthesizes factual answer with strict inline citations and cross-verification status."""
        context_blocks = []
        for i, art in enumerate(articles, 1):
            context_blocks.append(
                f"[Source {i}] {art.get('source_domain')} ({art.get('source_name')}):\n"
                f"Headline: {art.get('title')}\n"
                f"Published: {art.get('published_at')} (Freshness: {art.get('freshness_score')})\n"
                f"Content: {art.get('summary')}"
            )
        articles_text = "\n\n---\n\n".join(context_blocks)

        verified_claims_text = "\n".join(
            f"- [{c['status']}] (Domains: {', '.join(c['corroborating_domains'])}): {c['statement']}"
            for c in verification_report.get("claims", [])
        )

        system_prompt = f"""You are an elite live intelligence analyst and real-time news synthesizer.
Your task is to synthesize an authoritative, fact-checked report answering the user's query using ONLY the provided verified context.

Guidelines:
1. Ground every substantive statement with an inline citation referring to [Source X: domain.com].
2. For claims verified by >= 2 independent domains, highlight them with a [VERIFIED - Multi-Source] tag.
3. For single-source claims, flag them with [SINGLE-SOURCE: domain.com].
4. Do not invent any numbers, quotes, or details not present in the sources.
5. Provide a crisp Executive Summary, Key Verified Findings, and Timeline/Context section.

Verified Claims Matrix:
{verified_claims_text}

Real-Time Source Context:
{articles_text}
"""
        user_prompt = f"Topic to analyze: {query}\n\nProvide the verified intelligence report:"
        return call_llm(system_prompt, user_prompt)
