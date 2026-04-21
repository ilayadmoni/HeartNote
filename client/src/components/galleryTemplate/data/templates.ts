/**
 * Template Data
 * Static data for gallery templates - connected to actual template components
 */

import type { Template, FilterTab } from "../types";

export const CATEGORY_EMOJI_MAP: Record<string, string> = {
  "רומנטי": "💕",
  "משחקים": "🎮",
  "זיכרונות": "📸",
  "מתנות": "🎁",
  "אירועים מיוחדים": "🎉",
  "חתונה": "💍",
  "חגים": "🕎",
  "בר/בת מצווה": "🎊",
};

export const FILTER_TABS: FilterTab[] = [
  { id: "all", label: "הכל", emoji: "✨" },
  { id: "romantic", label: "רומנטי", emoji: "💕" },
  { id: "fun", label: "משחקים", emoji: "🎮" },
  { id: "memories", label: "זיכרונות", emoji: "📸" },
  { id: "gifts", label: "מתנות", emoji: "🎁" },
  { id: "birthday", label: "אירועים מיוחדים", emoji: "🎉" }
];

export const TEMPLATES: Template[] = [
  {
    id: "date-invite",
    title: "הזמנה לדייט",
    description:
      'כרטיס אינטראקטיבי שבו כפתור ה"לא" בורח מהאצבע. אי אפשר לסרב לזה! 💕',
    category: "romantic",
    isFree: true,
    componentKey: "DateInvite",
    link: "/create/date-invite",
    badge: { type: "free", color: "#22c55e" },
  },
  {
    id: "scratch-card",
    title: "כרטיס גירוד",
    description:
      "גרדו וגלו את ההפתעה! פרס מוסתר מחכה מתחת לשכבה הכסופה. ✨",
    category: "fun",
    isFree: true,
    componentKey: "ScratchCard",
    link: "/create/scratch-card",
    badge: { type: "free", color: "#22c55e" },
  },
  {
    id: "timeline",
    title: "ציר הזמן שלנו",
    description:
      "מסע נוסטלגי דרך הרגעים המיוחדים: הנשיקה הראשונה, הדייט הראשון והיום. 📅",
    category: "memories",
    isFree: true,
    componentKey: "Timeline",
    link: "/create/timeline",
    badge: { type: "free", color: "#22c55e" },
  },
  {
    id: "decision-wheel",
    title: "גלגל החלטות",
    description:
      "לא יודעים מה לעשות? סובבו את הגלגל ותנו לגורל להחליט! 🎡",
    category: "fun",
    isFree: true,
    componentKey: "DecisionWheel",
    link: "/create/decision-wheel",
    badge: { type: "free", color: "#22c55e" },
  },
  {
    id: "love-coupons",
    title: "קופוני אהבה",
    description:
      "פנקס קופונים דיגיטלי למימוש! עיסוי, ארוחת ערב, ועוד הפתעות מפנקות. 🎟️",
    category: "gifts",
    componentKey: "LoveCoupons",
    link: "/create/love-coupons",
    badge: { type: "heart", color: "#d4826f" },
  },
  {
    id: "relationship-quiz",
    title: "חידון חברות",
    description:
      "כמה את/ה באמת מכיר/ה אותי? חידון אינטראקטיבי עם ציון בסוף! 🧠",
    category: "fun",
    isPremium: true,
    componentKey: "RelationshipQuiz",
    link: "/create/relationship-quiz",
    badge: { type: "premium", color: "#f59e0b" },
    linkText: "פרימיום",
  },
  {
    id: "open-when",
    title: "פתח כש...",
    description:
      "מעטפות דיגיטליות עם מכתבים לרגעים מיוחדים. כשעצוב, כשמתגעגעים... 💌",
    category: "romantic",
    isPremium: true,
    componentKey: "OpenWhen",
    link: "/create/open-when",
    badge: { type: "premium", color: "#f59e0b" },
    linkText: "פרימיום",
  },
  {
    id: "steamy-window",
    title: "חלון עם אדים",
    description:
      "העבירו את האצבע על החלון וגלו את ההודעה הסודית שמוסתרת מאחוריו! 🫧",
    category: "romantic",
    isFree: true,
    componentKey: "SteamyWindow",
    link: "/create/steamy-window",
    badge: { type: "free", color: "#22c55e" },
  },
  {
    id: "surprise-gift",
    title: "מתנה בהפתעה",
    description:
      "קופסת מתנה אינטראקטיבית, נערו אותה עד שתיפתח ותגלו את ההפתעה! 🎁",
    category: "gifts",
    isPremium: true,
    componentKey: "SurpriseGift",
    link: "/create/surprise-gift",
    badge: { type: "new", color: "#8b5cf6" },
    linkText: "חדש!",
  },
  {
    id: "slot-machine",
    title: "מכונת ההבטחות",
    description: "סובבו את הגלגלים וגלו הבטחה מתוקה מאחד שאוהב אתכם! 🎰",
    category: "fun",
    isFree: true,
    componentKey: "SlotMachine",
    link: "/create/slot-machine",
    badge: { type: "new", color: "#8b5cf6" },
    linkText: "חדש!",
  },
  {
    id: "punching-bag",
    title: "שק האיגרוף",
    description: "תנו מכות לשק ובסוף גלו מסר מיוחד שמחכה לכם! 🥊",
    category: "fun",
    isFree: true,
    componentKey: "PunchingBag",
    link: "/create/punching-bag",
    badge: { type: "new", color: "#8b5cf6" },
    linkText: "חדש!",
  },
  {
    id: "apology-search",
    title: "חיפוש סליחה",
    description: "חיפוש שמקליד את הסליחה לבד ומגיע לתוצאה הכי מרגשת ברשת! 🔍",
    category: "romantic",
    isFree: true,
    componentKey: "ApologySearch",
    link: "/create/apology-search",
    badge: { type: "new", color: "#8b5cf6" },
    linkText: "חדש!",
  },
  {
    id: "birthday-candles",
    title: "כיבוי נרות",
    description: "כבו את הנרות אחד אחד, בקשו משאלה, וגלו הפתעה מתוקה ליום ההולדת! 🎂",
    category: "birthday",
    isPremium: true,
    componentKey: "BirthdayCandles",
    link: "/create/birthday-candles",
    badge: { type: "premium", color: "#f59e0b" },
    linkText: "פרימיום",
  },
  {
    id: "excuse-generator",
    title: "מכונת התירוצים",
    description: "לחצו על הכפתור וקבלו תירוץ אוטומטי ומושלם לכל מצב! ⚙️",
    category: "fun",
    isFree: true,
    componentKey: "ExcuseGenerator",
    link: "/create/excuse-generator",
    badge: { type: "free", color: "#22c55e" },
  },
  {
    id: "wedding-glass",
    title: "שבירת כוס",
    description:
      "חתן וכלה חכמים משם וכוס שנשברת בכל לחיצה! מזל טוב ודרך מושלמת לחגוג את החתונה. 💍",
    category: "wedding",
    isPremium: true,
    componentKey: "WeddingGlass",
    link: "/create/wedding-glass",
    badge: { type: "premium", color: "#f59e0b" },
    linkText: "פרימיום",
  },
  {
    id: "holiday-card",
    title: "מפעל החגים",
    description:
      "בחרו חג אהוב ותאימו ברכה אישית לכל החג — ראש השנה, חנוכה, פורים, פסח ועוד. 🍯",
    category: "holidays",
    isPremium: true,
    componentKey: "HolidayCard",
    link: "/create/holiday-card",
    badge: { type: "premium", color: "#f59e0b" },
    linkText: "פרימיום",
  },
  {
    id: "bar-bat-mitzvah",
    title: "בר/בת מצווה",
    description:
      "כרטיס אינטראקטיבי לחגיגת בר או בת מצווה! בחרו את הסוג, לחצו על הכתר או הספר, וגלו הודעת ברכה מרגשת. 🎉",
    category: "mitzvah",
    isPremium: true,
    componentKey: "BarBatMitzvah",
    link: "/create/bar-bat-mitzvah",
    badge: { type: "premium", color: "#f59e0b" },
    linkText: "פרימיום",
  },
];

