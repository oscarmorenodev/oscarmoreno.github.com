"""Loads content/<lang>/ into page objects.

Single Markdown files and page bundles (a directory with its own index.md plus images or
attachments) each become one Page with a derived URL.
"""

import dataclasses
import re
import tomllib
from dataclasses import dataclass, field
from datetime import date, datetime
from pathlib import Path
from urllib.parse import unquote

# Which content/<lang> directories to read and the URL prefix each gets. This is independent of
# config.LANGUAGES (the site's navigation, which is English-only) — Spanish content still lives
# under content/es and keeps its /es/ URLs; see build.py for what happens to those URLs.
CONTENT_LANGS = {"en": {"prefix": ""}, "es": {"prefix": "/es"}}

FRONT_MATTER = re.compile(r"^\+\+\+\r?\n(.*?)\r?\n\+\+\+\r?\n?", re.DOTALL)
IMAGE = re.compile(r"\.(png|jpe?g|webp|gif|svg)$", re.IGNORECASE)


@dataclass
class Resource:
    """A file inside a page bundle: an image, a .zip attachment…"""

    name: str
    src: Path
    url: str
    inherited: bool = False  # borrowed from a translation's bundle rather than this page's own


# eq=False: pages are compared by identity. Comparing every field would be slow, and would recurse
# forever because pages point at each other through `translations`.
@dataclass(eq=False)
class Page:
    lang: str
    kind: str  # "page" or "section"
    section: str
    slug: str
    file: Path | None
    content_path: str | None
    url: str
    title: str
    date: str | None
    params: dict
    body: str
    resources: list[Resource]
    translations: list["Page"] = field(default_factory=list)
    children: list["Page"] = field(default_factory=list)
    # Filled in by build.py once the Markdown is rendered.
    summary: str = ""
    html: str = ""
    toc: list[dict] = field(default_factory=list)
    plain_text: str = ""
    section_title: str = ""


def read_page(file: Path) -> tuple[dict, str]:
    raw = file.read_text(encoding="utf-8")
    match = FRONT_MATTER.match(raw)
    if not match:
        return {}, raw
    return tomllib.loads(match[1]), raw[match.end() :]


def section_title(name: str) -> str:
    """A section without its own _index.md is titled after its folder name, pluralized.

    "apps" -> "Apps", "legal" -> "Legals".
    """
    title = name[:1].upper() + name[1:]
    return title if title.endswith("s") else f"{title}s"


def iso_date(value: date | datetime | None) -> str | None:
    if not value:
        return None
    # A datetime keeps the offset written in the front matter, so the calendar day is the author's.
    if isinstance(value, datetime):
        return value.isoformat(timespec="milliseconds")
    return value.isoformat()


def make_page(*, lang, section, slug, kind, file=None, bundle_dir=None, content_dir) -> Page:
    params, body = read_page(file) if file else ({}, "")
    prefix = CONTENT_LANGS[lang]["prefix"]
    parts = [p.lower() for p in (section, slug) if p]
    url = f"{prefix}/{'/'.join(parts) + '/' if parts else ''}"
    resources = []
    if bundle_dir:
        resources = [
            Resource(name=child.name, src=child, url=url + child.name)
            for child in sorted(bundle_dir.iterdir())
            if not child.name.endswith(".md") and not child.name.startswith(".")
        ]
    return Page(
        lang=lang,
        kind=kind,
        section=section,
        slug=slug.lower(),
        file=file,
        content_path=str(file.relative_to(content_dir)) if file else None,
        url=url,
        title=params.get("title", section_title(section) if kind == "section" else ""),
        date=iso_date(params.get("date")),
        params=params,
        body=body,
        resources=resources,
    )


def load_language(lang: str, root: Path) -> tuple[list[Page], list[Page]]:
    content_dir = root / "content" / lang
    pages: list[Page] = []
    sections: dict[str, Page] = {}

    for entry in sorted(content_dir.iterdir()):
        if entry.is_file() and entry.suffix == ".md":
            if entry.name != "_index.md":
                pages.append(
                    make_page(lang=lang, section="", slug=entry.stem, kind="page", file=entry, content_dir=content_dir)
                )
            continue
        if not entry.is_dir():
            continue

        section = entry.name
        index_file = entry / "_index.md"
        sections[section] = make_page(
            lang=lang,
            section=section,
            slug="",
            kind="section",
            file=index_file if index_file.exists() else None,
            content_dir=content_dir,
        )

        for child in sorted(entry.iterdir()):
            if child.is_file() and child.suffix == ".md" and child.name != "_index.md":
                pages.append(
                    make_page(
                        lang=lang, section=section, slug=child.stem, kind="page", file=child, content_dir=content_dir
                    )
                )
            elif child.is_dir() and (child / "index.md").exists():
                pages.append(
                    make_page(
                        lang=lang,
                        section=section,
                        slug=child.name,
                        kind="page",
                        file=child / "index.md",
                        bundle_dir=child,
                        content_dir=content_dir,
                    )
                )

    published = [p for p in pages if not p.params.get("draft")]
    for page in published:
        if page.section:
            sections[page.section].children.append(page)
    for section in sections.values():
        # Newest first. Python's sort is stable, also with reverse=True.
        section.children.sort(key=lambda p: p.date or "", reverse=True)
    return published, list(sections.values())


def link_translations(pages: list[Page]) -> None:
    """Pairs pages across languages by translationKey (or by identical content path).

    Also lets a bundle without its own images or attachments use the files of its translation.
    """
    groups: dict[str, list[Page]] = {}
    for page in pages:
        key = page.params.get("translationKey", f"{page.kind}:{page.section}/{page.slug}")
        groups.setdefault(key, []).append(page)
    for group in groups.values():
        for page in group:
            page.translations = [p for p in group if p is not page]
            for other in page.translations:
                for res in other.resources:
                    if not any(r.name.lower() == res.name.lower() for r in page.resources):
                        page.resources.append(dataclasses.replace(res, inherited=True))


def load_content(root: Path) -> dict[str, dict[str, list[Page]]]:
    """Returns {"en": {"pages": [...], "sections": [...]}, "es": {...}}."""
    site = {}
    for lang in CONTENT_LANGS:
        pages, sections = load_language(lang, root)
        site[lang] = {"pages": pages, "sections": sections}
    link_translations([p for s in site.values() for p in s["pages"] + s["sections"]])
    return site


def find_resource(page: Page, name: str) -> Resource | None:
    wanted = unquote(name).lower()
    return next((r for r in page.resources if r.name.lower() == wanted), None)


def feature_image(page: Page) -> Resource | None:
    images = [r for r in page.resources if IMAGE.search(r.name)]
    return next((r for r in images if "feature" in r.name.lower()), None) or next(
        (r for r in images if "thumb" in r.name.lower()), None
    )
