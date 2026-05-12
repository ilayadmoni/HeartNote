import type { EditorConfig } from "../types";

export const ROMANCE_CONFIGS: Record<string, EditorConfig> = {
  "date-invite": {
    templateId: "date-invite",
    title: "הזמנה לדייט",
    description: 'כרטיס אינטראקטיבי שבו כפתור ה"לא" בורח. אי אפשר לסרב!',
    fields: [
      { key: "title", label: "כותרת", type: "text", placeholder: "הזמנה לדייט" },
      { key: "question", label: "שאלה", type: "text", placeholder: "?האם תצא/י איתי לדייט" },
      { key: "successMessage", label: "הודעת הצלחה", type: "text", placeholder: "!יש! איזה כיף" },
      { key: "primaryColor", label: "צבע ראשי", type: "color" },
    ],
    defaultData: {
      title: "הזמנה לדייט",
      question: "האם תרצי לצאת איתי לדייט?",
      yesText: "כן",
      noText: "לא",
      successMessage: "יש איזה כיף!",
      primaryColor: "#d4826f",
    },
  },
  "scratch-card": {
    templateId: "scratch-card",
    title: "כרטיס גירוד",
    description: "גרדו וגלו את ההפתעה המוסתרת!",
    fields: [
      { key: "title", label: "כותרת", type: "text", placeholder: "גרד וגלה את ההפתעה" },
      { key: "prizeContent", label: "תוכן הפרס", type: "textarea", placeholder: "🎁 זכית בהפתעה מיוחדת!" },
      { key: "primaryColor", label: "צבע ראשי", type: "color" },
    ],
    defaultData: {
      title: "גרד וגלה את ההפתעה",
      prizeContent: "🎁 זכית בהפתעה מיוחדת!",
      primaryColor: "#d4826f",
    },
  },
  "apology-search": {
    templateId: "apology-search",
    title: "חיפוש סליחה",
    description: "חיפוש שמדמה גוגל — מקליד את הסליחה ומגיע לתוצאה מרגשת!",
    fields: [
      { key: "searchQuery", label: "שאילתת חיפוש", type: "text", placeholder: "איך לבקש סליחה מהבן זוג שלי?", maxLength: 70 },
      { key: "resultTitle", label: "כותרת תוצאה", type: "text", placeholder: "סליחה שהייתי עצבנית", maxLength: 30 },
      { key: "resultSubtitle", label: "תיאור תוצאה", type: "textarea", placeholder: "אתה צודק. אוהבת אותך.", maxLength: 100 },
      { key: "startButtonLabel", label: "כפתור התחלה", type: "text", placeholder: "התחל חיפוש", maxLength: 40 },
      { key: "primaryColor", label: "צבע ראשי", type: "color" },
    ],
    defaultData: {
      searchQuery: "איך לבקש סליחה מהבן זוג שלי?",
      resultTitle: "סליחה שהייתי עצבנית",
      resultSubtitle: "אתה צודק. אוהבת אותך.",
      startButtonLabel: "התחל חיפוש",
      typingSpeedMs: 80,
      primaryColor: "#d4826f",
    },
  },
};
