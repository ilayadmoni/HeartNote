import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/locale";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { Home } from "@/components/home";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  return buildPageMetadata({ locale, path: "/", key: "home" });
}

export default async function HomePage({ params }: HomePageProps): Promise<JSX.Element> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  setRequestLocale(locale);
  return <Home />;
}
