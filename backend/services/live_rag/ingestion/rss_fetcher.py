"""
Real-time Live News & RSS feed ingestion service.
Fetches headlines, snippets, and publication timestamps from multiple distinct publishers.
"""

import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
import email.utils
from typing import List, Dict, Any
from backend.utils.logging_config import logger


class LiveRSSFetcher:
    """
    Ingests live news from multiple public feeds (Google News RSS, Tech feeds, General feeds).
    Requires zero third-party API keys; parses standard RSS/Atom feeds in real-time.
    """

    DEFAULT_SOURCES = [
        {
            "name": "Google News Search",
            "url_template": "https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en",
            "type": "search"
        },
        {
            "name": "Google News Top Stories",
            "url_template": "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en",
            "type": "topic"
        },
        {
            "name": "Hacker News Live",
            "url_template": "https://news.ycombinator.com/rss",
            "type": "topic"
        }
    ]

    USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 DocMindLiveRAG/1.0"

    def fetch_topic_feed(self, query: str, max_items: int = 15) -> List[Dict[str, Any]]:
        """
        Fetches live news articles matching the query across RSS endpoints.
        """
        encoded_query = urllib.parse.quote(query)
        target_url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-US&gl=US&ceid=US:en"
        
        logger.info(f"LiveRSSFetcher: Fetching live news for query: '{query}'")
        articles = self._parse_rss_url(target_url, max_items=max_items)
        
        # If search returned few items, also fetch top topic feed and filter
        if len(articles) < 3:
            logger.info("LiveRSSFetcher: Few search items found, augmenting with top news...")
            fallback_articles = self._parse_rss_url("https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en", max_items=10)
            articles.extend(fallback_articles)
            
        return articles

    def _parse_rss_url(self, feed_url: str, max_items: int = 15) -> List[Dict[str, Any]]:
        """Downloads and parses an RSS feed into normalized article dictionaries."""
        req = urllib.request.Request(
            feed_url,
            headers={"User-Agent": self.USER_AGENT}
        )
        items: List[Dict[str, Any]] = []

        try:
            with urllib.request.urlopen(req, timeout=8) as response:
                xml_data = response.read()

            root = ET.fromstring(xml_data)
            channel = root.find("channel")
            if channel is None:
                return items

            for item in channel.findall("item"):
                if len(items) >= max_items:
                    break

                title = item.findtext("title", "").strip()
                link = item.findtext("link", "").strip()
                pub_date_raw = item.findtext("pubDate", "")
                description = item.findtext("description", "").strip()
                source_elem = item.find("source")
                source_name = source_elem.text.strip() if source_elem is not None and source_elem.text else ""

                # Extract publication datetime and calculate age
                pub_dt = self._parse_pub_date(pub_date_raw)
                
                # Derive clean domain
                source_domain = self._extract_domain(link, source_name)

                # Clean HTML tags from description
                clean_desc = self._strip_html(description)

                items.append({
                    "title": title,
                    "url": link,
                    "source_name": source_name or source_domain,
                    "source_domain": source_domain,
                    "published_at": pub_dt.isoformat() if pub_dt else datetime.now(timezone.utc).isoformat(),
                    "pub_datetime": pub_dt or datetime.now(timezone.utc),
                    "summary": clean_desc or title,
                    "raw_content": f"{title}. {clean_desc}"
                })

        except Exception as e:
            logger.warning(f"LiveRSSFetcher failed to fetch or parse {feed_url}: {e}")

        return items

    @staticmethod
    def _parse_pub_date(date_str: str) -> datetime:
        """Parses RFC-2822 RSS pubDate strings to timezone-aware datetime."""
        if not date_str:
            return datetime.now(timezone.utc)
        try:
            parsed_tuple = email.utils.parsedate_to_datetime(date_str)
            if parsed_tuple.tzinfo is None:
                parsed_tuple = parsed_tuple.replace(tzinfo=timezone.utc)
            return parsed_tuple
        except Exception:
            return datetime.now(timezone.utc)

    @staticmethod
    def _extract_domain(url: str, fallback_name: str = "") -> str:
        """Derives a normalized domain name from URL or publisher name."""
        try:
            parsed = urllib.parse.urlparse(url)
            domain = parsed.netloc.lower()
            if domain.startswith("www."):
                domain = domain[4:]
            if domain and "google.com" not in domain:
                return domain
        except Exception:
            pass

        if fallback_name:
            clean = re_name = "".join(c.lower() for c in fallback_name if c.isalnum() or c in ".-_")
            return f"{clean}.com" if "." not in clean else clean
        return "news-source.org"

    @staticmethod
    def _strip_html(raw_html: str) -> str:
        """Removes HTML markup from RSS descriptions."""
        if not raw_html:
            return ""
        import re
        clean = re.sub(r"<[^>]+>", " ", raw_html)
        clean = re.sub(r"\s+", " ", clean).strip()
        return clean
