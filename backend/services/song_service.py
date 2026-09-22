def format_duration(seconds: int | None) -> str:
    """Convert integer seconds to mm:ss string, e.g. 213 → '3:33'."""
    if seconds is None:
        return "0:00"
    m, s = divmod(seconds, 60)
    return f"{m}:{s:02d}"
