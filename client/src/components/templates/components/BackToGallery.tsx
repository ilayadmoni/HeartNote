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
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md hover:text-[#d4826f] dark:hover:text-[#e8917a] transition-all duration-200 text-hebrew-body self-start ${className}`}
      aria-label="חזרה לגלריה"
    >
      <ArrowRight size={16} />
      <span>חזרה לגלריה</span>
    </Link>
  );
}
