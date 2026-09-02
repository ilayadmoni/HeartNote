import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Frown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/locale";

export async function generateMetadata(): Promise<Metadata> {
  const rawLocale = await getLocale();
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  return buildPageMetadata({ locale, path: "/404", key: "notFound" });
}

export default async function NotFound(): Promise<JSX.Element> {
  const rawLocale = await getLocale();
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  setRequestLocale(locale);
  const t = await getTranslations("common.notFound");

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center gap-4 px-6 text-center bg-surface">
      <Frown aria-hidden="true" size={56} className="text-accent" />

      <h1 className="text-title-lg text-ink">{t("title")}</h1>

      <p className="text-body-sm text-ink-muted max-w-prose leading-relaxed">
        {t("description")}
      </p>

      <Link
        href="/"
        className="mt-2 px-6 py-3 rounded-pill bg-accent text-accent-ink font-bold text-body-sm shadow-glow-sm hover:bg-accent-hover hover:shadow-glow transition-all duration-base"
      >
        {t("cta")}
      </Link>
    </div>
  );
}
