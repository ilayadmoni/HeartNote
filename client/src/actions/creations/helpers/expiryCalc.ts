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

// ── Calculate Expiry ─────────────────────────────────────────────────────

/**
 * Returns an ISO 8601 timestamp for when the creation should expire.
 *
 * @param rawPolicy  - The template.expiration_policy JSONB value
 * @param isPaid     - Whether the user has a paid subscription
 */
export function calculateExpiry(
  rawPolicy: Record<string, unknown> | null | undefined,
  isPaid: boolean,
): string {
  const policy = (rawPolicy ?? {}) as ExpirationPolicy;

  const expiryDays = isPaid
    ? Number(policy.paid_days ?? 14)
    : Number(policy.free_days ?? 1);

  return new Date(
    Date.now() + expiryDays * 24 * 60 * 60 * 1000,
  ).toISOString();
}
