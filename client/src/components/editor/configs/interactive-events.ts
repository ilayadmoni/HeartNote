import type { EditorConfig, EditorField } from "../types";
import { HOLIDAY_INTERACTIVE_CONFIGS } from "@/components/templates/holidays-shared";
import type { HolidayInteractiveSlug } from "@/components/templates/types";

const COMMON_FIELDS: EditorField[] = [
  { key: "recipientName", labelKey: "fields.common.recipientName.label", type: "text", placeholderKey: "fields.common.recipientName.placeholder", maxLength: 50 },
  { key: "senderName", labelKey: "fields.common.senderName.label", type: "text", placeholderKey: "fields.common.senderName.placeholder", maxLength: 50 },
  { key: "greetingTitle", labelKey: "fields.common.greetingTitle.label", type: "text", placeholderKey: "fields.common.greetingTitle.placeholder", maxLength: 70 },
  { key: "message", labelKey: "fields.common.message.label", type: "textarea", placeholderKey: "fields.common.message.placeholder", maxLength: 500 },
];

const COMMON_DEFAULTS = {
  recipientName: "",
  senderName: "",
  greetingTitle: "",
  message: "",
  signature: "",
};

function holidayConfig(slug: HolidayInteractiveSlug): EditorConfig {
  const holiday = HOLIDAY_INTERACTIVE_CONFIGS[slug];
  return {
    templateId: slug,
    // Sourced from the templates chrome catalog (owned outside `editor`),
    // so it stays a raw fallback string rather than a titleKey.
    title: holiday.name,
    description: holiday.galleryDescription,
    fields: COMMON_FIELDS,
    defaultData: {
      ...COMMON_DEFAULTS,
      greetingTitle: holiday.defaultTitle,
      message: holiday.revealLine,
    },
  };
}

const BIRTHDAY_FIELDS: EditorField[] = [
  { key: "recipientName", labelKey: "fields.birthday-candles-interactive.recipientName.label", type: "text", placeholderKey: "fields.birthday-candles-interactive.recipientName.placeholder", maxLength: 50 },
  { key: "senderName", labelKey: "fields.birthday-candles-interactive.senderName.label", type: "text", placeholderKey: "fields.birthday-candles-interactive.senderName.placeholder", maxLength: 50 },
  { key: "greetingTitle", labelKey: "fields.common.greetingTitle.label", type: "text", placeholderKey: "fields.common.greetingTitle.placeholder", maxLength: 70 },
  { key: "message", labelKey: "fields.common.message.label", type: "textarea", placeholderKey: "fields.common.message.placeholder", maxLength: 500, aiAssist: true },
  { key: "recipientAge", labelKey: "fields.birthday-candles-interactive.recipientAge.label", type: "number", placeholderKey: "fields.birthday-candles-interactive.recipientAge.placeholder", min: 1, max: 120 },
];

const BIRTHDAY_DEFAULTS = {
  recipientName: "",
  senderName: "",
  greetingTitle: "",
  message: "",
  recipientAge: 30,
};

export const INTERACTIVE_EVENT_CONFIGS: Record<string, EditorConfig> = {
  "birthday-candles-interactive": {
    templateId: "birthday-candles-interactive",
    titleKey: "templates.birthday-candles-interactive.title",
    descriptionKey: "templates.birthday-candles-interactive.description",
    fields: BIRTHDAY_FIELDS,
    defaultData: {
      ...BIRTHDAY_DEFAULTS,
      greetingTitle: "יום הולדת שמח",
      message: "שתהיה שנה מלאה באור, אהבה והפתעות מתוקות.",
    },
  },
  "wedding-glass-interactive": {
    templateId: "wedding-glass-interactive",
    titleKey: "templates.wedding-glass-interactive.title",
    descriptionKey: "templates.wedding-glass-interactive.description",
    fields: [
      { key: "coupleNames", labelKey: "fields.wedding-glass-interactive.coupleNames.label", type: "text", placeholderKey: "fields.wedding-glass-interactive.coupleNames.placeholder", maxLength: 42 },
      { key: "senderName", labelKey: "fields.wedding-glass-interactive.senderName.label", type: "text", placeholderKey: "fields.wedding-glass-interactive.senderName.placeholder", maxLength: 36 },
      { key: "greetingTitle", labelKey: "fields.wedding-glass-interactive.greetingTitle.label", type: "text", placeholderKey: "fields.wedding-glass-interactive.greetingTitle.placeholder", maxLength: 48 },
      { key: "message", labelKey: "fields.wedding-glass-interactive.message.label", type: "textarea", placeholderKey: "fields.wedding-glass-interactive.message.placeholder", maxLength: 260 },
    ],
    defaultData: {
      coupleNames: "ניצן ועילי",
      senderName: "",
      greetingTitle: "מזל טוב לזוג האהוב",
      message: "שתבנו יחד בית מלא באהבה, צחוק וחברות טובה.",
    },
  },
  "holiday-rosh-hashanah-interactive": holidayConfig("holiday-rosh-hashanah-interactive"),
  "holiday-passover-interactive": holidayConfig("holiday-passover-interactive"),
  "holiday-purim-interactive": holidayConfig("holiday-purim-interactive"),
  "holiday-shavuot-interactive": holidayConfig("holiday-shavuot-interactive"),
  "holiday-sukkot-interactive": holidayConfig("holiday-sukkot-interactive"),
  "holiday-hanukkah-interactive": holidayConfig("holiday-hanukkah-interactive"),
};
