import type { EditorConfig } from "../types";

export const RELATIONSHIPS_CONFIGS: Record<string, EditorConfig> = {
  timeline: {
    templateId: "timeline",
    titleKey: "templates.timeline.title",
    descriptionKey: "templates.timeline.description",
    fields: [
      { key: "title", labelKey: "fields.timeline.title.label", type: "text", placeholderKey: "fields.timeline.title.placeholder" },
      { key: "events", labelKey: "fields.timeline.events.label", type: "events" },
      { key: "primaryColor", labelKey: "fields.common.primaryColor.label", type: "color" },
    ],
    defaultData: {
      title: "הסיפור שלנו",
      events: [],
      primaryColor: "#d4826f",
    },
  },
  "love-coupons": {
    templateId: "love-coupons",
    titleKey: "templates.love-coupons.title",
    descriptionKey: "templates.love-coupons.description",
    fields: [
      { key: "title", labelKey: "fields.love-coupons.title.label", type: "text", placeholderKey: "fields.love-coupons.title.placeholder" },
      { key: "coupons", labelKey: "fields.love-coupons.coupons.label", type: "coupons" },
      { key: "primaryColor", labelKey: "fields.common.primaryColor.label", type: "color" },
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
    titleKey: "templates.open-when.title",
    descriptionKey: "templates.open-when.description",
    fields: [
      { key: "title", labelKey: "fields.open-when.title.label", type: "text", placeholderKey: "fields.open-when.title.placeholder" },
      { key: "primaryColor", labelKey: "fields.common.primaryColor.label", type: "color" },
      { key: "envelopes", labelKey: "fields.open-when.envelopes.label", type: "envelopes", min: 1, max: 6 },
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
