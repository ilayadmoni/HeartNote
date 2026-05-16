# Add Missing Gallery Info Text — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the 8 missing `TEMPLATE_INFO_TEXT` entries for the interactive event templates so their info (ℹ️) button appears in the `/gallery` screen, while splitting `data/templates.ts` (currently 469 lines) into ≤150-line focused files.

**Architecture:** `data/templates.ts` becomes a thin barrel that re-exports from 5 focused sub-files. All existing import paths (`from "../data/templates"`) remain valid — zero changes needed in consumers. The 8 new `TEMPLATE_INFO_TEXT` entries follow the existing playful Hebrew tone.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, no test framework changes needed (no logic changes — data-only).

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `data/categoryConfig.ts` | `CATEGORY_EMOJI_MAP` + `FILTER_TABS` |
| Create | `data/baseTemplates.ts` | 16 original `TEMPLATES` entries |
| Create | `data/interactiveEventTemplates.ts` | 8 `INTERACTIVE_EVENT_TEMPLATES` entries |
| Create | `data/previewData.ts` | `PREVIEW_DATA` constant |
| Create | `data/templateInfoText.ts` | All 24 `TEMPLATE_INFO_TEXT` entries (16 existing + 8 new) |
| Modify | `data/templates.ts` | Barrel: imports from sub-files, re-exports, merges TEMPLATES list |

All files under `client/src/components/galleryTemplate/data/`.

---

## Task 1 — Create `categoryConfig.ts`

**Files:**
- Create: `client/src/components/galleryTemplate/data/categoryConfig.ts`

- [ ] **Step 1.1 — Create the file**

```ts
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
```

- [ ] **Step 1.2 — Type-check this file only**

```powershell
cd D:\HeartNote\client; npx tsc --noEmit 2>&1 | Select-String "categoryConfig"
```

Expected: no output (zero errors in this file).

---

## Task 2 — Create `baseTemplates.ts`

**Files:**
- Create: `client/src/components/galleryTemplate/data/baseTemplates.ts`

- [ ] **Step 2.1 — Create the file**

