"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { upgradeSubscription } from "@/actions/subscription";
import type { PricingPlan } from "@/components/pricing/types";

interface UsePricingUpgradeOptions {
  plan: PricingPlan;
  hasActivePaidSubscription: boolean;
  upgradesEnabled: boolean;
}

export function usePricingUpgrade({
  plan,
  hasActivePaidSubscription,
  upgradesEnabled,
}: UsePricingUpgradeOptions) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  const isFree = plan.price === 0;
  const canUpgrade = !isFree && upgradesEnabled && !!plan.tierCode;

  const runUpgrade = () => {
    if (!plan.tierCode || isPending) return;
    startTransition(async () => {
      const result = await upgradeSubscription({ tierCode: plan.tierCode! });
      if (!result.success) {
        if (result.code === 401) {
          toast.error("יש להתחבר כדי לשדרג מסלול.");
          router.push("/login");
          return;
        }
        toast.error(result.error || "שדרוג המסלול נכשל.");
        return;
      }
      toast.success("המסלול שודרג בהצלחה.");
      router.refresh();
    });
  };

  const handleUpgradeClick = () => {
    if (!canUpgrade || isPending) return;
    if (hasActivePaidSubscription) { setIsWarningOpen(true); return; }
    runUpgrade();
  };

  const handleWarningConfirm = () => {
    setIsWarningOpen(false);
    runUpgrade();
  };

  return {
    isPending,
    canUpgrade,
    isFree,
    isWarningOpen,
    handleUpgradeClick,
    handleWarningConfirm,
    closeWarning: () => setIsWarningOpen(false),
  };
}
