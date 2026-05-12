/**
 * persistCreation — DB persistence for submitGenericCreation.
 * Quota decrement is handled by trigger `trg_handle_new_creation_quota`.
 */

import type { User, SupabaseClient } from "@supabase/supabase-js";
import { ActionError } from "@/lib/action-response";
import { logger } from "@/lib/utils/logger";
import { logAudit } from "@/lib/audit-logger";
import { fetchProfileForQuota, checkPremiumAccess } from "./quotaCheck";
import { calculateExpiry } from "./expiryCalc";
import { CREATION_ACTION_ERRORS } from "@/lib/creation-flow/errors";
import type { ValidatedSubmitInput } from "./validateSubmit";

export interface PersistResult {
  creationId: string;
  verification_code: string;
}

function buildInsertErrorMessage(error: unknown): string {
  const e = (error ?? {}) as Record<string, unknown>;
  const t = (v: unknown): string => (typeof v === "string" ? v : "");
  const message = t(e.message), details = t(e.details), code = t(e.code);
  logger.error("[persistCreation] Insert failed", { message, details, code });
  if (process.env.NODE_ENV === "production") {
    return "Failed to create card. Please try again.";
  }
  const parts = [code && `code=${code}`, message && `message=${message}`, details && `details=${details}`]
    .filter(Boolean).join(" | ");
  return `Failed to create card: ${parts || "Unknown error"}`;
}

export async function persistCreation(
  user: User,
  supabase: SupabaseClient,
  input: ValidatedSubmitInput,
): Promise<PersistResult> {
  const { templateSlug, parsedMetadata, quotaPreference, file, bucketName } = input;

  if (file && file.size > 0 && bucketName) {
    const fileExt = file.type.split("/")[1] || "jpeg";
    const storagePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, file, { contentType: file.type, upsert: false });
    if (uploadError) {
      logger.error("[submitGenericCreation] Upload error", { bucketName, storagePath, error: uploadError });
      throw new ActionError(`Image upload failed: ${uploadError.message}`, 500);
    }
    const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
    parsedMetadata.background_image = publicUrl;
  }

  const { data: template, error: tmplErr } = await supabase
    .from("templates").select("id, is_premium, expiration_policy")
    .eq("slug", templateSlug).eq("is_active", true).single();
  if (tmplErr || !template) throw new ActionError("Template not found", 404);

  const profile = await fetchProfileForQuota(supabase, user.id);
  const userTier = profile.subscription_tier ?? "free";

  if (profile.subscription_expired && (template.is_premium || quotaPreference === "pro")) {
    throw new ActionError(CREATION_ACTION_ERRORS.SUBSCRIPTION_EXPIRED, 403);
  }
  checkPremiumAccess(template.is_premium, userTier);

  const appliedQuota: "free" | "pro" = template.is_premium
    ? "pro"
    : userTier === "free" ? "free" : quotaPreference;
  const isPremiumBehavior = userTier !== "free" && appliedQuota === "pro";

  const tierCodes = userTier !== "free" ? ["free", userTier] : ["free"];
  const { data: policies } = await supabase
    .from("subscription_policies")
    .select("tier_code, creation_limit, default_expiry")
    .in("tier_code", tierCodes);

  const freePolicy = policies?.find((p) => p.tier_code === "free");
  const tierPolicy = policies?.find((p) => p.tier_code === userTier);

  const freeLimit = Number(freePolicy?.creation_limit ?? 3);
  const freeTotalAllowed = freeLimit + (profile.additional_creation_free ?? 0);
  if (appliedQuota === "free" && profile.creations_count_free >= freeTotalAllowed) {
    throw new ActionError(CREATION_ACTION_ERRORS.QUOTA_EXCEEDED, 403);
  }

  let paidDefaultExpirySeconds: number | null = null;
  if (isPremiumBehavior) {
    const proLimit = tierPolicy?.creation_limit as number | null | undefined;
    const proTotalAllowed = proLimit == null
      ? null : Number(proLimit) + (profile.additional_creation_pro ?? 0);
    if (proTotalAllowed != null && profile.creations_count_pro >= proTotalAllowed) {
      throw new ActionError(CREATION_ACTION_ERRORS.QUOTA_EXCEEDED, 403);
    }
    paidDefaultExpirySeconds = Number(tierPolicy?.default_expiry ?? 0);
    if (!Number.isFinite(paidDefaultExpirySeconds) || paidDefaultExpirySeconds <= 0) {
      throw new ActionError("Invalid subscription policy expiry", 500);
    }
  }

  parsedMetadata.has_watermark = !isPremiumBehavior;
  parsedMetadata.applied_quota = appliedQuota;
  parsedMetadata.is_paid = isPremiumBehavior;

  const expiresAt = calculateExpiry(
    template.expiration_policy as Record<string, unknown>,
    { isPremiumBehavior, paidDefaultExpirySeconds },
  );

  const REDEMPTION_CODE_MAX = parseInt(process.env.REDEMPTION_CODE_MAX || "10000", 10);
  // SEC-CRIT-2: 4-digit verification code for coupon redemption.
  const verificationCode = String(Math.floor(Math.random() * REDEMPTION_CODE_MAX)).padStart(4, "0");

  const { data: creation, error: insertErr } = await supabase
    .from("creations")
    .insert({
      user_id: user.id, template_id: template.id, metadata: parsedMetadata,
      is_paid: isPremiumBehavior, expires_at: expiresAt, verification_code: verificationCode,
    })
    .select("id, verification_code").single();

  if (insertErr || !creation) {
    throw new ActionError(buildInsertErrorMessage(insertErr), 500);
  }

  await logAudit({
    eventType: "creation.created", userId: user.id,
    metadata: {
      creation_id: creation.id, template_id: template.id, template_slug: templateSlug,
      is_paid: isPremiumBehavior, applied_quota: appliedQuota,
    },
  });

  return {
    creationId: creation.id as string,
    verification_code: (creation.verification_code as string) ?? verificationCode,
  };
}
