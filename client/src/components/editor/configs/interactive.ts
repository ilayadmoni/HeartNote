import type { EditorConfig } from "../types";

export const INTERACTIVE_CONFIGS: Record<string, EditorConfig> = {
  "relationship-quiz": {
    templateId: "relationship-quiz",
    title: "חידון חברות",
    description: "צרו חידון לבדיקת כמה מכירים אתכם",
    fields: [
      { key: "title", label: "כותרת", type: "text", placeholder: "כמה טוב את מכירה אותי?" },
      { key: "questions", label: "שאלות", type: "questions" },
    ],
    defaultData: {
      title: "כמה טוב את מכירה אותי?",
      questions: [
        { id: "q-1", question: "איזה מאכל אני הכי אוהב?", options: ["פיצה", "סושי", "המבורגר", "שוקולד"], correctIndex: 0 },
        { id: "q-2", question: "מה החלום הכי גדול שלי?", options: ["לטייל בעולם", "לפתוח עסק", 'לגור בחו"ל', "להיות שף"], correctIndex: 0 },
        { id: "q-3", question: "מה הצבע האהוב עליי?", options: ["כחול", "אדום", "ירוק", "שחור"], correctIndex: 0 },
      ],
      scoreMessages: [
        { minScore: 80, message: "מכיר/ה אותי מושלם!" },
        { minScore: 50, message: "כמעט מושלם..." },
        { minScore: 0, message: "כל הכבוד על הניסיון!" },
      ],
      primaryColor: "#d4826f",
    },
  },
  "decision-wheel": {
    templateId: "decision-wheel",
    title: "גלגל החלטות",
    description: "סובבו את הגלגל וקבלו תשובה!",
    fields: [
      { key: "title", label: "כותרת", type: "text", placeholder: "גלגל ההחלטות" },
      { key: "subtitle", label: "כותרת משנה", type: "text", placeholder: "סובבו וגלו!" },
      { key: "options", label: "אופציות (2-8)", type: "options" },
      { key: "primaryColor", label: "צבע ראשי", type: "color" },
    ],
    defaultData: {
      title: "גלגל ההחלטות",
      subtitle: "לחצו על הכפתור וגלו!",
      options: ["ארוחת ערב רומנטית", "סרט ביחד", "טיול בטבע", "ערב משחקים", "מסאז' מפנק", "בישול ביחד"],
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
};