```ts
import type { Template } from "../types";

export const BASE_TEMPLATES: Template[] = [
  {
    id: "date-invite",
    title: "בא לך דייט?",
    description: 'כרטיס אינטראקטיבי שבו כפתור ה"לא" בורח מהאצבע. אי אפשר לסרב לזה! 💕',
    category: "romantic",
    isFree: true,
    componentKey: "DateInvite",
    link: "/create/date-invite",
    badge: { type: "free", color: "#22c55e" },
  },
  {
    id: "scratch-card",
    title: "כרטיס גירוד",
    description: "גרדו וגלו את ההפתעה! פרס מוסתר מחכה מתחת לשכבה הכסופה. ✨",
    category: "fun",
    isFree: true,
    componentKey: "ScratchCard",
    link: "/create/scratch-card",
    badge: { type: "free", color: "#22c55e" },
  },
  {
    id: "timeline",
    title: "איך הכול התחיל?",
    description: "מסע נוסטלגי דרך הרגעים המיוחדים שלכם ושל מי שאתם אוהבים📅",
    category: "memories",
    isFree: true,
    componentKey: "Timeline",
    link: "/create/timeline",
    badge: { type: "free", color: "#22c55e" },
  },
  {
    id: "decision-wheel",
    title: "אין לי כוח להחליט",
    description: "לא יודעים מה לעשות? סובבו את הגלגל ותנו לגורל לבחור בשבילכם! 🎡",
    category: "fun",
    isFree: true,
    componentKey: "DecisionWheel",
    link: "/create/decision-wheel",
    badge: { type: "free", color: "#22c55e" },
  },
  {
    id: "love-coupons",
    title: "קופוני אהבה",
    description: "פנקס קופונים דיגיטלי! המון הפתעות מפנקות שתוכלו להתאים בעצמכם🎟️",
    category: "gifts",
    componentKey: "LoveCoupons",
    link: "/create/love-coupons",
    badge: { type: "heart", color: "#d4826f" },
  },
  {
    id: "relationship-quiz",
    title: "מבחן חברות",
    description: "כמה אתם באמת מכירים אחד את השני? חידון גורלי עם ציון בסוף! 🧠",
    category: "fun",
    isPremium: true,
    componentKey: "RelationshipQuiz",
    link: "/create/relationship-quiz",
    badge: { type: "premium", color: "#f59e0b" },
    linkText: "פרימיום",
  },
  {
    id: "open-when",
    title: "פתח כש...",
    description: "מעטפות עם מכתבים לרגעים מיוחדים. כשעצוב, כשמתגעגעים... 💌",
    category: "romantic",
    isPremium: true,
    componentKey: "OpenWhen",
    link: "/create/open-when",
    badge: { type: "premium", color: "#f59e0b" },
    linkText: "פרימיום",
  },
  {
    id: "surprise-gift",
    title: "הפתעה קטנה",
    description: "קופסת מתנה, נערו אותה עד שתיפתח ותגלו את מה מסתתר בפנים! 🎁",
    category: "gifts",
    isPremium: true,
    componentKey: "SurpriseGift",
    link: "/create/surprise-gift",
    badge: { type: "new", color: "#8b5cf6" },
    linkText: "חדש!",
  },
  {
    id: "slot-machine",
    title: "בלי נדר",
    description: "סובבו את מכונת ההבטחות וגלו מה ההפתעה שמחכה לכם! 🎰",
    category: "fun",
    isFree: true,
    componentKey: "SlotMachine",
    link: "/create/slot-machine",
    badge: { type: "new", color: "#8b5cf6" },
    linkText: "חדש!",
  },
  {
    id: "punching-bag",
    title: "יאללה, לפרוק",
    description: "תוציאו את כל העצבים שק האגרוף וגלו מה המסר שמחכה לכם! 🥊",
    category: "fun",
    isFree: true,
    componentKey: "PunchingBag",
    link: "/create/punching-bag",
    badge: { type: "new", color: "#8b5cf6" },
    linkText: "חדש!",
  },
  {
    id: "apology-search",
    title: "איפה הסליחה שלי?",
    description: "חיפוש שמקליד את הסליחה לבד ומגיע לתוצאה הכי מרגשת ברשת! 🔍",
    category: "romantic",
    isFree: true,
    componentKey: "ApologySearch",
    link: "/create/apology-search",
    badge: { type: "new", color: "#8b5cf6" },
    linkText: "חדש!",
  },
  {
    id: "birthday-candles",
    title: "כיבוי נרות",
    description: "כבו את הנרות אחד אחד, בקשו משאלה, וגלו הפתעה מתוקה ליום ההולדת! 🎂",
    category: "birthday",
    isPremium: true,
    componentKey: "BirthdayCandles",
    link: "/create/birthday-candles",
    badge: { type: "premium", color: "#f59e0b" },
    linkText: "פרימיום",
  },
  {
    id: "excuse-generator",
    title: "יש לי הסבר...",
    description: "הפעילו את מכונת התירוצים וקבלו תירוץ זריז ומושלם לכל מצב! ⚙️",
    category: "fun",
    isFree: true,
    componentKey: "ExcuseGenerator",
    link: "/create/excuse-generator",
    badge: { type: "free", color: "#22c55e" },
  },
  {
    id: "wedding-glass",
    title: "שבירת כוס",
    description: "חתן וכלה חכמים משם וכוס שנשברת בכל לחיצה! מזל טוב ודרך מושלמת לחגוג את החתונה. 💍",
    category: "wedding",
    isPremium: true,
    componentKey: "WeddingGlass",
    link: "/create/wedding-glass",
    badge: { type: "premium", color: "#f59e0b" },
    linkText: "פרימיום",
  },
  {
    id: "holiday-card",
    title: "מפעל החגים",
    description: "בחרו חג אהוב ותאימו ברכה אישית לכל החג — ראש השנה, חנוכה, פורים, פסח ועוד. 🍯",
    category: "holidays",
    isPremium: true,
    componentKey: "HolidayCard",
    link: "/create/holiday-card",
    badge: { type: "premium", color: "#f59e0b" },
    linkText: "פרימיום",
  },
  {
    id: "bar-bat-mitzvah",
    title: "בר/בת מצווה",
    description: "כרטיס אינטראקטיבי לחגיגת בר או בת מצווה! בחרו את הסוג, לחצו על הכתר או הספר, וגלו הודעת ברכה מרגשת. 🎉",
    category: "mitzvah",
    isPremium: true,
    componentKey: "BarBatMitzvah",
    link: "/create/bar-bat-mitzvah",
    badge: { type: "premium", color: "#f59e0b" },
    linkText: "פרימיום",
  },
];
```

