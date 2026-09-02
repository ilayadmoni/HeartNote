"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { redeemCouponAction } from "@/actions/creations";
import type { LoveCoupon } from "@/components/templates/LoveCoupons/types";

export function useCoupons(
  initial: LoveCoupon[],
  creationId?: string,
  providedCode?: string | null,
) {
  const t = useTranslations("editor");
  const [coupons, setCoupons] = useState<LoveCoupon[]>(initial);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);

  useEffect(() => setCoupons(initial), [initial]);

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

    const code = (providedCode ?? enteredCode).trim();
    if (!/^[0-9]{4}$/.test(code)) {
      setCodeError(t("redeem.invalidCodeLength"));
      return;
    }

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
      setCoupons(snapshot);
      if (result.code === 409) {
        toast.error(t("redeem.alreadyRedeemed"));
        setPendingId(null);
      } else if (result.code === 400) {
        setCodeError(t("redeem.wrongCode"));
      } else {
        toast.error(t("redeem.genericError"));
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
