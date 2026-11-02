"""RSS feeds, sitemaps, robots.txt and the search index."""

import json
import re
from datetime import date

from .config import SITE
from .content import Page
from .markdown import strip_tags

ISO = re.compile(r"^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}:\d{2}:\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})?")
DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def abs_url(url: str) -> str:
    return SITE["base_url"] + url


def rfc822(iso: str) -> str:
    """RFC 822 date that keeps the front matter's offset, e.g. "Tue, 08 Oct 2024 08:00:00 +0200".

    Built by hand rather than with strftime, whose day and month names depend on the locale.
    """
    y, m, d, time, offset = ISO.match(iso).groups()
    weekday = DAYS[date(int(y), int(m), int(d)).weekday()]
    tz = "+0000" if offset in (None, "Z") else offset.replace(":", "")
    return f"{weekday}, {d} {MONTHS[int(m) - 1]} {y} {time or '00:00:00'} {tz}"


def search_index(pages: list[Page]) -> str:
    # separators without spaces and ensure_ascii=False give the same output as JavaScript's JSON.stringify.
    return json.dumps(
        [
            {
                "title": p.title,
                "section": p.section_title,
                "summary": strip_tags(p.summary or ""),
                "content": p.plain_text,
                "permalink": p.params.get("externalUrl", p.url),
                "date": p.date,
            }
            for p in pages
        ],
        ensure_ascii=False,
        separators=(",", ":"),
    )
