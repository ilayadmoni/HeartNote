/**
 * Footer Constants
 * Static data for footer links and social media
 */

import type { FooterLinkGroup, SocialLink } from "../types";

export const FOOTER_LINKS: FooterLinkGroup[] = [
  {
    title: "HeartNote",
    links: [
      { id: "gallery", label: "גלריית התבניות", href: "/gallery" },
      { id: "how-it-works", label: "איך זה עובד?", href: "/#how-it-works" },
      { id: "faq", label: "שאלות נפוצות", href: "/faq" },
    ],
  },
  {
    title: "משפטי",
    links: [
      { id: "privacy", label: "מדיניות פרטיות", href: "/privacy" },
      { id: "accessibility", label: "נגישות", href: "/accessibility" },
      { id: "contact", label: "צרו קשר איתנו", href: "/contact" },
    ],
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://tiktok.com/@nitsanbp22",
    icon: "tiktok",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://instagram.com/heartnote.co.il",
    icon: "instagram",
  },
];

export const FOOTER_DESCRIPTION =
  "מפעל הרגעים הדיגיטלי שלכם. יוצרים אהבה, חיוכים וזיכרונות בלחיצת כפתור";

export const COPYRIGHT_TEXT = "© 2026 HeartNote . כל הזכויות שמורות. נבנה באהבה.";
export const SECURITY_TEXT = "";
