"""
Backend Color Palette Constants

Single source of truth for allowed color hex values.
Mirrors the client-side constants/colors.ts.
"""

ALLOWED_COLORS: set[str] = {
    "#C7CEEA",   # Periwinkle
    "#B5EAD7",   # Mint
    "#E2F0CB",   # Pale Lime
    "#FFB7B2",   # Salmon
    "#E1BEE7",   # Lavender
    "#F8BBD0",   # Pink
    "#D4F0F0",   # Light Cyan
    "#FFFFD8",   # Cream
    "#38B6FF",   # Bright Blue
    "#7ED957",   # Bright Green
    "#FFDE59",   # Bright Yellow
    "#FF5757",   # Bright Red
}


def is_allowed_color(hex_value: str) -> bool:
    """Check if a hex color is within the allowed palette (case-insensitive)."""
    return hex_value.upper() in ALLOWED_COLORS
