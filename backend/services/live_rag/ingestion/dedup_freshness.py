"""
Article deduplication and exponential time-decay freshness scoring engine.
"""

import math
import re
from datetime import datetime, timezone
from typing import List, Dict, Any


class FreshnessAndDedupEngine:
    """
    Computes time-decay freshness scores and eliminates cross-syndicated duplicate news items.
    
    Freshness equation:
        Score = exp(-lambda * delta_t_hours)
        Where half_life = 24 hours -> lambda = ln(2) / 24 ~= 0.02888
    """

    def __init__(self, half_life_hours: float = 24.0, similarity_threshold: float = 0.65):
        self.half_life_hours = half_life_hours
        self.decay_lambda = math.log(2) / half_life_hours
        self.similarity_threshold = similarity_threshold

    def calculate_freshness(self, pub_dt: datetime) -> float:
        """
        Calculates normalized freshness in [0.0, 1.0].
        A story published right now has score 1.0.
        A story 24 hours old has score 0.5.
        A story 48 hours old has score 0.25.
        """
        now = datetime.now(timezone.utc)
        if pub_dt.tzinfo is None:
            pub_dt = pub_dt.replace(tzinfo=timezone.utc)

        delta_seconds = max(0.0, (now - pub_dt).total_seconds())
        delta_hours = delta_seconds / 3600.0

        score = math.exp(-self.decay_lambda * delta_hours)
        return round(float(score), 4)

    def process_and_dedup(self, articles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Scores each article for freshness and filters out duplicates based on token Jaccard similarity.
        """
        scored_articles = []
        for art in articles:
            pub_dt = art.get("pub_datetime", datetime.now(timezone.utc))
            freshness = self.calculate_freshness(pub_dt)
            
            # Form clean token set for deduplication
            tokens = self._tokenize(f"{art.get('title', '')} {art.get('summary', '')}")
            
            scored_articles.append({
                **art,
                "freshness_score": freshness,
                "_tokens": tokens
            })

        # Sort by freshness descending
        scored_articles.sort(key=lambda x: x["freshness_score"], reverse=True)

        # Deduplicate
        unique_articles: List[Dict[str, Any]] = []
        for candidate in scored_articles:
            is_duplicate = False
            for accepted in unique_articles:
                sim = self._jaccard_similarity(candidate["_tokens"], accepted["_tokens"])
                if sim >= self.similarity_threshold:
                    # Same story syndicate: keep the one with higher freshness or attach domain as co-source
                    if candidate.get("source_domain") and candidate["source_domain"] not in accepted.get("co_sources", []):
                        accepted.setdefault("co_sources", []).append(candidate["source_domain"])
                    is_duplicate = True
                    break

            if not is_duplicate:
                candidate.setdefault("co_sources", [])
                unique_articles.append(candidate)

        # Strip internal temporary fields before returning
        return [{k: v for k, v in a.items() if k != "_tokens"} for a in unique_articles]

    @staticmethod
    def _tokenize(text: str) -> set:
        """Extracts normalized alphanumeric token set."""
        words = re.findall(r"\b[a-zA-Z0-9]{3,}\b", text.lower())
        stopwords = {
            "the", "and", "for", "with", "this", "that", "from", "have", "were", "been",
            "said", "after", "will", "about", "more", "also", "into", "their", "they"
        }
        return set(w for w in words if w not in stopwords)

    @staticmethod
    def _jaccard_similarity(set_a: set, set_b: set) -> float:
        """Calculates Jaccard similarity between two token sets."""
        if not set_a or not set_b:
            return 0.0
        intersection = len(set_a.intersection(set_b))
        union = len(set_a.union(set_b))
        return intersection / union if union > 0 else 0.0
