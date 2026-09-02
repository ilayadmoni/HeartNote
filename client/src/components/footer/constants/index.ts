/**
 * Footer Constants
 * Static data for footer links and social media. Labels resolve through
 * `footer.groups.<groupKey>.<labelKey>` at render time.
 */

import type { FooterLinkGroup, SocialLink } from "../types";

export const FOOTER_LINKS: FooterLinkGroup[] = [
  {
    groupKey: "brand",
    links: [
      { id: "how-it-works", labelKey: "howItWorks", href: "/#how-it-works" },
      { id: "faq", labelKey: "faq", href: "/faq" },
      { id: "contact", labelKey: "contact", href: "/contact" },
    ],
  },
  {
    groupKey: "legal",
    links: [
      { id: "privacy", labelKey: "privacy", href: "/privacy" },
      { id: "terms", labelKey: "terms", href: "/terms" },
      { id: "accessibility", labelKey: "accessibility", href: "/accessibility" },
    ],
  },
];

/** Brand names stay untranslated; they are proper nouns, not UI copy. */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://tiktok.com/@heartnote.co.il",
    icon: "tiktok",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://instagram.com/heartnote.co.il",
    icon: "instagram",
  },
];
