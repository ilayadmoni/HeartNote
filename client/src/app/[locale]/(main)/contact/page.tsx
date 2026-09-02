/**
 * Contact Page
 * Contact form page for HeartNote
 */

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Contact } from "@/components/contact";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/locale";

interface ContactPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({ locale, path: "/contact", key: "contact" });
}

export default async function ContactPage({ params }: ContactPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Contact />;
}
