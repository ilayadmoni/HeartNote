/**
 * Template Components Type Definitions
 * Shared interfaces for all HeartNote template components
 */

// =============================================================================
// SHARED: PRIMARY COLOR
// =============================================================================
/** Default accent color used when no primaryColor is specified */
export const DEFAULT_PRIMARY_COLOR = "#d4826f";

// =============================================================================
// 1. DATE INVITE
// =============================================================================
export interface DateInviteData {
  title?: string;             // "הזמנה לדייט"
  question: string;           // "?האם תצאי איתי לדייט"
  yesText: string;            // "כן"
  noText: string;             // "לא"
  successMessage: string;     // "!יש לנו דייט"
  backgroundImage?: string;   // Optional background URL
  primaryColor?: string;      // Accent color for buttons, highlights
}

// =============================================================================
// 2. SCRATCH CARD
// =============================================================================
export interface ScratchCardData {
  prizeContent: string;       // Text content to reveal
  title?: string;             // "גרד וגלה את ההפתעה"
  primaryColor?: string;      // Accent color for buttons, highlights
}

// =============================================================================
// 3. TIMELINE
// =============================================================================
export interface TimelineEvent {
  id: string;
  date: string;               // "2023-01-15"
  title: string;              // "הפגישה הראשונה שלנו"
  description?: string;
  icon?: string;              // Emoji: "💖"
}

export interface TimelineData {
  title?: string;             // "הסיפור שלנו"
  events: TimelineEvent[];
  primaryColor?: string;      // Accent color for timeline line, badges
}

// =============================================================================
// 4. LOVE COUPONS
// =============================================================================
export interface LoveCoupon {
  id: string;
  title: string;              // "ארוחת ערב רומנטית"
  description?: string;
  icon?: string;              // Emoji: "🍽️"
  color?: string;             // Tailwind color key: "emerald" | "sky" | "amber" etc.
  isRedeemed: boolean;
  redeemedAt?: string;
}

export interface LoveCouponsData {
  title?: string;             // "קופונים מיוחדים"
  coupons: LoveCoupon[];
  primaryColor?: string;      // Accent color for buttons, highlights
}

// =============================================================================
// 5. RELATIONSHIP QUIZ
// =============================================================================
export interface QuizQuestion {
  id: string;
  question: string;           // "?מה הצבע האהוב עליי"
  options: string[];          // ["אדום", "כחול", "ירוק", "צהוב"]
  correctIndex: number;       // 0-3
}

export interface QuizScoreMessage {
  minScore: number;           // 0-100
  message: string;            // "!מכיר.ה אותי מצוין"
}

export interface RelationshipQuizData {
  title?: string;             // "כמה את/ה מכיר/ה אותי?"
  questions: QuizQuestion[];
  scoreMessages: QuizScoreMessage[];
  primaryColor?: string;      // Accent color for buttons, progress bar
}

// =============================================================================
// 6. OPEN WHEN
// =============================================================================
export interface OpenWhenEnvelope {
  id: string;
  title: string;              // "כשאת/ה עצוב/ה"
  content: string;            // Letter content (supports line breaks)
  emoji?: string;             // "😢"
  dateOpen: string;           // ISO date string "2026-03-15" — unlocks on this date
  color?: string;             // Per-card color key (e.g., "rose", "sky")
}

export interface OpenWhenData {
  title?: string;             // "מכתבים מיוחדים"
  envelopes: OpenWhenEnvelope[];
  primaryColor?: string;      // Accent color for envelopes, modal
}

// =============================================================================
// 7. DECISION WHEEL
// =============================================================================
export interface DecisionWheelData {
  title?: string;             // "גלגל ההחלטות"
  subtitle?: string;          // "סובבו וגלו!"
  options: string[];           // 2-8 text labels for wheel segments
  primaryColor?: string;      // Accent color for spin button, pointer
}

// =============================================================================
// 9. SURPRISE GIFT
// =============================================================================
export interface SurpriseGiftData {
  title?: string;             // "יש לך הפתעה!"
  greeting: string;           // Revealed message after opening
  boxColor?: string;          // Gift box fill color
  ribbonColor?: string;       // Ribbon / bow color
  clicksRequired?: number;    // Shakes before opening (default 5)
  primaryColor?: string;      // Accent fallback
}

