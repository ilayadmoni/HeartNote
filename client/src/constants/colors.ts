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
  nameHe: string;
}

/**
 * The 13 approved colors in the HeartNote design system.
 */
export const COLOR_PALETTE: PaletteColor[] = [
  { hex: "#C7CEEA", name: "Periwinkle",    nameHe: "סגלגל" },
  { hex: "#B5EAD7", name: "Mint",          nameHe: "מנטה" },
  { hex: "#E2F0CB", name: "Pale Lime",     nameHe: "ליים" },
  { hex: "#E1BEE7", name: "Lavender",      nameHe: "לבנדר" },
  { hex: "#F8BBD0", name: "Pink",          nameHe: "ורוד" },
  { hex: "#d4826f", name: "Salmon",        nameHe: "סלמון" },
  { hex: "#D4F0F0", name: "Light Cyan",    nameHe: "תכלת" },
  { hex: "#38b6ff", name: "Bright Blue",   nameHe: "כחול בהיר" },
  { hex: "#7ed957", name: "Bright Green",  nameHe: "ירוק בהיר" },
  { hex: "#ffde59", name: "Bright Yellow", nameHe: "צהוב בהיר" },
  { hex: "#ff5757", name: "Bright Red",    nameHe: "אדום בהיר" },
  { hex: "#000000", name: "Black",         nameHe: "שחור" }
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
