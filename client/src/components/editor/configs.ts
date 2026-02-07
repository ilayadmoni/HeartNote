/**
 * Editor Configurations
 * Config for each template's editable fields
 */

import type { EditorConfig } from "./types";

export const EDITOR_CONFIGS: Record<string, EditorConfig> = {
  "date-invite": {
    templateId: "date-invite",
    title: "הזמנה לדייט",
    description: "כרטיס אינטראקטיבי שבו כפתור ה\"לא\" בורח. אי אפשר לסרב!",
    fields: [
      {
        key: "question",
        label: "שאלה",
        type: "text",
        placeholder: "?האם תצא/י איתי לדייט",
      },
      {
        key: "yesText",
        label: "טקסט כפתור כן",
        type: "text",
        placeholder: "כן!",
      },
      {
        key: "noText",
        label: "טקסט כפתור לא",
        type: "text",
        placeholder: "לא",
      },
      {
        key: "successMessage",
        label: "הודעת הצלחה",
        type: "text",
        placeholder: "!יש! איזה כיף",
      },
    ],
    defaultData: {
      question: "?האם תצא/י איתי לדייט",
      yesText: "כן!",
      noText: "לא",
      successMessage: "!יש! איזה כיף",
    },
  },
  "scratch-card": {
    templateId: "scratch-card",
    title: "כרטיס גירוד",
    description: "גרדו וגלו את ההפתעה המוסתרת!",
    fields: [
      {
        key: "title",
        label: "כותרת",
        type: "text",
        placeholder: "גרד וגלה את ההפתעה",
      },
      {
        key: "prizeContent",
        label: "תוכן הפרס",
        type: "textarea",
        placeholder: "🎁 זכית בהפתעה מיוחדת!",
      },
    ],
    defaultData: {
      title: "גרד וגלה את ההפתעה",
      prizeContent: "🎁 זכית בהפתעה מיוחדת!",
      gridSize: { cols: 6, rows: 4 },
      scratchColor: "#c0c0c0",
    },
  },
  "timeline": {
    templateId: "timeline",
    title: "ציר הזמן שלנו",
    description: "ספרו את הסיפור שלכם דרך אירועים בציר זמן",
    fields: [
      {
        key: "title",
        label: "כותרת",
        type: "text",
        placeholder: "הסיפור שלנו",
      },
    ],
    defaultData: {
      title: "הסיפור שלנו",
      events: [],
    },
  },
  "love-coupons": {
    templateId: "love-coupons",
    title: "קופוני אהבה",
    description: "צרו קופונים דיגיטליים למימוש",
    fields: [
      {
        key: "title",
        label: "כותרת",
        type: "text",
        placeholder: "קופונים מיוחדים",
      },
    ],
    defaultData: {
      title: "קופונים מיוחדים",
      coupons: [],
    },
  },
  "relationship-quiz": {
    templateId: "relationship-quiz",
    title: "חידון זוגיות",
    description: "צרו חידון לבדיקת כמה מכירים אתכם",
    fields: [
      {
        key: "title",
        label: "כותרת",
        type: "text",
        placeholder: "?כמה את/ה מכיר/ה אותי",
      },
    ],
    defaultData: {
      title: "?כמה את/ה מכיר/ה אותי",
      questions: [],
      scoreMessages: [],
    },
  },
  "open-when": {
    templateId: "open-when",
    title: "פתח כש...",
    description: "צרו מעטפות עם מכתבים לרגעים מיוחדים",
    fields: [
      {
        key: "title",
        label: "כותרת",
        type: "text",
        placeholder: "מכתבים מיוחדים",
      },
    ],
    defaultData: {
      title: "מכתבים מיוחדים",
      envelopes: [],
    },
  },
};