- [ ] **Step 2.2 — Type-check**

```powershell
cd D:\HeartNote\client; npx tsc --noEmit 2>&1 | Select-String "baseTemplates"
```

Expected: no output.

---

## Task 3 — Create `interactiveEventTemplates.ts`

**Files:**
- Create: `client/src/components/galleryTemplate/data/interactiveEventTemplates.ts`

- [ ] **Step 3.1 — Create the file**

```ts
import type { Template } from "../types";

export const INTERACTIVE_EVENT_TEMPLATES: Template[] = [
  {
    id: "birthday-candles-interactive",
    title: "עוגת יום הולדת קסומה",
    description: "כרטיס יום הולדת שבו מכבים נרות ומגלים ברכה אישית.",
    category: "birthday",
    isPremium: true,
    componentKey: "BirthdayCandlesInteractive",
    link: "/create/birthday-candles-interactive",
    badge: { type: "premium", color: "#f59e0b" },
    linkText: "פרימיום",
  },
  {
    id: "wedding-glass-interactive",
    title: "חתונה תחת החופה",
    description: "רגע חתונה רומנטי עם איורי החופה החדשים וברכה אישית לזוג.",
    category: "wedding",
    isPremium: true,
    componentKey: "WeddingGlassInteractive",
    link: "/create/wedding-glass-interactive",
    badge: { type: "premium", color: "#f59e0b" },
    linkText: "פרימיום",
  },
  {
    id: "holiday-rosh-hashanah-interactive",
    title: "ראש השנה מתוק",
    description: "דבש, תפוחים וברכה שנפתחת ברגע מתוק לשנה החדשה.",
    category: "holidays",
    isPremium: true,
    componentKey: "HolidayRoshHashanahInteractive",
    link: "/create/holiday-rosh-hashanah-interactive",
    badge: { type: "premium", color: "#f59e0b" },
    linkText: "פרימיום",
  },
  {
    id: "holiday-passover-interactive",
    title: "פסח נפתח",
    description: "מצה מאוירת נפתחת בעדינות ומגלה ברכת חג אישית.",
    category: "holidays",
    isPremium: true,
    componentKey: "HolidayPassoverInteractive",
    link: "/create/holiday-passover-interactive",
    badge: { type: "premium", color: "#f59e0b" },
    linkText: "פרימיום",
  },
  {
    id: "holiday-purim-interactive",
    title: "מסכת פורים",
    description: "מסכה חגיגית נוטה ונפתחת כדי לחשוף הפתעה שמחה.",
    category: "holidays",
    isPremium: true,
    componentKey: "HolidayPurimInteractive",
    link: "/create/holiday-purim-interactive",
    badge: { type: "premium", color: "#f59e0b" },
    linkText: "פרימיום",
  },
  {
    id: "holiday-shavuot-interactive",
    title: "שבועות פורח",
    description: "זר פרחים וחיטים פורח סביב ברכה רכה ובהירה.",
    category: "holidays",
    isPremium: true,
    componentKey: "HolidayShavuotInteractive",
    link: "/create/holiday-shavuot-interactive",
    badge: { type: "premium", color: "#f59e0b" },
    linkText: "פרימיום",
  },
  {
    id: "holiday-sukkot-interactive",
    title: "נכנסים לסוכה",
    description: "וילונות הסוכה נפתחים ומגלים ברכת חג חמה.",
    category: "holidays",
    isPremium: true,
    componentKey: "HolidaySukkotInteractive",
    link: "/create/holiday-sukkot-interactive",
    badge: { type: "premium", color: "#f59e0b" },
    linkText: "פרימיום",
  },
  {
    id: "holiday-hanukkah-interactive",
    title: "אור חנוכה",
    description: "מדליקים חנוכייה אלגנטית, נר אחר נר, ואז הברכה נחשפת.",
    category: "holidays",
    isPremium: true,
    componentKey: "HolidayHanukkahInteractive",
    link: "/create/holiday-hanukkah-interactive",
    badge: { type: "premium", color: "#f59e0b" },
    linkText: "פרימיום",
  },
];
```

