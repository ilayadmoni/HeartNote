/**
 * Locale-aware weekday/month labels for BrandCalendar, derived from Intl
 * so the picker reads correctly in both Hebrew and English.
 */

import type { Locale } from "@/i18n/locale";

export const LOCALE_TAG: Record<Locale, string> = { he: "he-IL", en: "en-US" };

/** Localized weekday initials (Sun..Sat) for the given app locale. */
export function getLocalizedDays(locale: Locale): string[] {
  const fmt = new Intl.DateTimeFormat(LOCALE_TAG[locale], { weekday: "narrow" });
  // 2023-01-01 was a Sunday — start there so index 0 = Sunday.
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2023, 0, 1 + i)));
}

/** Localized full month names (Jan..Dec) for the given app locale. */
export function getLocalizedMonths(locale: Locale): string[] {
  const fmt = new Intl.DateTimeFormat(LOCALE_TAG[locale], { month: "long" });
  return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(2023, i, 1)));
}

/** @deprecated kept for any lingering direct imports — prefer getLocalizedDays */
export const DAYS_HE = getLocalizedDays("he");
/** @deprecated kept for any lingering direct imports — prefer getLocalizedMonths */
export const MONTHS_HE = getLocalizedMonths("he");
