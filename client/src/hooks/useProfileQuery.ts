"use client";

/**
 * useProfileQuery Hook
 * Canonical React Query hook for the current user's profile.
 * Fetches all profile columns so thin-selector hooks (useUser, useProfile)
 * can read from this shared cache without issuing duplicate DB round-trips.
 */

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { PROFILE_QUERY_KEY } from "@/lib/queryKeys/profileKeys";

export { PROFILE_QUERY_KEY };

const supabase = createClient();

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
}

const PROFILE_SELECT =
  "id, first_name, last_name, date_of_birth, avatar_url, email, " +
  "subscription_tier, creations_count_free, creations_count_pro, " +
  "additional_creation_free, additional_creation_pro, premium_expiry";

async function fetchProfile(userId: string): Promise<ProfileQueryData | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return data as unknown as ProfileQueryData;
}

export function useProfileQuery() {
  const { user } = useAuth();

  return useQuery({
    queryKey: user ? [...PROFILE_QUERY_KEY, user.id] : PROFILE_QUERY_KEY,
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
}
