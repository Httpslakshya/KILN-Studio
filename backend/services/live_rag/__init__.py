"""
Live Verified Agentic RAG Module.
"""

from backend.services.live_rag.engine import LiveVerifiedRAGEngine
from backend.services.live_rag.ingestion.rss_fetcher import LiveRSSFetcher
from backend.services.live_rag.ingestion.dedup_freshness import FreshnessAndDedupEngine
from backend.services.live_rag.verification.cross_verifier import CrossSourceVerifier

__all__ = [
    "LiveVerifiedRAGEngine",
    "LiveRSSFetcher",
    "FreshnessAndDedupEngine",
    "CrossSourceVerifier"
]
