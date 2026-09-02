import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/metadata";

const PRIVATE_PATHS = [
  "/profile",
  "/auth/",
  "/complete-profile",
  "/preview",
  "/preview-frame",
  "/login",
];

/**
 * Crawler policy. Public marketing, gallery, editor and share pages are
 * open in both locales; private account and internal preview routes are
 * blocked for Hebrew (unprefixed) and English (/en) alike.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/", ...PRIVATE_PATHS, ...PRIVATE_PATHS.map((p) => `/en${p}`)];
  return {
    rules: [{ userAgent: "*", allow: "/", disallow }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
