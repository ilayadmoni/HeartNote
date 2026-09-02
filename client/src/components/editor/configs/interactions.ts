import type { EditorConfig } from "../types";
import { COLOR_PALETTE } from "@/constants/colors";

const SURPRISE_GIFT_BOX_COLOR = COLOR_PALETTE.find((c) => c.name === "Bright Red")!.hex;
const SURPRISE_GIFT_RIBBON_COLOR = COLOR_PALETTE.find((c) => c.name === "Bright Yellow")!.hex;

export const INTERACTIONS_CONFIGS: Record<string, EditorConfig> = {
  "surprise-gift": {
    templateId: "surprise-gift",
    titleKey: "templates.surprise-gift.title",
    descriptionKey: "templates.surprise-gift.description",
    fields: [
      { key: "title", labelKey: "fields.surprise-gift.title.label", type: "text", placeholderKey: "fields.surprise-gift.title.placeholder" },
      { key: "greeting", labelKey: "fields.surprise-gift.greeting.label", type: "textarea", placeholderKey: "fields.surprise-gift.greeting.placeholder", aiAssist: true },
      { key: "boxColor", labelKey: "fields.surprise-gift.boxColor.label", type: "color" },
      { key: "ribbonColor", labelKey: "fields.surprise-gift.ribbonColor.label", type: "color" },
      { key: "primaryColor", labelKey: "fields.common.primaryColor.label", type: "color" },
    ],
    defaultData: {
      title: "יש לך הפתעה! 🎁",
      greeting: "אוהב/ת אותך מכל הלב ❤️",
      boxColor: SURPRISE_GIFT_BOX_COLOR,
      ribbonColor: SURPRISE_GIFT_RIBBON_COLOR,
      clicksRequired: 5,
      primaryColor: "#d4826f",
    },
  },
  "punching-bag": {
    templateId: "punching-bag",
    titleKey: "templates.punching-bag.title",
    descriptionKey: "templates.punching-bag.description",
    fields: [
      { key: "introTitle", labelKey: "fields.punching-bag.introTitle.label", type: "text", placeholderKey: "fields.punching-bag.introTitle.placeholder", maxLength: 60 },
      { key: "introSubtitle", labelKey: "fields.punching-bag.introSubtitle.label", type: "text", placeholderKey: "fields.punching-bag.introSubtitle.placeholder", maxLength: 120 },
      {
        key: "hitsRequired",
        labelKey: "fields.punching-bag.hitsRequired.label",
        type: "select",
        options: [3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({ value: String(n), label: String(n) })),
      },
      { key: "hitInstructions", labelKey: "fields.punching-bag.hitInstructions.label", type: "text", placeholderKey: "fields.punching-bag.hitInstructions.placeholder", maxLength: 80 },
      { key: "resultTitle", labelKey: "fields.punching-bag.resultTitle.label", type: "text", placeholderKey: "fields.punching-bag.resultTitle.placeholder", maxLength: 60 },
      { key: "resultMessage", labelKey: "fields.punching-bag.resultMessage.label", type: "textarea", placeholderKey: "fields.punching-bag.resultMessage.placeholder" },
      { key: "bagColor", labelKey: "fields.punching-bag.bagColor.label", type: "color" },
      { key: "primaryColor", labelKey: "fields.common.primaryColor.label", type: "color" },
    ],
    defaultData: {
      introTitle: "מערכת לשחרור לחצים",
      introSubtitle: "תני לזה כמה מכות טובות. הכל בסדר.",
      hitsRequired: 5,
      hitInstructions: "הקישי על השק כדי להרביץ",
      resultTitle: "אאוץ׳... זה שחרר?",
      resultMessage: "מקווה שהוצאת את העצבים על השק איגרוף במקום עליי. סליחה שהייתי מניאק ❤️",
      bagColor: "#d4826f",
      primaryColor: "#d4826f",
    },
  },
};
