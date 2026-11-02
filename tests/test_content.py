from datetime import date, datetime, timedelta, timezone

from builder.content import iso_date, section_title


def test_section_title_is_pluralized():
    assert section_title("apps") == "Apps"
    assert section_title("legal") == "Legals"


def test_iso_date_matches_the_front_matter():
    assert iso_date(date(2024, 3, 11)) == "2024-03-11"
    offset = timezone(timedelta(hours=2))
    assert iso_date(datetime(2024, 10, 15, 8, tzinfo=offset)) == "2024-10-15T08:00:00.000+02:00"
    assert iso_date(None) is None
