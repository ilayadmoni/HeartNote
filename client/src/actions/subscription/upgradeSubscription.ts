"use server";

import { ActionError, type ActionResult } from "@/lib/action-response";
import { protectedAction } from "@/lib/protectedAction";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  UpgradeSubscriptionRequestSchema,
  type UpgradeSubscriptionInput,
  type UpgradeSubscriptionResponse,
} from "@/lib/validations";

export async function upgradeSubscription(
  input: UpgradeSubscriptionInput,
): Promise<ActionResult<UpgradeSubscriptionResponse>> {
  return protectedAction(async (user, supabase) => {
    const parsed = UpgradeSubscriptionRequestSchema.safeParse(input);
    if (!parsed.success) {
      throw new ActionError(
        parsed.error.issues.map((issue) => issue.message).join("; "),
        422,
      );
    }

    const tierCode = parsed.data.tierCode;

    const { data: policy, error: policyError } = await supabase
      .from("subscription_policies")
      .select("default_expiry")
      .eq("tier_code", tierCode)
      .single();

    if (policyError || !policy) {
      throw new ActionError("Subscription policy not found", 404);
    }

    const defaultExpirySeconds = Number(policy.default_expiry);
    if (!Number.isFinite(defaultExpirySeconds) || defaultExpirySeconds <= 0) {
      throw new ActionError("Invalid subscription policy expiry", 500);
    }

    const premiumStart = new Date();
    const premiumExpiry = new Date(
      premiumStart.getTime() + defaultExpirySeconds * 1000,
    );

    const admin = createAdminClient();
    const { data: updatedProfile, error: updateError } = await admin
      .from("profiles")
      .update({
        subscription_tier: tierCode,
        premium_start: premiumStart.toISOString(),
        premium_expiry: premiumExpiry.toISOString(),
        creations_count_pro: 0,
      })
      .eq("id", user.id)
      .select("subscription_tier, premium_start, premium_expiry")
      .single();

    if (updateError || !updatedProfile) {
      throw new ActionError("Failed to update subscription", 500);
    }

    return {
      tierCode: updatedProfile.subscription_tier as "lite" | "premium",
      premium_start: String(updatedProfile.premium_start),
      premium_expiry: String(updatedProfile.premium_expiry),
    };
  });
}
