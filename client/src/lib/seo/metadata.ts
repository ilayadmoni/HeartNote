import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LOCALES, LOCALE_TAGS, OG_LOCALES, type Locale } from "@/i18n/locale";

export const SITE_URL = "https://www.heartnote.co.il";
const OG_IMAGE = "/assets/images/full_logo.png";
const ICON = "/assets/images/logo_heartnote.png";

/** Absolute path for a locale (Hebrew unprefixed, English under /en). */
export function localizedPath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path;
  if (locale === "he") return clean || "/";
  return `/en${clean}`;
}

/** hreflang map for a path, including x-default pointing at Hebrew. */
export function languageAlternates(path: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const locale of LOCALES) {
    map[LOCALE_TAGS[locale]] = `${SITE_URL}${localizedPath(locale, path)}`;
  }
  map["x-default"] = `${SITE_URL}${localizedPath("he", path)}`;
  return map;
}

interface PageMetaInput {
  locale: Locale;
  path: string;
  /** Key inside the `meta` namespace, e.g. "home" reads meta.home.title */
  key: string;
}

/**
 * Localized metadata (title, description, canonical, hreflang, OG, Twitter)
 * sourced from the `meta` message namespace.
 */
export async function buildPageMetadata({ locale, path, key }: PageMetaInput): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t(`${key}.title`);
  const description = t(`${key}.description`);
  const canonical = `${SITE_URL}${localizedPath(locale, path)}`;

  return {
    title,
    description,
    alternates: { canonical, languages: languageAlternates(path) },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "HeartNote",
      locale: OG_LOCALES[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
      type: "website",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: title, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
      creator: "@HeartNote",
    },
  };
}

/** Root-level metadata shared by every page (icons, keywords, base URL). */
export async function buildRootMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const page = await buildPageMetadata({ locale, path: "/", key: "home" });
  return {
    ...page,
    metadataBase: new URL(SITE_URL),
    applicationName: "HeartNote",
    keywords: t("keywords")
      .split(",")
      .map((k) => k.trim()),
    authors: [{ name: "HeartNote", url: SITE_URL }],
    creator: "HeartNote",
    icons: { icon: ICON, apple: ICON, shortcut: ICON },
  };
}
