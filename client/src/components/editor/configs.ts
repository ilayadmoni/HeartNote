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
        key: "successMessage",
        label: "הודעת הצלחה",
        type: "text",
        placeholder: "!יש! איזה כיף",
      },
    ],
    defaultData: {
      question: "האם תצא/י איתי לדייט?",
      yesText: "כן!",
      noText: "לא",
      successMessage: "!יש! איזה כיף",
      primaryColor: "#d4826f",
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
      primaryColor: "#d4826f",
    },
  },
  timeline: {
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
      {
        key: "events",
        label: "אירועים",
        type: "events",
      },
    ],
    defaultData: {
      title: "הסיפור שלנו",
      events: [],
      primaryColor: "#d4826f",
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
        placeholder: "פנקס קופונים",
      },
      {
        key: "coupons",
        label: "קופונים",
        type: "coupons",
      },
    ],
    defaultData: {
      title: "פנקס קופונים",
      coupons: [
        {
          id: "coupon-1",
          title: "20 דקות מסאז'",
          description: "מקפה דרג שווים",
          icon: "💆",
          color: "emerald",
          isRedeemed: false,
        },
        {
          id: "coupon-2",
          title: "פטור משטיפת כלים",
          description: "מקפה דרג שווים",
          icon: "🧽",
          color: "sky",
          isRedeemed: false,
        },
        {
          id: "coupon-3",
          title: "בחירת סרט הערב",
          description: "מימוש 1",
          icon: "🎬",
          color: "amber",
          isRedeemed: false,
        },
      ],
      primaryColor: "#d4826f",
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
        placeholder: "כמה טוב את מכירה אותי?",
      },
      {
        key: "questions",
        label: "שאלות",
        type: "questions",
      },
    ],
    defaultData: {
      title: "כמה טוב את מכירה אותי?",
      questions: [
        {
          id: "q-1",
          question: "איזה מאכל אני הכי אוהב?",
          options: ["פיצה", "סושי", "המבורגר", "שוקולד"],
          correctIndex: 0,
        },
        {
          id: "q-2",
          question: "מה החלום הכי גדול שלי?",
          options: ["לטייל בעולם", "לפתוח עסק", "לגור בחו\"ל", "להיות שף"],
          correctIndex: 0,
        },
        {
          id: "q-3",
          question: "מה הצבע האהוב עליי?",
          options: ["כחול", "אדום", "ירוק", "שחור"],
          correctIndex: 0,
        },
      ],
      scoreMessages: [
        { minScore: 80, message: "מכיר/ה אותי מושלם!", emoji: "🎉" },
        { minScore: 50, message: "כמעט מושלם...", emoji: "😊" },
        { minScore: 0, message: "כל הכבוד על הניסיון!", emoji: "💪" },
      ],
      primaryColor: "#d4826f",
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
      {
        key: "envelopes",
        label: "מעטפות",
        type: "envelopes",
      },
    ],
    defaultData: {
      title: "...תפתחי כש",
      envelopes: [
        {
          id: "env-1",
          title: "כשאת מתגעגעת",
          emoji: "💖",
          dateOpen: new Date().toISOString().split("T")[0],
          content: "את תמיד בלב שלי, גם כשאנחנו רחוקים...",
        },
        {
          id: "env-2",
          title: "כשאת עצובה",
          emoji: "😢",
          dateOpen: new Date().toISOString().split("T")[0],
          content: "תזכרי שאני כאן בשבילך, תמיד.",
        },
      ],
      primaryColor: "#d4826f",
    },
  },
};
