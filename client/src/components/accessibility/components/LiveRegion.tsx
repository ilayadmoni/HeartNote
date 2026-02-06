"use client";

/**
 * LiveRegion Component
 * Announces dynamic content changes to screen readers
 */

import type { LiveRegionProps } from "../types";

export function LiveRegion({
  children,
  politeness = "polite",
  atomic = true,
}: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      className="sr-only"
    >
      {children}
    </div>
  );
}
