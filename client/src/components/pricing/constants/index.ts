/**
 * Pricing Constants
 */

import type { PricingPlan } from "../types";

// Header Content
export const PRICING_TITLE = "תוכניות ייצור";
export const PRICING_SUBTITLE = "בחרו את התוכנית המתאימה לכם. המנויים בתשלום תקפים לחודש ואינם מתחדשים.";

// Pricing Plans
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "פועל מתחיל",
    price: 0,
    period: "",
    features: [
      { id: "s1", text: "גישה לתבניות בסיסיות", included: true },
      { id: "s2", text: "עריכת טקסט והתאמת צבעים", included: true },
      { id: "s3", text: "'סימן מים' ברקע הכרטיס", included: false },
      { id: "s4", text: "עד 5 יצירות חינמיות לכל החיים", included: false },
      { id: "s5", text: "זמינות הקישור: 24 שעות", included: false },

    ],
    ctaText: "בחירת מסלול חינם",
    isFeatured: true,
  },
  {
    id: "manager",
    name: "פועל לייט",
    price: 12,
    period: "לחודש",
    features: [
      { id: "m1", text: "גישה לכל התבניות", included: true },
      { id: "m2", text: "עריכת טקסט והתאמת צבעים", included: true },
      { id: "m3", text: "הסרת 'סימן מים' מרקע הכרטיס", included: true },
      { id: "m4", text: "העלאת תמונות", included: true },
      { id: "m5", text: "2 יצירות פרימיום + 5 יצירות חינמיות", included: true },
            { id: "m6", text: "זמינות הקישור: 14-30 ימים", included: true },


    ],
    ctaText: "פרטים בהמשך",
    isFeatured: false,
    badge: "בקרוב",
  },
  {
    id: "owner",
    name: "פועל פרימיום",
    price: 29,
    period: "לחודש",
    features: [
      { id: "o1", text: "גישה לכל התבניות", included: true },
      { id: "o2", text: "עריכת טקסט והתאמת צבעים", included: true },
      { id: "o3", text: "הסרת 'סימן מים' מרקע הכרטיס", included: true },
      { id: "o4", text: "העלאת תמונות", included: true },
      { id: "o5", text: "6 יצירות פרימיום + 5 יצירות חינמיות", included: true },
                  { id: "o6", text: "זמינות הקישור: 14-30 ימים", included: true },


    ],
    ctaText: "פרטים בהמשך",
    isFeatured: false,
        badge: "בקרוב",

  },

];
