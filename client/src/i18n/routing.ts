import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, LOCALES } from "./locale";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * Hebrew URLs stay unprefixed (/gallery, /p/<id>) so every shared link and
 * indexed page keeps working. English lives under /en/*.
 */
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "as-needed",
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: ONE_YEAR_SECONDS,
    sameSite: "lax",
  },
});
