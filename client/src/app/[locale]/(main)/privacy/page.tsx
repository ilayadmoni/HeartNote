/**
 * Privacy Page
 * Privacy policy page for HeartNote
 */

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Privacy } from "@/components/privacy";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/locale";

interface PrivacyPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({ locale, path: "/privacy", key: "privacy" });
}

export default async function PrivacyPage({ params }: PrivacyPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Privacy />;
}
