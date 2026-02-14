/**
 * OpenWhen Constants
 * Stationery palette, emoji options, animation variants
 */

/** Maximum envelopes the user can create */
export const MAX_ENVELOPES = 6;

/** Premium stationery color palette for envelopes (rotating) */
export const ENVELOPE_COLORS = [
  { body: "#fef2f0", flap: "#fce4e0", seal: "#e8636b", accent: "#f9d4cf" },
  { body: "#eef6fc", flap: "#dceefb", seal: "#5b9bd5", accent: "#c5dff4" },
  { body: "#fef9ee", flap: "#fdf0d0", seal: "#d4a33e", accent: "#f5e4b3" },
  { body: "#f5f0fc", flap: "#ebe0fa", seal: "#9b6fd0", accent: "#d8c6f0" },
  { body: "#eefaf3", flap: "#d6f2e2", seal: "#4caf84", accent: "#b8e8ce" },
  { body: "#fef0f5", flap: "#fce0eb", seal: "#d4688a", accent: "#f5c6d7" },
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
