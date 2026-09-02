"use client";

/**
 * BackToGallery Component
 * Arrow button to navigate back to the gallery page
 */

import { Link, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";

interface BackToGalleryProps {
  className?: string;
}

export function BackToGallery({ className = "" }: BackToGalleryProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("templates");

  // Hide on published public links (/p/[slug])
  if (pathname?.startsWith("/p/")) return null;

  return (
    <Link
      href="/gallery"
      className={`inline-flex items-center gap-1.5 self-start bg-transparent text-ink-muted hover:text-ink font-normal text-[15px] px-1.5 py-[11px] border-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded ${className}`}
      aria-label={t("common.backToGallery")}
    >
      <ChevronRight size={14} strokeWidth={2} className={locale === "he" ? "" : "-scale-x-100"} />
      <span>{t("common.backToGallery")}</span>
    </Link>
  );
}
