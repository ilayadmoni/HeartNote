/**
 * Creations Server Actions
 *
 * Port of:
 *   server/app/api/v1/endpoints/creations.py
 *
 * DB columns (creations table – 005_destructive_reset.sql):
 *   id, user_id, template_id, metadata, is_paid, expires_at, is_deleted, created_at
 *
 * DB columns (profiles table – used for quota checks):
 *   subscription_tier, creations_count, creations_left_free, creations_left_pro
 *
 * DB columns (templates table – used for config_schema & expiration_policy):
 *   id, slug, name, is_premium, config_schema, is_active, expiration_policy
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import {
  CreateCreationRequestSchema,
  type CreateCreationInput,
  type CreateCreationResponse,
  type CreationListItem,
  type CreationDetail,
} from "@/lib/validations";
import { validateMetadata } from "@/lib/validations/metadata";

// ---------------------------------------------------------------------------
// CREATE
// ---------------------------------------------------------------------------

/**
 * POST /creations → createCreation(input)
 *
 * Business logic ported from Python endpoint step-by-step:
 *  1. Fetch template (config_schema, expiration_policy, is_premium)
 *  2. Validate metadata against config_schema
 *  3. Fetch user profile for quota check
 *  4. Premium template guard
 *  5. creations_left quota check
 *  6. Calculate expires_at from template expiration_policy
 *  7. Insert creation
 *  8. Decrement creations_left / increment creations_count
 */
export async function createCreation(
  input: CreateCreationInput,
): Promise<
  { data: CreateCreationResponse } | { error: string; status: number }
