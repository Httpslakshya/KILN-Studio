"""
State models and data contracts for the Multi-Agent Content Pipeline.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class VerifiedClaim(BaseModel):
    statement: str
    status: str  # "VERIFIED", "UNVERIFIED_SINGLE_SOURCE", "DISPUTED"
    confidence_score: float
    corroborating_domains: List[str]
    category: str = "General"


class SourceCitation(BaseModel):
    index: int
    title: str
    source_domain: str
    url: str
    published_at: str
    freshness_score: float


class EditorCritique(BaseModel):
    score: int = Field(ge=0, le=100, description="Overall publication readiness score 0-100")
    groundedness_score: float = Field(ge=0.0, le=1.0)
    requires_revision: bool
    feedback: str
    missing_citations: List[str] = Field(default_factory=list)
    strengths: List[str] = Field(default_factory=list)


class PipelineStepLog(BaseModel):
    step_name: str
    agent_name: str
    timestamp: str
    summary: str
    details: Dict[str, Any] = Field(default_factory=dict)


class ContentPipelineState(BaseModel):
    topic: str
    target_audience: str = "Industry Professionals & Developers"
    editorial_tone: str = "Authoritative Thought Leadership"
    current_iteration: int = 0
    max_revisions: int = 2
    status: str = "INITIALIZED"  # INITIALIZED, RESEARCHING, VERIFYING, WRITING, EDITING, COMPLETED, FAILED
    
    # Artifacts generated at each stage
    research_articles: List[Dict[str, Any]] = Field(default_factory=list)
    verified_claims: List[VerifiedClaim] = Field(default_factory=list)
    citations: List[SourceCitation] = Field(default_factory=list)
    current_draft: str = ""
    critiques: List[EditorCritique] = Field(default_factory=list)
    step_logs: List[PipelineStepLog] = Field(default_factory=list)
    final_output: Optional[str] = None
    execution_time_seconds: float = 0.0