- [ ] **Step 3.2 — Type-check**

```powershell
cd D:\HeartNote\client; npx tsc --noEmit 2>&1 | Select-String "interactiveEventTemplates"
```

Expected: no output.

---

## Task 4 — Create `previewData.ts`

**Files:**
- Create: `client/src/components/galleryTemplate/data/previewData.ts`

Note: `SURPRISE_GIFT_BOX_COLOR` and `SURPRISE_GIFT_RIBBON_COLOR` are derived inline here using the same logic as the original file.

- [ ] **Step 4.1 — Create the file**

```ts
import { COLOR_PALETTE } from "@/constants/colors";

const SURPRISE_GIFT_BOX_COLOR = COLOR_PALETTE.find(
  (color) => color.name === "Bright Red",
)!.hex;
const SURPRISE_GIFT_RIBBON_COLOR = COLOR_PALETTE.find(
  (color) => color.name === "Bright Yellow",
)!.hex;

export const PREVIEW_DATA = {
  DateInvite: {
    question: "?תצא/י איתי",
    yesText: "כן!",
    noText: "לא",
    successMessage: "!יש",
  },
  ScratchCard: {
    title: "",
    prizeContent: "🎁",
  },
  Timeline: {
    events: [
      { id: "1", date: "2023-01", title: "❤️" },
      { id: "2", date: "2023-06", title: "✨" },
      { id: "3", date: "2024-01", title: "💒" },
    ],
  },
  LoveCoupons: {
    coupons: [
      { id: "1", title: "עיסוי", icon: "💆", color: "emerald", isRedeemed: false },
      { id: "2", title: "ארוחה", icon: "🍽️", color: "sky", isRedeemed: true },
    ],
  },
  RelationshipQuiz: {
    title: "?",
    questions: [
      { id: "1", question: "?", options: ["A", "B", "C", "D"], correctIndex: 0 },
    ],
    scoreMessages: [
      { minScore: 0, message: "כל הכבוד!", emoji: "💪" },
    ],
  },
  OpenWhen: {
    envelopes: [
      { id: "1", title: "😢", emoji: "😢", content: "", dateOpen: "2026-01-01" },
      { id: "2", title: "💪", emoji: "💪", content: "", dateOpen: "2099-01-01" },
    ],
  },
  DecisionWheel: {
    title: "גלגל ההחלטות",
    options: ["ארוחה", "סרט", "טיול", "מסאז'"],
  },
  SlotMachine: {
    title: "מכונת ההבטחות",
    reel1Options: ["אני מבטיח", "מחר בבוקר"],
    reel2Options: ["להזמין לנו", "לפנק אותך"],
    reel3Options: ["פיצה ענקית.", "מסאז'."],
    targetReel1: "אני מבטיח",
    targetReel2: "להזמין לנו",
    targetReel3: "פיצה ענקית.",
    primaryColor: "#d4826f",
  },
  SurpriseGift: {
    title: "יש לך הפתעה! 🎁",
    greeting: "אוהב/ת אותך מכל הלב ❤️",
    boxColor: SURPRISE_GIFT_BOX_COLOR,
    ribbonColor: SURPRISE_GIFT_RIBBON_COLOR,
    clicksRequired: 5,
    primaryColor: "#d4826f",
  },
  PunchingBag: {
    introTitle: "מערכת לשחרור לחצים",
    introSubtitle: "תני לזה כמה מכות טובות",
    hitsRequired: 5,
    resultMessage: "סליחה שהייתי מניאק ❤️",
    bagColor: "#d4826f",
    primaryColor: "#d4826f",
  },
  ApologySearch: {
    searchQuery: "איך לבקש סליחה מהבן זוג שלי?",
    resultTitle: "סליחה שהייתי עצבנית",
    resultSubtitle: "אתה צודק. אוהבת אותך.",
    primaryColor: "#d4826f",
  },
  BirthdayCandles: {
    title: "מערכת כיבוי נרות",
    subtitle: "הקישי על הלהבות",
    candleCount: 3,
    cakeColor: "#d4826f",
    flameColor: "#ffde59",
    celebrationTitle: "מזל טוב!!! 🎂",
    celebrationMessage: "שתמיד תהיי מוקפת באהבה!",
    primaryColor: "#d4826f",
  },
  ExcuseGenerator: {
    title: "מכונת התירוצים האוטומטית",
    subtitle: "לא בא לך לצאת? יש לנו תירוץ בשבילך.",
    excuses: [
      "הכלב שלי אכל את הזמן הפנוי שלי.",
      "הגשם גרם לי לחשוב מחדש.",
      "הצמח שלי חלה ואני צריך/ה לטפל בו.",
    ],
    buttonLabel: "ג'נרט תירוץ",
    disclaimer: "* החברה אינה אחראית לתוצאות השימוש בתירוצים אלו.",
    primaryColor: "#d4826f",
  },
  WeddingGlass: {
    title: "שבירת כוס דיגיטלית",
    subtitle: "לחצו על הכפתור כדי שהחתן ישבור את הכוס",
    stompButtonLabel: "שבור את הכוס!",
    mazalTovTitle: "מזל טוב! 💍",
    mazalTovMessage: "שתזכו לבנות יחד בית מלא באהבה, צחוק ושמחה.",
    primaryColor: "#d4826f",
  },
  HolidayCard: {
    holidayKind: "rosh" as const,
    customTitle: "",
    customGreeting: "שנה טובה ומתוקה!",
    primaryColor: "#d4826f",
  },
  BarBatMitzvah: {
    kind: "bat" as const,
    introTitle: "מכונת ההתבגרות",
    introSubtitle: "לחצו על הכתר או הספר כדי לגלות את הברכה",
    blessingTitle: "הגיע הזמן לחגוג! 🎉",
    blessingMessage: "ברוכים הבאים לגיל הבגרות. שתיהיי מוקפת בחברים, אהבה וגאווה למשפחה.",
    tapHintLabel: "לחצו על הכתר",
    primaryColor: "#d4826f",
  },
};
```

