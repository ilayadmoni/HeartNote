import type { EditorConfig } from "../types";

export const SPECIAL_OCCASIONS_CONFIGS: Record<string, EditorConfig> = {
  "bar-bat-mitzvah": {
    templateId: "bar-bat-mitzvah",
    title: "בר/בת מצווה",
    description: "כרטיס אינטראקטיבי עם ברכה לבר או בת מצווה",
    fields: [
      {
        key: "kind",
        label: "בחר סוג",
        type: "select",
        options: [
          { value: "bar", label: "בר מצווה" },
          { value: "bat", label: "בת מצווה" },
        ],
      },
      { key: "introTitle", label: "כותרת", type: "text", placeholder: "מכונת ההתבגרות", maxLength: 60 },
      { key: "introSubtitle", label: "תיאור", type: "text", placeholder: "לחצו על הכתר או הספר כדי לגלות את הברכה", maxLength: 120 },
      { key: "blessingTitle", label: "כותרת הברכה", type: "text", placeholder: "הגיע הזמן לחגוג! 🎉", maxLength: 80 },
      { key: "blessingMessage", label: "הברכה", type: "textarea", placeholder: "ברוכים הבאים לגיל הבגרות. המון הצלחה ושמחה.", maxLength: 300 },
      { key: "tapHintLabel", label: "טקסט הרמז (אופציונלי)", type: "text", placeholder: "לחצו על הכתר / לחצו על הספר", maxLength: 60 },
      { key: "primaryColor", label: "צבע ראשי", type: "color" },
    ],
    defaultData: {
      kind: "bat" as const,
      introTitle: "מכונת ההתבגרות",
      introSubtitle: "לחצו על הכתר או הספר כדי לגלות את הברכה",
      blessingTitle: "הגיע הזמן לחגוג! 🎉",
      blessingMessage: "ברוכים הבאים לגיל הבגרות. שתיהיי מוקפת בחברים, אהבה וגאווה למשפחה.",
      tapHintLabel: "לחצו על הכתר",
      primaryColor: "#d4826f",
    },
  },
};
