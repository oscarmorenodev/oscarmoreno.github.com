"""Verifies dist/: every page live on gh-pages still exists, and every internal link resolves.

Usage: uv run site build && uv run site check
"""

import re
import subprocess
from urllib.parse import unquote, urljoin

from .build import DIST
from .config import SITE

# Live URLs dropped on purpose, now that the site is English-only in its navigation (see build.py):
# empty tag/category listings, and the Spanish-specific infrastructure (its own 404/sitemap/search
# index/feeds) that no longer exists now that translated Spanish pages redirect to English and the
# rest is folded into the single English-shell sitemap and search index.
DROPPED = re.compile(
    r"^(es/)?(tags|categories)/"
    r"|^es/(404\.html|index\.(xml|json)|sitemap\.xml|(blog|apps|podcast)/index\.xml)$"
    r"|^en/sitemap\.xml$"
)
LINK = re.compile(r'(?:href|src)="([^"]+)"')


def resolves(url_path: str) -> bool:
    clean = unquote(re.split(r"[?#]", url_path)[0])
    file = DIST / clean.lstrip("/")
    if clean.endswith("/"):
        return (file / "index.html").exists()
    return file.exists() or (file / "index.html").exists()


def live_urls() -> list[str]:
    try:
        output = subprocess.run(
            ["git", "ls-tree", "-r", "--name-only", "origin/gh-pages"], capture_output=True, text=True, check=True
        ).stdout
    except subprocess.CalledProcessError:
        print("! origin/gh-pages not available, skipping the live URL comparison")
        return []
    return [f for f in output.splitlines() if f.endswith((".html", ".xml", ".json")) and not DROPPED.search(f)]


def check() -> int:
    """Returns the process exit code: 0 when everything is fine, 1 otherwise."""
    failures = 0

    def fail(message: str) -> None:
        nonlocal failures
        failures += 1
        print(f"✗ {message}")

    # 1. Live pages.
    live = live_urls()
    for f in live:
        if not (DIST / f).exists():
            fail(f"missing live URL: /{f}")

    # 2. Internal links and assets.
    files = sorted(DIST.rglob("*.html"))
    for file in files:
        html = file.read_text(encoding="utf-8")
        page = "/" + re.sub(r"index\.html$", "", str(file.relative_to(DIST)))
        if re.search(r"example\.org|localhost:1313", html):
            fail(f"{page}: references example.org or localhost")
        for url in LINK.findall(html):
            target = url.replace("&amp;", "&")
            if target.startswith(SITE["base_url"]):
                target = target[len(SITE["base_url"]) :] or "/"
            if re.match(r"^([a-z]+:|//|#)", target, re.IGNORECASE):
                continue
            absolute = target if target.startswith("/") else urljoin(page, target)
            if not resolves(absolute):
                fail(f"{page}: broken link {url}")

    summary = f"{failures} problem(s)" if failures else "all good"
    print(f"Checked {len(live)} live URLs and {len(files)} HTML files: {summary}")
    return 1 if failures else 0
