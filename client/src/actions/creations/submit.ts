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
 */

"use server";

import { protectedAction } from "@/lib/protectedAction";
import { ActionError, type ActionResult } from "@/lib/action-response";
import {
  fetchProfileForQuota,
  fetchPolicyLimit,
  checkPremiumAccess,
  checkQuotaLimit,
} from "./helpers/quotaCheck";
import { calculateExpiry } from "./helpers/expiryCalc";

export async function submitGenericCreation(
  formData: FormData,
): Promise<ActionResult<{ creationId: string }>> {
  return protectedAction(async (user, supabase) => {
    // ── Extract form fields ────────────────────────────────────────
    const templateSlug = formData.get("templateSlug") as string | null;
    const metadataRaw = formData.get("metadata") as string | null;
    const file = formData.get("file") as File | null;
    const bucketName = formData.get("bucketName") as string | null;

    if (!templateSlug?.trim()) {
      throw new ActionError("templateSlug is required", 422);
    }

    if (!metadataRaw) {
      throw new ActionError("metadata is required", 422);
    }

    // ── Parse metadata JSON ────────────────────────────────────────
    let parsedMetadata: Record<string, unknown>;
    try {
      parsedMetadata = JSON.parse(metadataRaw);
    } catch {
      throw new ActionError("metadata must be valid JSON", 422);
    }

    // ── Optional file upload ───────────────────────────────────────
    if (file && file.size > 0 && bucketName?.trim()) {
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
        console.error("[submitGenericCreation] Upload error", {
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

    checkPremiumAccess(template.is_premium, userTier);

    const policyLimit = await fetchPolicyLimit(supabase, userTier);
    checkQuotaLimit(profile, userTier, policyLimit);

    // ── Expiry & insert ────────────────────────────────────────────
    const isPaid = userTier === "premium";
    const expiresAt = calculateExpiry(
      template.expiration_policy as Record<string, unknown>,
      isPaid,
    );

    const { data: creation, error: insertErr } = await supabase
      .from("creations")
      .insert({
        user_id: user.id,
        template_id: template.id,
        metadata: parsedMetadata,
        is_paid: isPaid,
        expires_at: expiresAt,
      })
      .select("id")
      .single();

    if (insertErr || !creation) {
      throw new ActionError(
        `Failed to create card: ${insertErr?.message ?? "Unknown error"}`,
        500,
      );
    }

    return { creationId: creation.id as string };
  });
}
