/**
 * validateSubmit — Input validation for submitGenericCreation.
 *
 * Performs CSRF origin check, FormData extraction, required-field
 * validation, JSON parsing of metadata, and bucket whitelisting.
 */

import { ActionError } from "@/lib/action-response";
import { logger } from "@/lib/utils/logger";
import { validateOrigin } from "@/lib/utils/csrf";

const ALLOWED_BUCKETS = ["image_steamy_Window"] as const;
export type AllowedBucket = (typeof ALLOWED_BUCKETS)[number];

function isAllowedBucket(name: string): name is AllowedBucket {
  return (ALLOWED_BUCKETS as readonly string[]).includes(name);
}

export interface ValidatedSubmitInput {
  templateSlug: string;
  parsedMetadata: Record<string, unknown>;
  quotaPreference: "free" | "pro";
  file: File | null;
  bucketName: AllowedBucket | null;
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
  const file = formData.get("file") as File | null;
  const rawBucketName = formData.get("bucketName") as string | null;

  if (!templateSlug?.trim()) {
    throw new ActionError("templateSlug is required", 422);
  }

  if (!metadataRaw) {
    throw new ActionError("metadata is required", 422);
  }

  // ── SEC-HIGH-4: Validate bucket name against whitelist ──────────────
  let bucketName: AllowedBucket | null = null;
  if (rawBucketName?.trim()) {
    if (!isAllowedBucket(rawBucketName)) {
      logger.warn("[submitGenericCreation] Rejected invalid bucket", {
        bucket: rawBucketName,
      });
      throw new ActionError("Invalid storage bucket", 400);
    }
    bucketName = rawBucketName;
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
    file,
    bucketName,
  };
}
