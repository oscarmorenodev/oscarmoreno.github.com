"""Builds the static site into dist/.

The site itself is English-only (nav, home, sections, feeds). Spanish content under content/es
is still loaded: a Spanish page/section that has an English translation becomes a redirect to it
(so old /es/... links and search-engine entries land on the English version instead of a dead
end); Spanish content with no English counterpart — the podcast, one untranslated post — is still
rendered for real, using the same English nav, and is included in the sitemap and search index so
it stays reachable and discoverable even though nothing links to it from the menu.
"""

import hashlib
import json
import math
import re
import shutil
from itertools import groupby
from pathlib import Path, PurePosixPath

from .config import DEFAULT_LANGUAGE, LANGUAGES, SITE
from .content import CONTENT_LANGS, Page, load_content
from .feeds import search_index
from .markdown import render_inline, render_markdown, strip_tags
from .render import absolute, render

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
FEATURE_IMAGE = re.compile(r"\.(png|jpe?g|webp|gif)$", re.IGNORECASE)
ANCHOR = re.compile(r'<a class="heading-anchor"[^>]*>#</a>')


class Builder:
    """Writes files into dist/, remembering every URL written so redirects never overwrite a page."""

    def __init__(self, assets: dict | None = None):
        self.written: set[str] = set()
        self.assets = assets

    def write(self, url_path: str, contents: str | bytes) -> None:
        file = DIST / (url_path + "index.html" if url_path.endswith("/") else url_path).lstrip("/")
        file.parent.mkdir(parents=True, exist_ok=True)
        if isinstance(contents, str):
            contents = contents.encode("utf-8")
        file.write_bytes(contents)
        self.written.add(url_path)

    def copy(self, src: Path, url_path: str) -> None:
        dest = DIST / url_path.lstrip("/")
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(src, dest)

    def fingerprint(self, directory: str, name: str, ext: str, contents: str) -> str:
        """Writes an asset under a content-hashed name so browsers can cache it forever."""
        digest = hashlib.sha256(contents.encode("utf-8")).hexdigest()[:10]
        url_path = f"/{directory}/{name}.{digest}.{ext}"
        self.write(url_path, contents)
        return url_path

    def build_assets(self) -> None:
        def read(p: str) -> str:
            return (ROOT / "assets" / p).read_text(encoding="utf-8")

        js = "\n".join(read(f"js/{f}") for f in ["menu.js", "search.js", "code-copy.js", "consent.js"])
        self.assets = {
            "css": self.fingerprint("css", "main", "css", read("css/main.css")),
            "js": self.fingerprint("js", "main", "js", js),
            "appearance": read("js/appearance.js").strip(),
        }

    def redirect(self, url_path: str, target: str) -> None:
        self.write(url_path, render("redirect.html", url=absolute(target)))

    # --- Pages ---------------------------------------------------------------------------------

    def write_section(self, section: Page) -> None:
        """Writes every page of a section's paginated article list."""
        size = SITE["page_size"]
        total = page_count(section)
        for n in range(1, total + 1):
            url = section.url if n == 1 else f"{section.url}page/{n}/"
            items = section.children[(n - 1) * size : n * size]
            groups = [(year, list(group)) for year, group in groupby(items, key=lambda p: (p.date or "")[:4])]
            self.write(
                url,
                render(
                    "list.html",
                    lang=section.lang,
                    page=section,
                    url=url,
                    title=section.title,
                    description=strip_tags(section.summary) or None,
                    image=None,
                    json_ld=[],
                    assets=self.assets,
                    section=section,
                    groups=groups,
                    current=n,
                    total=total,
                    intro=section.html.strip() if n == 1 else "",
                ),
            )
        self.redirect(f"{section.url}page/1/", section.url)

    def write_single(self, page: Page, siblings: list[Page]) -> None:
        image = next((r for r in page.resources if "feature" in r.name.lower() and FEATURE_IMAGE.search(r.name)), None)
        description = page.params.get("description", strip_tags(page.summary))
        json_ld = []
        if page.date:
            article = {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": page.title,
                "description": description,
                "inLanguage": page.lang,
                "url": SITE["base_url"] + page.url,
                "author": {"@type": "Person", "name": SITE["author"]["name"]},
                "datePublished": page.date,
            }
            if image:
                article["image"] = SITE["base_url"] + image.url
            json_ld.append(article)
        older, newer = neighbours(page, siblings)
        self.write(
            page.url,
            render(
                "single.html",
                lang=page.lang,
                page=page,
                url=page.url,
                title=page.title,
                description=description,
                image=image.url if image else None,
                json_ld=json_ld,
                assets=self.assets,
                older=older,
                newer=newer,
            ),
        )

    def build_english_site(self, pages: list[Page], sections: list[Page]) -> list[dict]:
        all_pages = pages + sections
        sections_by_name = {s.section: s for s in sections}
        for page in all_pages:
            render_page(page, all_pages, sections_by_name)

        sitemap_entries = []
        dated = sorted((p for p in pages if p.date), key=lambda p: p.date, reverse=True)

        language = LANGUAGES["en"]
        self.write(
            "/",
            render(
                "home.html",
                lang="en",
                page=None,
                url="/",
                title=None,
                description=None,
                image=None,
                assets=self.assets,
                json_ld=[
                    {
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": language["title"],
                        "url": SITE["base_url"] + "/",
                        "inLanguage": "en",
                        "description": language["description"],
                    }
                ],
            ),
        )
        sitemap_entries.append({"url": "/", "date": dated[0].date if dated else None})

        for section in sections:
            self.write_section(section)
            sitemap_entries.append({"url": section.url, "date": section.children[0].date if section.children else None})
            self.write(f"{section.url}index.xml", rss(title=section.title, url=section.url, items=section.children))

        for page in pages:
            siblings = sections_by_name[page.section].children if page.section else []
            self.write_single(page, siblings)
            for res in page.resources:
                if not res.inherited:
                    self.copy(res.src, res.url)
            sitemap_entries.append({"url": page.url, "date": page.date})

        self.write(
            "/404.html",
            render(
                "404.html",
                lang="en",
                page=None,
                url="/404.html",
                title="404",
                description=None,
                image=None,
                json_ld=[],
                assets=self.assets,
            ),
        )
        self.write("/index.xml", rss(title=None, url="/", items=dated))
        return sitemap_entries

    def build_spanish_extras(self, pages: list[Page], sections: list[Page]) -> tuple[list[Page], list[dict]]:
        """Handles everything under content/es.

        Redirects translated content to its English page, and fully renders (under the same
        English nav) whatever has no English counterpart.
        """
        all_pages = pages + sections
        sections_by_name = {s.section: s for s in sections}
        for page in all_pages:
            if not has_english(page):
                render_page(page, all_pages, sections_by_name)

        # Bundle files (images, zips) are copied regardless of whether the page itself redirects:
        # an English page may reach into this exact bundle for an inherited image or attachment.
        for page in pages:
            for res in page.resources:
                if not res.inherited:
                    self.copy(res.src, res.url)

        sitemap_entries = []
        orphan_pages = []

        for section in sections:
            if has_english(section):
                target = final_url(section)
                self.redirect(section.url, target)
                for n in range(1, page_count(section) + 1):
                    self.redirect(f"{section.url}page/{n}/", target)
                continue
            self.write_section(section)
            sitemap_entries.append({"url": section.url, "date": section.children[0].date if section.children else None})

        for page in pages:
            if has_english(page):
                self.redirect(page.url, final_url(page))
                continue
            siblings = sections_by_name[page.section].children if page.section else []
            self.write_single(page, siblings)
            sitemap_entries.append({"url": page.url, "date": page.date})
            orphan_pages.append(page)

        return orphan_pages, sitemap_entries


