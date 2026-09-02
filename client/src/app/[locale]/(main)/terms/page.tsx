/**
 * Terms of Use Page
 * Terms of use page for HeartNote
 */

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Terms } from "@/components/terms";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/locale";

interface TermsPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({ locale, path: "/terms", key: "terms" });
}

export default async function TermsPage({ params }: TermsPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Terms />;
}
