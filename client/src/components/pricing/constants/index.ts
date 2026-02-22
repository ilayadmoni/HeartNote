/**
 * Pricing Constants
 */

import type { PricingPlan } from "../types";

// Header Content
export const PRICING_TITLE = "תוכניות ייצור";
export const PRICING_SUBTITLE = "בחרו את הכלים המתאימים למפעל שלכם. ניתן לבטל בכל רגע.";

// Pricing Plans
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "פועל מתחיל",
    price: 0,
    period: "",
    features: [
      { id: "s1", text: "גישה ל-3 תבניות בסיס", included: true },
      { id: "s2", text: "עריכת טקסט מלאה", included: true },
      { id: "s3", text: "לוגו HeartNote על הכרטיס", included: false },
      { id: "s4", text: "ללא תמונות", included: false },
    ],
    ctaText: "בחר מסלול חינם",
    isFeatured: false,
  },
  {
    id: "manager",
    name: "מנהל עבודה",
    price: 29,
    period: "לחודש",
    features: [
      { id: "m1", text: "גישה לכל התבניות", included: true },
      { id: "m2", text: "הסרת לוגו המערכת", included: true },
      { id: "m3", text: "העלאת תמונות אישיות", included: true },
      { id: "m4", text: "מחיקת רקע", included: true },
    ],
    ctaText: "שדרג למנהל עבודה",
    isFeatured: true,
    badge: "מומלץ",
  },
  {
    id: "owner",
    name: "בעל המפעל",
    price: 59,
    period: "לחודש",
    features: [
      { id: "o1", text: "הכל כולל הכל", included: true },
      { id: "o2", text: "סטטיסטיקות צפייה", included: true },
      { id: "o3", text: "דומיין אישי", included: true },
      { id: "o4", text: "תמיכה בוואטסאפ 24/7", included: true },
    ],
    ctaText: "בחר מסלול עסקי",
    isFeatured: false,
  },
];
