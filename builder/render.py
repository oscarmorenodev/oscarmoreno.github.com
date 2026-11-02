"""The Jinja2 environment: loads templates/ and exposes the helpers the templates call."""

import json
import re
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, StrictUndefined, select_autoescape
from markupsafe import Markup

from .config import LANGUAGES, SITE
from .content import feature_image
from .feeds import rfc822
from .i18n import format_date, t
from .icons import icon
from .markdown import strip_tags

TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "templates"


def absolute(url: str) -> str:
    return url if re.match(r"^https?:", url) else SITE["base_url"] + url


def json_ld(data: dict) -> Markup:
    # Escaping "<" keeps a "</script>" inside the data from closing the script tag early.
    return Markup(json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c"))


env = Environment(
    loader=FileSystemLoader(TEMPLATES_DIR),
    autoescape=select_autoescape(["html", "xml"]),  # every {{ value }} is HTML-escaped unless marked safe
    trim_blocks=True,  # a {% tag %} doesn't leave its line break behind…
    lstrip_blocks=True,  # …nor the indentation before it
    undefined=StrictUndefined,  # a typo in a variable name is an error, not an empty string
    keep_trailing_newline=True,
)
env.globals.update(
    site=SITE,
    languages=LANGUAGES,
    t=t,
    format_date=format_date,
    icon=icon,
    absolute=absolute,
    feature_image=feature_image,
    rfc822=rfc822,
    strip_tags=strip_tags,
)
env.filters["json_ld"] = json_ld


def render(template: str, **context) -> str:
    return env.get_template(template).render(**context)
