/**
 * useProfile Hook (Supabase version)
 * Fetches the user profile + subscription data from the `profiles` table.
 * Used by CreationConfirmModal and QuotaModal for quota display.
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

interface Subscription {
  tier: "free" | "premium";
  creations_count_free: number;
  additional_creation_free: number;
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
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) { setProfile(null); setLoading(false); return; }
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url, subscription_tier, creations_count_free, additional_creation_free, premium_expiry")
        .eq("id", user.id)
        .single();
      if (err || !data) throw new Error(err?.message ?? "Failed to load profile");
      setProfile({
        firstName: data.first_name ?? "",
        lastName: data.last_name ?? "",
        avatarUrl: data.avatar_url ?? null,
        subscription: {
          tier: data.subscription_tier ?? "free",
          creations_count_free: data.creations_count_free ?? 0,
          additional_creation_free: data.additional_creation_free ?? 0,
          creation_limit: 3,
          premium_expiry: data.premium_expiry ?? null,
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  return { profile, loading, error };
}
