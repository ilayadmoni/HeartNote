"use client";

/**
 * useCoupons Hook
 * Manages coupon redemption state with reset support
 */

import { useState, useCallback } from "react";
import type { LoveCoupon } from "../types";

export function useCoupons(initialCoupons: LoveCoupon[]) {
  const [coupons, setCoupons] = useState<LoveCoupon[]>(initialCoupons);

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
