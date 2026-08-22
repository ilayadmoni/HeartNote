/**
 * persistCreation — DB persistence for submitGenericCreation.
 *
 * Quota decrement + template-use tracking used to be DB triggers
 * (trg_handle_new_creation_quota, trigger_increment_template_uses). Both are
 * reimplemented here inside one transaction — see actions/creations/create.ts
 * for the twin implementation (this is the FormData-based submission path).
 */

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { ActionError } from "@/lib/action-response";
import { logger } from "@/lib/utils/logger";
import { logAudit } from "@/lib/audit-logger";
import { fetchProfileForQuota, checkPremiumAccess } from "./quotaCheck";
import { calculateExpiry } from "./expiryCalc";
import { CREATION_ACTION_ERRORS } from "@/lib/creation-flow/errors";
import { validateMetadata } from "@/lib/validations/metadata";
import { validateInteractiveEventMetadata } from "@/lib/validations/interactive-events";
import type { ValidatedSubmitInput } from "./validateSubmit";

export interface PersistResult {
  creationId: string;
  verification_code: string;
}

export async function persistCreation(
  userId: string,
  input: ValidatedSubmitInput,
): Promise<PersistResult> {
  const { templateSlug, parsedMetadata, quotaPreference } = input;

  const template = await prisma.template.findFirst({
    where: { slug: templateSlug, isActive: true },
  });
  if (!template) throw new ActionError("Template not found", 404);

  const zodErrors = validateInteractiveEventMetadata(templateSlug, parsedMetadata);
  if (zodErrors.length > 0) {
    throw new ActionError(`Validation errors: ${zodErrors.join("; ")}`, 422);
  }

  const validationErrors = validateMetadata(
    parsedMetadata,
    (template.configSchema as Record<string, unknown>) ?? {},
  );
  if (validationErrors.length > 0) {
    throw new ActionError(`Validation errors: ${validationErrors.join("; ")}`, 422);
  }

  const profile = await fetchProfileForQuota(userId);
  const userTier = profile.subscription_tier ?? "free";

  if (profile.subscription_expired && (template.isPremium || quotaPreference === "pro")) {
    throw new ActionError(CREATION_ACTION_ERRORS.SUBSCRIPTION_EXPIRED, 403);
  }
  checkPremiumAccess(template.isPremium, userTier);

  const appliedQuota: "free" | "pro" = template.isPremium
    ? "pro"
    : userTier === "free" ? "free" : quotaPreference;
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
    const proTotalAllowed = proLimit == null
      ? null : Number(proLimit) + (profile.additional_creation_pro ?? 0);
    if (proTotalAllowed != null && profile.creations_count_pro >= proTotalAllowed) {
      throw new ActionError(CREATION_ACTION_ERRORS.QUOTA_EXCEEDED, 403);
    }
    paidDefaultExpirySeconds = Number(tierPolicy?.defaultExpiry ?? 0);
    if (!Number.isFinite(paidDefaultExpirySeconds) || paidDefaultExpirySeconds <= 0) {
      throw new ActionError("Invalid subscription policy expiry", 500);
    }
  }

  parsedMetadata.has_watermark = !isPremiumBehavior;
  parsedMetadata.applied_quota = appliedQuota;
  parsedMetadata.is_paid = isPremiumBehavior;

  const expiresAt = calculateExpiry(
    template.expirationPolicy as Record<string, unknown>,
    { isPremiumBehavior, paidDefaultExpirySeconds },
  );

  const REDEMPTION_CODE_MAX = parseInt(process.env.REDEMPTION_CODE_MAX || "10000", 10);
  // SEC-CRIT-2: 4-digit verification code for coupon redemption.
  const verificationCode = String(Math.floor(Math.random() * REDEMPTION_CODE_MAX)).padStart(4, "0");

  let creation;
  try {
    creation = await prisma.$transaction(async (tx) => {
      if (appliedQuota === "free") {
        const updated = await tx.profile.updateMany({
          where: { id: userId, creationsCountFree: { lt: freeTotalAllowed } },
          data: { creationsCountFree: { increment: 1 } },
        });
        if (updated.count === 0) {
          throw new ActionError(CREATION_ACTION_ERRORS.QUOTA_EXCEEDED, 403);
        }
      } else if (isPremiumBehavior) {
        await tx.profile.update({
          where: { id: userId },
          data: { creationsCountPro: { increment: 1 } },
        });
      }

      const created = await tx.creation.create({
        data: {
          userId,
          templateId: template.id,
          metadata: parsedMetadata as Prisma.InputJsonValue,
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
    logger.error("[persistCreation] Insert failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    if (process.env.NODE_ENV === "production") {
      throw new ActionError("Failed to create card. Please try again.", 500);
    }
    throw new ActionError(
      `Failed to create card: ${err instanceof Error ? err.message : "Unknown error"}`,
      500,
    );
  }

  await logAudit({
    eventType: "creation.created", userId,
    metadata: {
      creation_id: creation.id, template_id: template.id, template_slug: templateSlug,
      is_paid: isPremiumBehavior, applied_quota: appliedQuota,
    },
  });

  return {
    creationId: creation.id,
    verification_code: creation.verificationCode,
  };
}
