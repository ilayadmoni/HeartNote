/**
 * Template Data
 * Static data for gallery templates - connected to actual template components
 */

import type { Template, FilterTab } from "../types";

export const FILTER_TABS: FilterTab[] = [
  { id: "all", label: "הכל", emoji: "✨" },
  { id: "romantic", label: "רומנטי", emoji: "💕" },
  { id: "fun", label: "משחקים", emoji: "🎮" },
  { id: "memories", label: "זיכרונות", emoji: "📸" },
  { id: "gifts", label: "מתנות", emoji: "🎁" },
];

export const TEMPLATES: Template[] = [
  {
    id: "date-invite",
    title: "הזמנה לדייט",
    description:
      'כרטיס אינטראקטיבי שבו כפתור ה"לא" בורח מהאצבע. אי אפשר לסרב לזה! 💕',
    category: "romantic",
    isFree: true,
    componentKey: "DateInvite",
    link: "/create/date-invite",
    badge: { type: "free", color: "#22c55e" },
  },
  {
    id: "scratch-card",
    title: "כרטיס גירוד",
    description:
      "גרדו וגלו את ההפתעה! פרס מוסתר מחכה מתחת לשכבה הכסופה. ✨",
    category: "fun",
    isFree: true,
    componentKey: "ScratchCard",
    link: "/create/scratch-card",
    badge: { type: "free", color: "#22c55e" },
  },
  {
    id: "timeline",
    title: "ציר הזמן שלנו",
    description:
      "מסע נוסטלגי דרך הרגעים המיוחדים: הנשיקה הראשונה, הדייט הראשון והיום. 📅",
    category: "memories",
    componentKey: "Timeline",
    link: "/create/timeline",
    badge: { type: "heart", color: "#d4826f" },
  },
  {
    id: "love-coupons",
    title: "קופוני אהבה",
    description:
      "פנקס קופונים דיגיטלי למימוש! עיסוי, ארוחת ערב, ועוד הפתעות מפנקות. 🎟️",
    category: "gifts",
    componentKey: "LoveCoupons",
    link: "/create/love-coupons",
    badge: { type: "heart", color: "#d4826f" },
  },
  {
    id: "relationship-quiz",
    title: "חידון זוגיות",
    description:
      "כמה את/ה באמת מכיר/ה אותי? חידון אינטראקטיבי עם ציון בסוף! 🧠",
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
    description:
      "מעטפות דיגיטליות עם מכתבים לרגעים מיוחדים. כשעצוב, כשמתגעגע, כששמח... 💌",
    category: "romantic",
    isPremium: true,
    componentKey: "OpenWhen",
    link: "/create/open-when",
    badge: { type: "premium", color: "#f59e0b" },
    linkText: "פרימיום",
  },
];

// Sample data for live previews
export const PREVIEW_DATA = {
  DateInvite: {
    question: "?תצא/י איתי",
    yesText: "כן!",
    noText: "לא",
    successMessage: "!יש",
  },
  ScratchCard: {
    title: "",
    prize: { type: "text" as const, content: "🎁" },
    gridSize: { cols: 4, rows: 3 },
    scratchColor: "#c0c0c0",
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
      { id: "1", title: "עיסוי", icon: "💆", isRedeemed: false },
      { id: "2", title: "ארוחה", icon: "🍽️", isRedeemed: true },
    ],
  },
  RelationshipQuiz: {
    title: "?",
    questions: [{ id: "1", question: "?", options: ["A", "B"], correctIndex: 0 }],
    scoreMessages: [],
  },
  OpenWhen: {
    envelopes: [
      { id: "1", title: "😢", content: "", isLocked: false },
      { id: "2", title: "💪", content: "", isLocked: true },
    ],
  },
};
