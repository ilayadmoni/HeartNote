"use client";

/**
 * useProfileQuery Hook
 * Canonical React Query hook for the current user's profile.
 * Fetches all profile columns so thin-selector hooks (useUser, useProfile)
 * can read from this shared cache without issuing duplicate server calls.
 */

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getMyProfile } from "@/actions/profile/get";
import { PROFILE_QUERY_KEY } from "@/lib/queryKeys/profileKeys";
import { mapProfileResponseToQueryData, type ProfileQueryData } from "@/lib/profileQueryData";

export { PROFILE_QUERY_KEY };
export type { ProfileQueryData };

async function fetchProfile(): Promise<ProfileQueryData | null> {
  const result = await getMyProfile();
  if (!result.success) return null;
  return mapProfileResponseToQueryData(result.data);
}

export function useProfileQuery() {
  const { user } = useAuth();

  return useQuery({
    queryKey: user ? [...PROFILE_QUERY_KEY, user.id] : PROFILE_QUERY_KEY,
    queryFn: fetchProfile,
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
}
