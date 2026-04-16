import type { ActionResult } from "@/lib/action-response";

export const CREATION_ACTION_ERRORS = {
  QUOTA_EXCEEDED: "QUOTA_EXCEEDED",
  PAID_QUOTA_EXCEEDED: "PAID_QUOTA_EXCEEDED",
  SUBSCRIPTION_EXPIRED: "SUBSCRIPTION_EXPIRED",
  TEMPLATE_NOT_ALLOWED: "TEMPLATE_NOT_ALLOWED",
} as const;

export type CreationActionErrorCode =
  (typeof CREATION_ACTION_ERRORS)[keyof typeof CREATION_ACTION_ERRORS];

export type CreationActionResult = ActionResult<{ creationId: string }>;

export type BlockedModal = "upgrade" | "quota" | "paid-quota";

export function isCreationActionErrorCode(
  error: string,
): error is CreationActionErrorCode {
  return Object.values(CREATION_ACTION_ERRORS).includes(
    error as CreationActionErrorCode,
  );
}

export function resolveBlockedModalFromCreationResult(
  result: CreationActionResult,
): BlockedModal | null {
  if (result.success) return null;

  if (
    result.code === 403 &&
    result.error === CREATION_ACTION_ERRORS.QUOTA_EXCEEDED
  ) {
    return "quota";
  }

  if (
    result.code === 403 &&
    result.error === CREATION_ACTION_ERRORS.PAID_QUOTA_EXCEEDED
  ) {
    return "paid-quota";
  }

  if (
    (result.code === 403 &&
      result.error === CREATION_ACTION_ERRORS.SUBSCRIPTION_EXPIRED) ||
    (result.code === 402 &&
      result.error === CREATION_ACTION_ERRORS.TEMPLATE_NOT_ALLOWED)
  ) {
    return "upgrade";
  }

  return null;
}

export function isSubscriptionEffectivelyFree(
  tier: "free" | "lite" | "premium" | null | undefined,
  premiumExpiry: string | null | undefined,
): boolean {
  if (!tier || tier === "free") return true;
  if (!premiumExpiry) return false;

  const expiryDate = new Date(premiumExpiry);
  if (Number.isNaN(expiryDate.getTime())) return false;

  return expiryDate <= new Date();
}
