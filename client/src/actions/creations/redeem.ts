/**
 * Redeem Coupon Server Action
 *
 * Marks a single coupon as redeemed inside the creation's metadata JSONB.
 * No auth required — the viewer (public link recipient) redeems coupons.
 */

"use server";

import { createClient } from "@/lib/supabase/server";

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
      return {
        error: `Failed to redeem coupon: ${updateErr.message}`,
        status: 500,
      };
    }

    return { success: true };
  } catch (e) {
    return {
      error: `Failed to redeem coupon: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}
