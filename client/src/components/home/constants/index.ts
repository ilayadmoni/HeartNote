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
export const HERO_CTA = "התניעו את המכונה – התחילו לעצב";

// Gallery Teaser
export const GALLERY_TITLE = "טעימה מהגלריה";
export const GALLERY_SUBTITLE = "הנה כמה מהעיצובים הכי פופולריים שלנו. יש עוד הרבה בפנים!";
export const GALLERY_CTA = "לכל התבניות בגלריה";

// Pricing Teaser
export const PRICING_BADGE = "שדרגו את החוויה";
export const PRICING_TITLE_HIGHLIGHT = "המסלול המושלם";
export const PRICING_TITLE = "מצאו את";
export const PRICING_TITLE_END = "עבורכם";
export const PRICING_DESCRIPTION = "ממנוי חינם להתנסות ועד לחבילת \"בעל מפעל\" שנותנת לכם הכל. הצטרפו לאלפי יוצרים שכבר שדרגו.";
export const PRICING_CTA = "לכל החבילות והמחירים";

// How It Works
export const HOW_IT_WORKS_TITLE = "איך זה עובד?";
export const HOW_IT_WORKS_SUBTITLE = "שלושה צעדים פשוטים ליצירת הברכה המושלמת";

export const STEPS: StepItem[] = [
  {
    id: 1,
    icon: "click",
    title: "בוחרים תבנית",
    description: "בחרו תבנית מהמבס היצירה שלנו – יש לנו עשרות אפשרויות יצירתיות",
  },
  {
    id: 2,
    icon: "settings",
    title: "מתאימים אישית",
    description: "הוסיפו טקסט, תמונות והתאמות אישיות בממשק העריכה הפשוט שלנו",
  },
  {
    id: 3,
    icon: "send",
    title: "משגרים בוואטסאפ",
    description: "לחצו שלח וקבלו קישור מיידי לשיתוף ישר לוואטסאפ",
  },
];
