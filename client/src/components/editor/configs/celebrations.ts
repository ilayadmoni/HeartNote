import type { EditorConfig } from "../types";

const COUNT_SELECT_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({
  value: String(n),
  label: String(n),
}));

export const CELEBRATIONS_CONFIGS: Record<string, EditorConfig> = {
  "birthday-candles": {
    templateId: "birthday-candles",
    title: "כיבוי נרות",
    description: "עוגת יום הולדת אינטראקטיבית — כבו את הנרות אחד אחד ובקשו משאלה!",
    fields: [
      { key: "title", label: "כותרת", type: "text", placeholder: "מזל טוב! כבה את הנרות", maxLength: 60 },
      { key: "subtitle", label: "כותרת משנה", type: "text", placeholder: "הקישי על הלהבות כדי לכבות את הנרות ולבקש משאלה.", maxLength: 120 },
      { key: "candleCount", label: "מספר נרות", type: "select", options: COUNT_SELECT_OPTIONS },
      { key: "cakeColor", label: "צבע העוגה", type: "color" },
      { key: "flameColor", label: "צבע הלהבה", type: "color" },
      { key: "celebrationTitle", label: "כותרת חגיגה", type: "text", placeholder: "מזל טוב!!! 🎂", maxLength: 60 },
      { key: "celebrationMessage", label: "הודעת חגיגה", type: "textarea", placeholder: "שתמיד תהיי מוקפת באהבה..." },
      { key: "primaryColor", label: "צבע ראשי", type: "color" },
    ],
    defaultData: {
      title: "מזל טוב! כבה את הנרות",
      subtitle: "הקישי על הלהבות כדי לכבות את הנרות ולבקש משאלה.",
      candleCount: 3,
      cakeColor: "#d4826f",
      flameColor: "#ffde59",
      celebrationTitle: "מזל טוב!!! 🎂",
      celebrationMessage: "שתמיד תהיי מוקפת באהבה ושמחה, ושכל משאלותייך יתגשמו!",
      primaryColor: "#d4826f",
    },
  },
  "wedding-glass": {
    templateId: "wedding-glass",
    title: "שבירת כוס",
    description: "כוס שבירה דיגיטלית עם חתן וכלה — לחצו וגלו הודעת מזל טוב!",
    fields: [
      { key: "title", label: "כותרת", type: "text", placeholder: "שבירת כוס דיגיטלית", maxLength: 60 },
      { key: "subtitle", label: "כותרת משנה", type: "text", placeholder: "לחצו על הכפתור כדי שהחתן ישבור את הכוס", maxLength: 120 },
      { key: "stompButtonLabel", label: "טקסט כפתור", type: "text", placeholder: "שבור את הכוס!", maxLength: 40 },
      { key: "mazalTovTitle", label: "כותרת מזל טוב", type: "text", placeholder: "מזל טוב! 💍", maxLength: 60 },
      { key: "mazalTovMessage", label: "הודעת מזל טוב", type: "textarea", placeholder: "שתזכו לבנות יחד בית מלא באהבה, צחוק ושמחה." },
      { key: "primaryColor", label: "צבע ראשי", type: "color" },
    ],
    defaultData: {
      title: "שבירת כוס דיגיטלית",
      subtitle: "לחצו על הכפתור כדי שהחתן ישבור את הכוס ויתחיל את החגיגה!",
      stompButtonLabel: "שבור את הכוס!",
      mazalTovTitle: "מזל טוב! 💍",
      mazalTovMessage: "שתזכו לבנות יחד בית מלא באהבה, צחוק ושמחה.",
      primaryColor: "#d4826f",
    },
  },
};
