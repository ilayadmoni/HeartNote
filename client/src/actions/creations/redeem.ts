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
  verificationCode: z.string().regex(/^[0-9]{4}$/, "verificationCode must be 4 digits"),
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
  verificationCode: string,
): Promise<ActionResult<RedeemedCoupon>> {
  try {
    const originOk = await validateOrigin();
    if (!originOk) {
      logger.warn("[redeemCouponAction] CSRF origin validation failed", { creationId, couponId });
      return fail("Invalid origin", 403);
    }

    const parsed = RedeemSchema.safeParse({ creationId, couponId, verificationCode });
    if (!parsed.success) {
      logger.warn("[redeemCouponAction] Zod validation failed", { creationId, couponId });
      return fail("Invalid input", 400);
    }

    const headerStore = await headers();
    const ip =
      headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rateLimitResult = await redeemLimiter.check(ip);
    if (!rateLimitResult.success) {
      logger.warn("[redeemCouponAction] Rate limit exceeded", { ip });
      return fail("Too many requests", 429);
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("redeem_love_coupon", {
      p_creation_id: parsed.data.creationId,
      p_coupon_id: parsed.data.couponId,
      p_verification_code: parsed.data.verificationCode,
    });

    if (error) {
      logger.error("[redeemCouponAction] RPC failed", { error: error.message, code: error.code });
      return fail("Failed to redeem coupon", 500);
    }

    // RPC returns NULL on not-found OR already-redeemed → surface 409.
    if (data === null) {
      logger.warn("[redeemCouponAction] RPC returned null — coupon not found or already redeemed", { creationId, couponId });
      return fail("Coupon unavailable", 409);
    }

    return ok(data as RedeemedCoupon);
  } catch (e) {
    logger.error("[redeemCouponAction] Unexpected error", { error: e });
    return fail("Failed to redeem coupon", 500);
  }
}
