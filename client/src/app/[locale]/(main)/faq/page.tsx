/**
 * FAQ Page
 * Frequently asked questions page for HeartNote
 */

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { FAQ } from "@/components/faq";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/locale";

interface FaqPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: FaqPageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({ locale, path: "/faq", key: "faq" });
}

export default async function FAQPage({ params }: FaqPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FAQ />;
}
