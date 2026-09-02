import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/locale";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { DemoTourClient } from "@/components/demo";

interface DemoPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: DemoPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  return buildPageMetadata({ locale, path: "/demo", key: "demo" });
}

export default async function DemoPage({ params }: DemoPageProps): Promise<JSX.Element> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  setRequestLocale(locale);
  return <DemoTourClient />;
}
