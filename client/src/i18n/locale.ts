/**
 * Locale primitives shared by routing, layout and server code.
 * Hebrew is the product's home language; English is the second locale.
 */

export const LOCALES = ["he", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "he";

export type TextDirection = "rtl" | "ltr";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function dirFor(locale: Locale): TextDirection {
  return locale === "he" ? "rtl" : "ltr";
}

/** BCP-47 tags used for <html lang>, OpenGraph and hreflang. */
export const LOCALE_TAGS: Record<Locale, string> = {
  he: "he-IL",
  en: "en",
};

export const OG_LOCALES: Record<Locale, string> = {
  he: "he_IL",
  en: "en_US",
};
