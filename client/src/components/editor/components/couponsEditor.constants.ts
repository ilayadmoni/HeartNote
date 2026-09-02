/** Emoji + color swatch options shared by CouponsEditor and CouponItem. */

export const EMOJI_OPTIONS = [
  "💆", "🍽️", "🎬", "🧹", "💤", "🍫",
  "☕", "🎁", "💋", "🌹", "🏖️", "🎵",
] as const;

export const COLOR_OPTIONS = [
  { key: "emerald", labelKey: "coupons.colorGreen", dot: "bg-emerald-400" },
  { key: "sky", labelKey: "coupons.colorBlue", dot: "bg-sky-400" },
  { key: "amber", labelKey: "coupons.colorOrange", dot: "bg-amber-400" },
  { key: "rose", labelKey: "coupons.colorPink", dot: "bg-rose-400" },
  { key: "violet", labelKey: "coupons.colorPurple", dot: "bg-violet-400" },
  { key: "cyan", labelKey: "coupons.colorCyan", dot: "bg-cyan-400" },
] as const;
