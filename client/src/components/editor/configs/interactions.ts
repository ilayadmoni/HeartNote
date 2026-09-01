import type { EditorConfig } from "../types";
import { COLOR_PALETTE } from "@/constants/colors";

const SURPRISE_GIFT_BOX_COLOR = COLOR_PALETTE.find((c) => c.name === "Bright Red")!.hex;
const SURPRISE_GIFT_RIBBON_COLOR = COLOR_PALETTE.find((c) => c.name === "Bright Yellow")!.hex;

export const INTERACTIONS_CONFIGS: Record<string, EditorConfig> = {
  "surprise-gift": {
    templateId: "surprise-gift",
    title: "מתנה בהפתעה",
    description: "קופסת מתנה אינטראקטיבית — נערו אותה עד שתיפתח!",
    fields: [
      { key: "title", label: "כותרת", type: "text", placeholder: "יש לך הפתעה! 🎁" },
      { key: "greeting", label: "ברכה / הודעה", type: "textarea", placeholder: "הטקסט שייחשף אחרי הפתיחה", aiAssist: true },
      { key: "boxColor", label: "צבע קופסה", type: "color" },
      { key: "ribbonColor", label: "צבע סרט", type: "color" },
      { key: "primaryColor", label: "צבע ראשי", type: "color" },
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
    title: "שק האיגרוף",
    description: "תנו מכות לשק ובסוף תקבלו מסר אישי מיוחד!",
    fields: [
      { key: "introTitle", label: "כותרת פתיחה", type: "text", placeholder: "מערכת לשחרור לחצים", maxLength: 60 },
      { key: "introSubtitle", label: "תת-כותרת", type: "text", placeholder: "תני לזה כמה מכות טובות. הכל בסדר.", maxLength: 120 },
      {
        key: "hitsRequired",
        label: "מספר מכות נדרשות",
        type: "select",
        options: [3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({ value: String(n), label: String(n) })),
      },
      { key: "hitInstructions", label: "הוראות הכאה", type: "text", placeholder: "הקישי על השק כדי להרביץ", maxLength: 80 },
      { key: "resultTitle", label: "כותרת תוצאה", type: "text", placeholder: "אאוץ׳... זה שחרר?", maxLength: 60 },
      { key: "resultMessage", label: "הודעת סיום", type: "textarea", placeholder: "מקווה שהוצאת את העצבים על השק איגרוף במקום עליי. סליחה שהייתי מניאק ❤️" },
      { key: "bagColor", label: "צבע השק", type: "color" },
      { key: "primaryColor", label: "צבע ראשי", type: "color" },
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
