/**
 * Maps template slugs (stable IDs used in routes + DB) to the camelCase
 * key used under messages/*.json "gallery.templates.<key>". Slugs never
 * change; this indirection lets copy live entirely in the message catalog.
 */
export const TEMPLATE_KEY: Record<string, string> = {
  "date-invite": "dateInvite",
  "scratch-card": "scratchCard",
  timeline: "timeline",
  "decision-wheel": "decisionWheel",
  "love-coupons": "loveCoupons",
  "relationship-quiz": "relationshipQuiz",
  "open-when": "openWhen",
  "surprise-gift": "surpriseGift",
  "slot-machine": "slotMachine",
  "punching-bag": "punchingBag",
  "apology-search": "apologySearch",
  "excuse-generator": "excuseGenerator",
  "bar-bat-mitzvah": "barBatMitzvah",
  "birthday-candles-interactive": "birthdayCandles",
  "wedding-glass-interactive": "weddingGlass",
  "holiday-rosh-hashanah-interactive": "holidayRoshHashanah",
  "holiday-passover-interactive": "holidayPassover",
  "holiday-purim-interactive": "holidayPurim",
  "holiday-shavuot-interactive": "holidayShavuot",
  "holiday-sukkot-interactive": "holidaySukkot",
  "holiday-hanukkah-interactive": "holidayHanukkah",
};

/** DB category strings (Hebrew, from `templates.category`) mapped to canonical ids. */
export const CATEGORY_KEY: Record<string, string> = {
  "רומנטי": "romantic",
  "משחקים": "fun",
  "זיכרונות": "memories",
  "מתנות": "gifts",
  "אירועים מיוחדים": "birthday",
  "חתונה": "wedding",
  "חגים": "holidays",
  "בר/בת מצווה": "mitzvah",
};
