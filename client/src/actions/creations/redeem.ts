"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
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

interface CouponRow {
  verification_code: string | null;
  coupons: unknown;
}

/**
 * Ported from the `redeem_love_coupon` Postgres function (SECURITY DEFINER,
 * row-locked). Locks the creation row for the duration of the transaction so
 * two concurrent redemption attempts on the same coupon can't both succeed.
 * Returns null for "not found / wrong code / already redeemed" — the caller
 * maps that to a 409, matching the original RPC's contract.
 */
async function redeemLoveCoupon(
  creationId: string,
  couponId: string,
  verificationCode: string,
): Promise<RedeemedCoupon | null> {
  return prisma.$transaction(async (tx) => {
    const rows = await tx.$queryRaw<CouponRow[]>`
      SELECT verification_code, metadata -> 'coupons' AS coupons
      FROM creations
      WHERE id = ${creationId}::uuid AND is_deleted = false
      FOR UPDATE
    `;
    const row = rows[0];
    if (!row || row.verification_code == null) return null;
    if (row.verification_code !== verificationCode) return null;

    const coupons = row.coupons as Array<Record<string, unknown>> | null;
    if (!coupons) return null;

    const idx = coupons.findIndex((c) => c.id === couponId);
    if (idx === -1) return null;

    const coupon = coupons[idx];
    if (coupon.isRedeemed === true) return null;

    const updatedCoupon: RedeemedCoupon = {
      ...(coupon as { id: string }),
      isRedeemed: true,
      redeemedAt: new Date().toISOString(),
    };

    await tx.$executeRaw`
      UPDATE creations
      SET metadata = jsonb_set(metadata, ARRAY['coupons', ${idx}::text], ${JSON.stringify(updatedCoupon)}::jsonb, false)
      WHERE id = ${creationId}::uuid
    `;

    return updatedCoupon;
  });
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

    const result = await redeemLoveCoupon(
      parsed.data.creationId,
      parsed.data.couponId,
      parsed.data.verificationCode,
    );

    if (result === null) {
      logger.warn("[redeemCouponAction] Coupon not found, wrong code, or already redeemed", {
        creationId, couponId,
      });
      return fail("Coupon unavailable", 409);
    }

    return ok(result);
  } catch (e) {
    logger.error("[redeemCouponAction] Unexpected error", { error: e });
    return fail("Failed to redeem coupon", 500);
  }
}