> {
  try {
    // Zod validation (mirrors Pydantic CreateCreationRequest)
    const parsed = CreateCreationRequestSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error: parsed.error.issues.map((i) => i.message).join("; "),
        status: 422,
      };
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Unauthorized", status: 401 };
    }

    // ── Step 1: Get template info ──────────────────────────────────
    const { data: template, error: tmplErr } = await supabase
      .from("templates")
      .select("id, slug, name, is_premium, config_schema, expiration_policy")
      .eq("id", parsed.data.template_id)
      .eq("is_active", true)
      .single();

    if (tmplErr || !template) {
      return { error: "Template not found", status: 404 };
    }

    // ── Step 2: Validate metadata against config_schema ────────────
    const configSchema = (template.config_schema as Record<string, unknown>) ?? {};
    const validationErrors = validateMetadata(
      parsed.data.metadata as Record<string, unknown>,
      configSchema,
    );
    if (validationErrors.length > 0) {
      return {
        error: `Validation errors: ${validationErrors.join("; ")}`,
        status: 422,
      };
    }

    // ── Step 3: Get user profile to check quota ────────────────────
    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select(
        "subscription_tier, creations_count, creations_left_free, creations_left_pro",
      )
      .eq("id", user.id)
      .single();

    if (profErr || !profile) {
      return {
        error: "Profile not found. Please complete registration.",
        status: 404,
      };
    }

    const userTier: string = profile.subscription_tier ?? "free";

    // ── Step 4: Premium template check ─────────────────────────────
    if (template.is_premium && userTier === "free") {
      return { error: "TEMPLATE_NOT_ALLOWED", status: 402 };
    }

    // ── Step 5: Check creations_left quota ─────────────────────────
    if (userTier === "free") {
      const creationsLeft: number = profile.creations_left_free ?? 0;
      if (creationsLeft <= 0) {
        return { error: "QUOTA_EXCEEDED", status: 403 };
      }
    } else if (userTier === "premium") {
      const creationsLeft: number | null = profile.creations_left_pro;
      // NULL means unlimited for premium
      if (creationsLeft !== null && creationsLeft <= 0) {
        return { error: "QUOTA_EXCEEDED", status: 403 };
      }
    }

    // ── Step 6: Calculate expiry ───────────────────────────────────
    const isPaid = userTier === "premium";
    const expirationPolicy =
      (template.expiration_policy as Record<string, unknown>) ?? {};

    const expiryDays = isPaid
      ? Number(expirationPolicy.paid_days ?? 14)
      : Number(expirationPolicy.free_days ?? 1);

    const expiresAt = new Date(
      Date.now() + expiryDays * 24 * 60 * 60 * 1000,
    ).toISOString();

    // ── Step 7: Insert creation ────────────────────────────────────
    const { data: creation, error: insertErr } = await supabase
      .from("creations")
      .insert({
        user_id: user.id,
        template_id: parsed.data.template_id,
        metadata: parsed.data.metadata,
        is_paid: isPaid,
        expires_at: expiresAt,
      })
      .select("id, expires_at")
      .single();

    if (insertErr || !creation) {
      return { error: "Failed to create card", status: 500 };
    }

    // ── Step 8: Decrement creations_left & increment count ─────────
    const updateDict: Record<string, number> = {
      creations_count: (profile.creations_count ?? 0) + 1,
    };

    if (userTier === "free") {
      updateDict.creations_left_free = Math.max(
        (profile.creations_left_free ?? 0) - 1,
        0,
      );
    } else if (
      userTier === "premium" &&
      profile.creations_left_pro !== null
    ) {
      updateDict.creations_left_pro = Math.max(
        (profile.creations_left_pro ?? 0) - 1,
        0,
      );
    }

    await supabase
      .from("profiles")
      .update(updateDict)
      .eq("id", user.id);

    return {
      data: {
        id: creation.id as string,
        expires_at: (creation.expires_at as string) ?? null,
      },
    };
  } catch (e) {
    return {
      error: `Failed to create card: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}

// ---------------------------------------------------------------------------
// LIST (authenticated)
// ---------------------------------------------------------------------------

/**
 * GET /creations/my → getMyCreations()
 *
 * Returns current user's non-deleted creations with joined template info.
 * RLS enforces user_id ownership.
 */
export async function getMyCreations(): Promise<
  { data: CreationListItem[] } | { error: string; status: number }
> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Unauthorized", status: 401 };
    }

    const { data, error } = await supabase
      .from("creations")
      .select(
        "id, is_paid, expires_at, is_deleted, created_at, templates!inner(slug, name)",
      )
      .eq("user_id", user.id)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (error) {
      return { error: error.message, status: 500 };
    }

    const items: CreationListItem[] = (data ?? []).map((c) => {
      const tmpl = (c.templates as unknown as Record<string, string>) ?? {};
      return {
        id: c.id as string,
        template_slug: tmpl.slug ?? "",
        template_name: tmpl.name ?? "כרטיס",
        is_paid: (c.is_paid as boolean) ?? null,
        expires_at: (c.expires_at as string) ?? null,
        is_deleted: (c.is_deleted as boolean) ?? false,
        created_at: c.created_at as string,
      };
    });

    return { data: items };
  } catch (e) {
    return {
      error: `Failed to fetch creations: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}

// ---------------------------------------------------------------------------
// GET (public – shared links)
// ---------------------------------------------------------------------------

/**
 * GET /creations/:id → getCreation(creationId)
 *
 * Public endpoint for shared links. Checks is_deleted and expiry.
 * The anon-key RLS policy allows SELECT on non-deleted creations.
 */
export async function getCreation(
  creationId: string,
): Promise<{ data: CreationDetail } | { error: string; status: number }> {
  try {
    const supabase = await createClient();

    const { data: c, error } = await supabase
      .from("creations")
      .select(
        "id, metadata, is_paid, expires_at, is_deleted, created_at, templates!inner(slug, name)",
      )
      .eq("id", creationId)
      .single();

    if (error || !c) {
      return { error: "Creation not found", status: 404 };
    }

    // Deleted check (mirrors Python logic)
    if (c.is_deleted) {
      return { error: "This creation has been deleted", status: 410 };
    }

    // Expiry check (mirrors Python logic)
    if (c.expires_at) {
      try {
        const expStr = String(c.expires_at);
        const expDt = new Date(
          expStr.includes("Z")
            ? expStr
            : expStr.replace("+00:00", "Z"),
        );
        if (expDt < new Date()) {
          return { error: "This creation has expired", status: 410 };
        }
      } catch {
        // Ignore parse errors — same as Python
      }
    }

    const tmpl = (c.templates as unknown as Record<string, string>) ?? {};

    return {
      data: {
        id: c.id as string,
        template_slug: tmpl.slug ?? "",
        template_name: tmpl.name ?? "כרטיס",
        metadata: (c.metadata as Record<string, unknown>) ?? {},
        is_paid: (c.is_paid as boolean) ?? null,
        expires_at: (c.expires_at as string) ?? null,
        created_at: c.created_at as string,
      },
    };
  } catch (e) {
    return {
      error: `Failed to fetch creation: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}

// ---------------------------------------------------------------------------
// SOFT DELETE
// ---------------------------------------------------------------------------

/**
 * DELETE /creations/:id → deleteCreation(creationId)
 *
 * Soft-deletes a creation (sets is_deleted = true).
 * RLS enforces that only the owner can modify.
 */
export async function deleteCreation(
  creationId: string,
): Promise<{ success: true } | { error: string; status: number }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Unauthorized", status: 401 };
    }

    // Verify ownership
    const { data, error: findErr } = await supabase
      .from("creations")
      .select("id")
      .eq("id", creationId)
      .eq("user_id", user.id);

    if (findErr || !data?.length) {
      return { error: "Creation not found", status: 404 };
    }

    await supabase
      .from("creations")
      .update({ is_deleted: true })
      .eq("id", creationId);

    return { success: true };
  } catch (e) {
    return {
      error: `Failed to delete creation: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}

// ---------------------------------------------------------------------------
// REDEEM COUPON (LoveCoupons template)
// ---------------------------------------------------------------------------

/**
 * Marks a single coupon as redeemed inside the creation's metadata JSONB.
 * No auth required — the viewer (public link recipient) redeems coupons.
 *
 * metadata.coupons[] is an array of { id, title, ..., isRedeemed, redeemedAt }.
 * We find the matching coupon by `couponId`, flip `isRedeemed` to true,
 * and set `redeemedAt` to the current ISO timestamp.
 */
export async function redeemCoupon(
  creationId: string,
  couponId: string,
): Promise<{ success: true } | { error: string; status: number }> {
  try {
    const supabase = await createClient();

    // Fetch the creation's metadata
    const { data, error: fetchErr } = await supabase
      .from("creations")
      .select("metadata")
      .eq("id", creationId)
      .eq("is_deleted", false)
      .single();

    if (fetchErr || !data) {
      return { error: "Creation not found", status: 404 };
    }

    const metadata = (data.metadata ?? {}) as Record<string, unknown>;
    const coupons = Array.isArray(metadata.coupons) ? metadata.coupons : [];

    // Find and mark the coupon
    let found = false;
    const updatedCoupons = coupons.map((c: Record<string, unknown>) => {
      if (c.id === couponId) {
        found = true;
        return { ...c, isRedeemed: true, redeemedAt: new Date().toISOString() };
      }
      return c;
    });

    if (!found) {
      return { error: "Coupon not found", status: 404 };
    }

    // Persist back
    const { error: updateErr } = await supabase
      .from("creations")
      .update({ metadata: { ...metadata, coupons: updatedCoupons } })
      .eq("id", creationId);

    if (updateErr) {
      return {
        error: `Failed to redeem coupon: ${updateErr.message}`,
        status: 500,
      };
    }

    return { success: true };
  } catch (e) {
    return {
      error: `Failed to redeem coupon: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}

// ---------------------------------------------------------------------------
// GENERIC CREATION (file upload + insert for ANY template)
// ---------------------------------------------------------------------------

/**
 * submitGenericCreation(formData)
 *
 * Generic server action for creating a card from ANY template.
 * Accepts dynamic templateSlug, metadata JSON, and optional file + bucket.
 *
 * FormData keys:
 *   - templateSlug  (string, required)
 *   - metadata      (JSON string, required)
 *   - file          (File, optional)  — image or asset to upload
 *   - bucketName    (string, optional) — Supabase Storage bucket name
 *
 * Flow:
 *  1. Authenticate user
 *  2. Parse metadata JSON
 *  3. If file + bucketName provided → upload, inject publicUrl into metadata
 *  4. Fetch template_id by slug
 *  5. Quota & premium guard
 *  6. Insert creation row
 *  7. Decrement quota
 *  8. Return { success, creationId }
 */
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

      // Inject the public URL into metadata
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
    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select(
        "subscription_tier, creations_count, creations_left_free, creations_left_pro",
      )
      .eq("id", user.id)
      .single();

    if (profErr || !profile) {
      return {
        error: "Profile not found. Please complete registration.",
        status: 404,
      };
    }

    const userTier: string = profile.subscription_tier ?? "free";

    if (template.is_premium && userTier === "free") {
      return { error: "TEMPLATE_NOT_ALLOWED", status: 402 };
    }

    if (userTier === "free") {
      const creationsLeft: number = profile.creations_left_free ?? 0;
      if (creationsLeft <= 0) {
        return { error: "QUOTA_EXCEEDED", status: 403 };
      }
    } else if (userTier === "premium") {
      const creationsLeft: number | null = profile.creations_left_pro;
      if (creationsLeft !== null && creationsLeft <= 0) {
        return { error: "QUOTA_EXCEEDED", status: 403 };
      }
    }

    // ── 6. Expiry calculation ──────────────────────────────────────
    const isPaid = userTier === "premium";
    const expirationPolicy =
      (template.expiration_policy as Record<string, unknown>) ?? {};
    const expiryDays = isPaid
      ? Number(expirationPolicy.paid_days ?? 14)
      : Number(expirationPolicy.free_days ?? 1);
    const expiresAt = new Date(
      Date.now() + expiryDays * 24 * 60 * 60 * 1000,
    ).toISOString();

    // ── 7. Insert creation ─────────────────────────────────────────
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

    // ── 8. Decrement quota & increment count ───────────────────────
    const updateDict: Record<string, number> = {
      creations_count: (profile.creations_count ?? 0) + 1,
    };

    if (userTier === "free") {
      updateDict.creations_left_free = Math.max(
        (profile.creations_left_free ?? 0) - 1,
        0,
      );
    } else if (
      userTier === "premium" &&
      profile.creations_left_pro !== null
    ) {
      updateDict.creations_left_pro = Math.max(
        (profile.creations_left_pro ?? 0) - 1,
        0,
      );
    }

    await supabase.from("profiles").update(updateDict).eq("id", user.id);

    // ── 9. Return success ──────────────────────────────────────────
    return { success: true, creationId: creation.id as string };
  } catch (e) {
    console.error("[submitGenericCreation] Unexpected error", e);
    return {
      error: `Failed to create card: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}
