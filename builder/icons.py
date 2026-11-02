"""Inline SVG icons from assets/icons."""

from functools import cache
from pathlib import Path

from markupsafe import Markup

ICONS_DIR = Path(__file__).resolve().parent.parent / "assets" / "icons"


@cache
def _svg(name: str) -> str:
    file = ICONS_DIR / f"{name}.svg"
    if not file.exists():
        raise ValueError(f"Unknown icon: {name}")
    return file.read_text(encoding="utf-8").strip()


def icon(name: str) -> Markup:
    # Markup tells Jinja2 this HTML is already safe, so it is not escaped again.
    return Markup(f'<span class="icon">{_svg(name)}</span>')
