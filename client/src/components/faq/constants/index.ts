/**
 * FAQ Page Constants
 * Placeholder questions and answers - easy to edit later
 */

import type { FAQItem } from "../types";

// Page Header
export const FAQ_TITLE = "שאלות נפוצות";
export const FAQ_SUBTITLE = "מצא תשובות לשאלות הנפוצות ביותר לפני שאתה פונה אלינו";

// FAQ Items - Placeholder content for easy editing
export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "what-is-heartnote",
    question: "מה זה HeartNote?",
    answer:
      "HeartNote היא פלטפורמה דיגיטלית ליצירת הזמנות ודפים מעוצבים לאירועים מיוחדים. אנו מאפשרים לכם ליצור תוכן מרגש ומותאם אישית בכמה קליקים פשוטים.",
  },
  {
    id: "how-to-create",
    question: "איך יוצרים הזמנה ב-HeartNote?",
    answer:
      "פשוט בחרו תבנית מהגלריה שלנו, מלאו את הפרטים האישיים שלכם, והמערכת תיצור עבורכם דף מעוצב ומותאם אישית. תוכלו לשתף את הקישור עם מי שתרצו!",
  },
  {
    id: "pricing",
    question: "כמה עולה השירות?",
    answer:
      "אנו מציעים מגוון חבילות מחירים התואמות לצרכים שונים. ניתן לצפות בכל האפשרויות בעמוד המחירים שלנו. יש לנו גם אפשרויות חינמיות למתחילים!",
  },
  {
    id: "edit-after-creation",
    question: "האם אפשר לערוך את הדף אחרי שיצרתי אותו?",
    answer:
      "כן! אתם יכולים לחזור לפאנל הניהול שלכם ולערוך את התוכן בכל עת. השינויים יעודכנו בזמן אמת בקישור המשותף.",
  },
  {
    id: "support",
    question: "איך פונים לתמיכה?",
    answer:
      "ניתן ליצור איתנו קשר דרך טופס יצירת הקשר באתר, או לשלוח הודעה לדוא״ל שלנו. אנו משתדלים לענות תוך 24 שעות.",
  },
  {
    id: "password-reset",
    question: "שכחתי את הסיסמה, מה לעשות?",
    answer:
      "לחצו על 'שכחתי סיסמה' במסך ההתחברות, והזינו את כתובת הדוא״ל שלכם. תקבלו קישור לאיפוס הסיסמה תוך מספר דקות.",
  },
];
