/**
 * Home Page Constants
 */

import type { StepItem } from "../types";

// Hero Section
export const HERO_BADGE = "מפעל הברכות הדיגיטלי החדש";
export const HERO_TITLE_LINE1 = "ברוכים הבאים";
export const HERO_TITLE_LINE2 = "למפעל הרגעים שלכם.";
export const HERO_DESCRIPTION = "צרו בקלות כרטיסים דיגיטליים, מצחיקים ומרגשים שכיף לתת למי שאוהבים.";
export const HERO_DESCRIPTION_2 = "בחרו תבנית, התאימו אישית, ושלחו!";
export const HERO_CTA = "התניעו את המכונה – התחילו לעצב"
export const HERO_CTA_SECONDARY = "צפו בדוגמה";

// Gallery Teaser
export const GALLERY_TITLE = "טעימה מהגלריה";
export const GALLERY_SUBTITLE = "הנה כמה מהעיצובים הכי פופולריים שלנו. יש עוד הרבה בגלריית התבניות!";
export const GALLERY_CTA = "לכל התבניות בגלריה";

// Pricing Teaser
export const PRICING_BADGE = "שדרגו את החוויה";
export const PRICING_TITLE_HIGHLIGHT = "המסלול המושלם";
export const PRICING_TITLE = "מצאו את";
export const PRICING_TITLE_END = "עבורכם";
export const PRICING_DESCRIPTION = "ממנוי חינם להתנסות ועד לחבילת פרימיום שנותנת לכם הכל. הצטרפו לאלפי יוצרים שכבר שדרגו.";
export const PRICING_CTA = "לכל החבילות והמחירים";

// How It Works
export const HOW_IT_WORKS_TITLE = "איך זה עובד?";
export const HOW_IT_WORKS_SUBTITLE = "שלושה צעדים פשוטים ליצירת המתנה המושלמת";

export const STEPS: StepItem[] = [
  {
    id: 1,
    icon: "click",
    title: "בוחרים תבנית",
    description: "בחרו תבנית מגלריית התבניות, יש לנו המון אפשרויות מגניבות",
  },
  {
    id: 2,
    icon: "settings",
    title: "מתאימים אישית",
    description: "הוסיפו טקסט, תמונות והתאימו אישית את העיצוב שלכם",
  },
  {
    id: 3,
    icon: "send",
    title: "שולחים למי שאוהבים",
    description: "לחצו 'יצירה' וקבלו קישור מיידי לשיתוף",
  },
];
