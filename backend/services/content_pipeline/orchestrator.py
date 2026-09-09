"""
Multi-Agent Content Pipeline Orchestrator.
Coordinates the Researcher -> Verifier -> Writer -> Editor lifecycle and feedback loops.
"""

import time
from datetime import datetime, timezone
from backend.services.content_pipeline.state import ContentPipelineState, PipelineStepLog
from backend.services.content_pipeline.agents.researcher import ResearcherAgent
from backend.services.content_pipeline.agents.verifier import VerifierAgent
from backend.services.content_pipeline.agents.writer import WriterAgent
from backend.services.content_pipeline.agents.editor import EditorAgent
from backend.utils.logging_config import logger


class MultiAgentContentOrchestrator:
    """
    Supervisor that manages execution flow, state transitions, and revision cycles
    across the Researcher, Verifier, Writer, and Editor agents.
    """

    def __init__(self, max_revisions: int = 1):
        self.max_revisions = max_revisions
        self.researcher = ResearcherAgent()
        self.verifier = VerifierAgent()
        self.writer = WriterAgent()
        self.editor = EditorAgent(passing_threshold=70)

    def execute_pipeline(self, topic: str, target_audience: str = "Industry Professionals & Developers", editorial_tone: str = "Authoritative Thought Leadership") -> ContentPipelineState:
        start_time = time.time()
        logger.info(f"Orchestrator: Starting multi-agent pipeline for topic: '{topic}' | Audience: '{target_audience}' | Tone: '{editorial_tone}'")

        state = ContentPipelineState(
            topic=topic,
            target_audience=target_audience,
            editorial_tone=editorial_tone,
            max_revisions=self.max_revisions,
            status="INITIALIZED"
        )

        try:
            # Stage 1: Researcher Agent
            state = self.researcher.run(state)

            # Stage 2: Verifier Agent
            state = self.verifier.run(state)

            # Stage 3 & 4: Writer <-> Editor Revision Loop
            while True:
                state = self.writer.run(state)
                state = self.editor.run(state)

                latest_critique = state.critiques[-1]
                logger.info(
                    f"Orchestrator: Iteration {state.current_iteration} complete. "
                    f"Score: {latest_critique.score}/100. Requires revision: {latest_critique.requires_revision}"
                )

                if not latest_critique.requires_revision or state.current_iteration >= state.max_revisions:
                    break

                # Increment iteration count and loop back to Writer with editor's critique feedback
                state.current_iteration += 1

            # Finalize pipeline
            state.status = "COMPLETED"
            state.final_output = state.current_draft
            state.execution_time_seconds = round(time.time() - start_time, 2)

            final_log = PipelineStepLog(
                step_name="Pipeline Completion",
                agent_name="SupervisorOrchestrator",
                timestamp=datetime.now(timezone.utc).isoformat(),
                summary=f"Pipeline succeeded after {state.current_iteration + 1} iteration(s) in {state.execution_time_seconds}s.",
                details={
                    "total_sources": len(state.citations),
                    "verified_claims": len(state.verified_claims),
                    "final_score": state.critiques[-1].score if state.critiques else 0,
                    "revisions_count": state.current_iteration
                }
            )
            state.step_logs.append(final_log)
            logger.info(f"Orchestrator: Finished successfully in {state.execution_time_seconds}s.")

        except Exception as e:
            state.status = "FAILED"
            state.execution_time_seconds = round(time.time() - start_time, 2)
            logger.error(f"Orchestrator failed: {e}", exc_info=True)
            err_log = PipelineStepLog(
                step_name="Pipeline Error",
                agent_name="SupervisorOrchestrator",
                timestamp=datetime.now(timezone.utc).isoformat(),
                summary=f"Execution error: {str(e)}",
                details={"error": str(e)}
            )
            state.step_logs.append(err_log)

        return state
