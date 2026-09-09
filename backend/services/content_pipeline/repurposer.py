"""
Content Creator Repurposing Engine.
Transforms verified intelligence into:
1. LinkedIn Post
2. Carousel Slides (Multi-slide layout with per-slide copy)
3. Viral Reel / TikTok Video Script (with visual cues & audio timestamps)
4. Infometry Technical Blog
"""

import json
from typing import Dict, Any, List
from backend.services.rag import call_llm
from backend.utils.logging_config import logger


class ContentRepurposer:
    """
    Transforms fact-checked, cited research into creator-ready social and editorial assets.
    """

    FORMATS = ["linkedin_post", "carousel_slides", "viral_reel_script", "infometry_blog"]

    def repurpose(self, format_type: str, topic: str, content: str, claims: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        logger.info(f"ContentRepurposer: Generating format '{format_type}' for topic '{topic}'")

        claims_summary = ""
        if claims:
            claims_summary = "\n".join(
                f"- [{c.get('status', 'VERIFIED')}] ({c.get('domain_count', 2)} sources): {c.get('statement')}"
                for c in claims[:6]
            )

        if format_type == "linkedin_post":
            return self._generate_linkedin(topic, content, claims_summary)
        elif format_type == "carousel_slides":
            return self._generate_carousel(topic, content, claims_summary)
        elif format_type == "viral_reel_script":
            return self._generate_reel_script(topic, content, claims_summary)
        elif format_type == "infometry_blog":
            return self._generate_infometry_blog(topic, content, claims_summary)
        else:
            raise ValueError(f"Unknown format type: {format_type}. Supported: {self.FORMATS}")

    def _generate_linkedin(self, topic: str, content: str, claims: str) -> Dict[str, Any]:
        system_prompt = """You are a top 1% LinkedIn Tech Thought Leader with 250k+ followers.
Convert this verified intelligence report into an authoritative, high-engagement LinkedIn post.

Guidelines:
- Start with a compelling 1-line hook (no generic greetings).
- Use white space, short 1-2 sentence paragraphs, and crisp bullet points.
- Highlight the fact-checked verification (e.g. "We cross-verified this across independent sources:").
- Include 3-4 concrete takeaways.
- End with a thought-provoking question to drive discussion and 4-5 relevant hashtags."""

        user_prompt = f"Topic: {topic}\n\nVerified Claims:\n{claims}\n\nSource Content:\n{content[:2500]}"
        post_text = call_llm(system_prompt, user_prompt, role="writer")
        return {
            "format": "linkedin_post",
            "title": "LinkedIn Thought Leadership Post",
            "formatted_output": post_text
        }

    def _generate_carousel(self, topic: str, content: str, claims: str) -> Dict[str, Any]:
        system_prompt = """You are an Instagram and LinkedIn Carousel expert.
Create a high-retention 6-to-7 slide carousel breakdown based on the verified intelligence.
Return a JSON object with:
- "title": overall carousel title
- "slides": list of slide objects, each containing:
  - "slide_number": int
  - "type": "COVER", "CONTEXT", "KEY_STAT", "VERIFIED_INSIGHT", "STRATEGY", or "CTA"
  - "headline": punchy, bold title (max 7 words)
  - "body": 2-3 crisp bullet points or explanation (max 35 words)
  - "source_tag": e.g. "Verified across 3 independent publishers"

Output ONLY valid JSON."""

        user_prompt = f"Topic: {topic}\n\nVerified Claims:\n{claims}\n\nSource Content:\n{content[:2500]}"
        raw = call_llm(system_prompt, user_prompt, role="writer")
        try:
            cleaned = self._clean_json(raw)
            data = json.loads(cleaned)
            return {
                "format": "carousel_slides",
                "title": data.get("title", f"Carousel: {topic}"),
                "slides": data.get("slides", []),
                "formatted_output": self._format_carousel_text(data.get("slides", []))
            }
        except Exception:
            return {
                "format": "carousel_slides",
                "title": f"Carousel: {topic}",
                "slides": [],
                "formatted_output": raw
            }

    def _generate_reel_script(self, topic: str, content: str, claims: str) -> Dict[str, Any]:
        system_prompt = """You are a viral YouTube Shorts and Instagram Reels producer.
Write a high-energy, 45-to-60 second video script based on the verified facts.
Include:
- [0:00 - 0:03] HOOK: Visual cue + Voiceover line that stops the scroll.
- [0:03 - 0:15] THE CONFLICT / SHIFT: Visual B-roll cue + voiceover + on-screen text overlay.
- [0:15 - 0:35] THE VERIFIED PROOF: Breaking down what was confirmed by multiple sources.
- [0:35 - 0:50] WHAT THIS MEANS: Future prediction or warning.
- [0:50 - 0:60] CTA: Save this video & comment your opinion.

Format with clear headers [TIMESTAMP] | [VISUAL CUE] | [VOICEOVER] | [ON-SCREEN TEXT]."""

        user_prompt = f"Topic: {topic}\n\nVerified Claims:\n{claims}\n\nSource Content:\n{content[:2500]}"
        script_text = call_llm(system_prompt, user_prompt, role="writer")
        return {
            "format": "viral_reel_script",
            "title": "Viral Reel / Short Video Script",
            "formatted_output": script_text
        }

    def _generate_infometry_blog(self, topic: str, content: str, claims: str) -> Dict[str, Any]:
        system_prompt = """You are a senior technical journalist and analyst at an elite technology publication.
Transform this verified report into an in-depth Infometry Technical Blog.
Structure:
# Title
## Executive TL;DR
## Market / Technical Context
## Multi-Source Verification Breakdown
## Deep Technical Analysis
## Strategic Implications for Builders & Executives
## Primary Source Attribution Matrix

Maintain high journalistic rigor with citations and clear subheaders."""

        user_prompt = f"Topic: {topic}\n\nVerified Claims:\n{claims}\n\nSource Content:\n{content[:2500]}"
        blog_text = call_llm(system_prompt, user_prompt, role="writer")
        return {
            "format": "infometry_blog",
            "title": "Infometry In-Depth Technical Blog",
            "formatted_output": blog_text
        }

    @staticmethod
    def _clean_json(text: str) -> str:
        text = text.strip()
        if text.startswith("```"):
            lines = text.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            text = "\n".join(lines).strip()
        return text

    @staticmethod
    def _format_carousel_text(slides: List[Dict[str, Any]]) -> str:
        blocks = []
        for s in slides:
            blocks.append(
                f"--- SLIDE {s.get('slide_number', '')}: [{s.get('type', '')}] ---\n"
                f"HEADLINE: {s.get('headline', '')}\n"
                f"{s.get('body', '')}\n"
                f"[Source: {s.get('source_tag', '')}]"
            )
        return "\n\n".join(blocks)
