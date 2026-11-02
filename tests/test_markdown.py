from builder.content import Page, Resource
from builder.markdown import heading_id, render_markdown


def make_page(body: str, **params) -> Page:
    return Page(
        lang="en",
        kind="page",
        section="blog",
        slug="post",
        file=None,
        content_path=None,
        url="/blog/post/",
        title="Post",
        date=None,
        params=params,
        body=body,
        resources=[Resource(name="Image.png", src=None, url="/blog/post/Image.png")],
    )


def no_pages(ref):
    return None


def test_heading_ids_are_unique_and_github_style():
    used = set()
    assert heading_id("What's new?", used) == "whats-new"
    assert heading_id("What's new?", used) == "whats-new-1"
    assert heading_id("Ñandú & Co", used) == "ñandú--co"


def test_headings_get_anchors_and_toc_entries():
    html, toc = render_markdown(make_page("# Title\n\n## First\n\n### Second"), no_pages)
    assert '<h2 id="first">First <a class="heading-anchor" href="#first" aria-label="Anchor">#</a></h2>' in html
    assert toc == [{"level": 2, "id": "first", "text": "First"}, {"level": 3, "id": "second", "text": "Second"}]


def test_heading_anchors_can_be_turned_off():
    html, _ = render_markdown(make_page("## First", showHeadingAnchors=False), no_pages)
    assert html == '<h2 id="first">First</h2>\n'


def test_links_resolve_resources_pages_and_remote_urls():
    body = "[img](image.png) [page](../other/#part) [ext](https://example.com)"
    html, _ = render_markdown(make_page(body), lambda ref: "/blog/other/" if ref == "../other/" else None)
    assert '<a href="/blog/post/Image.png">img</a>' in html
    assert '<a href="/blog/other/#part">page</a>' in html
    assert '<a href="https://example.com" target="_blank" rel="noreferrer">ext</a>' in html


def test_image_with_title_becomes_a_figure():
    html, _ = render_markdown(make_page('![Alt](image.png "Caption")'), no_pages)
    assert '<figure><img src="/blog/post/Image.png" alt="Alt" loading="lazy" decoding="async">' in html
    assert "<figcaption>Caption</figcaption></figure>" in html


def test_alert_shortcode_renders_inline_markdown():
    html, _ = render_markdown(make_page('{{< alert "lightbulb" >}}Use **bold**{{< /alert >}}'), no_pages)
    assert html.startswith('<div class="alert"><span class="alert-icon"><span class="icon"><svg')
    assert "<span>Use <strong>bold</strong></span></div>" in html


def test_swift_code_is_highlighted():
    html, _ = render_markdown(make_page("```swift\nlet x = 1\n```"), no_pages)
    assert html.startswith('<div class="highlight"><pre class="shiki xcode-dark"')
    assert '<span style="color:#FC5FA3">let</span>' in html