- [ ] **Step 4.2 — Type-check**

```powershell
cd D:\HeartNote\client; npx tsc --noEmit 2>&1 | Select-String "previewData"
```

Expected: no output.

---

## Task 5 — Create `templateInfoText.ts` (with 8 new entries)

**Files:**
- Create: `client/src/components/galleryTemplate/data/templateInfoText.ts`

This file contains all 24 entries: the 16 originals (copied verbatim) plus 8 new ones for the interactive event templates.

- [ ] **Step 5.1 — Create the file**

```ts
/** Funny "how it works" descriptions shown in the info modal */
export const TEMPLATE_INFO_TEXT: Record<string, string> = {
  // ── Original 16 ────────────────────────────────────────────────────────────
  "date-invite":
    "איך זה עובד? אתם שולחים הזמנה, והצד השני פשוט לא יכול לסרב (כי כפתור ה'לא' בורח להם מהאצבע!). דרך מושלמת להבטיח דייט, או לפחות לגרום להם לצחוק קצת לפני שהם מסכימים.",
  "scratch-card":
    "מרגישים בני מזל? זה בדיוק כמו כרטיס חישגד, רק שבמקום לזכות ב-10 שקלים ולהתאכזב, פה מסתתרת הפתעה שאתם בחרתם! (ובלי הלכלוך של הגירוד על הספה).",
  timeline:
    "המסע שלכם, מאורגן יפה! תחשבו על זה כמו קורות חיים, רק של הזוגיות שלכם. מתי נפגשתם? מתי אמרתם 'אני אוהב/ת אותך' לראשונה? הכל פה.",
  "decision-wheel":
    "סוף לדילמה הנצחית של 'מה בא לך לאכול?'. מכניסים אופציות, מסובבים את הגלגל, והגורל יחליט (או שתסובבו שוב ושוב עד שייצא פיצה).",
  "love-coupons":
    "פנקס קופונים שאתם מכינים מראש! מסאז'? פטור משטיפת כלים? רק תיזהרו, כי הם עלולים לממש את כולם באותו יום.",
  "relationship-quiz":
    "המבחן האולטימטיבי! האם הם באמת מקשיבים לכם כשאתם מדברים? תכינו שאלות קשות ותראו מי יקבל תעודת הצטיינות (ומי יישן על הספה).",
  "open-when":
    "מעטפות וירטואליות לרגעים ספציפיים. 'פתח כשאתה עצוב', 'פתח כשאתה מתגעגע'... הרבה יותר מרגש מלהשאיר פתק על המקרר שנופל אחרי יומיים.",
  "surprise-gift":
    "קופסת מתנה וירטואלית שצריך ללחוץ עליה עד שהיא נפתחת כדי לגלות את ההפתעה. מתאים במיוחד לאנשים חסרי סבלנות!",
  "slot-machine":
    "לא צריך יותר להמר! כל סיבוב מגלה קצת יותר, עד שבסיבוב האחרון נחשפת ההבטחה המלאה. ככה מבטיחים דברים עם סטייל.",
  "punching-bag":
    "לפעמים צריך לשחרר קצת לחץ. כאן אפשר לתת מכות לשק האיגרוף הדיגיטלי ובסוף לגלות שמאחורי השק מסתתרת הפתעה מתוקה. טיפול זוגי ממש לא יצליח להתחרות בזה.",
  "apology-search":
    "מדמים חיפוש בגוגל — רק שהפעם מה שמחפשים זה סליחה. האנימציה מקלידה את השאלה לבד, ואחרי כמה שניות מתח מופיע הכרטיס עם ההודעה האישית. כי גם סליחה צריכה להופיע בתוצאות החיפוש.",
  "excuse-generator":
    "מה אנחנו עושים כאן? מכונה שמייצרת תירוצים אוטומטית! לוחצים, הגלגל עם השיניים מסתובב, ומתוך מאגר התירוצים שהכנתם מראש יוצא התירוץ המושלם. לא צריכים להיות יצירתיים — הגאדג'ט עושה את העבודה.",
  "birthday-candles":
    "עוגת יום הולדת דיגיטלית אמיתית! כל לחיצה כובה נר, ובסוף כשכל הנרות כבויים, מופיעה הודעת המזל טוב האישית. כי ריח העוגה לא מגיע בדיגיטל, אבל הרגש — כן!",
  "wedding-glass":
    "קלאסיקה חתונה דיגיטלית! החתן והכלה עומדים זה לצד זה, כוס שבורה במרכז, ולחיצה אחת — הכוס נשברת לשרדים עם אנימציה מפוצצת! בסוף הודעת מזל טוב אישית. כי ממש שום דבר לא מרגיש כמו חתונה בדיגיטל.",
  "holiday-card":
    "בחרו חג שלנו — ראש השנה, חנוכה, פורים או פסח — וכתבו ברכה אישית. כל חג בעל דיוק משלו: צבעים, ציוני כיתוב, ודרכו של העונה שזה שלנו. כי כל חג ראוי לבחינת תמונה איכותית וברכה מיוחדת.",
  "bar-bat-mitzvah":
    "כרטיס אינטראקטיבי לחגיגה של בר או בת מצווה! בחרו האם זה בר או בת, התאימו את הברכה, וכשהמקבל/ת לוחץ/ת על הכתר או הספר — ההודעה המרגשת שלכם מופיעה בפני עיניו/ה. כי ההתבגרות זה רגע שצריך חגיגה דיגיטלית.",

  // ── New 8 — Interactive Event Templates ────────────────────────────────────
  "birthday-candles-interactive":
    "עוגת יום הולדת שצריך לכבות בעצמכם! לוחצים על כל נר בזה אחר זה, בקשת משאלה (ובשקט, בשקט), ואז הברכה האישית שלכם נחשפת. מבטיח שיהיה יותר כיף מלנשוף על 40 נרות ולירוק על כולם.",
  "wedding-glass-interactive":
    "חתונה דיגיטלית עם איורים מקוריים! שולחים לזוג המאושר, הם לוחצים, ואנימציית החופה נפתחת לברכה האישית שכתבתם. פחות כאוס מחתונה אמיתית, אבל לא פחות מרגש (ממש קצת פחות).",
  "holiday-rosh-hashanah-interactive":
    "ברכת שנה טובה, אבל דיגיטלית ומרגשת. המקבל/ת לוחץ/ת, תפוחים ודבש קופצים על המסך, ואז מגיעה הברכה האישית שלכם. בדיוק כמו שיחת הטלפון עם סבתא — רק בלי שצריכים לחזור על 'מה נשמע' שבע פעמים.",
  "holiday-passover-interactive":
    "מצה אינטראקטיבית! המקבל/ת לוחץ/ת על הכרטיס, המצה נפרסת לאט, ומתחתיה מסתתרת ברכה חמה שכתבתם. לא מוצאים את האפיקומן? זה בסדר, הברכה הרבה יותר טובה ממנו בכל מקרה.",
  "holiday-purim-interactive":
    "מסכת פורים שמחביאה הפתעה! המקבל/ת לוחץ/ת על המסכה, היא מתגלגלת הצידה בתנועה שמחה, וברכת החג שלכם מופיעה. משנה כניסת אדר מרבים בשמחה — ובלחיצות.",
  "holiday-shavuot-interactive":
    "פרחים ושיבולים נפרשים על המסך, ובמרכז מסתתרת הברכה שלכם. כמו לקבל זר פרחים אמיתי — רק שזה לא יתייבש אחרי שלושה ימים ולא ישאיר כתמי אבקנים על הבגדים.",
  "holiday-sukkot-interactive":
    "וילונות הסוכה נפתחים לאט ומגלים את הברכה שהכנתם. מותר לשלוח גם מהספה, אפילו אם לא הספקתם לבנות סוכה השנה. הסוכה הדיגיטלית תמיד מוכנה.",
  "holiday-hanukkah-interactive":
    "מדליקים חנוכייה נר אחר נר, ואחרי הנר האחרון — הברכה שלכם מואירה את המסך. מתאים לשלוח כל ערב חנוכה מחדש, אם אתם מהסוג שמתחייבים לדברים. ואם לא — גם שליחה אחת מספיקה.",
};
```

