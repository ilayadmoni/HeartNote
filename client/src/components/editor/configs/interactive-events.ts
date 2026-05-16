import type { EditorConfig, EditorField } from "../types";
import { HOLIDAY_INTERACTIVE_CONFIGS } from "@/components/templates/interactive-events/holidays-shared";
import type { HolidayInteractiveSlug } from "@/components/templates/interactive-events/types";

const COMMON_FIELDS: EditorField[] = [
  { key: "recipientName", label: "שם המקבל/ת", type: "text", placeholder: "ניצן", maxLength: 50 },
  { key: "senderName", label: "שם השולח/ת", type: "text", placeholder: "מאמא ואבא", maxLength: 50 },
  { key: "greetingTitle", label: "כותרת הברכה", type: "text", placeholder: "ברכה מכל הלב", maxLength: 70 },
  { key: "message", label: "הברכה", type: "textarea", placeholder: "כתבו כאן ברכה אישית...", maxLength: 500 },
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
  { key: "recipientName", label: "שם המקבל/ת", type: "text", placeholder: "יואב", maxLength: 50 },
  { key: "senderName", label: "שם השולח/ת", type: "text", placeholder: "מאמא ואבא", maxLength: 50 },
  { key: "greetingTitle", label: "כותרת הברכה", type: "text", placeholder: "ברכה מכל הלב", maxLength: 70 },
  { key: "message", label: "הברכה", type: "textarea", placeholder: "כתבו כאן ברכה אישית...", maxLength: 500 },
  { key: "recipientAge", label: "גיל", type: "number", placeholder: "30", min: 1, max: 120 },
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
    title: "עוגת יום הולדת אינטראקטיבית",
    description: "המקבל/ת מכבה נרות ומגלה ברכה אישית.",
    fields: BIRTHDAY_FIELDS,
    defaultData: {
      ...BIRTHDAY_DEFAULTS,
      greetingTitle: "יום הולדת שמח",
      message: "שתהיה שנה מלאה באור, אהבה והפתעות מתוקות.",
    },
  },
  "wedding-glass-interactive": {
    templateId: "wedding-glass-interactive",
    title: "חתונה אינטראקטיבית",
    description: "מפעילים רגע חתונה רומנטי וחושפים ברכת מזל טוב.",
    fields: [
        { key: "coupleNames", label: "שמות הזוג", type: "text", placeholder: "ניצן ועילי", maxLength: 42 },
      { key: "senderName", label: "שם השולח/ת", type: "text", placeholder: "החברים מהעבודה", maxLength: 36 },
      { key: "greetingTitle", label: "כותרת הברכה", type: "text", placeholder: "מזל טוב לזוג האהוב", maxLength: 48 },
      { key: "message", label: "הברכה", type: "textarea", placeholder: "כתבו כאן ברכה לזוג...", maxLength: 260 },
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
