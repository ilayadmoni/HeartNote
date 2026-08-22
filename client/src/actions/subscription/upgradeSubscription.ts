"use server";

import { ActionError, type ActionResult } from "@/lib/action-response";
import { protectedAction } from "@/lib/protectedAction";
import { prisma } from "@/lib/prisma";
import {
  UpgradeSubscriptionRequestSchema,
  type UpgradeSubscriptionInput,
  type UpgradeSubscriptionResponse,
} from "@/lib/validations";
import { logAudit } from "@/lib/audit-logger";

export async function upgradeSubscription(
  input: UpgradeSubscriptionInput,
): Promise<ActionResult<UpgradeSubscriptionResponse>> {
  return protectedAction(async (user) => {
    const parsed = UpgradeSubscriptionRequestSchema.safeParse(input);
    if (!parsed.success) {
      throw new ActionError(
        parsed.error.issues.map((issue) => issue.message).join("; "),
        422,
      );
    }

    const tierCode = parsed.data.tierCode;

    const policy = await prisma.subscriptionPolicy.findUnique({ where: { tierCode } });
    if (!policy) {
      throw new ActionError("Subscription policy not found", 404);
    }

    const defaultExpirySeconds = Number(policy.defaultExpiry);
    if (!Number.isFinite(defaultExpirySeconds) || defaultExpirySeconds <= 0) {
      throw new ActionError("Invalid subscription policy expiry", 500);
    }

    const premiumStart = new Date();
    const premiumExpiry = new Date(premiumStart.getTime() + defaultExpirySeconds * 1000);

    let updatedProfile;
    try {
      updatedProfile = await prisma.profile.update({
        where: { id: user.id },
        data: {
          subscriptionTier: tierCode,
          premiumStart,
          premiumExpiry,
          creationsCountPro: 0,
        },
      });
    } catch {
      throw new ActionError("Failed to update subscription", 500);
    }

    await logAudit({
      eventType: "subscription.purchased",
      userId: user.id,
      metadata: {
        tier_code: tierCode,
        premium_start: premiumStart.toISOString(),
        premium_expiry: premiumExpiry.toISOString(),
      },
    });

    return {
      tierCode: updatedProfile.subscriptionTier as "lite" | "premium",
      premium_start: updatedProfile.premiumStart!.toISOString(),
      premium_expiry: updatedProfile.premiumExpiry!.toISOString(),
    };
  });
}
