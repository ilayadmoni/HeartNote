/**
 * Profile Constants
 * Plan configurations and mock data for profile page
 * TODO: Move to .env and API in the future
 */

import type { PlanConfig, PlanType, UserProfile } from "../types";

/** Plan configurations - will be moved to env/API */
export const PLAN_CONFIGS: Record<PlanType, PlanConfig> = {
  free: {
    name: "Free",
    hebrewName: "חינמי",
    maxTemplates: 3,
    color: "#6b7280", // gray
    description: "תוכנית בסיסית לניסיון",
  },
  pro: {
    name: "Pro",
    hebrewName: "פרו",
    maxTemplates: 15,
    color: "#d4826f", // coral
    description: "לאוהבי ברכות נלהבים",
  },
  premium: {
    name: "Premium",
    hebrewName: "פרימיום",
    maxTemplates: 999,
    color: "#8b5cf6", // purple
    description: "ללא הגבלה - הכל כלול",
  },
};

/** Mock user data - will be replaced with API call */
export const MOCK_USER_PROFILE: UserProfile = {
  id: "user-123",
  fullName: "עילי אדמוני",
  email: "ilayadmoni9@gmail.com",
  joinDate: "2024-01-15",
  subscription: {
    plan: "pro",
    startDate: "2024-09-04",
    expiryDate: "2025-10-20",
    isActive: true,
  },
  templates: [
    {
      id: "tmpl-1",
      name: "הזמנה ליום הולדת",
      type: "date-invite",
      createdAt: "2024-02-01",
    },
    {
      id: "tmpl-2",
      name: "קופונים לזוג",
      type: "love-coupons",
      createdAt: "2024-02-10",
    },
    {
      id: "tmpl-3",
      name: "ציר זמן שלנו",
      type: "timeline",
      createdAt: "2024-02-15",
    },
  ],
  templatesUsed: 3,
};