- [ ] **Step 5.2 — Type-check**

```powershell
cd D:\HeartNote\client; npx tsc --noEmit 2>&1 | Select-String "templateInfoText"
```

Expected: no output.

---

## Task 6 — Rewrite `templates.ts` as a barrel

**Files:**
- Modify: `client/src/components/galleryTemplate/data/templates.ts`

This replaces the entire 469-line file with a thin barrel that re-exports everything and assembles the final `TEMPLATES` list. All existing consumers (`import { TEMPLATES, ... } from "../data/templates"`) continue to work unchanged.

- [ ] **Step 6.1 — Read the current file** (to confirm current exports before overwriting)

Read `client/src/components/galleryTemplate/data/templates.ts` — confirm it exports: `TEMPLATES`, `INTERACTIVE_EVENT_TEMPLATES`, `PREVIEW_DATA`, `TEMPLATE_INFO_TEXT`, `CATEGORY_EMOJI_MAP`, `FILTER_TABS`.

- [ ] **Step 6.2 — Overwrite the file**

```ts
/**
 * Template Data — barrel
 * Assembles and re-exports all template data from focused sub-modules.
 * Consumers import from this file; sub-modules are an implementation detail.
 */

export { CATEGORY_EMOJI_MAP, FILTER_TABS } from "./categoryConfig";
export { PREVIEW_DATA } from "./previewData";
export { TEMPLATE_INFO_TEXT } from "./templateInfoText";
export { INTERACTIVE_EVENT_TEMPLATES } from "./interactiveEventTemplates";

import { BASE_TEMPLATES } from "./baseTemplates";
import { INTERACTIVE_EVENT_TEMPLATES } from "./interactiveEventTemplates";
import type { Template } from "../types";

export const TEMPLATES: Template[] = [
  ...BASE_TEMPLATES,
  ...INTERACTIVE_EVENT_TEMPLATES,
];
```

