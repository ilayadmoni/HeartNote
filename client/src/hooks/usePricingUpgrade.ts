"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { upgradeSubscription } from "@/actions/subscription";
import type { PricingPlan } from "@/components/pricing/types";

interface UsePricingUpgradeOptions {
  plan: PricingPlan;
  hasActivePaidSubscription: boolean;
  upgradesEnabled: boolean;
}

interface UsePricingUpgradeReturn {
  isPending: boolean;
  canUpgrade: boolean;
  isFree: boolean;
  isWarningOpen: boolean;
  handleUpgradeClick: () => void;
  handleWarningConfirm: () => void;
  closeWarning: () => void;
}

export function usePricingUpgrade({
  plan,
  hasActivePaidSubscription,
  upgradesEnabled,
}: UsePricingUpgradeOptions): UsePricingUpgradeReturn {
  const router = useRouter();
  const t = useTranslations("pricing");
  const [isPending, startTransition] = useTransition();
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  const isFree = plan.price === 0;
  const canUpgrade = !isFree && upgradesEnabled && !!plan.tierCode;

  const runUpgrade = (): void => {
    if (!plan.tierCode || isPending) return;
    startTransition(async () => {
      const result = await upgradeSubscription({ tierCode: plan.tierCode! });
      if (!result.success) {
        if (result.code === 401) {
          toast.error(t("toasts.loginRequired"));
          router.push("/gallery?login=true");
          return;
        }
        toast.error(result.error || t("toasts.upgradeFailed"));
        return;
      }
      toast.success(t("toasts.upgradeSuccess"));
      router.refresh();
    });
  };

  const handleUpgradeClick = (): void => {
    if (!canUpgrade || isPending) return;
    if (hasActivePaidSubscription) {
      setIsWarningOpen(true);
      return;
    }
    runUpgrade();
  };

  const handleWarningConfirm = (): void => {
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
