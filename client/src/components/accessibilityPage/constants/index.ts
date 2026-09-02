/**
 * Accessibility Statement Page Constants
 * Copy lives in `legal.accessibilityStatement` (message namespace); this
 * file only holds non-translatable config: section order and the
 * last-updated date.
 */

export const ACCESSIBILITY_SECTION_IDS = ["1", "2", "3", "4", "5"] as const;

export type AccessibilitySectionId = (typeof ACCESSIBILITY_SECTION_IDS)[number];

/** Formatted per-locale via `useFormatter`/`getFormatter` where it's shown. */
export const LEGAL_LAST_UPDATED = new Date("2026-02-11T00:00:00Z");
