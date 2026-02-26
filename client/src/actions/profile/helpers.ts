/**
 * Profile Helpers
 *
 * Shared helper functions for profile server actions.
 * Ported from ProfileService._is_subscription_active / _parse_*
 */

import type { ProfileResponse } from "@/lib/validations";

export function isSubscriptionActive(data: Record<string, unknown>): boolean {
  const tier = (data.subscription_tier as string) ?? "free";
  if (tier === "free") return true;

  const premiumExpiry = data.premium_expiry;
  if (!premiumExpiry) return true;

  try {
    const expiryStr = String(premiumExpiry).replace("Z", "+00:00");
    const expiry = new Date(expiryStr);
    return expiry > new Date();
  } catch {
    return true;
  }
}

export function buildProfileResponse(
  data: Record<string, unknown>,
): ProfileResponse {
  return {
    id: data.id as string,
    email: (data.email as string) ?? null,
    first_name: (data.first_name as string) ?? null,
    last_name: (data.last_name as string) ?? null,
    date_of_birth: (data.date_of_birth as string) ?? null,
    avatar_url: (data.avatar_url as string) ?? null,
    created_at: (data.created_at as string) ?? null,
    updated_at: (data.updated_at as string) ?? null,
    subscription: {
      tier: ((data.subscription_tier as string) ?? "free") as "free" | "premium",
      creations_count: (data.creations_count as number) ?? 0,
      creations_left_free: (data.creations_left_free as number) ?? 3,
      creations_left_pro: (data.creations_left_pro as number) ?? null,
      premium_start: (data.premium_start as string) ?? null,
      premium_expiry: (data.premium_expiry as string) ?? null,
      is_active: isSubscriptionActive(data),
    },
  };
}
