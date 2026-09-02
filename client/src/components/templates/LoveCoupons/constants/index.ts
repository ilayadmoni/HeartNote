/**
 * LoveCoupons Constants
 * Color palette, emoji options, max coupons
 */

/** Maximum coupons the user can create */
export const MAX_COUPONS = 6;

/** Coupon color options — key used in data, classes used for rendering */
export const COUPON_COLORS: { key: string; label: string; bg: string; bgDark: string }[] = [
  { key: "emerald", label: "Green", bg: "bg-emerald-50", bgDark: "dark:bg-emerald-900/20" },
  { key: "sky", label: "Blue", bg: "bg-sky-50", bgDark: "dark:bg-sky-900/20" },
  { key: "amber", label: "Orange", bg: "bg-amber-50", bgDark: "dark:bg-amber-900/20" },
  { key: "rose", label: "Pink", bg: "bg-rose-50", bgDark: "dark:bg-rose-900/20" },
  { key: "violet", label: "Purple", bg: "bg-violet-50", bgDark: "dark:bg-violet-900/20" },
  { key: "cyan", label: "Cyan", bg: "bg-cyan-50", bgDark: "dark:bg-cyan-900/20" },
];

/** Get the bg classes for a coupon based on its color key */
export function getCouponColorClasses(colorKey?: string, index?: number): string {
  const found = COUPON_COLORS.find((c) => c.key === colorKey);
  if (found) return `${found.bg} ${found.bgDark}`;
  // Fallback: cycle through palette
  const fallback = COUPON_COLORS[(index ?? 0) % COUPON_COLORS.length];
  return `${fallback.bg} ${fallback.bgDark}`;
}

/** Emoji options for coupon picker */
export const EMOJI_OPTIONS = [
  "💆", "🍽️", "🎬", "🧹", "💤", "🍫",
  "☕", "🎁", "💋", "🌹", "🏖️", "🎵",
];
