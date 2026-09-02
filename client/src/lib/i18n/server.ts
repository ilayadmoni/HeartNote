import "server-only";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/locale";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/locale";

export type MessageNamespace =
  | "common" | "nav" | "footer" | "home" | "gallery" | "pricing" | "profile"
  | "editor" | "auth" | "share" | "legal" | "faq" | "contact" | "demo"
  | "templates" | "errors" | "meta" | "accessibility";

/** Translator bound to the request locale, for use inside server actions. */
export async function getActionT(
  namespace: MessageNamespace,
): Promise<Awaited<ReturnType<typeof getTranslations>>> {
  return getTranslations(namespace);
}

export async function getRequestLocale(): Promise<Locale> {
  const locale = await getLocale();
  return isLocale(locale) ? locale : DEFAULT_LOCALE;
}
