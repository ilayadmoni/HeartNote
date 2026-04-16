/**
 * submitGenericCreation — FormData-based creation for ANY template.
 *
 * Accepts dynamic templateSlug, metadata JSON, and optional file upload.
 *
 * Flow:
 *  1. Authenticate user (via protectedAction wrapper)
 *  2. Parse metadata JSON
 *  3. If file + bucketName provided → upload, inject publicUrl into metadata
 *  4. Fetch template_id by slug
 *  5. Quota & premium guard (via helpers — fast-fail check only)
 *  6. Calculate expiry & insert creation
 *  7. Return { creationId }
 *
 * Note: Quota decrement is handled by the DB trigger
 * `trg_handle_new_creation_quota` — no application-level decrement.
 * 
 * SEC-HIGH-1: Uses logger for PII-safe logging.
 */

"use server";

import { protectedAction } from "@/lib/protectedAction";
import { ActionError } from "@/lib/action-response";
import {
  fetchProfileForQuota,
  checkPremiumAccess,
} from "./helpers/quotaCheck";
import { calculateExpiry } from "./helpers/expiryCalc";
import { logger } from "@/lib/utils/logger";
import {
  CREATION_ACTION_ERRORS,
  type CreationActionResult,
} from "@/lib/creation-flow/errors";

interface SupabaseInsertErrorLike {
  message?: unknown;
  details?: unknown;
  hint?: unknown;
  code?: unknown;
}

function normalizeInsertError(error: unknown): {
  message: string;
  details: string;
  hint: string;
  code: string;
} {
  const e = (error ?? {}) as SupabaseInsertErrorLike;
  const toText = (value: unknown): string =>
    typeof value === "string" ? value : "";

  return {
    message: toText(e.message),
    details: toText(e.details),
    hint: toText(e.hint),
    code: toText(e.code),
  };
}

/** Strictly allowed storage bucket names for file uploads. */
const ALLOWED_BUCKETS = ["image_steamy_Window"] as const;
type AllowedBucket = (typeof ALLOWED_BUCKETS)[number];

function isAllowedBucket(name: string): name is AllowedBucket {
  return (ALLOWED_BUCKETS as readonly string[]).includes(name);
}

