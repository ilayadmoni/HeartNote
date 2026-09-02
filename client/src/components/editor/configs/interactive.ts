import type { EditorConfig } from "../types";

export const INTERACTIVE_CONFIGS: Record<string, EditorConfig> = {
  "relationship-quiz": {
    templateId: "relationship-quiz",
    titleKey: "templates.relationship-quiz.title",
    descriptionKey: "templates.relationship-quiz.description",
    fields: [
      { key: "title", labelKey: "fields.relationship-quiz.title.label", type: "text", placeholderKey: "fields.relationship-quiz.title.placeholder" },
      { key: "questions", labelKey: "fields.relationship-quiz.questions.label", type: "questions" },
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
    titleKey: "templates.decision-wheel.title",
    descriptionKey: "templates.decision-wheel.description",
    fields: [
      { key: "title", labelKey: "fields.decision-wheel.title.label", type: "text", placeholderKey: "fields.decision-wheel.title.placeholder" },
      { key: "subtitle", labelKey: "fields.decision-wheel.subtitle.label", type: "text", placeholderKey: "fields.decision-wheel.subtitle.placeholder" },
      { key: "options", labelKey: "fields.decision-wheel.options.label", type: "options" },
      { key: "primaryColor", labelKey: "fields.common.primaryColor.label", type: "color" },
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
    titleKey: "templates.slot-machine.title",
    descriptionKey: "templates.slot-machine.description",
    fields: [
      { key: "title", labelKey: "fields.slot-machine.title.label", type: "text", placeholderKey: "fields.slot-machine.title.placeholder", maxLength: 60 },
      { key: "subtitle", labelKey: "fields.slot-machine.subtitle.label", type: "text", placeholderKey: "fields.slot-machine.subtitle.placeholder" },
      { key: "reel1Options", labelKey: "fields.slot-machine.reel1Options.label", type: "options" },
      { key: "reel2Options", labelKey: "fields.slot-machine.reel2Options.label", type: "options" },
      { key: "reel3Options", labelKey: "fields.slot-machine.reel3Options.label", type: "options" },
      { key: "targetReel1", labelKey: "fields.slot-machine.targetReel1.label", type: "text", maxLength: 40 },
      { key: "targetReel2", labelKey: "fields.slot-machine.targetReel2.label", type: "text", maxLength: 40 },
      { key: "targetReel3", labelKey: "fields.slot-machine.targetReel3.label", type: "text", maxLength: 40 },
      { key: "primaryColor", labelKey: "fields.common.primaryColor.label", type: "color" },
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
    titleKey: "templates.excuse-generator.title",
    descriptionKey: "templates.excuse-generator.description",
    fields: [
      { key: "title", labelKey: "fields.excuse-generator.title.label", type: "text", placeholderKey: "fields.excuse-generator.title.placeholder", maxLength: 60 },
      { key: "subtitle", labelKey: "fields.excuse-generator.subtitle.label", type: "text", placeholderKey: "fields.excuse-generator.subtitle.placeholder", maxLength: 120 },
      { key: "excuses", labelKey: "fields.excuse-generator.excuses.label", type: "options", min: 1, max: 8, maxLength: 80 },
      { key: "buttonLabel", labelKey: "fields.excuse-generator.buttonLabel.label", type: "text", placeholderKey: "fields.excuse-generator.buttonLabel.placeholder", maxLength: 40 },
      { key: "disclaimer", labelKey: "fields.excuse-generator.disclaimer.label", type: "textarea", placeholderKey: "fields.excuse-generator.disclaimer.placeholder", maxLength: 60 },
      { key: "primaryColor", labelKey: "fields.common.primaryColor.label", type: "color" },
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

