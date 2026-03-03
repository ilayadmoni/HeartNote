/**
 * Profile Helpers
 *
 * Shared helper functions for profile server actions.
 * Ported from ProfileService._is_subscription_active / _parse_*
 */

import type { SupabaseClient } from "@supabase/supabase-js";
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

export async function buildProfileResponse(
  data: Record<string, unknown>,
  supabase: SupabaseClient,
): Promise<ProfileResponse> {
  const tier = (data.subscription_tier as string) ?? "free";
  
  // Fetch creation_limit from subscription_policies table
  let creationLimit: number | null = null;
  try {
    const { data: policyData } = await supabase
      .from("subscription_policies")
      .select("creation_limit")
      .eq("tier_code", tier)
      .single();
    
    creationLimit = policyData?.creation_limit ?? (tier === "free" ? 3 : null);
  } catch {
    // Fallback to 3 for free tier if query fails
    creationLimit = tier === "free" ? 3 : null;
  }

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
      tier: tier as "free" | "premium",
      creations_count_free: (data.creations_count_free as number) ?? 0,
      creations_count_pro: (data.creations_count_pro as number) ?? 0,
      additional_creation_free: (data.additional_creation_free as number) ?? 0,
      additional_creation_pro: (data.additional_creation_pro as number) ?? 0,
      premium_start: (data.premium_start as string) ?? null,
      premium_expiry: (data.premium_expiry as string) ?? null,
      is_active: isSubscriptionActive(data),
      creation_limit: creationLimit,
    },
  };
}
