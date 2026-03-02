/**
 * Metadata Validation Helpers
 *
 * Port of server/app/api/v1/endpoints/creations.py → validate_metadata()
 * and server/app/core/color_palette.py → ALLOWED_COLORS.
 */

import { ALLOWED_HEX_VALUES } from "@/constants/colors";

/** Maximum length for a URL stored in metadata (mirrors MAX_URL_LENGTH). */
const MAX_URL_LENGTH = 2048;

export interface FieldDef {
  key: string;
  type: string;
  required?: boolean;
}

/**
 * Validate metadata against the template's config_schema.
 * Returns a list of validation error strings (empty = valid).
 *
 * Exact port of the Python `validate_metadata` helper.
 */
export function validateMetadata(
  metadata: Record<string, unknown>,
  configSchema: Record<string, unknown>,
): string[] {
  const errors: string[] = [];
  const fields = (configSchema?.fields ?? []) as FieldDef[];

  for (const fieldDef of fields) {
    if (typeof fieldDef !== "object" || fieldDef === null) continue;

    const key = fieldDef.key ?? "";
    const fieldType = fieldDef.type ?? "";
    const value = metadata[key];

    // Required check
    if (
      fieldDef.required &&
      (value === null ||
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0))
    ) {
      errors.push(`Field '${key}' is required.`);
      continue;
    }

    if (value === null || value === undefined) continue;

    // Color validation
    if (fieldType === "color") {
      if (
        typeof value !== "string" ||
        !ALLOWED_HEX_VALUES.includes(value.toUpperCase())
      ) {
        errors.push(
          `Field '${key}' value '${String(value)}' is not in the allowed color palette.`,
        );
      }
    }

    // Image URL validation — reject base64 blobs
    if (fieldType === "image_url") {
      if (typeof value !== "string") {
        errors.push(`Field '${key}' must be a string URL.`);
      } else if (value.length > MAX_URL_LENGTH) {
        errors.push(
          `Field '${key}' value is too long (${value.length} chars). Max ${MAX_URL_LENGTH}. Do not embed base64 data.`,
        );
      } else if (value.startsWith("data:")) {
        errors.push(
          `Field '${key}' must be a URL, not an inline data URI.`,
        );
      }
    }
  }

  return errors;
}