# --- Helpers ---------------------------------------------------------------------------------


def page_resolver(pages: list[Page], origin: Page):
    """Maps a content reference ("contact.md", "../cadenas-swift", "../swift-enums/") to a page URL.

    Scoped to pages in the same language as `origin` (never crosses into a redirect/orphan decision).
    """

    def resolve(ref: str) -> str | None:
        name = PurePosixPath(ref.rstrip("/")).name
        slug = name.removesuffix(".md").lower()
        if not slug or slug in (".", ".."):
            return None
        matches = [p for p in pages if p.lang == origin.lang and p.slug == slug]
        best = next((p for p in matches if p.section == origin.section), matches[0] if matches else None)
        return best.url if best else None

    return resolve


def has_english(page: Page) -> bool:
    return page.lang != "en" and any(p.lang == "en" for p in page.translations)


def final_url(page: Page) -> str:
    """Where a page's content ultimately lives.

    Itself if it's English or has no English translation, or its English translation's URL
    otherwise. Used for front-matter aliases, so an old link to a translated Spanish page
    redirects straight to English instead of bouncing through two redirects.
    """
    if has_english(page):
        return next(p for p in page.translations if p.lang == "en").url
    return page.url


def aliases_of(page: Page) -> list[tuple[str, str]]:
    prefix = CONTENT_LANGS[page.lang]["prefix"]
    aliases = []
    for value in (page.params.get("aliases"), page.params.get("alias")):
        if isinstance(value, list):
            aliases.extend(value)
        elif value:
            aliases.append(value)
    return [(f"{prefix}/{a.strip('/')}/", final_url(page)) for a in aliases]


