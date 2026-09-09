"""
Researcher Agent: Discovers, ingests, and filters real-time news and primary source articles.
"""

from datetime import datetime, timezone
from typing import Dict, Any, List
from backend.services.live_rag.ingestion.rss_fetcher import LiveRSSFetcher
from backend.services.live_rag.ingestion.dedup_freshness import FreshnessAndDedupEngine
from backend.services.content_pipeline.state import ContentPipelineState, PipelineStepLog, SourceCitation
from backend.utils.logging_config import logger


class ResearcherAgent:
    """
    Agent responsible for finding up-to-the-minute source material,
    filtering noise, and organizing source citations.
    """

    def __init__(self):
        self.fetcher = LiveRSSFetcher()
        self.freshness_dedup = FreshnessAndDedupEngine(half_life_hours=24.0)

    def run(self, state: ContentPipelineState) -> ContentPipelineState:
        logger.info(f"ResearcherAgent: Commencing live intelligence gathering for topic: '{state.topic}'")
        state.status = "RESEARCHING"

        # Ingest articles from multiple live streams
        raw_items = self.fetcher.fetch_topic_feed(state.topic, max_items=15)
        
        # Deduplicate and apply freshness time-decay
        unique_items = self.freshness_dedup.process_and_dedup(raw_items)
        selected = unique_items[:8]

        state.research_articles = selected

        # Populate structured citations
        citations = []
        for i, art in enumerate(selected, 1):
            citations.append(SourceCitation(
                index=i,
                title=art.get("title", "Untitled"),
                source_domain=art.get("source_domain", "news-source.org"),
                url=art.get("url", "#"),
                published_at=art.get("published_at", ""),
                freshness_score=art.get("freshness_score", 1.0)
            ))
        state.citations = citations

        log_entry = PipelineStepLog(
            step_name="Research & Ingestion",
            agent_name="ResearcherAgent",
            timestamp=datetime.now(timezone.utc).isoformat(),
            summary=f"Ingested {len(raw_items)} live articles; selected {len(selected)} unique recent sources.",
            details={
                "articles_found": len(raw_items),
                "unique_sources": [c.source_domain for c in citations]
            }
        )
        state.step_logs.append(log_entry)
        return state
