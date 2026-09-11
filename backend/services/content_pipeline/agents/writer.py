"""
Writer Agent: Drafts comprehensive, structured, citation-grounded content.
"""

from datetime import datetime, timezone
from backend.services.content_pipeline.state import ContentPipelineState, PipelineStepLog
from backend.services.rag import call_llm
from backend.utils.logging_config import logger


class WriterAgent:
    """
    Synthesizes research and verified claims into a cohesive, publication-ready article.
    Strictly attaches bracketed citations to every claim.
    """

    def run(self, state: ContentPipelineState) -> ContentPipelineState:
        logger.info(f"WriterAgent: Drafting content for iteration {state.current_iteration}...")
        state.status = "WRITING"

        # Build context from sources and verified claims
        sources_text = "\n".join(
            f"[Source {c.index}: {c.source_domain}] {c.title} (Published: {c.published_at})"
            for c in state.citations
        )

        claims_text = "\n".join(
            f"- [{c.status}] ({c.confidence_score*100:.0f}% confidence | Corroborated by: {', '.join(c.corroborating_domains)}): {c.statement}"
            for c in state.verified_claims
        )

        # Include feedback if revising
        revision_context = ""
        if state.critiques:
            latest_critique = state.critiques[-1]
            revision_context = f"""
CRITICAL EDITOR REVISION INSTRUCTIONS:
The previous draft scored {latest_critique.score}/100 and required revisions.
Specific feedback to address:
{latest_critique.feedback}

Missing citations flagged:
{', '.join(latest_critique.missing_citations) if latest_critique.missing_citations else 'None'}
"""

        system_prompt = f"""You are an elite, world-class technical journalist, software architect, and technology writer.
Your mandate is to craft an authoritative, deeply useful, and publication-ready technical intelligence article.

CRITICAL EDITORIAL PRINCIPLES:
1. DELIVER CONCRETE TECHNICAL SUBSTANCE:
   - When discussing developer tools, plugins, frameworks, security practices, or workflows, NEVER write empty meta-commentary (e.g. DO NOT say "the source tested 100 plugins and selected 5 without naming them").
   - Synthesize the real-time research and verified claims WITH authoritative technical domain expertise.
   - Name and evaluate the specific, state-of-the-art tools, plugins, CLI utilities, and architectural patterns (e.g. for Claude Code: Repomix, Playwright MCP, Snyk Code Guard, Supermaven, SQLite/PostgreSQL MCP, Git hooks) that embody the verified findings and benchmarks.
   - Include practical code snippets, terminal commands, or comparison tables where helpful.
2. CITATION RIGOR:
   - Ground external news events, benchmark results, and security alerts with explicit citations like [Source X: domain.com].
   - For claims corroborated across multiple domains, highlight them with [VERIFIED: >=2 Sources].
   - For single-source claims, transparently caveat them with [SINGLE-SOURCE: domain.com].
   - Anchor statistics and dates to the provided research.
3. ARTICLE STRUCTURE:
   # Compelling, Authoritative Headline
   ## Executive Summary (Key Takeaways)
   ## Deep-Dive Technical Analysis (Detailed breakdown of specific tools, techniques, and workflows)
   ## Cross-Source Verification & Security Consensus (Evaluating the veracity of claims, risks, and independent findings)
   ## Strategic Implementation Blueprint (Actionable recommendations for engineering teams)
   ## Verified Source Index

Audience: {state.target_audience}
Editorial Tone & Style: {state.editorial_tone}
{revision_context}
"""

        user_prompt = f"""Topic: {state.topic}

Verified Claims:
{claims_text}

Available Primary Sources:
{sources_text}

Draft the verified intelligence article now:"""

        draft = call_llm(system_prompt, user_prompt, role="writer")
        state.current_draft = draft

        log_entry = PipelineStepLog(
            step_name=f"Drafting (Iteration {state.current_iteration})",
            agent_name="WriterAgent",
            timestamp=datetime.now(timezone.utc).isoformat(),
            summary=f"Drafted article ({len(draft.split())} words) with inline citations.",
            details={"word_count": len(draft.split()), "iteration": state.current_iteration}
        )
        state.step_logs.append(log_entry)
        return state
