"""Site-wide configuration: base URL, author, menu, and the one supported navigation language.

The site is English-only in its navigation and chrome. Spanish content under content/es still
exists and still gets URLs (see build.py): pages that have an English translation redirect to it,
and Spanish-only content (the podcast, one untranslated post) is still rendered and reachable —
just without a language switcher or its own menu, using this English shell.
"""

from datetime import date

SITE = {
    "base_url": "https://oscarmoreno.com",
    "google_analytics": "G-R502FEV9RG",
    "page_size": 10,
    "default_appearance": "light",
    "auto_switch_appearance": True,
    "author": {
        "name": "Oscar Moreno",
        "image": "/img/memoji-2-no-bg.png",
        "links": [
            {"icon": "x-twitter", "label": "X", "url": "https://x.com/oscarmorenodev"},
            {"icon": "linkedin", "label": "Linkedin", "url": "https://linkedin.com/in/oscarmorenodev"},
        ],
    },
}

LANGUAGES = {
    "en": {
        "code": "en",
        "name": "English",
        "prefix": "",
        "title": "Oscar Moreno | Software Engineer",
        "description": "Software Engineer",
        "copyright": f"© {date.today().year} Oscar Moreno",
        "headline": "Coding and writing about Software Engineering",
        "privacy_page": "/privacy/",
        "menu": [
            {"name": "Blog", "url": "/blog/"},
            {"name": "About", "url": "/about/"},
            {"name": "Contact", "url": "/contact/"},
            {"name": "Projects", "url": "/projects/"},
        ],
    },
}

DEFAULT_LANGUAGE = "en"
