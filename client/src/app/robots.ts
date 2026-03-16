import { MetadataRoute } from "next";

const SITE_URL = "https://heartnote.co.il";

/**
 * App Robots Configuration
 * 
 * Controls search engine crawler access to the site:
 * - Allows public pages and template galleries
 * - Disallows private user routes, auth flows, and internal preview pages
 * - References the sitemap for SEO crawlers
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",           // Home page
          "/gallery",    // Template gallery
          "/pricing",    // Pricing page
          "/faq",        // FAQ page
          "/contact",    // Contact page
          "/terms",      // Terms of service
          "/privacy",    // Privacy policy
          "/accessibility", // Accessibility statement
          "/demo",       // Demo page
          "/create/",    // Template editor (public, no auth required)
          "/p/",         // Public creation pages (user-generated cards)
        ],
        disallow: [
          "/api/",       // API routes (if any exist)
          "/profile",    // User profile/dashboard (private)
          "/profile/",   // User profile routes
          "/auth/",      // Authentication flows (login, signup, password reset)
          "/complete-profile", // Profile completion (after OAuth)
          "/complete-profile/", // Profile completion routes
          "/preview",    // Internal preview page
          "/preview-frame", // Internal preview frame
          "/preview-frame/", // Preview frame routes
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
