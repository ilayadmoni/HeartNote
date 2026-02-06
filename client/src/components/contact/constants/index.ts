/**
 * Contact Page Constants
 */

import type { ContactInfoItem } from "../types";

// Page Header
export const CONTACT_TITLE = "צרו קשר";
export const CONTACT_SUBTITLE = "נשמח לשמוע מכם! מלאו את הטופס ונחזור אליכם בהקדם";

// Form Labels
export const FORM_LABELS = {
  name: "שם מלא",
  email: "כתובת אימייל",
  subject: "נושא הפנייה",
  message: "תוכן ההודעה",
  submit: "שלח הודעה",
  submitting: "שולח...",
} as const;

// Form Placeholders
export const FORM_PLACEHOLDERS = {
  name: "הכניסו את שמכם",
  email: "example@email.com",
  subject: "במה נוכל לעזור?",
  message: "ספרו לנו על הפנייה שלכם...",
} as const;

// Validation Messages
export const VALIDATION_MESSAGES = {
  nameRequired: "נא להזין שם",
  emailRequired: "נא להזין כתובת אימייל",
  emailInvalid: "כתובת אימייל לא תקינה",
  subjectRequired: "נא להזין נושא",
  messageRequired: "נא להזין הודעה",
  messageMinLength: "ההודעה חייבת להכיל לפחות 10 תווים",
} as const;

// Success/Error Messages
export const FORM_MESSAGES = {
  success: "ההודעה נשלחה בהצלחה! נחזור אליכם בהקדם",
  error: "אירעה שגיאה בשליחת ההודעה. אנא נסו שוב",
} as const;

// Contact Info Items
export const CONTACT_INFO: ContactInfoItem[] = [
  {
    id: "email",
    icon: "mail",
    title: "אימייל",
    value: "support@heartnote.co.il",
    href: "mailto:support@heartnote.co.il",
  },
  {
    id: "phone",
    icon: "phone",
    title: "טלפון",
    value: "03-1234567",
    href: "tel:03-1234567",
  },
  {
    id: "hours",
    icon: "clock",
    title: "שעות פעילות",
    value: "א׳-ה׳ 9:00-18:00",
  },
  {
    id: "location",
    icon: "mapPin",
    title: "כתובת",
    value: "תל אביב, ישראל",
  },
];

// Email endpoint (for future backend integration)
export const CONTACT_EMAIL_ENDPOINT = "/api/contact";
