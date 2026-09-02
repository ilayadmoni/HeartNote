/**
 * Sample data for the internal /preview template lab. This is fixture
 * content used only to render each template component in isolation for
 * QA — not chrome copy, so it stays as authored Hebrew (matches the
 * "user content is never translated" rule for template body content).
 */
export const SAMPLE_DATA = {
  DateInvite: {
    question: "האם תצאי איתי לדייט?",
    yesText: "כן",
    noText: "לא",
    successMessage: "יש לנו דייט!",
  },
  ScratchCard: {
    title: "גרד וגלה את ההפתעה",
    prizeContent: "🎉 זכית בארוחת ערב רומנטית!",
  },
  Timeline: {
    title: "הסיפור שלנו",
    events: [
      { id: "1", date: "2023-01-15", title: "הפגישה הראשונה", description: "נפגשנו בבית קפה" },
      { id: "2", date: "2023-02-14", title: "יום האהבה", description: "ארוחת ערב רומנטית" },
      { id: "3", date: "2023-06-20", title: "הטיול הראשון", description: "שבוע באיטליה" },
    ],
  },
  LoveCoupons: {
    title: "קופונים מיוחדים",
    coupons: [
      { id: "1", title: "ארוחת ערב", description: "במסעדה לבחירתך", icon: "🍽️", isRedeemed: false },
      { id: "2", title: "עיסוי מפנק", description: "30 דקות פינוק", icon: "💆", isRedeemed: false },
      { id: "3", title: "סרט לבחירתך", description: "כולל פופקורן!", icon: "🎬", isRedeemed: true },
    ],
  },
  RelationshipQuiz: {
    title: "כמה את/ה מכיר/ה אותי?",
    questions: [
      { id: "1", question: "מה הצבע האהוב עליי?", options: ["אדום", "כחול", "ירוק", "סגול"], correctIndex: 1 },
      { id: "2", question: "מה האוכל האהוב עליי?", options: ["פיצה", "סושי", "המבורגר", "פסטה"], correctIndex: 0 },
    ],
    scoreMessages: [
      { minScore: 80, message: "מכיר/ה אותי מעולה!", emoji: "🎉" },
      { minScore: 50, message: "לא רע!", emoji: "😊" },
      { minScore: 0, message: "כדאי לשפר", emoji: "💪" },
    ],
  },
  OpenWhen: {
    title: "מכתבים מיוחדים",
    envelopes: [
      { id: "1", title: "כשאת/ה עצוב/ה", content: "אני תמיד כאן בשבילך", dateOpen: "2023-01-01", emoji: "😢" },
      { id: "2", title: "כשמתגעגעים", content: "גם אני מתגעגע/ת...", dateOpen: "2023-01-01", emoji: "💕" },
      { id: "3", title: "ביום המיוחד", content: "הפתעה!", dateOpen: "2030-01-01", emoji: "🎁" },
    ],
  },
};

export type PreviewTemplateKey = keyof typeof SAMPLE_DATA;

export const PREVIEW_TEMPLATES: { key: PreviewTemplateKey; labelKey: string }[] = [
  { key: "DateInvite", labelKey: "previewLab.dateInvite" },
  { key: "ScratchCard", labelKey: "previewLab.scratchCard" },
  { key: "Timeline", labelKey: "previewLab.timeline" },
  { key: "LoveCoupons", labelKey: "previewLab.loveCoupons" },
  { key: "RelationshipQuiz", labelKey: "previewLab.relationshipQuiz" },
  { key: "OpenWhen", labelKey: "previewLab.openWhen" },
];
