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

import { protectedAction } from "@/lib/protectedAction";
import { ActionError, type ActionResult } from "@/lib/action-response";
import {
  CreateCreationRequestSchema,
  type CreateCreationInput,
  type CreateCreationResponse,
} from "@/lib/validations";
import { validateMetadata } from "@/lib/validations/metadata";
import {
  fetchProfileForQuota,
  checkPremiumAccess,
} from "./helpers/quotaCheck";
import { calculateExpiry } from "./helpers/expiryCalc";

export async function createCreation(
  input: CreateCreationInput,
): Promise<ActionResult<CreateCreationResponse>> {
  return protectedAction(async (user, supabase) => {
    const parsed = CreateCreationRequestSchema.safeParse(input);
    if (!parsed.success) {
      throw new ActionError(
        parsed.error.issues.map((i) => i.message).join("; "),
        422,
      );
    }

    // ── Step 1: Get template info ──────────────────────────────────
    const { data: template, error: tmplErr } = await supabase
      .from("templates")
      .select("id, slug, name, is_premium, config_schema, expiration_policy")
      .eq("id", parsed.data.template_id)
      .eq("is_active", true)
      .single();

    if (tmplErr || !template) {
      throw new ActionError("Template not found", 404);
    }

    // ── Step 2: Validate metadata against config_schema ────────────
    const configSchema =
      (template.config_schema as Record<string, unknown>) ?? {};
    const validationErrors = validateMetadata(
      parsed.data.metadata as Record<string, unknown>,
      configSchema,
    );
    if (validationErrors.length > 0) {
      throw new ActionError(
        `Validation errors: ${validationErrors.join("; ")}`,
        422,
      );
    }

    // ── Step 3-5: Profile, premium guard, quota ────────────────────
    const profile = await fetchProfileForQuota(supabase, user.id);
    const userTier = profile.subscription_tier ?? "free";

    checkPremiumAccess(template.is_premium, userTier);

    const quotaPreference = parsed.data.quotaPreference === "free" ? "free" : "pro";
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
      throw new ActionError("QUOTA_EXCEEDED", 403);
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
        throw new ActionError("QUOTA_EXCEEDED", 403);
      }

      paidDefaultExpirySeconds = Number(tierPolicy?.default_expiry ?? 0);
      if (!Number.isFinite(paidDefaultExpirySeconds) || paidDefaultExpirySeconds <= 0) {
        throw new ActionError("Invalid subscription policy expiry", 500);
      }
    }

    // ── Step 6: Calculate expiry & insert ──────────────────────────
    const metadataWithBehavior = {
      ...(parsed.data.metadata as Record<string, unknown>),
      has_watermark: !isPremiumBehavior,
      applied_quota: appliedQuota,
    };

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
        template_id: parsed.data.template_id,
        metadata: metadataWithBehavior,
        is_paid: isPremiumBehavior,
        has_watermark: !isPremiumBehavior,
        expires_at: expiresAt,
      })
      .select("id, expires_at")
      .single();

    if (insertErr || !creation) {
      throw new ActionError("Failed to create card", 500);
    }

    return {
      id: creation.id as string,
      expires_at: (creation.expires_at as string) ?? null,
    };
  });
}
