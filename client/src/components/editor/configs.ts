/**
 * Editor Configurations
 * Config for each template's editable fields.
 *
 * NOTE: The `config_schema` in the database is the source of truth for
 * validation. This file drives the editor UI and provides defaults.
 * Fields of type "color" will render the restricted 12-swatch palette.
 */

import type { EditorConfig } from "./types";

export const EDITOR_CONFIGS: Record<string, EditorConfig> = {
  "date-invite": {
    templateId: "date-invite",
    title: "הזמנה לדייט",
    description: 'כרטיס אינטראקטיבי שבו כפתור ה"לא" בורח. אי אפשר לסרב!',
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
      {
        key: "primaryColor",
        label: "צבע ראשי",
        type: "color",
      },
    ],
    defaultData: {
      question: "האם תרצה לצאת איתי לדייט?",
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
      {
        key: "primaryColor",
        label: "צבע ראשי",
        type: "color",
      },
    ],
    defaultData: {
      title: "גרד וגלה את ההפתעה",
      prizeContent: "🎁 זכית בהפתעה מיוחדת!",
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
      {
        key: "primaryColor",
        label: "צבע ראשי",
        type: "color",
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
      {
        key: "primaryColor",
        label: "צבע ראשי",
        type: "color",
      },
    ],
    defaultData: {
      title: "פנקס קופונים",
      coupons: [
        {
          id: "coupon-1",
          title: "20 דקות מסאז'",
          description: "קופון למימוש",
          icon: "💆",
          color: "emerald",
          isRedeemed: false,
        },
        {
          id: "coupon-2",
          title: "פטור משטיפת כלים",
          description: "קופון למימוש",
          icon: "🧽",
          color: "sky",
          isRedeemed: false,
        },
        {
          id: "coupon-3",
          title: "בחירת סרט הערב",
          description: "קופון למימוש",
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
    title: "חידון חברות",
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
          options: ["לטייל בעולם", "לפתוח עסק", 'לגור בחו"ל', "להיות שף"],
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
        { minScore: 80, message: "מכיר/ה אותי מושלם!" },
        { minScore: 50, message: "כמעט מושלם..." },
        { minScore: 0, message: "כל הכבוד על הניסיון!" },
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
        key: "primaryColor",
        label: "צבע ראשי",
        type: "color",
      },
      {
        key: "envelopes",
        label: "מעטפות",
        type: "envelopes",
      },
    ],
    defaultData: {
      title: "תפתחי כש...",
      envelopes: [
        {
          id: "env-1",
          title: "כשאת מתגעגעת",
          dateOpen: new Date().toISOString().split("T")[0],
          content: "את תמיד בלב שלי, גם כשאנחנו רחוקים...",
        },
        {
          id: "env-2",
          title: "כשאת עצובה",
          dateOpen: new Date().toISOString().split("T")[0],
          content: "תזכרי שאני כאן בשבילך, תמיד.",
        },
      ],
      primaryColor: "#d4826f",
    },
  },
  "decision-wheel": {
    templateId: "decision-wheel",
    title: "גלגל החלטות",
    description: "סובבו את הגלגל וקבלו תשובה!",
    fields: [
      {
        key: "title",
        label: "כותרת",
        type: "text",
        placeholder: "גלגל ההחלטות",
      },
      {
        key: "subtitle",
        label: "כותרת משנה",
        type: "text",
        placeholder: "סובבו וגלו!",
      },
      {
        key: "options",
        label: "אופציות (2-8)",
        type: "options",
      },
      {
        key: "primaryColor",
        label: "צבע ראשי",
        type: "color",
      },
    ],
    defaultData: {
      title: "גלגל ההחלטות",
      subtitle: "לחצו על הכפתור וגלו!",
      options: [
        "ארוחת ערב רומנטית",
        "סרט ביחד",
        "טיול בטבע",
        "ערב משחקים",
        "מסאז' מפנק",
        "בישול ביחד",
      ],
      primaryColor: "#d4826f",
    },
  },
  "surprise-gift": {
    templateId: "surprise-gift",
    title: "מתנה בהפתעה",
    description: "קופסת מתנה אינטראקטיבית — נערו אותה עד שתיפתח!",
    fields: [
      {
        key: "title",
        label: "כותרת",
        type: "text",
        placeholder: "יש לך הפתעה! 🎁",
      },
      {
        key: "greeting",
        label: "ברכה / הודעה",
        type: "textarea",
        placeholder: "הטקסט שייחשף אחרי הפתיחה",
      },
      {
        key: "boxColor",
        label: "צבע קופסה",
        type: "color",
      },
      {
        key: "ribbonColor",
        label: "צבע סרט",
        type: "color",
      },
      {
        key: "primaryColor",
        label: "צבע ראשי",
        type: "color",
      },
    ],
    defaultData: {
      title: "יש לך הפתעה! 🎁",
      greeting: "אוהב/ת אותך מכל הלב ❤️",
      boxColor: "#e74c5e",
      ribbonColor: "#ffd700",
      clicksRequired: 5,
      primaryColor: "#d4826f",
    },
  },
  "steamy-window": {
    templateId: "steamy-window",
    title: "חלון עם אדים",
    description: "הודעה מוסתרת מאחורי אדים — העבירו אצבע כדי לגלות",
    fields: [
      {
        key: "title",
        label: "כותרת",
        type: "text",
        placeholder: "יש לך הודעה...",
      },
      {
        key: "revealMessage",
        label: "הודעה מוסתרת",
        type: "textarea",
        placeholder: "הטקסט שייחשף אחרי הגירוד",
        maxLength: 18,
      },
      {
        key: "background_image",
        label: "תמונת רקע",
        type: "image_url",
        placeholder: "העלו תמונה לרקע",
      },
      {
        key: "primaryColor",
        label: "צבע ראשי",
        type: "color",
      },
    ],
    defaultData: {
      title: "יש לך הודעה...",
      revealMessage: "אני אוהב אותך! ❤️",
      primaryColor: "#d4826f",
    },
  },
};
