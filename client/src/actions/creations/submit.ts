/**
 * submitGenericCreation — FormData-based creation for ANY template.
 *
 * Accepts dynamic templateSlug, metadata JSON, and optional file upload.
 *
 * Flow:
 *  1. Authenticate user
 *  2. Parse metadata JSON
 *  3. If file + bucketName provided → upload, inject publicUrl into metadata
 *  4. Fetch template_id by slug
 *  5. Quota & premium guard (via helpers)
 *  6. Calculate expiry & insert creation (via helper)
 *  7. Decrement quota (via helper)
 *  8. Return { success, creationId }
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import {
  fetchProfileForQuota,
  checkPremiumAccess,
  checkQuotaLimit,
  decrementQuota,
} from "./helpers/quotaCheck";
import { calculateExpiry } from "./helpers/expiryCalc";

export async function submitGenericCreation(
  formData: FormData,
): Promise<
  { success: true; creationId: string } | { error: string; status: number }
> {
  try {
    const supabase = await createClient();

    // ── 1. Authenticate ────────────────────────────────────────────
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Unauthorized", status: 401 };
    }

    // ── Extract form fields ────────────────────────────────────────
    const templateSlug = formData.get("templateSlug") as string | null;
    const metadataRaw = formData.get("metadata") as string | null;
    const file = formData.get("file") as File | null;
    const bucketName = formData.get("bucketName") as string | null;

    if (!templateSlug?.trim()) {
      return { error: "templateSlug is required", status: 422 };
    }

    if (!metadataRaw) {
      return { error: "metadata is required", status: 422 };
    }

    // ── 2. Parse metadata JSON ─────────────────────────────────────
    let parsedMetadata: Record<string, unknown>;
    try {
      parsedMetadata = JSON.parse(metadataRaw);
    } catch {
      return { error: "metadata must be valid JSON", status: 422 };
    }

    // ── 3. Optional file upload ────────────────────────────────────
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
          fileType: file.type,
          fileSize: file.size,
          error: uploadError,
        });
        return {
          error: `Image upload failed: ${uploadError.message}`,
          status: 500,
        };
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(storagePath);

      parsedMetadata.background_image = publicUrl;
    }

    // ── 4. Fetch template by slug ──────────────────────────────────
    const { data: template, error: tmplErr } = await supabase
      .from("templates")
      .select("id, is_premium, expiration_policy")
      .eq("slug", templateSlug)
      .eq("is_active", true)
      .single();

    if (tmplErr || !template) {
      return { error: "Template not found", status: 404 };
    }

    // ── 5. Quota & premium guard ───────────────────────────────────
    const profileResult = await fetchProfileForQuota(supabase, user.id);
    if ("error" in profileResult) return profileResult;

    const profile = profileResult.data;
    const userTier = profile.subscription_tier ?? "free";

    const premiumErr = checkPremiumAccess(template.is_premium, userTier);
    if (premiumErr) return premiumErr;

    const quotaErr = checkQuotaLimit(profile, userTier);
    if (quotaErr) return quotaErr;

    // ── 6. Expiry & insert ─────────────────────────────────────────
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
      return {
        error: `Failed to create card: ${insertErr?.message ?? "Unknown error"}`,
        status: 500,
      };
    }

    // ── 7. Decrement quota ─────────────────────────────────────────
    await decrementQuota(supabase, user.id, profile, userTier);

    return { success: true, creationId: creation.id as string };
  } catch (e) {
    console.error("[submitGenericCreation] Unexpected error", e);
    return {
      error: `Failed to create card: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}
