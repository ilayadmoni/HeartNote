/**
 * Accessibility Page
 * Accessibility statement for HeartNote
 */

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Accessibility } from "@/components/accessibilityPage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/locale";

interface AccessibilityPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: AccessibilityPageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({ locale, path: "/accessibility", key: "accessibility" });
}

export default async function AccessibilityPage({ params }: AccessibilityPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Accessibility />;
}