export async function submitGenericCreation(
  formData: FormData,
): Promise<CreationActionResult> {
  return protectedAction(async (user, supabase) => {
    // ── Extract form fields ────────────────────────────────────────
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

    // ── SEC-HIGH-4: Validate bucket name against whitelist ─────────
    let bucketName: AllowedBucket | null = null;
    if (rawBucketName?.trim()) {
      if (!isAllowedBucket(rawBucketName)) {
        logger.warn("[submitGenericCreation] Rejected invalid bucket", { bucket: rawBucketName });
        throw new ActionError("Invalid storage bucket", 400);
      }
      bucketName = rawBucketName;
    }

    // ── Parse metadata JSON ────────────────────────────────────────
    let parsedMetadata: Record<string, unknown>;
    try {
      parsedMetadata = JSON.parse(metadataRaw);
    } catch {
      throw new ActionError("metadata must be valid JSON", 422);
    }

    // ── Optional file upload ───────────────────────────────────────
    if (file && file.size > 0 && bucketName) {
      const fileExt = file.type.split("/")[1] || "jpeg";
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const storagePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        logger.error("[submitGenericCreation] Upload error", {
          bucketName,
          storagePath,
          error: uploadError,
        });
        throw new ActionError(
          `Image upload failed: ${uploadError.message}`,
          500,
        );
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(storagePath);

      parsedMetadata.background_image = publicUrl;
    }

    // ── Fetch template by slug ─────────────────────────────────────
    const { data: template, error: tmplErr } = await supabase
      .from("templates")
      .select("id, is_premium, expiration_policy")
      .eq("slug", templateSlug)
      .eq("is_active", true)
      .single();

    if (tmplErr || !template) {
      throw new ActionError("Template not found", 404);
    }

    // ── Quota & premium guard ──────────────────────────────────────
    const profile = await fetchProfileForQuota(supabase, user.id);
    const userTier = profile.subscription_tier ?? "free";
    const quotaPreference = rawQuotaPreference === "free" ? "free" : "pro";

    if (profile.subscription_expired && (template.is_premium || quotaPreference === "pro")) {
      throw new ActionError(CREATION_ACTION_ERRORS.SUBSCRIPTION_EXPIRED, 403);
    }

    checkPremiumAccess(template.is_premium, userTier);

    const appliedQuota: "free" | "pro" = template.is_premium
      ? "pro"
      : userTier === "free"
        ? "free"
        : quotaPreference;
    const isPremiumBehavior = userTier !== "free" && appliedQuota === "pro";

    const { data: freePolicy } = await supabase
      .from("subscription_policies")
      .select("creation_limit")
      .eq("tier_code", "free")
      .single();

    const freeLimit = Number(freePolicy?.creation_limit ?? 3);
    const freeTotalAllowed = freeLimit + (profile.additional_creation_free ?? 0);

    if (appliedQuota === "free" && profile.creations_count_free >= freeTotalAllowed) {
      throw new ActionError(CREATION_ACTION_ERRORS.QUOTA_EXCEEDED, 403);
    }

    let paidDefaultExpirySeconds: number | null = null;
    if (isPremiumBehavior) {
      const { data: tierPolicy } = await supabase
        .from("subscription_policies")
        .select("creation_limit, default_expiry")
        .eq("tier_code", userTier)
        .single();

      const proLimit = tierPolicy?.creation_limit as number | null | undefined;
      const proTotalAllowed =
        proLimit == null ? null : Number(proLimit) + (profile.additional_creation_pro ?? 0);

      if (
        proTotalAllowed != null &&
        profile.creations_count_pro >= proTotalAllowed
      ) {
        throw new ActionError(CREATION_ACTION_ERRORS.QUOTA_EXCEEDED, 403);
      }

      paidDefaultExpirySeconds = Number(tierPolicy?.default_expiry ?? 0);
      if (!Number.isFinite(paidDefaultExpirySeconds) || paidDefaultExpirySeconds <= 0) {
        throw new ActionError("Invalid subscription policy expiry", 500);
      }
    }

    // ── Expiry & insert ────────────────────────────────────────────
    parsedMetadata.has_watermark = !isPremiumBehavior;
    parsedMetadata.applied_quota = appliedQuota;
    parsedMetadata.is_paid = isPremiumBehavior;

    const expiresAt = calculateExpiry(
      template.expiration_policy as Record<string, unknown>,
      {
        isPremiumBehavior,
        paidDefaultExpirySeconds,
      },
    );

    const { data: creation, error: insertErr } = await supabase
      .from("creations")
      .insert({
        user_id: user.id,
        template_id: template.id,
        metadata: parsedMetadata,
        is_paid: isPremiumBehavior,
        expires_at: expiresAt,
      })
      .select("id")
      .single();

    if (insertErr || !creation) {
      const insertInfo = normalizeInsertError(insertErr);

      // Keep explicit logs while debugging quota trigger failures.
      console.log("[submitGenericCreation] insert error.message:", insertInfo.message);
      console.log("[submitGenericCreation] insert error.details:", insertInfo.details);
      throw new ActionError(
        process.env.NODE_ENV !== "production"
          ? `Failed to create card: ${[
              insertInfo.code && `code=${insertInfo.code}`,
              insertInfo.message && `message=${insertInfo.message}`,
              insertInfo.details && `details=${insertInfo.details}`,
            ]
              .filter(Boolean)
              .join(" | ") || "Unknown error"}`
          : "Failed to create card. Please try again.",
        500,
      );
    }

    return { creationId: creation.id as string };
  });
}
