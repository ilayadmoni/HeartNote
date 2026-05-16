import type { FilterTab } from "../types";

export const CATEGORY_EMOJI_MAP: Record<string, string> = {
  "רומנטי": "💕",
  "משחקים": "🎮",
  "זיכרונות": "📸",
  "מתנות": "🎁",
  "אירועים מיוחדים": "🎉",
  "חתונה": "💍",
  "חגים": "🕎",
  "בר/בת מצווה": "🎊",
};

export const FILTER_TABS: FilterTab[] = [
  { id: "all", label: "הכל", emoji: "✨" },
  { id: "romantic", label: "רומנטי", emoji: "💕" },
  { id: "fun", label: "משחקים", emoji: "🎮" },
  { id: "memories", label: "זיכרונות", emoji: "📸" },
  { id: "gifts", label: "מתנות", emoji: "🎁" },
  { id: "birthday", label: "אירועים מיוחדים", emoji: "🎉" },
];
