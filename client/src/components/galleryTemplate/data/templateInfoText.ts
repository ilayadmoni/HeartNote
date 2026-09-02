import { TEMPLATE_KEY } from "./templateKeys";

/**
 * Message key for the "how it works" copy shown in the template info modal.
 * Returns undefined for slugs without a catalog entry (info button is hidden).
 */
export function infoKeyFor(templateId: string): string | undefined {
  const key = TEMPLATE_KEY[templateId];
  return key ? `templates.${key}.info` : undefined;
}
