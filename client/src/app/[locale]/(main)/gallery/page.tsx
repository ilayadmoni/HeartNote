/**
 * Gallery Templates Page
 * Browse and select from available HeartNote templates
 */

import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { GalleryLoadingWrapper } from "@/components/galleryTemplate/GalleryLoadingWrapper";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/locale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({ locale: isLocale(locale) ? locale : DEFAULT_LOCALE, path: "/gallery", key: "gallery" });
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<JSX.Element> {
  const { locale } = await params;
  setRequestLocale(isLocale(locale) ? locale : DEFAULT_LOCALE);
  return <GalleryLoadingWrapper />;
}
