import { COLOR_PALETTE } from "@/constants/colors";

const SURPRISE_GIFT_BOX_COLOR = COLOR_PALETTE.find(
  (color) => color.name === "Bright Red",
)!.hex;
const SURPRISE_GIFT_RIBBON_COLOR = COLOR_PALETTE.find(
  (color) => color.name === "Bright Yellow",
)!.hex;

export const PREVIEW_DATA = {
  DateInvite: {
    question: "?תצא/י איתי",
    yesText: "כן!",
    noText: "לא",
    successMessage: "!יש",
  },
  ScratchCard: {
    title: "",
    prizeContent: "🎁",
  },
  Timeline: {
    events: [
      { id: "1", date: "2023-01", title: "❤️" },
      { id: "2", date: "2023-06", title: "✨" },
      { id: "3", date: "2024-01", title: "💒" },
    ],
  },
  LoveCoupons: {
    coupons: [
      { id: "1", title: "עיסוי", icon: "💆", color: "emerald", isRedeemed: false },
      { id: "2", title: "ארוחה", icon: "🍽️", color: "sky", isRedeemed: true },
    ],
  },
  RelationshipQuiz: {
    title: "?",
    questions: [
      { id: "1", question: "?", options: ["A", "B", "C", "D"], correctIndex: 0 },
    ],
    scoreMessages: [
      { minScore: 0, message: "כל הכבוד!", emoji: "💪" },
    ],
  },
  OpenWhen: {
    envelopes: [
      { id: "1", title: "😢", emoji: "😢", content: "", dateOpen: "2026-01-01" },
      { id: "2", title: "💪", emoji: "💪", content: "", dateOpen: "2099-01-01" },
    ],
  },
  DecisionWheel: {
    title: "גלגל ההחלטות",
    options: ["ארוחה", "סרט", "טיול", "מסאז'"],
  },
  SlotMachine: {
    title: "מכונת ההבטחות",
    reel1Options: ["אני מבטיח", "מחר בבוקר"],
    reel2Options: ["להזמין לנו", "לפנק אותך"],
    reel3Options: ["פיצה ענקית.", "מסאז'."],
    targetReel1: "אני מבטיח",
    targetReel2: "להזמין לנו",
    targetReel3: "פיצה ענקית.",
    primaryColor: "#d4826f",
  },
  SurpriseGift: {
    title: "יש לך הפתעה! 🎁",
    greeting: "אוהב/ת אותך מכל הלב ❤️",
    boxColor: SURPRISE_GIFT_BOX_COLOR,
    ribbonColor: SURPRISE_GIFT_RIBBON_COLOR,
    clicksRequired: 5,
    primaryColor: "#d4826f",
  },
  PunchingBag: {
    introTitle: "מערכת לשחרור לחצים",
    introSubtitle: "תני לזה כמה מכות טובות",
    hitsRequired: 5,
    resultMessage: "סליחה שהייתי מניאק ❤️",
    bagColor: "#d4826f",
    primaryColor: "#d4826f",
  },
  ApologySearch: {
    searchQuery: "איך לבקש סליחה מהבן זוג שלי?",
    resultTitle: "סליחה שהייתי עצבנית",
    resultSubtitle: "אתה צודק. אוהבת אותך.",
    primaryColor: "#d4826f",
  },
  ExcuseGenerator: {
    title: "מכונת התירוצים האוטומטית",
    subtitle: "לא בא לך לצאת? יש לנו תירוץ בשבילך.",
    excuses: [
      "הכלב שלי אכל את הזמן הפנוי שלי.",
      "הגשם גרם לי לחשוב מחדש.",
      "הצמח שלי חלה ואני צריך/ה לטפל בו.",
    ],
    buttonLabel: "ג'נרט תירוץ",
    disclaimer: "* החברה אינה אחראית לתוצאות השימוש בתירוצים אלו.",
    primaryColor: "#d4826f",
  },
  BarBatMitzvah: {
    kind: "bat" as const,
    introTitle: "מכונת ההתבגרות",
    introSubtitle: "לחצו על הכתר או הספר כדי לגלות את הברכה",
    blessingTitle: "הגיע הזמן לחגוג! 🎉",
    blessingMessage: "ברוכים הבאים לגיל הבגרות. שתיהיי מוקפת בחברים, אהבה וגאווה למשפחה.",
    tapHintLabel: "לחצו על הכתר",
    primaryColor: "#d4826f",
  },
};
