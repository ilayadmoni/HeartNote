import "server-only";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/locale";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/locale";

/** Translator bound to the request locale, for use inside server actions. */
export async function getActionT(
  namespace: "errors" | "auth" | "editor" | "contact" | "profile" | "share",
): Promise<Awaited<ReturnType<typeof getTranslations>>> {
  return getTranslations(namespace);
}

export async function getRequestLocale(): Promise<Locale> {
  const locale = await getLocale();
  return isLocale(locale) ? locale : DEFAULT_LOCALE;
}
