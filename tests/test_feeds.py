from builder.feeds import rfc822
from builder.i18n import format_date


def test_rfc822_keeps_the_front_matter_offset():
    assert rfc822("2024-10-15T08:00:00.000+02:00") == "Tue, 15 Oct 2024 08:00:00 +0200"


def test_rfc822_date_only_is_midnight_utc():
    assert rfc822("2025-07-08") == "Tue, 08 Jul 2025 00:00:00 +0000"


def test_format_date_is_localized():
    assert format_date("2024-10-08T23:30:00.000-05:00", "en") == "8 October 2024"
    assert format_date("2024-10-08", "es") == "8 octubre 2024"
