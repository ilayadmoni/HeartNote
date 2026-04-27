/**
 * Editor Configurations
 * Config for each template's editable fields.
 *
 * NOTE: The `config_schema` in the database is the source of truth for
 * validation. This file drives the editor UI and provides defaults.
 * Fields of type "color" will render the restricted 12-swatch palette.
 */

import type { EditorConfig } from "./types";
import { COLOR_PALETTE } from "@/constants/colors";

const SURPRISE_GIFT_BOX_COLOR = COLOR_PALETTE.find(
  (color) => color.name === "Bright Red",
)!.hex;
const SURPRISE_GIFT_RIBBON_COLOR = COLOR_PALETTE.find(
  (color) => color.name === "Bright Yellow",
)!.hex;

export const EDITOR_CONFIGS: Record<string, EditorConfig> = {
  "date-invite": {
    templateId: "date-invite",
    title: "הזמנה לדייט",
    description: 'כרטיס אינטראקטיבי שבו כפתור ה"לא" בורח. אי אפשר לסרב!',
    fields: [
      {
        key: "title",
        label: "כותרת",
        type: "text",
        placeholder: "הזמנה לדייט",
      },
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
      title: "הזמנה לדייט",
      question: "האם תרצי לצאת איתי לדייט?",
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
        min: 1,
        max: 6,
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
      boxColor: SURPRISE_GIFT_BOX_COLOR,
      ribbonColor: SURPRISE_GIFT_RIBBON_COLOR,
      clicksRequired: 5,
      primaryColor: "#d4826f",
    },
  },
  "slot-machine": {
    templateId: "slot-machine",
    title: "מכונת ההבטחות",
    description: "סובבו 3 גלגלים ותקבלו הודעה מוסתרת!",
    fields: [
      { key: "title", label: "כותרת", type: "text", placeholder: "מכונת ההבטחות", maxLength: 60 },
      { key: "subtitle", label: "כותרת משנה", type: "text", placeholder: "סובבי 3 פעמים..." },
      { key: "reel1Options", label: "אפשרויות גלגל 1", type: "options" },
      { key: "reel2Options", label: "אפשרויות גלגל 2", type: "options" },
      { key: "reel3Options", label: "אפשרויות גלגל 3", type: "options" },
      { key: "targetReel1", label: "תוצאה סופית - גלגל 1", type: "text", maxLength: 40 },
      { key: "targetReel2", label: "תוצאה סופית - גלגל 2", type: "text", maxLength: 40 },
      { key: "targetReel3", label: "תוצאה סופית - גלגל 3", type: "text", maxLength: 40 },
      { key: "primaryColor", label: "צבע ראשי", type: "color" },
    ],
    defaultData: {
      title: "מכונת ההבטחות",
      subtitle: "סובבי 3 פעמים כדי לגלות מה מחכה לך הערב...",
      reel1Options: ["אני מבטיח", "מחר בבוקר", "תקשיבי לי טוב", "אין מצב ש"],
      reel2Options: ["לשטוף את", "להזמין לנו", "לפנק אותך ב", "לעשות היום"],
      reel3Options: ["כל הכלים.", "פיצה ענקית.", "מסאז' ברגליים.", "מרתון סרטים."],
      targetReel1: "אני מבטיח",
      targetReel2: "להזמין לנו",
      targetReel3: "פיצה ענקית.",
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
        cropAspect: 3 / 4,
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
        options: [
          { value: "3", label: "3" },
          { value: "4", label: "4" },
          { value: "5", label: "5" },
          { value: "6", label: "6" },
          { value: "7", label: "7" },
          { value: "8", label: "8" },
          { value: "9", label: "9" },
          { value: "10", label: "10" },
        ],
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
  "birthday-candles": {
    templateId: "birthday-candles",
    title: "כיבוי נרות",
    description: "עוגת יום הולדת אינטראקטיבית — כבו את הנרות אחד אחד ובקשו משאלה!",
    fields: [
      { key: "title", label: "כותרת", type: "text", placeholder: "מזל טוב! כבה את הנרות", maxLength: 60 },
      { key: "subtitle", label: "כותרת משנה", type: "text", placeholder: "הקישי על הלהבות כדי לכבות את הנרות ולבקש משאלה.", maxLength: 120 },
      {
        key: "candleCount",
        label: "מספר נרות",
        type: "select",
        options: [
          { value: "3", label: "3" },
          { value: "4", label: "4" },
          { value: "5", label: "5" },
          { value: "6", label: "6" },
          { value: "7", label: "7" },
          { value: "8", label: "8" },
          { value: "9", label: "9" },
          { value: "10", label: "10" },
        ],
      },
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
  "excuse-generator": {
    templateId: "excuse-generator",
    title: "מכונת התירוצים",
    description: "לחצו וקבלו תירוץ אוטומטי מהמכונה!",
    fields: [
      { key: "title", label: "כותרת", type: "text", placeholder: "מכונת התירוצים האוטומטית", maxLength: 60 },
      { key: "subtitle", label: "כותרת משנה", type: "text", placeholder: "לא בא לך לצאת? יש לנו תירוץ בשבילך.", maxLength: 120 },
      { key: "excuses", label: "תירוצים", type: "options", min: 1, max: 8, maxLength: 80 },
      { key: "buttonLabel", label: "טקסט כפתור", type: "text", placeholder: "ג'נרט תירוץ", maxLength: 40 },
      { key: "disclaimer", label: "כתב ויתור", type: "textarea", placeholder: "* החברה אינה אחראית לתוצאות השימוש בתירוצים אלו.", maxLength: 60 },
      { key: "primaryColor", label: "צבע ראשי", type: "color" },
    ],
    defaultData: {
      title: "מכונת התירוצים האוטומטית",
      subtitle: "לא בא לך לצאת? יש לנו תירוץ בשבילך.",
      excuses: [
        "הכלב שלי אכל את הזמן הפנוי שלי.",
        "הגשם גרם לי לחשוב מחדש.",
        "הצמח שלי חלה ואני צריך/ה לטפל בו.",
        "השכן שלי נגן על גיטרה ולא הצלחתי להתרכז.",
        "אמא שלי הזמינה אותי לאכול — לא יכול/ה לסרב.",
      ],
      buttonLabel: "ג'נרט תירוץ",
      disclaimer: "* החברה אינה אחראית לתוצאות השימוש בתירוצים אלו.",
      primaryColor: "#d4826f",
    },
  },
  "apology-search": {
    templateId: "apology-search",
    title: "חיפוש סליחה",
    description: "חיפוש שמדמה גוגל — מקליד את הסליחה ומגיע לתוצאה מרגשת!",
    fields: [
      { key: "searchQuery", label: "שאילתת חיפוש", type: "text", placeholder: "איך לבקש סליחה מהבן זוג שלי?", maxLength: 70 },
      { key: "resultTitle", label: "כותרת תוצאה", type: "text", placeholder: "סליחה שהייתי עצבנית", maxLength: 30 },
      { key: "resultSubtitle", label: "תיאור תוצאה", type: "textarea", placeholder: "אתה צודק. אוהבת אותך.", maxLength: 100 },
      { key: "startButtonLabel", label: "כפתור התחלה", type: "text", placeholder: "התחל חיפוש", maxLength: 40 },
      { key: "primaryColor", label: "צבע ראשי", type: "color" },
    ],
    defaultData: {
      searchQuery: "איך לבקש סליחה מהבן זוג שלי?",
      resultTitle: "סליחה שהייתי עצבנית",
      resultSubtitle: "אתה צודק. אוהבת אותך.",
      startButtonLabel: "התחל חיפוש",
      typingSpeedMs: 80,
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
  "holiday-card": {
    templateId: "holiday-card",
    title: "מפעל החגים",
    description: "בחרו חג וכתבו ברכה אישית לאהובים עליכם!",
    fields: [
      {
        key: "holidayKind",
        label: "בחר חג",
        type: "select",
        options: [
          { value: "rosh", label: "🍎 ראש השנה" },
          { value: "hanukkah", label: "🕎 חנוכה" },
          { value: "purim", label: "🎭 פורים" },
          { value: "pesach", label: "🍷 פסח" },
          { value: "sukkot", label: "🌿 סוכות" },
          { value: "shavuot", label: "🌾 שבועות" },
        ],
      },
      {
        key: "customTitle",
        label: "כותרת (אופציונלי)",
        type: "text",
        placeholder: "יתשמש כברירת המחדל של החג",
        maxLength: 60,
      },
      {
        key: "customGreeting",
        label: "הברכה שלך",
        type: "textarea",
        placeholder: "הקלד ברכה אישית...",
        maxLength: 300,
      },
      { key: "primaryColor", label: "צבע ראשי", type: "color" },
    ],
    defaultData: {
      holidayKind: "rosh" as const,
      customTitle: "",
      customGreeting: "",
      primaryColor: "#d4826f",
    },
  },
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
      {
        key: "introTitle",
        label: "כותרת",
        type: "text",
        placeholder: "מכונת ההתבגרות",
        maxLength: 60,
      },
      {
        key: "introSubtitle",
        label: "תיאור",
        type: "text",
        placeholder: "לחצו על הכתר או הספר כדי לגלות את הברכה",
        maxLength: 120,
      },
      {
        key: "blessingTitle",
        label: "כותרת הברכה",
        type: "text",
        placeholder: "הגיע הזמן לחגוג! 🎉",
        maxLength: 80,
      },
      {
        key: "blessingMessage",
        label: "הברכה",
        type: "textarea",
        placeholder: "ברוכים הבאים לגיל הבגרות. המון הצלחה ושמחה.",
        maxLength: 300,
      },
      {
        key: "tapHintLabel",
        label: "טקסט הרמז (אופציונלי)",
        type: "text",
        placeholder: "לחצו על הכתר / לחצו על הספר",
        maxLength: 60,
      },
      { key: "primaryColor", label: "צבע ראשי", type: "color" },
    ],
    defaultData: {
      kind: "bat" as const,
      introTitle: "מכונת ההתבגרות",
      introSubtitle: "לחצו על הכתר או הספר כדי לגלות את הברכה",
      blessingTitle: "הגיע הזמן לחגוג! 🎉",
      blessingMessage:
        "ברוכים הבאים לגיל הבגרות. שתיהיי מוקפת בחברים, אהבה וגאווה למשפחה.",
      tapHintLabel: "לחצו על הכתר",
      primaryColor: "#d4826f",
    },
  },
};
