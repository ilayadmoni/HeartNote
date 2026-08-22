import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/utils/logger";

const SITE_URL = "https://www.heartnote.co.il";
const NOW = new Date().toISOString();

/**
 * App Sitemap
 * Generates a dynamic XML sitemap combining:
 * - Static public/main routes (fixed priority)
 * - Dynamic template pages (priority 0.7)
 * - Dynamic creation pages (priority 0.6)
 *
 * Handles DB fetch failures gracefully by returning at least the static routes.
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ──────────────────────────────────────────────────────────────────────
  // Static Routes
  // ──────────────────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    // ── Home ────────────────────────────────────────────────────────────
    {
      url: `${SITE_URL}/`,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority: 1.0,
    },

    // ── Main Marketing/Info Pages ───────────────────────────────────────
    {
      url: `${SITE_URL}/gallery`,
      lastModified: NOW,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: NOW,
      changeFrequency: "yearly",
      priority: 0.6,
    },

    // ── Legal Pages ─────────────────────────────────────────────────────
    {
      url: `${SITE_URL}/terms`,
      lastModified: NOW,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: NOW,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/accessibility`,
      lastModified: NOW,
      changeFrequency: "yearly",
      priority: 0.5,
    },

    // ── Public Demo ─────────────────────────────────────────────────────
    {
      url: `${SITE_URL}/demo`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // ──────────────────────────────────────────────────────────────────────
  // Dynamic Routes
  // ──────────────────────────────────────────────────────────────────────

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  // ── Fetch Active Templates ────────────────────────────────────────────
  try {
    const templates = await prisma.template.findMany({
      where: { isActive: true },
      select: { slug: true },
      orderBy: { slug: "asc" },
    });

    dynamicRoutes.push(
      ...templates.map((template) => ({
        url: `${SITE_URL}/create/${template.slug}`,
        lastModified: NOW,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    );
  } catch (err) {
    logger.error("[sitemap] Templates fetch exception", { error: err });
    // Continue with creations even if templates fetch fails
  }

  // ── Fetch Published Creations (non-deleted, non-expired) ─────────────
  try {
    const creations = await prisma.creation.findMany({
      where: {
        isDeleted: false,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      select: { id: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 50000, // Sitemap limit is typically 50k URLs
    });

    dynamicRoutes.push(
      ...creations.map((creation) => ({
        url: `${SITE_URL}/p/${creation.id}`,
        lastModified: creation.createdAt.toISOString(),
        changeFrequency: "never" as const,
        priority: 0.6,
      })),
    );
  } catch (err) {
    logger.error("[sitemap] Creations fetch exception", { error: err });
    // Continue anyway — at least static + template routes will be in sitemap
  }

  return [...staticRoutes, ...dynamicRoutes];
}
