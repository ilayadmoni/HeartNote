import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import type { Locale } from "./locale";

const NAMESPACES = [
  "common",
  "nav",
  "footer",
  "home",
  "gallery",
  "pricing",
  "profile",
  "editor",
  "auth",
  "share",
  "legal",
  "faq",
  "contact",
  "demo",
  "templates",
  "errors",
  "meta",
  "accessibility",
] as const;

type Namespace = (typeof NAMESPACES)[number];
type Messages = Record<Namespace, Record<string, unknown>>;

async function loadMessages(locale: Locale): Promise<Messages> {
  const entries = await Promise.all(
    NAMESPACES.map(async (ns) => {
      const mod = (await import(`../messages/${locale}/${ns}.json`)) as {
        default: Record<string, unknown>;
      };
      return [ns, mod.default] as const;
    }),
  );
  // Every namespace above is imported, so the object is fully populated.
  return Object.fromEntries(entries) as Messages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
    timeZone: "Asia/Jerusalem",
  };
});