// =============================================================================
// 10. SLOT MACHINE
// =============================================================================
export interface SlotMachineData {
  title?: string;           // "מכונת ההבטחות"
  subtitle?: string;        // "סובבי 3 פעמים כדי לגלות..."
  reel1Options: string[];   // labels shown while spinning
  reel2Options: string[];
  reel3Options: string[];
  targetReel1: string;      // locked message on final spin
  targetReel2: string;
  targetReel3: string;
  spinsRequired?: number;   // default 3, min 1, max 5
  spinButtonLabel?: string; // "סובבי"
  successEmoji?: string;    // "🎉"
  primaryColor?: string;
}

// =============================================================================
// 11. PUNCHING BAG
// =============================================================================
export interface PunchingBagData {
  introTitle?: string;       // "מערכת לשחרור לחצים"
  introSubtitle?: string;    // "תני לזה כמה מכות טובות. הכל בסדר."
  hitsRequired?: number;     // default 5, min 1, max 20
  hitInstructions?: string;  // "הקישי על השק כדי להרביץ"
  resultTitle?: string;      // "אאוץ׳... זה שחרר?"
  resultMessage: string;     // personalised apology text
  bagColor?: string;         // palette color for bag fill
  primaryColor?: string;
}

// =============================================================================
// 12. APOLOGY SEARCH
// =============================================================================
export interface ApologySearchData {
  searchQuery: string;         // "איך לבקש סליחה מהבן זוג שלי?"
  resultTitle: string;         // "סליחה שהייתי עצבנית"
  resultSubtitle?: string;     // "אתה צודק. אוהבת אותך."
  startButtonLabel?: string;   // "התחל חיפוש"
  typingSpeedMs?: number;      // default 80
  primaryColor?: string;
}

// =============================================================================
// 13. EXCUSE GENERATOR
// =============================================================================
export interface ExcuseGeneratorData {
  title?: string;              // "מכונת התירוצים האוטומטית"
  subtitle?: string;           // "לא בא לך לצאת?..."
  excuses: string[];           // pool of 3–20 excuse strings
  buttonLabel?: string;        // "ג'נרט תירוץ"
  disclaimer?: string;         // "* החברה אינה אחראית..."
  primaryColor?: string;
}

// =============================================================================
// 15. BAR/BAT MITZVAH
// =============================================================================
export type MitzvahKind = "bar" | "bat";

export interface BarBatMitzvahData {
  kind: MitzvahKind;               // user selects in editor ("bar" or "bat")
  introTitle?: string;             // "מכונת ההתבגרות"
  introSubtitle?: string;          // "לחצו על הכתר / הספר..."
  blessingTitle: string;           // "הגיע הזמן לחגוג! 🎉"
  blessingMessage: string;         // "ברוכים הבאים לגיל הבגרות..."
  tapHintLabel?: string;           // "לחצו על הכתר" / "לחצו על הספר"
  primaryColor?: string;           // palette color
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================
export interface TemplateComponentProps<T> {
  data: T;
}

// =============================================================================
// INTERACTIVE EVENTS — shared greeting data
// =============================================================================
export interface InteractiveGreetingData {
  recipientName?: string;
  senderName?: string;
  greetingTitle?: string;
  message?: string;
  signature?: string;
}

export interface BirthdayInteractiveData extends InteractiveGreetingData {
  recipientAge?: number;
}

export interface WeddingInteractiveData {
  coupleNames?: string;
  senderName?: string;
  greetingTitle?: string;
  message?: string;
}

export type HolidayInteractiveSlug =
  | "holiday-rosh-hashanah-interactive"
  | "holiday-passover-interactive"
  | "holiday-purim-interactive"
  | "holiday-shavuot-interactive"
  | "holiday-sukkot-interactive"
  | "holiday-hanukkah-interactive";

export type HolidayInteraction =
  | "honey"
  | "matzah"
  | "mask"
  | "bloom"
  | "sukkah"
  | "hanukkah";

export interface HolidayInteractiveConfig {
  slug: HolidayInteractiveSlug;
  componentKey: string;
  name: string;
  galleryTitle: string;
  galleryDescription: string;
  defaultTitle: string;
  revealLine: string;
  prompt: string;
  accent: string;
  interaction: HolidayInteraction;
}

