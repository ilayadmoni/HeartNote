/**
 * Shared shape + mapper for the profile React Query cache entry.
 * Used both client-side (useProfileQuery) and server-side (the (main)
 * layout's prefetch) so the hydrated cache always matches what the hook
 * itself would have fetched.
 */

import type { ProfileResponse } from "@/lib/validations";

export interface ProfileQueryData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  avatar_url: string | null;
  email: string | null;
  subscription_tier: "free" | "lite" | "premium" | null;
  creations_count_free: number | null;
  creations_count_pro: number | null;
  additional_creation_free: number | null;
  additional_creation_pro: number | null;
  premium_expiry: string | null;
  creation_limit: number | null;
}

export function mapProfileResponseToQueryData(p: ProfileResponse): ProfileQueryData {
  return {
    id: p.id,
    first_name: p.first_name,
    last_name: p.last_name,
    date_of_birth: p.date_of_birth,
    avatar_url: p.avatar_url,
    email: p.email,
    subscription_tier: p.subscription.tier,
    creations_count_free: p.subscription.creations_count_free,
    creations_count_pro: p.subscription.creations_count_pro,
    additional_creation_free: p.subscription.additional_creation_free,
    additional_creation_pro: p.subscription.additional_creation_pro,
    premium_expiry: p.subscription.premium_expiry,
    creation_limit: p.subscription.creation_limit,
  };
}
