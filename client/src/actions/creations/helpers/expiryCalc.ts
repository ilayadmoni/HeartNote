/**
 * Expiry Calculation Helper
 *
 * Computes the `expires_at` ISO timestamp based on the template's
 * expiration policy and the user's subscription tier.
 */

// ── Types ────────────────────────────────────────────────────────────────

export interface ExpirationPolicy {
  free_days?: number;
  paid_days?: number;
}

export interface ExpiryCalculationOptions {
  isPremiumBehavior: boolean;
  paidDefaultExpirySeconds?: number | null;
}

// ── Calculate Expiry ─────────────────────────────────────────────────────

/**
 * Returns an ISO 8601 timestamp for when the creation should expire.
 *
 * @param rawPolicy  - The template.expiration_policy JSONB value
 * @param isPaid     - Whether the user has a paid subscription
 */
export function calculateExpiry(
  rawPolicy: Record<string, unknown> | null | undefined,
  options: ExpiryCalculationOptions,
): string {
  const policy = (rawPolicy ?? {}) as ExpirationPolicy;

  if (
    options.isPremiumBehavior &&
    options.paidDefaultExpirySeconds != null &&
    Number.isFinite(options.paidDefaultExpirySeconds)
  ) {
    return new Date(
      Date.now() + Number(options.paidDefaultExpirySeconds) * 1000,
    ).toISOString();
  }

  const rawDays = options.isPremiumBehavior
    ? policy.paid_days
    : policy.free_days;

  if (rawDays == null || !Number.isFinite(Number(rawDays))) {
    throw new Error(
      `Template expiration_policy is missing ${options.isPremiumBehavior ? "paid_days" : "free_days"}`,
    );
  }

  return new Date(
    Date.now() + Number(rawDays) * 24 * 60 * 60 * 1000,
  ).toISOString();
}
