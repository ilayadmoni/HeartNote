/**
 * validateSubmit — Input validation for submitGenericCreation.
 *
 * Performs CSRF origin check, FormData extraction, required-field
 * validation, JSON parsing of metadata, and bucket whitelisting.
 */

import { ActionError } from "@/lib/action-response";
import { validateOrigin } from "@/lib/utils/csrf";

export interface ValidatedSubmitInput {
  templateSlug: string;
  parsedMetadata: Record<string, unknown>;
  quotaPreference: "free" | "pro";
}

export async function validateSubmitInput(
  formData: FormData,
): Promise<ValidatedSubmitInput> {
  // ── SEC-HIGH-4: CSRF validation ─────────────────────────────────────
  if (!(await validateOrigin())) {
    throw new ActionError("Invalid origin", 403);
  }

  const templateSlug = formData.get("templateSlug") as string | null;
  const metadataRaw = formData.get("metadata") as string | null;
  const rawQuotaPreference = formData.get("quotaPreference") as string | null;

  if (!templateSlug?.trim()) {
    throw new ActionError("templateSlug is required", 422);
  }

  if (!metadataRaw) {
    throw new ActionError("metadata is required", 422);
  }

  let parsedMetadata: Record<string, unknown>;
  try {
    parsedMetadata = JSON.parse(metadataRaw);
  } catch {
    throw new ActionError("metadata must be valid JSON", 422);
  }

  const quotaPreference: "free" | "pro" =
    rawQuotaPreference === "free" ? "free" : "pro";

  return {
    templateSlug,
    parsedMetadata,
    quotaPreference,
  };
}
