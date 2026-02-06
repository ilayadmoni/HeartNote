/**
 * Accessibility Page Constants
 */

import type { AccessibilityFeature, ContactInfo } from "../types";

// Page Header Content
export const ACCESSIBILITY_TITLE = "הצהרת נגישות";
export const ACCESSIBILITY_SUBTITLE = "HeartNote מחויבת לספק חוויה נגישה לכלל המשתמשים";

// Introduction Text
export const ACCESSIBILITY_INTRO = `
אנו ב-HeartNote מאמינים שלכל אדם מגיעה הזכות ליצור ולשתף רגעים מרגשים. 
לכן, אנו פועלים להנגשת האתר שלנו בהתאם לתקן הישראלי (ת"י 5568) 
ולהנחיות WCAG 2.1 ברמה AA.
`;

// Accessibility Features
export const ACCESSIBILITY_FEATURES: AccessibilityFeature[] = [
  {
    id: "keyboard",
    title: "ניווט במקלדת",
    description: "ניתן לנווט בכל האתר באמצעות מקלדת בלבד, כולל קישורי דילוג לתוכן הראשי",
    icon: "keyboard",
  },
  {
    id: "screen-reader",
    title: "תמיכה בקורא מסך",
    description: "האתר תומך בקוראי מסך פופולריים כמו NVDA, JAWS ו-VoiceOver",
    icon: "volume",
  },
  {
    id: "contrast",
    title: "ניגודיות גבוהה",
    description: "תמיכה במצב ניגודיות גבוהה ומצב כהה להקלה על הקריאה",
    icon: "eye",
  },
  {
    id: "reduced-motion",
    title: "הפחתת אנימציות",
    description: "האתר מכבד את העדפות המשתמש להפחתת תנועה ואנימציות",
    icon: "monitor",
  },
  {
    id: "touch",
    title: "התאמה למובייל",
    description: "אזורי לחיצה גדולים ונוחים למגע בכל המכשירים",
    icon: "smartphone",
  },
  {
    id: "focus",
    title: "מיקוד ברור",
    description: "סימון ויזואלי ברור של האלמנט הממוקד לניווט נוח",
    icon: "mouse",
  },
];

// Contact Information
export const ACCESSIBILITY_CONTACT: ContactInfo = {
  email: "accessibility@heartnote.co.il",
  phone: "03-1234567",
};

// Additional Text
export const LAST_UPDATED = "פברואר 2026";
export const COMMITMENT_TEXT = `
אנו ממשיכים לעבוד על שיפור הנגישות באתר. אם נתקלתם בבעיית נגישות, 
אנא פנו אלינו ונשמח לסייע.
`;
