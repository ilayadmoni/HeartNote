"use client";

/**
 * SubscriptionCard Component
 * Always displays free plan card and optionally a paid plan card.
 */

import type { SubscriptionTier } from "../types";
import { SubscriptionPlanCard } from "./SubscriptionPlanCard";

export interface SubscriptionData {
  tier: SubscriptionTier;
  startDate: string | undefined;
  expiryDate: string | undefined;
  isActive: boolean;
}

interface SubscriptionCardProps {
  freeSubscription: SubscriptionData;
  paidSubscription?: SubscriptionData;
  onRenew: () => void;
  onUpgrade: () => void;
  freeCreationLimit: number | null;
  paidCreationLimit?: number | null;
  /** True when the paid plan is active but all creation slots have been used. */
  isPaidQuotaFull?: boolean;
}

export function SubscriptionCard({
  freeSubscription,
  paidSubscription,
  onRenew,
  onUpgrade,
  freeCreationLimit,
  paidCreationLimit,
  isPaidQuotaFull = false,
}: SubscriptionCardProps): JSX.Element {
  const hasActivePaidSubscription = Boolean(paidSubscription?.isActive);

  return (
    <div className="space-y-4">
      <SubscriptionPlanCard
        subscription={freeSubscription}
        creationLimit={freeCreationLimit}
        onUpgrade={hasActivePaidSubscription ? undefined : onUpgrade}
      />

      {paidSubscription && (
        <SubscriptionPlanCard
          subscription={paidSubscription}
          creationLimit={paidCreationLimit}
          isQuotaFull={isPaidQuotaFull}
          onRenew={paidSubscription.isActive ? undefined : onRenew}
          onUpgrade={isPaidQuotaFull ? onUpgrade : undefined}
        />
      )}
    </div>
  );
}
