/**
 * OpenWhen Constants
 * Pastel palette, emoji options, animation variants
 */

/** Maximum envelopes the user can create */
export const MAX_ENVELOPES = 6;

/** Pastel color palette for envelope cards (rotating) */
export const ENVELOPE_COLORS = [
  { bg: "bg-rose-50 dark:bg-rose-900/20", border: "border-rose-200 dark:border-rose-800" },
  { bg: "bg-sky-50 dark:bg-sky-900/20", border: "border-sky-200 dark:border-sky-800" },
  { bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800" },
  { bg: "bg-violet-50 dark:bg-violet-900/20", border: "border-violet-200 dark:border-violet-800" },
  { bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800" },
  { bg: "bg-pink-50 dark:bg-pink-900/20", border: "border-pink-200 dark:border-pink-800" },
];

/** Floating background emojis */
export const FLOATING_EMOJIS = ["💌", "✨", "💕", "🌸", "⭐", "🦋"];

/** Emoji options for envelope picker */
export const EMOJI_OPTIONS = [
  "💌", "😢", "😊", "💪", "🎉", "💖",
  "🌟", "🏠", "🌧️", "☀️", "🎂", "✈️",
];

/** Check if an envelope is unlocked based on its dateOpen */
export function isEnvelopeUnlocked(dateOpen: string): boolean {
  if (!dateOpen) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const openDate = new Date(dateOpen + "T00:00:00");
  return openDate <= today;
}
