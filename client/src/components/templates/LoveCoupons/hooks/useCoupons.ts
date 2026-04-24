"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { redeemCouponAction } from "@/actions/creations";
import type { LoveCoupon } from "../types";

export function useCoupons(
  initial: LoveCoupon[],
  creationId?: string,
  providedCode?: string | null,
) {
  const [coupons, setCoupons] = useState<LoveCoupon[]>(initial);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);

  // Sync with editor live-preview changes
  useEffect(() => setCoupons(initial), [initial]);

  // Reset entered-code state when the pending coupon changes.
  useEffect(() => {
    setEnteredCode("");
    setCodeError(null);
  }, [pendingId]);

  const requestRedeem = (id: string) => setPendingId(id);
  const cancelRedeem = () => {
    if (!isSubmitting) setPendingId(null);
  };

  const confirmRedeem = async () => {
    if (!pendingId) return;
    const id = pendingId;
    const snapshot = coupons;

    // Editor mode — no persistence, just close
    if (!creationId) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, isRedeemed: true, redeemedAt: new Date().toISOString() }
            : c,
        ),
      );
      setPendingId(null);
      return;
    }

    // Require a valid 4-digit code (from URL or user input).
    const code = (providedCode ?? enteredCode).trim();
    if (!/^[0-9]{4}$/.test(code)) {
      setCodeError("יש להזין קוד בן 4 ספרות");
      return;
    }

    // Optimistic update
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, isRedeemed: true, redeemedAt: new Date().toISOString() }
          : c,
      ),
    );

    setIsSubmitting(true);
    const result = await redeemCouponAction(creationId, id, code);
    setIsSubmitting(false);

    if (!result.success) {
      setCoupons(snapshot); // rollback
      if (result.code === 409) {
        toast.error("הקופון כבר מומש");
        setPendingId(null);
      } else if (result.code === 400) {
        setCodeError("קוד אימות שגוי");
      } else {
        toast.error("שגיאה במימוש");
        setPendingId(null);
      }
      return;
    }

    setPendingId(null);
  };

  const handleReset = () =>
    setCoupons((prev) =>
      prev.map((c) => ({ ...c, isRedeemed: false, redeemedAt: undefined })),
    );

  const pendingCoupon = coupons.find((c) => c.id === pendingId) ?? null;
  const needsCodeInput = !!creationId && !providedCode;

  return {
    coupons,
    pendingCoupon,
    isSubmitting,
    requestRedeem,
    confirmRedeem,
    cancelRedeem,
    handleReset,
    needsCodeInput,
    enteredCode,
    setEnteredCode,
    codeError,
  };
}