- [ ] **Step 6.3 — Full type-check**

```powershell
cd D:\HeartNote\client; npx tsc --noEmit
```

Expected: exit 0, zero errors.

- [ ] **Step 6.4 — Lint**

```powershell
cd D:\HeartNote\client; npm run lint
```

Expected: no errors or warnings introduced by this change.

---

## Task 7 — Commit and verify

- [ ] **Step 7.1 — Stage all new and modified files**

```powershell
cd D:\HeartNote; git add client/src/components/galleryTemplate/data/
```

- [ ] **Step 7.2 — Confirm staged files**

```powershell
git diff --cached --name-only
```

Expected output (exactly these 6 files):
```
client/src/components/galleryTemplate/data/baseTemplates.ts
client/src/components/galleryTemplate/data/categoryConfig.ts
client/src/components/galleryTemplate/data/interactiveEventTemplates.ts
client/src/components/galleryTemplate/data/previewData.ts
client/src/components/galleryTemplate/data/templateInfoText.ts
client/src/components/galleryTemplate/data/templates.ts
```

- [ ] **Step 7.3 — Commit**

```powershell
git commit -m "$(cat <<'EOF'
feat: add missing info modal text for 8 interactive event templates

Split data/templates.ts (469 lines) into focused sub-modules to comply
with 150-line file limit. Added TEMPLATE_INFO_TEXT entries for all 8
interactive event templates so their info button appears in /gallery.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 7.4 — Production build**

```powershell
cd D:\HeartNote\client; npm run build
```

Expected: exits 0, no errors.

---

## Task 8 — Visual verification on dev server

- [ ] **Step 8.1 — Start dev server**

```powershell
cd D:\HeartNote\client; npm run dev
```

- [ ] **Step 8.2 — Navigate to `/gallery`**

Open `http://localhost:3000/gallery` in a browser.

