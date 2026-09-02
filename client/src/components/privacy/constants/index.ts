/**
 * Privacy Policy Page Constants
 * Copy lives in `legal.privacy` (message namespace); this file only holds
 * non-translatable config: section order and the last-updated date.
 */

export const PRIVACY_SECTION_IDS = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14",
] as const;

export type PrivacySectionId = (typeof PRIVACY_SECTION_IDS)[number];

/** Formatted per-locale via `useFormatter`/`getFormatter` where it's shown. */
export const LEGAL_LAST_UPDATED = new Date("2026-02-11T00:00:00Z");
