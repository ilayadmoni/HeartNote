export type Locale = "he" | "en";

export interface RouteSpec {
  name: string;
  path: string;
  /** Route exposes hreflang alternates (public, indexable). */
  seo: boolean;
  /** Assert no Hebrew leaks into chrome when locale is English. */
  checkUntranslated: boolean;
}

export const ROUTES: RouteSpec[] = [
  { name: "home", path: "/", seo: true, checkUntranslated: true },
  { name: "gallery", path: "/gallery", seo: true, checkUntranslated: true },
  { name: "pricing", path: "/pricing", seo: true, checkUntranslated: true },
  { name: "faq", path: "/faq", seo: true, checkUntranslated: true },
  { name: "contact", path: "/contact", seo: true, checkUntranslated: true },
  { name: "demo", path: "/demo", seo: true, checkUntranslated: true },
  { name: "create-scratch-card", path: "/create/scratch-card", seo: true, checkUntranslated: true },
  { name: "not-found", path: "/this-page-does-not-exist", seo: false, checkUntranslated: true },
];

export const HEBREW = /[֐-׿]/g;
export const EM_DASH = "—";

export function withLocale(locale: Locale, path: string): string {
  if (locale === "he") return path;
  return path === "/" ? "/en" : `/en${path}`;
}

export function shotPath(project: string, locale: Locale, name: string): string {
  return `e2e/screenshots/${project}/${locale}/${name}.png`;
}