- [ ] **Step 8.3 — Verify all 8 interactive event cards show the ℹ️ button**

Confirm each of these cards has a visible info button (top-right of the preview area):
- עוגת יום הולדת קסומה
- חתונה תחת החופה
- ראש השנה מתוק
- פסח נפתח
- מסכת פורים
- שבועות פורח
- נכנסים לסוכה
- אור חנוכה

- [ ] **Step 8.4 — Click each info button**

For each card: click ℹ️ → modal opens → title, description, and "איך זה עובד" text are all populated → click "הבנתי" or ✕ to close.

- [ ] **Step 8.5 — Confirm existing 16 cards are unaffected**

Click the info button on any 2–3 of the original 16 templates and confirm their modals still show the correct text.

---

## Post-Execution Checklist

Write to `.claude/plans/logs/add-missing-gallery-info-text-<timestamp>.log`:

```markdown
## Post-Execution Checklist — add-missing-gallery-info-text — <timestamp>

### Code Quality
- [ ] No file exceeds 150 lines
- [ ] TypeScript: zero `any`, all return types explicit
- [ ] No raw `console.*` — use `logger.*`

### Correctness
- [ ] All 8 interactive event templates now show ℹ️ button on /gallery
- [ ] TemplateInfoModal opens with correct infoText for each
- [ ] All 16 original templates unchanged
- [ ] No undefined or empty infoText values

### Git
- [ ] Working on `dev` branch only
- [ ] No changes to `main`

### Plan
- [ ] Plan log written to `.claude/plans/logs/add-missing-gallery-info-text-<timestamp>.log`
- [ ] All checklist items verified ✅
```

---

## Self-Review

**Spec coverage:**
- ✅ 8 missing `TEMPLATE_INFO_TEXT` entries → Task 5
- ✅ File split (469 → ≤150 lines each) → Tasks 1–6
- ✅ Zero import-path changes for consumers → Task 6 barrel re-exports all public names
- ✅ Playful Hebrew tone → Task 5 text written to match existing 16
- ✅ Existing 16 entries unchanged → Task 5 copies them verbatim
- ✅ Verification → Tasks 6, 7, 8

**Placeholder scan:** None found. All steps contain complete code.

**Type consistency:** `BASE_TEMPLATES` (Task 2) and `INTERACTIVE_EVENT_TEMPLATES` (Task 3) both type as `Template[]`. Barrel (Task 6) imports both and spreads into `TEMPLATES: Template[]`. `TEMPLATE_INFO_TEXT` is `Record<string, string>` throughout.
