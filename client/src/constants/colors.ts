/**
 * HeartNote Global Color Palette
 *
 * This is the SINGLE SOURCE OF TRUTH for all color selections in the
 * template editor. Any field of type "color" must restrict its palette
 * to these 13 colors. No arbitrary hex input is allowed.
 */

export interface PaletteColor {
  hex: string;
  name: string;
  /** Resolve via useTranslations("editor") as `colors.<nameKey>` */
  nameKey: string;
}

/**
 * The 13 approved colors in the HeartNote design system.
 * Display names are resolved through `editor.colors.<nameKey>`.
 */
export const COLOR_PALETTE: PaletteColor[] = [
  { hex: "#C7CEEA", name: "Periwinkle",    nameKey: "periwinkle" },
  { hex: "#B5EAD7", name: "Mint",          nameKey: "mint" },
  { hex: "#E2F0CB", name: "Pale Lime",     nameKey: "paleLime" },
  { hex: "#E1BEE7", name: "Lavender",      nameKey: "lavender" },
  { hex: "#F8BBD0", name: "Pink",          nameKey: "pink" },
  { hex: "#d4826f", name: "Salmon",        nameKey: "salmon" },
  { hex: "#D4F0F0", name: "Light Cyan",    nameKey: "lightCyan" },
  { hex: "#38b6ff", name: "Bright Blue",   nameKey: "brightBlue" },
  { hex: "#7ed957", name: "Bright Green",  nameKey: "brightGreen" },
  { hex: "#ffde59", name: "Bright Yellow", nameKey: "brightYellow" },
  { hex: "#ff5757", name: "Bright Red",    nameKey: "brightRed" },
  { hex: "#000000", name: "Black",         nameKey: "black" }
];

/**
 * Flat array of allowed hex values (upper-cased for comparison).
 * Used for quick validation.
 */
export const ALLOWED_HEX_VALUES: string[] = COLOR_PALETTE.map((c) =>
  c.hex.toUpperCase()
);

/**
 * Check whether a hex string is in the allowed palette.
 * Comparison is case-insensitive.
 */
export function isAllowedColor(hex: string): boolean {
  return ALLOWED_HEX_VALUES.includes(hex.toUpperCase());
}
