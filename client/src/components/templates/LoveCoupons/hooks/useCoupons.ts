"use client";

/**
 * useCoupons Hook
 * Manages coupon redemption state with reset support.
 * Syncs with upstream prop changes (e.g. editor live-preview).
 */

import { useState, useCallback, useEffect } from "react";
import type { LoveCoupon } from "../types";

export function useCoupons(initialCoupons: LoveCoupon[]) {
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
  }, []);

  const handleReset = useCallback(() => {
    setCoupons((prev) =>
      prev.map((coupon) => ({ ...coupon, isRedeemed: false, redeemedAt: undefined })),
    );
  }, []);

  return { coupons, handleRedeem, handleReset };
}
