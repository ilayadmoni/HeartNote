"use client";

/**
 * useCoupons Hook
 * Manages coupon redemption state with reset support.
 * Syncs with upstream prop changes (e.g. editor live-preview).
 * When creationId is provided (viewer mode), persists redemptions server-side.
 */

import { useState, useCallback, useEffect } from "react";
import { redeemCoupon } from "@/actions/creations";
import type { LoveCoupon } from "../types";

export function useCoupons(initialCoupons: LoveCoupon[], creationId?: string) {
  const [coupons, setCoupons] = useState<LoveCoupon[]>(initialCoupons);

  // Sync when the upstream array changes (editor typing, add/remove)
  useEffect(() => {
    setCoupons(initialCoupons);
  }, [initialCoupons]);

  const handleRedeem = useCallback((couponId: string) => {
    setCoupons((prev) =>
      prev.map((coupon) =>
        coupon.id === couponId
          ? { ...coupon, isRedeemed: true, redeemedAt: new Date().toISOString() }
          : coupon,
      ),
    );

    // Persist to DB when viewing a saved creation
    if (creationId) {
      redeemCoupon(creationId, couponId).catch(console.error);
    }
  }, [creationId]);

  const handleReset = useCallback(() => {
    setCoupons((prev) =>
      prev.map((coupon) => ({ ...coupon, isRedeemed: false, redeemedAt: undefined })),
    );
  }, []);

  return { coupons, handleRedeem, handleReset };
}
