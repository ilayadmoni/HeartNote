import type { EditorConfig } from "../types";

export const RELATIONSHIPS_CONFIGS: Record<string, EditorConfig> = {
  timeline: {
    templateId: "timeline",
    title: "ציר הזמן שלנו",
    description: "ספרו את הסיפור שלכם דרך אירועים בציר זמן",
    fields: [
      { key: "title", label: "כותרת", type: "text", placeholder: "הסיפור שלנו" },
      { key: "events", label: "אירועים", type: "events" },
      { key: "primaryColor", label: "צבע ראשי", type: "color" },
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
      { key: "title", label: "כותרת", type: "text", placeholder: "פנקס קופונים" },
      { key: "coupons", label: "קופונים", type: "coupons" },
      { key: "primaryColor", label: "צבע ראשי", type: "color" },
    ],
    defaultData: {
      title: "פנקס קופונים",
      coupons: [
        { id: "coupon-1", title: "20 דקות מסאז'", description: "קופון למימוש", icon: "💆", color: "emerald", isRedeemed: false },
        { id: "coupon-2", title: "פטור משטיפת כלים", description: "קופון למימוש", icon: "🧽", color: "sky", isRedeemed: false },
        { id: "coupon-3", title: "בחירת סרט הערב", description: "קופון למימוש", icon: "🎬", color: "amber", isRedeemed: false },
      ],
      primaryColor: "#d4826f",
    },
  },
  "open-when": {
    templateId: "open-when",
    title: "פתח כש...",
    description: "צרו מעטפות עם מכתבים לרגעים מיוחדים",
    fields: [
      { key: "title", label: "כותרת", type: "text", placeholder: "מכתבים מיוחדים" },
      { key: "primaryColor", label: "צבע ראשי", type: "color" },
      { key: "envelopes", label: "מעטפות", type: "envelopes", min: 1, max: 6 },
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
};
