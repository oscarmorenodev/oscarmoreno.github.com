"""Markdown to HTML.

Content shortcodes (alert, icon, resources, relref), heading anchors, build-time syntax
highlighting, and link/image resolution against page bundles.

markdown-it-py turns Markdown into a flat list of tokens (heading_open, inline, fence, …) and
calls one render rule per token type. The rules below replace the default ones for headings,
code blocks, links and images. Per-page state (the page, its heading ids, its table of
contents) travels in the `env` dict that markdown-it passes to every rule.
"""

import re
from collections.abc import Callable

from markdown_it import MarkdownIt

from .content import Page, find_resource
from .highlight import highlight
from .i18n import t
from .icons import icon

TAG = re.compile(r"<[^>]+>")


def escape_html(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def strip_tags(html: str) -> str:
    return TAG.sub("", html)


def heading_id(text: str, used: set[str]) -> str:
    """Goldmark's default ("github") heading IDs."""
    base = text.lower()
    base = re.sub(r"<[^>]+>", "", base)
    base = re.sub(r"&[a-z#0-9]+;", "", base)
    base = re.sub(r"[^\w\s-]", "", base).strip()  # \w is Unicode-aware: letters, digits and _
    base = re.sub(r"\s", "-", base)
    id_ = base
    n = 1
    while id_ in used:
        id_ = f"{base}-{n}"
        n += 1
    used.add(id_)
    return id_


def is_remote(href: str) -> bool:
    return bool(re.match(r"^(https?:)?//", href))


def is_relative(href: str) -> bool:
    return bool(href) and not is_remote(href) and not re.match(r"^(/|#|mailto:|tel:)", href)


# --- Render rules ---------------------------------------------------------------------------
# Each rule receives the renderer, the token list, the current token's index, the options and env.


def render_heading_open(self, tokens, idx, options, env):
    token = tokens[idx]
    inner = self.renderInline(tokens[idx + 1].children, options, env)
    text = strip_tags(inner)
    id_ = heading_id(text, env["used_ids"])
    level = int(token.tag[1])
    if 2 <= level <= 4:
        env["toc"].append({"level": level, "id": id_, "text": text})
    # Remembered for heading_close, which adds the anchor link.
    token.meta["id"] = id_
    tokens[idx + 2].meta["id"] = id_
    return f'<{token.tag} id="{id_}">'


def render_heading_close(self, tokens, idx, options, env):
    token = tokens[idx]
    anchor = ""
    if env["page"].params.get("showHeadingAnchors", True):
        label = t(env["page"].lang, "anchor")
        anchor = f' <a class="heading-anchor" href="#{token.meta["id"]}" aria-label="{label}">#</a>'
    return f"{anchor}</{token.tag}>\n"


def render_fence(self, tokens, idx, options, env):
    token = tokens[idx]
    lang = token.info.split()[0] if token.info.strip() else None
    code = token.content.removesuffix("\n")
    return f'<div class="highlight">{highlight(code, lang)}</div>\n'


def render_link_open(self, tokens, idx, options, env):
    token = tokens[idx]
    href = token.attrGet("href") or ""
    title = token.attrGet("title")
    target = href
    if is_relative(href):
        ref, _, fragment = href.partition("#")
        resource = find_resource(env["page"], ref)
        target = (resource.url if resource else env["resolve"](ref) or ref) + (f"#{fragment}" if fragment else "")
    attrs = ' target="_blank" rel="noreferrer"' if is_remote(href) else ""
    title_attr = f' title="{escape_html(title)}"' if title else ""
    return f'<a href="{escape_html(target)}"{title_attr}{attrs}>'


def render_image(self, tokens, idx, options, env):
    token = tokens[idx]
    href = token.attrGet("src") or ""
    title = token.attrGet("title")
    alt = self.renderInlineAsText(token.children or [], options, env)
    if is_relative(href):
        resource = find_resource(env["page"], href)
        src = resource.url if resource else href
    else:
        src = href
    img = f'<img src="{escape_html(src)}" alt="{escape_html(alt)}" loading="lazy" decoding="async">'
    return f"<figure>{img}<figcaption>{escape_html(title)}</figcaption></figure>" if title else img


def create_markdown() -> MarkdownIt:
    md = MarkdownIt("commonmark", {"typographer": True, "xhtmlOut": False})
    md.enable(["table", "strikethrough", "replacements", "smartquotes"])
    md.add_render_rule("heading_open", render_heading_open)
    md.add_render_rule("heading_close", render_heading_close)
    md.add_render_rule("fence", render_fence)
    md.add_render_rule("link_open", render_link_open)
    md.add_render_rule("image", render_image)
    return md


MD = create_markdown()
# Front-matter summaries: plain inline Markdown, no typography or custom rules.
INLINE_MD = MarkdownIt("commonmark", {"xhtmlOut": False}).enable(["table", "strikethrough"])


def render_inline(source: str) -> str:
    return INLINE_MD.renderInline(source)


# --- Shortcodes -----------------------------------------------------------------------------

ALERT = re.compile(r'\{\{<\s*alert\s*(?:"([^"]+)")?\s*>\}\}([\s\S]*?)\{\{<\s*/\s*alert\s*>\}\}')
ICON = re.compile(r'\{\{<\s*icon\s+"([^"]+)"\s*>\}\}')
RESOURCES = re.compile(r"\{\{%\s*resources\s+([^%]*?)/?%\}\}")
RELREF = re.compile(r'\{\{<\s*relref\s+"([^"]+)"\s*>\}\}')
PLACEHOLDER_P = re.compile(r"<p>@@SC(\d+)@@</p>")
PLACEHOLDER = re.compile(r"@@SC(\d+)@@")


def extract_shortcodes(source: str, env: dict) -> tuple[str, list[str]]:
    """Replaces shortcodes with placeholder tokens rendered after Markdown, so their HTML is not re-parsed."""
    page: Page = env["page"]
    blocks: list[str] = []

    def token(html: str, block: bool) -> str:
        blocks.append(html)
        id_ = f"@@SC{len(blocks) - 1}@@"
        return f"\n\n{id_}\n\n" if block else id_

    def alert(match: re.Match) -> str:
        name, inner = match[1], match[2]
        body = render_shortcode_body(inner.strip(), env)
        return token(
            f'<div class="alert"><span class="alert-icon">{icon(name or "triangle-exclamation")}</span>'
            f"<span>{body}</span></div>",
            True,
        )

    def resources(match: re.Match) -> str:
        found = re.search(r'pattern="([^"]*)"', match[1])
        pattern = re.compile(found[1] if found else "")
        files = "".join(
            f'<li><a href="{r.url}" download>{escape_html(r.name)}</a></li>'
            for r in sorted(page.resources, key=lambda r: r.name)
            if pattern.search(r.name)
        )
        label = t(page.lang, "attachments")
        html = f'<div class="attachments"><div class="attachments-label">{label}</div><ul>{files}</ul></div>'
        return token(html, True)

    out = ALERT.sub(alert, source)
    out = ICON.sub(lambda m: token(icon(m[1]), False), out)
    out = RESOURCES.sub(resources, out)
    out = RELREF.sub(lambda m: env["resolve"](m[1]) or m[1], out)
    return out, blocks


def render_shortcode_body(source: str, env: dict) -> str:
    html = MD.render(source, env).strip()
    # A result that's just one paragraph is unwrapped, so inline shortcode bodies stay inline.
    single = re.fullmatch(r"<p>([\s\S]*)</p>", html)
    return single[1] if single and "<p>" not in single[1] else html


def render_markdown(page: Page, resolve_page: Callable[[str], str | None]) -> tuple[str, list[dict]]:
    """Renders a page's Markdown body.

    resolve_page maps a content reference to a URL in the page's language.
    Returns the HTML and the table of contents: a list of {"level", "id", "text"}.
    """
    env = {"page": page, "resolve": resolve_page, "used_ids": set(), "toc": []}
    source, blocks = extract_shortcodes(page.body, env)
    html = MD.render(source, env)
    html = PLACEHOLDER_P.sub(lambda m: blocks[int(m[1])], html)
    html = PLACEHOLDER.sub(lambda m: blocks[int(m[1])], html)
    return html, env["toc"]
