"use client";

/**
 * BackToGallery Component
 * Arrow button to navigate back to the gallery page
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface BackToGalleryProps {
  className?: string;
}

export function BackToGallery({ className = "" }: BackToGalleryProps) {
  const pathname = usePathname();

  // Hide on published public links (/p/[slug])
  if (pathname?.startsWith("/p/")) return null;

  return (
    <Link
      href="/gallery"
      className={`inline-flex items-center gap-1.5 self-start bg-transparent text-[#9a6a52] hover:text-[#4a2e1e] font-normal text-[15px] text-hebrew-body px-1.5 py-[11px] border-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 rounded dark:text-navy-100 dark:hover:text-coral-200 ${className}`}
      aria-label="חזרה לגלריה"
    >
      <ChevronRight size={14} strokeWidth={2} />
      <span>חזרה לגלריה</span>
    </Link>
  );
}
