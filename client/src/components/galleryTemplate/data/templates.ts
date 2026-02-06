/**
 * Template Data
 * Static data for gallery templates
 */

import type { Template, FilterTab } from "../types";

export const FILTER_TABS: FilterTab[] = [
  { id: "all", label: "הכל" },
  { id: "dates-love", label: "דייטים ואהבה" },
  { id: "birthdays", label: "ימי הולדת" },
  { id: "family-friends", label: "משפחה וחברים" },
  { id: "humor", label: "הומור" },
];

export const TEMPLATES: Template[] = [
  {
    id: "viral-invitation",
    title: "ההזמנה הוויראלית",
    description:
      'כרטיס אינטראקטיבי שבו כפתור ה"לא" בורח מהאצבע. אי אפשר לסרב לזה.',
    imageSrc: "/assets/templates/viral-invitation.png",
    category: "dates-love",
    isFree: true,
    link: "/templates/viral-invitation",
  },
  {
    id: "swipe-card",
    title: "כרטיס חיש-גד",
    description:
      "שלחו רמיק לנמיד דיגיטליייי שמתחיל את הפסר הפרהש שלכם.",
    imageSrc: "/assets/templates/swipe-card.png",
    category: "dates-love",
    badge: { type: "heart", color: "#f59e0b" },
    link: "/templates/swipe-card",
    linkText: "כולל תמונות אישיות בפרימיום",
  },
  {
    id: "timeline",
    title: "ציר הזמן שלנו",
    description:
      "מסע נוסטלגי דרך התאריכים החשובים: הנשיקה הראשונה, הדייט הראשון והיום.",
    imageSrc: "/assets/templates/timeline.png",
    category: "dates-love",
    badge: { type: "star", color: "#6b7280" },
    link: "/templates/timeline",
  },
  {
    id: "love-coupons",
    title: "קופונים לאהובים",
    description:
      "פנקס קופונים דיגיטלי. כולל עדכון בזמן אמת כשהצד השני ממנש קופון!",
    imageSrc: "/assets/templates/love-coupons.png",
    category: "dates-love",
    badge: { type: "heart", color: "#f59e0b" },
    link: "/templates/love-coupons",
    linkText: "כולל תמונות אישיות בפרימיום",
  },
];
