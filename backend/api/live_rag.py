"""
Live Verified RAG & Multi-Agent Content Pipeline Router.
"""

from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional
from backend.services.live_rag.engine import LiveVerifiedRAGEngine
from backend.services.content_pipeline.orchestrator import MultiAgentContentOrchestrator
from backend.models.schemas import success_response, error_response
from backend.utils.logging_config import logger
from agentprahari import AgentPrahari

router = APIRouter(prefix="/api/live-rag", tags=["Live Verified RAG"])

# Singleton services
live_rag_engine = LiveVerifiedRAGEngine()
orchestrator = MultiAgentContentOrchestrator(max_revisions=2)
prahari = AgentPrahari.custom(
    enable_pii=True,
    enable_prompt_injection=True,
    enable_output_secrets=True,
    enable_toxicity=True
)


class LiveSearchRequest(BaseModel):
    query: str = Field(..., min_length=2, description="News topic or search query to verify")
    max_articles: int = Field(default=8, ge=1, le=20)


class PipelineRequest(BaseModel):
    topic: str = Field(..., min_length=2, description="Topic for multi-agent content generation")
    target_audience: str = Field(default="General Tech & Media Community")
    editorial_tone: str = Field(default="Authoritative Thought Leadership")
    max_revisions: int = Field(default=1, ge=0, le=3)
    enriched_pdf: Optional[str] = None


class GuardrailCheckRequest(BaseModel):
    text: str = Field(..., description="Text to validate using AgentPrahari")
    check_type: str = Field(default="input", description="'input' or 'output'")
    context: Optional[str] = None


@router.post("/search")
def api_live_search(req: LiveSearchRequest):
    """
    Real-time news search with exponential time-decay freshness scoring,
    semantic deduplication, and cross-source corroboration (>= 2 independent domains).
    Protected by AgentPrahari.
    """
    logger.info(f"API: Live Verified Search request: '{req.query}'")
    try:
        result = live_rag_engine.query(req.query, max_articles=req.max_articles)
        if not result.get("success", False):
            return error_response(
                message=result.get("error", "Live RAG search failed"),
                data=result.get("guardrail_audit"),
                status_code=400
            )
        return success_response(data=result, message="Live verified search completed successfully")
    except Exception as e:
        logger.error(f"api_live_search error: {e}", exc_info=True)
        return error_response(message=f"Live search failed: {str(e)}", status_code=500)


@router.post("/research-pipeline")
def api_research_pipeline(req: PipelineRequest):
    """
    Executes an autonomous 4-agent content pipeline:
    Researcher -> Verifier (cross-corroboration) -> Writer -> Editor/Critic (revision loop).
    """
    logger.info(f"API: Content Pipeline request: '{req.topic}'")
    try:
        # Pre-check input safety
        guard_res = prahari.validate_input(req.topic)
        if not guard_res.is_valid:
            return error_response(
                message=f"AgentPrahari blocked input: {guard_res.rejection_reason}",
                data={"decision": str(guard_res.decision), "violations": [v.message for v in guard_res.violations]},
                status_code=400
            )

        sanitized_topic = guard_res.sanitized_content or req.topic
        pipeline = MultiAgentContentOrchestrator(max_revisions=req.max_revisions)
        state = pipeline.execute_pipeline(
            sanitized_topic, 
            target_audience=req.target_audience,
            editorial_tone=req.editorial_tone
        )

        if state.status == "FAILED":
            return error_response(message="Pipeline encountered an execution failure", status_code=500)

        response_data = {
            "topic": state.topic,
            "status": state.status,
            "execution_time_seconds": state.execution_time_seconds,
            "iterations": state.current_iteration + 1,
            "final_article": state.final_output,
            "verified_claims": [c.model_dump() for c in state.verified_claims],
            "citations": [c.model_dump() for c in state.citations],
            "critiques": [c.model_dump() for c in state.critiques],
            "step_logs": [log.model_dump() for log in state.step_logs]
        }

        return success_response(data=response_data, message="Multi-agent content pipeline finished successfully")
    except Exception as e:
        logger.error(f"api_research_pipeline error: {e}", exc_info=True)
        return error_response(message=f"Content pipeline error: {str(e)}", status_code=500)


@router.post("/guardrails/check")
def api_guardrails_check(req: GuardrailCheckRequest):
    """
    Interactive test endpoint for AgentPrahari security guardrails.
    Evaluates PII masking, prompt injections, and output hallucination/secrets.
    """
    try:
        if req.check_type == "output":
            res = prahari.validate_output(req.text, context=req.context)
        else:
            res = prahari.validate_input(req.text)

        data = {
            "is_valid": res.is_valid,
            "decision": str(res.decision),
            "original_content": res.original_content,
            "sanitized_content": res.sanitized_content,
            "violations": [
                {
                    "rule_id": v.rule_id,
                    "message": v.message,
                    "severity": str(v.severity),
                    "matched_content": v.matched_content
                }
                for v in res.violations
            ],
            "rejection_reason": res.rejection_reason
        }
        return success_response(data=data, message="Guardrail validation evaluated")
    except Exception as e:
        return error_response(message=f"Guardrail evaluation failed: {str(e)}", status_code=500)


class RepurposeRequest(BaseModel):
    format_type: str = Field(..., description="Format: 'linkedin_post', 'carousel_slides', 'viral_reel_script', or 'infometry_blog'")
    topic: str = Field(..., description="Topic of the verified intelligence")
    content: str = Field(..., description="The verified report/article text")
    claims: Optional[list] = None


@router.post("/repurpose")
def api_repurpose_content(req: RepurposeRequest):
    """
    Transforms fact-checked research into creator-ready formats:
    - LinkedIn Post
    - Instagram / LinkedIn Carousel Slides
    - Viral Reel / Short Video Script
    - Infometry In-Depth Technical Blog
    """
    logger.info(f"API: Content repurposing requested for format '{req.format_type}' on '{req.topic}'")
    try:
        from backend.services.content_pipeline.repurposer import ContentRepurposer
        repurposer = ContentRepurposer()
        result = repurposer.repurpose(
            format_type=req.format_type,
            topic=req.topic,
            content=req.content,
            claims=req.claims
        )
        return success_response(data=result, message=f"Content successfully repurposed into {req.format_type}")
    except Exception as e:
        logger.error(f"api_repurpose_content error: {e}", exc_info=True)
        return error_response(message=f"Repurposing failed: {str(e)}", status_code=500)

