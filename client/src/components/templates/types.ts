/**
 * Template Components Type Definitions
 * Shared interfaces for all HeartNote template components
 */

// =============================================================================
// 1. DATE INVITE
// =============================================================================
export interface DateInviteData {
  question: string;           // "?האם תצאי איתי לדייט"
  yesText: string;            // "כן"
  noText: string;             // "לא"
  successMessage: string;     // "!יש לנו דייט"
  backgroundImage?: string;   // Optional background URL
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
}

// =============================================================================
// 4. LOVE COUPONS
// =============================================================================
export interface LoveCoupon {
  id: string;
  title: string;              // "ארוחת ערב רומנטית"
  description?: string;
  icon?: string;              // Emoji: "🍽️"
  isRedeemed: boolean;
  redeemedAt?: string;
}

export interface LoveCouponsData {
  title?: string;             // "קופונים מיוחדים"
  coupons: LoveCoupon[];
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
}

// =============================================================================
// 6. OPEN WHEN
// =============================================================================
export interface OpenWhenEnvelope {
  id: string;
  title: string;              // "כשאת/ה עצוב/ה"
  content: string;            // Letter content (supports line breaks)
  isLocked: boolean;
  emoji?: string;             // "😢"
}

export interface OpenWhenData {
  title?: string;             // "מכתבים מיוחדים"
  envelopes: OpenWhenEnvelope[];
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================
export interface TemplateComponentProps<T> {
  data: T;
}
