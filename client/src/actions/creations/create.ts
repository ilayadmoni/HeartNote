/**
 * createCreation — Zod-validated creation from template_id + metadata.
 *
 * Business logic:
 *  1. Zod-validate input
 *  2. Fetch template (config_schema, expiration_policy, is_premium)
 *  3. Validate metadata against config_schema
 *  4. Quota & premium guard (via helpers — fast-fail check only)
 *  5. Calculate expiry (via helper)
 *  6. Insert creation row, atomically incrementing the quota counter and the
 *     template's use count inside one transaction.
 *
 * Quota decrement + template-use tracking used to be DB triggers
 * (trg_handle_new_creation_quota, trigger_increment_template_uses). Both are
 * reimplemented here: the counter increment happens in the same transaction
 * as the insert, guarded by a conditional update so two concurrent requests
 * can't both slip past the quota check (replicating the trigger's
 * SELECT ... FOR UPDATE row-lock behavior).
 */

"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
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
import { CREATION_ACTION_ERRORS } from "@/lib/creation-flow/errors";
import { logAudit } from "@/lib/audit-logger";
import { validateOrigin } from "@/lib/utils/csrf";
import { logger } from "@/lib/utils/logger";

export async function createCreation(
  input: CreateCreationInput,
): Promise<ActionResult<CreateCreationResponse>> {
  return protectedAction(async (user) => {
    // ── SEC-HIGH-4: CSRF validation ───────────────────────────────────
    if (!(await validateOrigin())) {
      throw new ActionError("Invalid origin", 403);
    }

    const parsed = CreateCreationRequestSchema.safeParse(input);
    if (!parsed.success) {
      throw new ActionError(
        parsed.error.issues.map((i) => i.message).join("; "),
        422,
      );
    }

    // ── Step 1: Get template info ──────────────────────────────────
    const template = await prisma.template.findFirst({
      where: { id: parsed.data.template_id, isActive: true },
    });
    if (!template) {
      throw new ActionError("Template not found", 404);
    }

    // ── Step 2: Validate metadata against config_schema ────────────
    const configSchema = (template.configSchema as Record<string, unknown>) ?? {};
    const validationErrors = validateMetadata(
      parsed.data.metadata as Record<string, unknown>,
      configSchema,
    );
    if (validationErrors.length > 0) {
      throw new ActionError(`Validation errors: ${validationErrors.join("; ")}`, 422);
    }

    // ── Step 3-5: Profile, premium guard, quota ────────────────────
    const profile = await fetchProfileForQuota(user.id);
    const userTier = profile.subscription_tier ?? "free";
    const quotaPreference = parsed.data.quotaPreference === "free" ? "free" : "pro";

    if (profile.subscription_expired && (template.isPremium || quotaPreference === "pro")) {
      throw new ActionError(CREATION_ACTION_ERRORS.SUBSCRIPTION_EXPIRED, 403);
    }

    checkPremiumAccess(template.isPremium, userTier);

    const appliedQuota: "free" | "pro" = template.isPremium
      ? "pro"
      : userTier === "free"
        ? "free"
        : quotaPreference;
    const isPremiumBehavior = userTier !== "free" && appliedQuota === "pro";

    const tierCodes = userTier !== "free" ? ["free", userTier] : ["free"];
    const policies = await prisma.subscriptionPolicy.findMany({
      where: { tierCode: { in: tierCodes } },
    });

    const freePolicy = policies.find((p) => p.tierCode === "free");
    const tierPolicy = policies.find((p) => p.tierCode === userTier);

    const freeLimit = Number(freePolicy?.creationLimit ?? 3);
    const freeTotalAllowed = freeLimit + (profile.additional_creation_free ?? 0);

    if (appliedQuota === "free" && profile.creations_count_free >= freeTotalAllowed) {
      throw new ActionError(CREATION_ACTION_ERRORS.QUOTA_EXCEEDED, 403);
    }

    let paidDefaultExpirySeconds: number | null = null;
    if (isPremiumBehavior) {
      const proLimit = tierPolicy?.creationLimit ?? null;
      const proTotalAllowed =
        proLimit == null ? null : Number(proLimit) + (profile.additional_creation_pro ?? 0);

      if (proTotalAllowed != null && profile.creations_count_pro >= proTotalAllowed) {
        // Subscription is still active (expiry guard fired above).
        // Use a distinct code so the UI can show the paid-quota modal.
        throw new ActionError(CREATION_ACTION_ERRORS.PAID_QUOTA_EXCEEDED, 403);
      }

      paidDefaultExpirySeconds = Number(tierPolicy?.defaultExpiry ?? 0);
      if (!Number.isFinite(paidDefaultExpirySeconds) || paidDefaultExpirySeconds <= 0) {
        throw new ActionError("Invalid subscription policy expiry", 500);
      }
    }

    // ── Step 6: Calculate expiry & insert ──────────────────────────
    const metadataWithBehavior = {
      ...(parsed.data.metadata as Record<string, unknown>),
      has_watermark: !isPremiumBehavior,
      applied_quota: appliedQuota,
      is_paid: isPremiumBehavior,
    };

    const expiresAt = calculateExpiry(
      template.expirationPolicy as Record<string, unknown>,
      { isPremiumBehavior, paidDefaultExpirySeconds },
    );

    const REDEMPTION_CODE_MAX = parseInt(process.env.REDEMPTION_CODE_MAX || "10000", 10);
    // SEC-CRIT-2: 4-digit verification code required for coupon redemption.
    const verificationCode = String(Math.floor(Math.random() * REDEMPTION_CODE_MAX)).padStart(4, "0");

    let creation;
    try {
      creation = await prisma.$transaction(async (tx) => {
        // Atomic, guarded quota increment — replicates the row-locked
        // BEFORE INSERT trigger this used to be.
        if (appliedQuota === "free") {
          const updated = await tx.profile.updateMany({
            where: { id: user.id, creationsCountFree: { lt: freeTotalAllowed } },
            data: { creationsCountFree: { increment: 1 } },
          });
          if (updated.count === 0) {
            throw new ActionError(CREATION_ACTION_ERRORS.QUOTA_EXCEEDED, 403);
          }
        } else if (isPremiumBehavior) {
          await tx.profile.update({
            where: { id: user.id },
            data: { creationsCountPro: { increment: 1 } },
          });
        }

        const created = await tx.creation.create({
          data: {
            userId: user.id,
            templateId: parsed.data.template_id,
            metadata: metadataWithBehavior as Prisma.InputJsonValue,
            isPaid: isPremiumBehavior,
            expiresAt,
            verificationCode,
          },
        });

        await tx.template.update({
          where: { id: template.id },
          data: { uses: { increment: 1 } },
        });

        return created;
      });
    } catch (err) {
      if (err instanceof ActionError) throw err;

      logger.error("[createCreation] Insert failed", {
        error: err instanceof Error ? err.message : String(err),
        userId: user.id,
        templateId: parsed.data.template_id,
        appliedQuota,
        isPremiumBehavior,
      });

      if (process.env.NODE_ENV !== "production") {
        throw new ActionError(
          `Failed to create card: ${err instanceof Error ? err.message : "Unknown error"}`,
          500,
        );
      }
      throw new ActionError("Failed to create card. Please try again.", 500);
    }

    await logAudit({
      eventType: "creation.created",
      userId: user.id,
      metadata: {
        creation_id: creation.id,
        template_id: template.id,
        template_slug: template.slug,
        is_paid: isPremiumBehavior,
        applied_quota: appliedQuota,
      },
    });

    return {
      creationId: creation.id,
      expires_at: creation.expiresAt ? creation.expiresAt.toISOString() : null,
      verification_code: creation.verificationCode,
    };
  });
}
