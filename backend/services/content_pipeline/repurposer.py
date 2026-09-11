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
        system_prompt = """You are a top 0.1% LinkedIn Tech Thought Leader & Creator with 300k+ followers.
Convert this research into an authoritative, scroll-stopping, high-engagement LinkedIn post.

STRICT GUIDELINES:
- Start with a compelling 1-line hook that challenges conventional wisdom or promises immediate ROI (no generic greetings like "Hey network" or "In today's fast-paced world").
- Deliver CONCRETE value: name specific tools, CLI commands, frameworks, metrics, or practical workflows. Never write vague meta-abstractions like "only 5 tools matter" without naming them.
- Seamlessly integrate the verified findings and security warnings (e.g. "Verified in real-world developer benchmarks:" or "Security alert:").
- Use generous whitespace, short 1-2 sentence paragraphs, and clear bullet points.
- Include 3-5 concrete, actionable takeaways builders can implement today.
- End with a sharp, discussion-starting question to drive comments, plus 4-5 relevant hashtags."""

        user_prompt = f"Topic: {topic}\n\nVerified Research & Claims:\n{claims}\n\nTechnical Intelligence Context:\n{content[:3500]}"
        post_text = call_llm(system_prompt, user_prompt, role="writer")
        return {
            "format": "linkedin_post",
            "title": "LinkedIn Thought Leadership Post",
            "formatted_output": post_text
        }

    def _generate_carousel(self, topic: str, content: str, claims: str) -> Dict[str, Any]:
        system_prompt = """You are a world-class Social Media Carousel Architect and Viral Tech Creator (top 0.1% creator on LinkedIn & Instagram).
Your carousels get tens of thousands of saves and shares because every single slide is PACKED with high-signal, specific, actionable value — never academic summaries or abstract meta-commentary.

CORE ARCHETYPE STRATEGY:
1. If the topic is a Listicle / Tools / Plugins / Extensions / Libraries (e.g. "top claude code plugins", "best AI tools", "developer stacks"):
   - Slide 1: High-curiosity, high-ROI cover hook that stops the scroll (e.g. "5 Claude Code Plugins That Feel Illegal to Know" or "The Modern Claude Code Stack: Top 5 Extensions").
   - Slides 2 to 5 (or 6): EACH SLIDE MUST PROFILE ONE CONCRETE, NAMED TOOL/PLUGIN.
     * Name the actual tool/plugin prominently (e.g. Repomix, Playwright MCP, Snyk Code Guard, Supermaven, SQLite Inspector).
     * Explain its exact superpower and why it beats alternatives.
     * Provide a concrete CLI command, shortcut, or usage tip (e.g. "⚡ Quick Run: npx repomix").
   - Next-to-last slide: An essential Pro Tip, Architecture Rule, or Critical Security Alert (e.g. "Beware: Rogue Search Clones" highlighting the 404 Media malicious package hijack).
   - Final slide: High-engagement Save/Bookmark CTA.
2. If the topic is a How-To / Playbook / Framework:
   - Slide 1: The Transformational Promise Hook.
   - Slides 2 to N-1: Numbered, chronological execution steps with practical commands, decisions, and syntax.
   - Final slide: Summary checklist & CTA.
3. If the topic is an Industry Breakdown / Trend / Analysis:
   - Slide 1: Provocative Contrarian Hook.
   - Slides 2 to N-1: The Paradigm Shift, Key Metric, The Hidden Risk, The Winning Strategy.
   - Final slide: Strategic Action Checklist & CTA.

ABSOLUTE BANNED PATTERNS:
- NEVER write vague meta-commentary like "Over 100 plugins were tested and only 5 survived", "Criteria: speed and reliability", or "Security Boulevard recommended 7 plugins".
- Readers want the ACTUAL tools, names, commands, and actionable advice!

SLIDE JSON SCHEMA:
Return a JSON object containing:
- "title": string (the overall carousel title)
- "slides": array of 6 to 8 slide objects, each containing:
  - "slide_number": int (1, 2, 3...)
  - "type": "hook" (for Slide 1), "step" (for tool/action slides), "metric" (for data/benchmark slides), "source" (for security/insight slides), or "cta" (for the final slide)
  - "badge": punchy uppercase badge (e.g. "PLUGIN 01", "PLUGIN 02", "SUPERPOWER", "SECURITY ALERT", "CHEF'S PICK", "SAVE THIS")
  - "headline": punchy, bold title (max 7-9 words, e.g. "01. Repomix: 50k Lines of Context")
  - "highlight_word": 1-2 words from the headline to highlight in accent color (e.g. "Repomix" or "50k Lines")
  - "body": 2-3 short, punchy lines with concrete specifics, tool names, commands, or takeaways (max 45 words)
  - "source_tag": concise credibility badge (e.g. "GitHub 15k★ • Tested Fast", "Official MCP", "Security Boulevard Pick", "404 Media Alert")

Output ONLY valid JSON."""

        user_prompt = f"""Topic: {topic}

Verified Claims & Research:
{claims}

Synthesized Technical Intelligence:
{content[:3500]}

Generate a high-converting, viral carousel now. Remember: feature SPECIFIC named tools, commands, and tactical value on each slide!"""

        raw = call_llm(system_prompt, user_prompt, role="writer")
        try:
            cleaned = self._clean_json(raw)
            data = json.loads(cleaned)
            slides = data.get("slides", [])
            # Normalize slide fields
            for idx, s in enumerate(slides):
                s["slide_number"] = s.get("slide_number", idx + 1)
                if not s.get("type"):
                    s["type"] = "hook" if idx == 0 else ("cta" if idx == len(slides) - 1 else "step")
                if not s.get("badge"):
                    s["badge"] = "PROVEN TAKEAWAY" if idx == 0 else f"STEP {str(idx + 1).padStart(2, '0') if hasattr(str(idx + 1), 'padStart') else f'{idx+1:02d}'}"
            return {
                "format": "carousel_slides",
                "title": data.get("title", f"Carousel: {topic}"),
                "slides": slides,
                "formatted_output": self._format_carousel_text(slides)
            }
        except Exception as e:
            logger.warning(f"ContentRepurposer: Carousel JSON parse fallback ({e})")
            return {
                "format": "carousel_slides",
                "title": f"Carousel: {topic}",
                "slides": [],
                "formatted_output": raw
            }

    def _generate_reel_script(self, topic: str, content: str, claims: str) -> Dict[str, Any]:
        system_prompt = """You are a viral YouTube Shorts and Instagram Reels producer with 1M+ subscribers.
Write a high-energy, 45-to-60 second video script for tech builders and creators.
MANDATORY: Name specific tools, commands, or dramatic facts in the voiceover — do not speak in vague abstractions!

Format:
- [0:00 - 0:03] HOOK: Visual cue + Voiceover line that stops the scroll immediately.
- [0:03 - 0:15] THE PROBLEM / CONFLICT: Why most people are doing it wrong, or the shocking security risk discovered.
- [0:15 - 0:40] THE TACTICAL BREAKDOWN: 2-3 specific named tools, commands, or steps that solve it.
- [0:40 - 0:50] PRO TIP / WARNING: Essential safety or optimization trick.
- [0:50 - 0:60] CTA: Save this reel & comment your stack.

Format with clear headers [TIMESTAMP] | [VISUAL CUE] | [VOICEOVER] | [ON-SCREEN TEXT]."""

        user_prompt = f"Topic: {topic}\n\nVerified Claims:\n{claims}\n\nTechnical Intelligence Context:\n{content[:3000]}"
        script_text = call_llm(system_prompt, user_prompt, role="writer")
        return {
            "format": "viral_reel_script",
            "title": "Viral Reel / Short Video Script",
            "formatted_output": script_text
        }

    def _generate_infometry_blog(self, topic: str, content: str, claims: str) -> Dict[str, Any]:
        system_prompt = """You are a principal technical architect and lead investigative editor at an elite engineering publication.
Transform this verified report into an in-depth, production-grade Infometry Technical Guide and Analysis.

Structure:
# Title
## Executive TL;DR
## Technical Problem Space & Architectural Context
## Concrete Tooling & Ecosystem Breakdown (Name specific tools, commands, integrations, and benchmarks)
## Multi-Source Security & Verification Analysis
## Production Implementation Playbook
## Strategic Takeaways for Engineering Leaders
## Primary Source Attribution Matrix

Maintain deep technical rigor, naming concrete frameworks, CLI utilities, security scanners, and architecture decisions."""

        user_prompt = f"Topic: {topic}\n\nVerified Claims:\n{claims}\n\nTechnical Intelligence Context:\n{content[:3500]}"
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
            badge = s.get('badge', '')
            badge_str = f" [{badge}]" if badge else ""
            blocks.append(
                f"--- SLIDE {s.get('slide_number', '')}{badge_str} ---\n"
                f"HEADLINE: {s.get('headline', '')}\n"
                f"{s.get('body', '')}\n"
                f"[Source / Tag: {s.get('source_tag', '')}]"
            )
        return "\n\n".join(blocks)

