"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { redeemCouponAction } from "@/actions/creations";
import type { LoveCoupon } from "../types";

export function useCoupons(initial: LoveCoupon[], creationId?: string) {
  const [coupons, setCoupons] = useState<LoveCoupon[]>(initial);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync with editor live-preview changes
  useEffect(() => setCoupons(initial), [initial]);

  const requestRedeem = (id: string) => setPendingId(id);
  const cancelRedeem = () => {
    if (!isSubmitting) setPendingId(null);
  };

  const confirmRedeem = async () => {
    if (!pendingId) return;
    const id = pendingId;
    const snapshot = coupons;

    // Optimistic update
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, isRedeemed: true, redeemedAt: new Date().toISOString() }
          : c,
      ),
    );

    // Editor mode — no persistence, just close
    if (!creationId) {
      setPendingId(null);
      return;
    }

    setIsSubmitting(true);
    const result = await redeemCouponAction(creationId, id);
    setIsSubmitting(false);
    setPendingId(null);

    if (!result.success) {
      setCoupons(snapshot); // rollback
      toast.error(result.code === 409 ? "הקופון כבר מומש" : "שגיאה במימוש");
    }
  };

  const handleReset = () =>
    setCoupons((prev) =>
      prev.map((c) => ({ ...c, isRedeemed: false, redeemedAt: undefined })),
    );

  const pendingCoupon = coupons.find((c) => c.id === pendingId) ?? null;

  return {
    coupons,
    pendingCoupon,
    isSubmitting,
    requestRedeem,
    confirmRedeem,
    cancelRedeem,
    handleReset,
  };
}
