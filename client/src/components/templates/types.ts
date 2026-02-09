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
  prize: {
    type: 'text' | 'image';
    content: string;          // Text or image URL
  };
  gridSize: {
    cols: number;             // e.g., 6
    rows: number;             // e.g., 4
  };
  scratchColor: string;       // e.g., "#c0c0c0"
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
  emoji?: string;             // "🎉"
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
// COMPONENT PROPS
// =============================================================================
export interface TemplateComponentProps<T> {
  data: T;
}
