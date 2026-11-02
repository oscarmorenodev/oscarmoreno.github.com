"""Build-time syntax highlighting with an Xcode-dark-like theme.

Pygments splits code into (token type, text) pairs; this module colors each one with inline
styles, using the same <pre class="shiki xcode-dark"><code><span class="line">… markup the
previous shiki-based build produced, which the CSS and assets/js/code-copy.js rely on.
"""

from html import escape

from pygments.lexers import get_lexer_by_name
from pygments.token import Comment, Keyword, Name, Number, Punctuation, String, Token
from pygments.util import ClassNotFound

BACKGROUND = "#1f1f24"
FOREGROUND = "#FFFFFF"

# Pygments token type -> color. A token without its own entry uses its parent's
# (e.g. Comment.Single -> Comment), and falls back to FOREGROUND.
COLORS = {
    Comment: "#6C7986",
    Comment.Preproc: "#FD8F3F",
    Name.Decorator: "#FD8F3F",
    Keyword: "#FC5FA3",
    String: "#FC6A5D",
    String.Interpol: FOREGROUND,
    String.Char: "#D0BF69",
    Number: "#D0BF69",
    Name.Builtin: "#D0A8FF",
    Name.Builtin.Pseudo: "#A167E6",
    Name.Class: "#5DD8FF",
    Name.Function: "#41A1C0",
    Punctuation: FOREGROUND,
}

LANGUAGES = {"swift"}


def color_of(ttype) -> str:
    while ttype is not Token:
        if ttype in COLORS:
            return COLORS[ttype]
        ttype = ttype.parent
    return FOREGROUND


def flush_whitespace(runs: list[list[str]], whitespace: str) -> None:
    """Trailing whitespace on a line goes to the line's last run (or a run of its own)."""
    if not whitespace:
        return
    if runs:
        runs[-1][1] += whitespace
    else:
        runs.append([FOREGROUND, whitespace])


def highlight(code: str, lang: str | None) -> str:
    try:
        # stripnl/ensurenl off: keep the code exactly as written, without extra newlines.
        lexer = get_lexer_by_name(lang, stripnl=False, ensurenl=False) if lang in LANGUAGES else None
    except ClassNotFound:
        lexer = None
    tokens = list(lexer.get_tokens(code)) if lexer else [(Token.Text, code)]

    # Each line is a list of [color, text] runs. Like shiki, whitespace joins the run that follows
    # it, and neighbouring runs of the same color are merged, to keep the HTML small.
    lines: list[list[list[str]]] = [[]]
    pending = ""
    for ttype, text in tokens:
        color = color_of(ttype)
        for i, part in enumerate(text.split("\n")):
            if i > 0:
                flush_whitespace(lines[-1], pending)
                pending = ""
                lines.append([])
            if not part.strip():
                pending += part
                continue
            run = lines[-1]
            if run and run[-1][0] == color:
                run[-1][1] += pending + part
            else:
                run.append([color, pending + part])
            pending = ""
    flush_whitespace(lines[-1], pending)

    spans = (
        "".join(f'<span style="color:{color}">{escape(text, quote=False)}</span>' for color, text in runs)
        for runs in lines
    )
    body = "\n".join(f'<span class="line">{line}</span>' for line in spans)
    return (
        f'<pre class="shiki xcode-dark" style="background-color:{BACKGROUND.lower()};color:{FOREGROUND.lower()}"'
        f' tabindex="0"><code>{body}</code></pre>'
    )
