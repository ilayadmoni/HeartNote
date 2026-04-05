/**
 * Redeem Coupon Server Action
 *
 * Marks a single coupon as redeemed inside the creation's metadata JSONB.
 * No auth required — the viewer (public link recipient) redeems coupons.
 *
 * SEC-HIGH-1: Validates input UUIDs with Zod before querying DB.
 * SEC-HIGH-1: Uses logger for PII-safe logging.
 */

"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";

const RedeemInputSchema = z.object({
  creationId: z.string().uuid("Invalid creation ID format"),
  couponId: z.string().uuid("Invalid coupon ID format"),
});

/**
 * Marks a coupon as redeemed inside the creation's metadata.
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
    // ── Input validation ──────────────────────────────────────────
    const parsed = RedeemInputSchema.safeParse({ creationId, couponId });
    if (!parsed.success) {
      return { error: "Invalid input", status: 400 };
    }

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
      logger.error("[redeemCoupon] Update failed", { error: updateErr.message });
      return {
        error: "Failed to redeem coupon",
        status: 500,
      };
    }

    return { success: true };
  } catch (e) {
    logger.error("[redeemCoupon] Unexpected error", { error: e });
    return {
      error: "Failed to redeem coupon",
      status: 500,
    };
  }
}
