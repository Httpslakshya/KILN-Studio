"""
Fact-Checker / Verifier Agent: Cross-verifies claims across independent publisher domains.
Protected and vetted using AgentPrahari.
"""

from datetime import datetime, timezone
from typing import List
from backend.services.live_rag.verification.cross_verifier import CrossSourceVerifier
from backend.services.content_pipeline.state import ContentPipelineState, PipelineStepLog, VerifiedClaim
from backend.services.live_rag.engine import AgentPrahari
from backend.utils.logging_config import logger


class VerifierAgent:
    """
    Fact-checking agent that tests claims for multi-source consensus.
    Guarantees that only claims corroborated by >= 2 independent domains receive 'VERIFIED' status.
    """

    def __init__(self):
        self.verifier = CrossSourceVerifier(min_sources_for_verification=2)
        self.guard = AgentPrahari.custom(
            enable_pii=True,
            enable_prompt_injection=True,
            enable_output_secrets=True
        )

    def run(self, state: ContentPipelineState) -> ContentPipelineState:
        logger.info(f"VerifierAgent: Running cross-source verification on {len(state.research_articles)} articles.")
        state.status = "VERIFYING"

        # Execute multi-source verification
        verification_report = self.verifier.verify_news_claims(state.topic, state.research_articles)

        verified_claims_list: List[VerifiedClaim] = []
        for c in verification_report.get("claims", []):
            # Guardrail check on each extracted claim statement
            guard_res = self.guard.validate_output(c.get("statement", ""))
            clean_stmt = guard_res.sanitized_content or c.get("statement", "")

            verified_claims_list.append(VerifiedClaim(
                statement=clean_stmt,
                status=c.get("status", "UNVERIFIED_SINGLE_SOURCE"),
                confidence_score=c.get("confidence_score", 0.5),
                corroborating_domains=c.get("corroborating_domains", []),
                category=c.get("category", "General")
            ))

        state.verified_claims = verified_claims_list

        verified_count = sum(1 for vc in verified_claims_list if vc.status == "VERIFIED")
        single_count = sum(1 for vc in verified_claims_list if vc.status == "UNVERIFIED_SINGLE_SOURCE")

        log_entry = PipelineStepLog(
            step_name="Factual Claim Verification",
            agent_name="VerifierAgent",
            timestamp=datetime.now(timezone.utc).isoformat(),
            summary=f"Extracted and cross-checked {len(verified_claims_list)} claims. Verified multi-source: {verified_count}, Single-source: {single_count}.",
            details={
                "verified_claims_count": verified_count,
                "single_source_count": single_count,
                "total_claims": len(verified_claims_list)
            }
        )
        state.step_logs.append(log_entry)
        return state