def render_page(page: Page, all_pages: list[Page], sections_by_name: dict[str, Page]) -> None:
    page.summary = render_inline(page.params["summary"]) if page.params.get("summary") else ""
    page.html, page.toc = render_markdown(page, page_resolver(all_pages, page))
    page.plain_text = " ".join(strip_tags(ANCHOR.sub("", page.html)).split())
    page.section_title = sections_by_name[page.section].title if page.section else ""


def page_count(section: Page) -> int:
    return max(1, math.ceil(len(section.children) / SITE["page_size"]))


def neighbours(page: Page, siblings: list[Page]) -> tuple[Page | None, Page | None]:
    """The older and newer articles next to `page` (siblings are sorted newest first)."""
    index = next((i for i, p in enumerate(siblings) if p is page), None)
    if index is None:
        return None, None
    older = siblings[index + 1] if index + 1 < len(siblings) else None
    newer = siblings[index - 1] if index > 0 else None
    return older, newer


def rss(*, title: str | None, url: str, items: list[Page]) -> str:
    dated = [p for p in items if p.date]
    return render("rss.xml", title=title, url=url, items=dated, latest=dated[0].date if dated else None)


def build() -> None:
    shutil.rmtree(DIST, ignore_errors=True)
    shutil.copytree(ROOT / "static", DIST)
    builder = Builder()
    builder.copy(ROOT / "assets/img/memoji-2-no-bg.png", "/img/memoji-2-no-bg.png")
    builder.build_assets()

    content = load_content(ROOT)
    en_sitemap = builder.build_english_site(**content["en"])
    es_orphans, es_sitemap = builder.build_spanish_extras(**content["es"])

    # Redirects: every page's own front-matter aliases, resolved to its final (English, if
    # translated) URL, plus /en/ for the default language. Never overwrite a real page.
    redirects = [(f"/{DEFAULT_LANGUAGE}/", "/"), ("/es/", "/")]
    for page in content["en"]["pages"] + content["es"]["pages"]:
        redirects.extend(aliases_of(page))
    for source, target in redirects:
        if source not in builder.written:
            builder.redirect(source, target)

    builder.write("/sitemap.xml", render("sitemap.xml", entries=en_sitemap + es_sitemap))
    builder.write("/robots.txt", f"User-agent: *\nSitemap: {SITE['base_url']}/sitemap.xml\n")
    builder.write("/index.json", search_index(content["en"]["pages"] + es_orphans))
    manifest = {
        "name": LANGUAGES["en"]["title"],
        "short_name": SITE["author"]["name"],
        "icons": [
            {"src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable"},
            {"src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"},
        ],
        "theme_color": "#ffffff",
        "background_color": "#ffffff",
        "display": "standalone",
    }
    builder.write("/site.webmanifest", json.dumps(manifest, indent=2, ensure_ascii=False))
    (DIST / ".nojekyll").write_text("")

    html_count = sum(1 for u in builder.written if u.endswith("/") or u.endswith(".html"))
    print(f"Built {html_count} HTML pages into dist/")
