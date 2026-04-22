"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { ok, fail, type ActionResult } from "@/lib/action-response";
import { validateOrigin } from "@/lib/utils/csrf";
import { createRateLimiter } from "@/lib/utils/rate-limiter";
import { logger } from "@/lib/utils/logger";

const RedeemSchema = z.object({
  creationId: z.string().uuid(),
  couponId: z.string().min(1),
});

const redeemLimiter = createRateLimiter({
  maxRequests: 10,
  windowMs: 60_000,
  prefix: "redeem-coupon",
});

export interface RedeemedCoupon {
  id: string;
  isRedeemed: true;
  redeemedAt: string;
}

export async function redeemCouponAction(
  creationId: string,
  couponId: string,
): Promise<ActionResult<RedeemedCoupon>> {
  try {
    const originOk = await validateOrigin();
    if (!originOk) {
      console.error("[redeemCouponAction] CSRF origin validation failed", { creationId, couponId });
      return fail("Invalid origin", 403);
    }

    const parsed = RedeemSchema.safeParse({ creationId, couponId });
    if (!parsed.success) {
      console.error("[redeemCouponAction] Zod validation failed", { creationId, couponId, errors: parsed.error.issues });
      return fail("Invalid input", 400);
    }

    const headerStore = await headers();
    const ip =
      headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rateLimitResult = await redeemLimiter.check(ip);
    if (!rateLimitResult.success) {
      console.error("[redeemCouponAction] Rate limit exceeded", { ip });
      return fail("Too many requests", 429);
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("redeem_love_coupon", {
      p_creation_id: parsed.data.creationId,
      p_coupon_id: parsed.data.couponId,
    });

    if (error) {
      console.error("[redeemCouponAction] RPC failed", { error: error.message, code: error.code, details: error.details });
      logger.error("[redeemCouponAction] RPC failed", { error: error.message });
      return fail("Failed to redeem coupon", 500);
    }

    // RPC returns NULL on not-found OR already-redeemed → surface 409.
    if (data === null) {
      console.error("[redeemCouponAction] RPC returned null — coupon not found or already redeemed", { creationId, couponId });
      return fail("Coupon unavailable", 409);
    }

    return ok(data as RedeemedCoupon);
  } catch (e) {
    console.error("[redeemCouponAction] Unexpected error", e);
    logger.error("[redeemCouponAction] Unexpected", { error: e });
    return fail("Failed to redeem coupon", 500);
  }
}
