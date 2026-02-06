/**
 * GalleryHeader Component
 * Hero section with title and subtitle for the gallery page
 */

import type { GalleryHeaderProps } from "../types";

export function GalleryHeader({
  title,
  subtitle,
  className = "",
}: GalleryHeaderProps) {
  return (
    <div className={`text-center ${className}`}>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2e3c52] dark:text-white mb-4 transition-colors duration-300 text-hebrew-heading">
        {title}
      </h1>
      <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300 text-hebrew-body">
        {subtitle}
      </p>
    </div>
  );
}
