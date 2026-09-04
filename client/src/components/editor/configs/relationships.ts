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
      title: "defaults.timeline.title",
      events: [
        {
          id: "event-1",
          date: "2023-06-15",
          title: "defaults.timeline.events.1.title",
          description: "defaults.timeline.events.1.description",
          icon: "💫",
        },
        {
          id: "event-2",
          date: "2024-02-14",
          title: "defaults.timeline.events.2.title",
          description: "defaults.timeline.events.2.description",
          icon: "💖",
        },
        {
          id: "event-3",
          date: "2024-12-25",
          title: "defaults.timeline.events.3.title",
          description: "defaults.timeline.events.3.description",
          icon: "🎉",
        },
      ],
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
      title: "defaults.love-coupons.title",
      coupons: [
        { id: "coupon-1", title: "defaults.love-coupons.coupons.1.title", description: "defaults.love-coupons.coupons.description", icon: "💆", color: "emerald", isRedeemed: false },
        { id: "coupon-2", title: "defaults.love-coupons.coupons.2.title", description: "defaults.love-coupons.coupons.description", icon: "🧽", color: "sky", isRedeemed: false },
        { id: "coupon-3", title: "defaults.love-coupons.coupons.3.title", description: "defaults.love-coupons.coupons.description", icon: "🎬", color: "amber", isRedeemed: false },
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
      title: "defaults.open-when.title",
      envelopes: [
        {
          id: "env-1",
          title: "defaults.open-when.envelopes.1.title",
          dateOpen: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          content: "defaults.open-when.envelopes.1.content",
        },
        {
          id: "env-2",
          title: "defaults.open-when.envelopes.2.title",
          dateOpen: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          content: "defaults.open-when.envelopes.2.content",
        },
      ],
      primaryColor: "#d4826f",
    },
  },
};
