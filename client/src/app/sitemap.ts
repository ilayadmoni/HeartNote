import { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

const SITE_URL = "https://heartnote.co.il";
const NOW = new Date().toISOString();

/**
 * App Sitemap
 * Generates a dynamic XML sitemap combining:
 * - Static public/main routes (fixed priority)
 * - Dynamic template pages (priority 0.7)
 * - Dynamic creation pages (priority 0.6)
 *
 * Handles Supabase fetch failures gracefully by returning
 * at least the static routes.
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
  // Dynamic Routes from Supabase
  // ──────────────────────────────────────────────────────────────────────

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const admin = createAdminClient();

    // ── Fetch Active Templates ──────────────────────────────────────────
    // These templates are available for creating new cards
    try {
      const { data: templates, error: templatesError } = await admin
        .from("templates")
        .select("id, component_key, updated_at")
        .eq("is_active", true)
        .order("updated_at", { ascending: false });

      if (templatesError) {
        console.error("[sitemap] Templates fetch error:", templatesError);
      } else if (templates && Array.isArray(templates)) {
        const templateRoutes = templates.map((template) => ({
          url: `${SITE_URL}/create/${template.component_key}`,
          lastModified: template.updated_at || NOW,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }));
        dynamicRoutes.push(...templateRoutes);
      }
    } catch (err) {
      console.error("[sitemap] Templates fetch exception:", err);
      // Continue with creations even if templates fetch fails
    }

    // ── Fetch Published Creations ───────────────────────────────────────
    // Only include non-deleted, non-expired creations
    try {
      const { data: creations, error: creationsError } = await admin
        .from("creations")
        .select("id, created_at, expires_at")
        .eq("is_deleted", false)
        .or(
          `expires_at.is.null,expires_at.gt.${NOW}` // Include if no expiry OR not yet expired
        )
        .order("created_at", { ascending: false })
        .limit(50000); // Sitemap limit is typically 50k URLs

      if (creationsError) {
        console.error("[sitemap] Creations fetch error:", creationsError);
      } else if (creations && Array.isArray(creations)) {
        const creationRoutes = creations.map((creation) => ({
          url: `${SITE_URL}/p/${creation.id}`,
          lastModified: creation.created_at || NOW,
          changeFrequency: "never" as const,
          priority: 0.6,
        }));
        dynamicRoutes.push(...creationRoutes);
      }
    } catch (err) {
      console.error("[sitemap] Creations fetch exception:", err);
      // Continue anyway — at least static routes will be in sitemap
    }
  } catch (err) {
    console.error("[sitemap] Supabase client initialization failed:", err);
    // Fallback: return only static routes
    console.warn("[sitemap] Returning static routes only due to Supabase error");
  }

  // ──────────────────────────────────────────────────────────────────────
  // Combine and Return
  // ──────────────────────────────────────────────────────────────────────

  const combinedSitemap: MetadataRoute.Sitemap = [
    ...staticRoutes,
    ...dynamicRoutes,
  ];

  return combinedSitemap;
}
