"use client";

/**
 * useProfileQuery Hook
 * Fetches the current user's profile from the `profiles` table via React Query.
 * Provides a shared cache key ["profile"] so all consumers (Header, ProfilePage)
 * stay in sync when the profile is updated via useMutation + invalidation.
 */

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export const PROFILE_QUERY_KEY = ["profile"] as const;

export interface ProfileQueryData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

async function fetchProfile(userId: string): Promise<ProfileQueryData | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, avatar_url, email")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return data as ProfileQueryData;
}

export function useProfileQuery() {
  const { user } = useAuth();

  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
}
