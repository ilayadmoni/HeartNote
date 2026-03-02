/**
 * createCreation — Zod-validated creation from template_id + metadata.
 *
 * Business logic:
 *  1. Zod-validate input
 *  2. Fetch template (config_schema, expiration_policy, is_premium)
 *  3. Validate metadata against config_schema
 *  4. Quota & premium guard (via helpers — fast-fail check only)
 *  5. Calculate expiry (via helper)
 *  6. Insert creation row
 *
 * Note: Quota decrement is handled by the DB trigger
 * `trg_handle_new_creation_quota` — no application-level decrement.
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import {
  CreateCreationRequestSchema,
  type CreateCreationInput,
  type CreateCreationResponse,
} from "@/lib/validations";
import { validateMetadata } from "@/lib/validations/metadata";
import {
  fetchProfileForQuota,
  fetchPolicyLimit,
  checkPremiumAccess,
  checkQuotaLimit,
} from "./helpers/quotaCheck";
import { calculateExpiry } from "./helpers/expiryCalc";

export async function createCreation(
  input: CreateCreationInput,
): Promise<
  { data: CreateCreationResponse } | { error: string; status: number }
> {
  try {
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
    const configSchema =
      (template.config_schema as Record<string, unknown>) ?? {};
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

    // ── Step 3-5: Profile, premium guard, quota ────────────────────
    const profileResult = await fetchProfileForQuota(supabase, user.id);
    if ("error" in profileResult) return profileResult;

    const profile = profileResult.data;
    const userTier = profile.subscription_tier ?? "free";

    const premiumErr = checkPremiumAccess(template.is_premium, userTier);
    if (premiumErr) return premiumErr;

    const policyLimit = await fetchPolicyLimit(supabase, userTier);
    const quotaErr = checkQuotaLimit(profile, userTier, policyLimit);
    if (quotaErr) return quotaErr;

    // ── Step 6: Calculate expiry & insert ──────────────────────────
    const isPaid = userTier === "premium";
    const expiresAt = calculateExpiry(
      template.expiration_policy as Record<string, unknown>,
      isPaid,
    );

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

    // Quota decrement handled by DB trigger `trg_handle_new_creation_quota`

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
