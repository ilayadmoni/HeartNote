import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/utils/logger";
import { LOCALES } from "@/i18n/locale";
import { SITE_URL, languageAlternates, localizedPath } from "@/lib/seo/metadata";

const NOW = new Date().toISOString();
type Entry = MetadataRoute.Sitemap[number];
type Frequency = NonNullable<Entry["changeFrequency"]>;

interface StaticRoute {
  path: string;
  changeFrequency: Frequency;
  priority: number;
}

const STATIC_ROUTES: StaticRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/gallery", changeFrequency: "daily", priority: 0.9 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.8 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/demo", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.5 },
  { path: "/accessibility", changeFrequency: "yearly", priority: 0.5 },
];

/** One sitemap entry per locale for a path, each carrying the hreflang set. */
function localizedEntries(
  path: string,
  changeFrequency: Frequency,
  priority: number,
  lastModified: string = NOW,
): Entry[] {
  const languages = languageAlternates(path);
  return LOCALES.map((locale) => ({
    url: `${SITE_URL}${localizedPath(locale, path)}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

/**
 * Sitemap: static marketing routes, active template editors and live
 * creations, emitted for Hebrew (unprefixed) and English (/en) with
 * hreflang alternates. DB failures degrade to the static set.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: Entry[] = STATIC_ROUTES.flatMap((r) =>
    localizedEntries(r.path, r.changeFrequency, r.priority),
  );

  try {
    const templates = await prisma.template.findMany({
      where: { isActive: true },
      select: { slug: true },
      orderBy: { slug: "asc" },
    });
    for (const template of templates) {
      entries.push(...localizedEntries(`/create/${template.slug}`, "weekly", 0.7));
    }
  } catch (err) {
    logger.error("[sitemap] Templates fetch exception", { error: err });
  }

  try {
    const creations = await prisma.creation.findMany({
      where: {
        isDeleted: false,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      select: { id: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 25000, // two locales per creation, under the 50k sitemap cap
    });
    for (const creation of creations) {
      entries.push(
        ...localizedEntries(`/p/${creation.id}`, "never", 0.6, creation.createdAt.toISOString()),
      );
    }
  } catch (err) {
    logger.error("[sitemap] Creations fetch exception", { error: err });
  }

  return entries;
}
