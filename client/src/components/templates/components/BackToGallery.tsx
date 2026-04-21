"use client";

/**
 * BackToGallery Component
 * Arrow button to navigate back to the gallery page
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

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
      className={`inline-flex items-center gap-1.5 self-start rounded-lg border border-coral-200 bg-coral-50/90 px-3 py-1.5 text-sm font-medium text-navy-700 shadow-sm backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-coral-300 hover:bg-coral-100 hover:text-coral-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 dark:border-navy-500 dark:bg-navy-800/80 dark:text-navy-100 dark:hover:border-coral-400 dark:hover:bg-navy-700 dark:hover:text-coral-200 dark:focus-visible:ring-coral-300 dark:focus-visible:ring-offset-navy-900 text-hebrew-body ${className}`}
      aria-label="חזרה לגלריה"
    >
      <ArrowRight size={16} />
      <span>חזרה לגלריה</span>
    </Link>
  );
}
