"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useProfileQuery } from "./useProfileQuery";

const supabase = createClient();

interface Subscription {
  tier: "free" | "lite" | "premium";
  creations_count_free: number;
  creations_count_pro: number;
  additional_creation_free: number;
  additional_creation_pro: number;
  creation_limit: number;
  premium_expiry: string | null;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  subscription: Subscription;
}

interface UseProfileReturn {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
}

export function useProfile(): UseProfileReturn {
  const { data: profileData, isLoading, error: queryError } = useProfileQuery();
  const tier = (profileData?.subscription_tier ?? "free") as "free" | "lite" | "premium";

  const { data: policyData } = useQuery({
    queryKey: ["subscription_policies", tier],
    queryFn: async () => {
      const { data } = await supabase
        .from("subscription_policies")
        .select("creation_limit")
        .eq("tier_code", tier)
        .single();
      return data ?? null;
    },
    enabled: !!profileData,
    staleTime: 1000 * 60 * 10,
  });

  const profile: ProfileData | null = profileData
    ? {
        firstName: profileData.first_name ?? "",
        lastName: profileData.last_name ?? "",
        avatarUrl: profileData.avatar_url ?? null,
        subscription: {
          tier,
          creations_count_free: profileData.creations_count_free ?? 0,
          creations_count_pro: profileData.creations_count_pro ?? 0,
          additional_creation_free: profileData.additional_creation_free ?? 0,
          additional_creation_pro: profileData.additional_creation_pro ?? 0,
          creation_limit: (policyData?.creation_limit as number | null) ?? 3,
          premium_expiry: profileData.premium_expiry ?? null,
        },
      }
    : null;

  return {
    profile,
    loading: isLoading,
    error: queryError
      ? queryError instanceof Error
        ? queryError.message
        : "Unknown error"
      : null,
  };
}