// Sample data for live previews
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
  SteamyWindow: {
    title: "יש לך הודעה...",
    revealMessage: "❤️",
    emoji: "💖",
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
    boxColor: "#e74c5e",
    ribbonColor: "#ffd700",
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
  BirthdayCandles: {
    title: "מערכת כיבוי נרות",
    subtitle: "הקישי על הלהבות",
    candleCount: 3,
    cakeColor: "#d4826f",
    flameColor: "#ffde59",
    celebrationTitle: "מזל טוב!!! 🎂",
    celebrationMessage: "שתמיד תהיי מוקפת באהבה!",
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
  WeddingGlass: {
    title: "שבירת כוס דיגיטלית",
    subtitle: "לחצו על הכפתור כדי שהחתן ישבור את הכוס",
    stompButtonLabel: "שבור את הכוס!",
    mazalTovTitle: "מזל טוב! 💍",
    mazalTovMessage: "שתזכו לבנות יחד בית מלא באהבה, צחוק ושמחה.",
    primaryColor: "#d4826f",
  },
  HolidayCard: {
    holidayKind: "rosh" as const,
    customTitle: "",
    customGreeting: "שנה טובה ומתוקה!",
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

/** Funny "how it works" descriptions shown in the info modal */
export const TEMPLATE_INFO_TEXT: Record<string, string> = {
  "date-invite":
    "איך זה עובד? אתם שולחים הזמנה, והצד השני פשוט לא יכול לסרב (כי כפתור ה'לא' בורח להם מהאצבע!). דרך מושלמת להבטיח דייט, או לפחות לגרום להם לצחוק קצת לפני שהם מסכימים.",
  "scratch-card":
    "מרגישים בני מזל? זה בדיוק כמו כרטיס חישגד, רק שבמקום לזכות ב-10 שקלים ולהתאכזב, פה מסתתרת הפתעה שאתם בחרתם! (ובלי הלכלוך של הגירוד על הספה).",
  timeline:
    "המסע שלכם, מאורגן יפה! תחשבו על זה כמו קורות חיים, רק של הזוגיות שלכם. מתי נפגשתם? מתי אמרתם 'אני אוהב/ת אותך' לראשונה? הכל פה.",
  "decision-wheel":
    "סוף לדילמה הנצחית של 'מה בא לך לאכול?'. מכניסים אופציות, מסובבים את הגלגל, והגורל יחליט (או שתסובבו שוב ושוב עד שייצא פיצה).",
  "love-coupons":
    "פנקס קופונים שאתם מכינים מראש! מסאז'? פטור משטיפת כלים? רק תיזהרו, כי הם עלולים לממש את כולם באותו יום.",
  "relationship-quiz":
    "המבחן האולטימטיבי! האם הם באמת מקשיבים לכם כשאתם מדברים? תכינו שאלות קשות ותראו מי יקבל תעודת הצטיינות (ומי יישן על הספה).",
  "open-when":
    "מעטפות וירטואליות לרגעים ספציפיים. 'פתח כשאתה עצוב', 'פתח כשאתה מתגעגע'... הרבה יותר מרגש מלהשאיר פתק על המקרר שנופל אחרי יומיים.",
  "steamy-window":
    "זוכרים שפעם היינו מציירים לבבות על חלונות עם אדים באוטו? אז כזה, רק בדיגיטל, ובלי שצריך לנקות את השמשות אחר כך!",
  "surprise-gift":
    "קופסת מתנה וירטואלית שצריך ללחוץ עליה עד שהיא נפתחת כדי לגלות את ההפתעה. מתאים במיוחד לאנשים שאין להם סבלנות!",
  "slot-machine":
    "מכונת גלגלים שמסתירה הבטחה! כל סיבוב מגלה קצת יותר, עד שבסיבוב האחרון נחשפת ההבטחה המלאה. כי ככה מבטיחים דברים עם סטייל.",
  "punching-bag":
    "לפעמים צריך לשחרר קצת לחץ. כאן אפשר לתת מכות לשק האיגרוף הדיגיטלי — ובסוף מגלים שמאחורי השק מסתתרת הפתעה מתוקה. טיפול זוגי ממש לא יצליח להתחרות בזה.",
  "apology-search":
    "מדמים חיפוש בגוגל — רק שהפעם מה שמחפשים זה סליחה. האנימציה מקלידה את השאלה לבד, ואחרי כמה שניות מתח מופיע הכרטיס עם ההודעה האישית. כי גם סליחה צריכה להופיע בתוצאות החיפוש.",
  "excuse-generator":
    "מה אנחנו עושים כאן? מכונה שמייצרת תירוצים אוטומטית! לוחצים, הגלגל עם השיניים מסתובב, ומתוך מאגר התירוצים שהכנתם מראש יוצא התירוץ המושלם. לא צריכים להיות יצירתיים — הגאדג'ט עושה את העבודה.",
  "birthday-candles":
    "עוגת יום הולדת דיגיטלית אמיתית! כל לחיצה כובה נר, ובסוף כשכל הנרות כבויים, מופיעה הודעת המזל טוב האישית. כי ריח העוגה לא מגיע בדיגיטל, אבל הרגש — כן!",
  "wedding-glass":
    "קלאסיקה חתונה דיגיטלית! החתן והכלה עומדים זה לצד זה, כוס שבורה במרכז, ולחיצה אחת — הכוס נשברת לשרדים עם אנימציה מפוצצת! בסוף הודעת מזל טוב אישית. כי ממש שום דבר לא מרגיש כמו חתונה בדיגיטל.",
  "holiday-card":
    "בחרו חג שלנו — ראש השנה, חנוכה, פורים או פסח — וכתבו ברכה אישית. כל חג בעל דיוק משלו: צבעים, ציוני כיתוב, ודרכו של העונה שזה שלנו. כי כל חג ראוי לבחינת תמונה איכותית וברכה מיוחדת.",
  "bar-bat-mitzvah":
    "כרטיס אינטראקטיבי לחגיגה של בר או בת מצווה! בחרו האם זה בר או בת, התאימו את הברכה, וכשהמקבל/ת לוחץ/ת על הכתר או הספר — ההודעה המרגשת שלכם מופיעה בפני עיניו/ה. כי ההתבגרות זה רגע שצריך חגיגה דיגיטלית.",
};
