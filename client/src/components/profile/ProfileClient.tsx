"use client";

/**
 * ProfileClient Component
 *
 * Client-side interactive wrapper for the profile page.
 * Receives server-fetched profile + dashboard data as props (from the RSC page).
 * Uses useMutation (React Query v5) for profile updates so the Header
 * syncs instantly via queryClient.invalidateQueries(["profile"]).
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfileQuery";
import { ProfileDesktop } from "./Desktop/ProfileDesktop";
import { ProfileMobile } from "./Mobile/ProfileMobile";
import { updateMyProfile, deleteMyAccount } from "@/actions/profile";
import { mapApiProfileToUserProfile, AVATAR_URLS } from "./types";
import type { UserProfile } from "./types";
import type { ProfileResponse } from "@/lib/validations";
import type { DashboardData } from "@/hooks/useDashboard";

// ---------------------------------------------------------------------------
// Props — everything the RSC page passes down
// ---------------------------------------------------------------------------

export interface SubscriptionUsage {
  used: number;
  limit: number | null; // null = unlimited
  tier: "free" | "premium";
  expiryLabel: string;
}

export interface ProfileClientProps {
  /** Server-fetched profile (snake_case from Supabase, already shaped as ProfileResponse). */
  initialProfile: ProfileResponse;
  /** Server-fetched dashboard stats + creations. Null if the query failed. */
  initialDashboard: DashboardData | null;
  /** Computed subscription usage from the server (policy limit vs remaining). */
  subscriptionUsage: SubscriptionUsage;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProfileClient({
  initialProfile,
  initialDashboard,
  subscriptionUsage,
}: ProfileClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Local state seeded from server data — lets us update optimistically
  const [profile, setProfile] = useState<UserProfile>(
    mapApiProfileToUserProfile(initialProfile),
  );
  const [dashboard] = useState<DashboardData | null>(initialDashboard);
  const [error, setError] = useState<string | null>(null);

  // ── Mutation: edit profile (name) ─────────────────────────────────────

  const editProfileMutation = useMutation({
    mutationFn: async ({
      firstName,
      lastName,
    }: {
      firstName: string;
      lastName: string;
    }) => {
      const result = await updateMyProfile({
        first_name: firstName,
        last_name: lastName,
      });
      if ("error" in result) throw new Error(result.error);
      return result.data;
    },
    onMutate: async ({ firstName, lastName }) => {
      // Optimistic update
      setError(null);
      setProfile((prev) => ({ ...prev, firstName, lastName }));
    },
    onSuccess: (data) => {
      setProfile(mapApiProfileToUserProfile(data));
      // Invalidate React Query cache → Header updates instantly
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
    onError: (err: Error) => {
      setError(err.message);
      setProfile(mapApiProfileToUserProfile(initialProfile));
    },
  });

  // ── Mutation: avatar select ───────────────────────────────────────────

  const avatarMutation = useMutation({
    mutationFn: async (avatarUrl: string) => {
      const result = await updateMyProfile({ avatar_url: avatarUrl });
      if ("error" in result) throw new Error(result.error);
      return result.data;
    },
    onMutate: async (avatarUrl) => {
      setError(null);
      setProfile((prev) => ({ ...prev, avatarUrl }));
    },
    onSuccess: (data) => {
      setProfile(mapApiProfileToUserProfile(data));
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
    onError: (err: Error) => {
      setError(err.message);
      setProfile(mapApiProfileToUserProfile(initialProfile));
    },
  });

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleEditProfile = useCallback(
    async (firstName: string, lastName: string): Promise<void> => {
      editProfileMutation.mutate({ firstName, lastName });
    },
    [editProfileMutation],
  );

  const handleAvatarSelect = useCallback(
    async (avatarUrl: string): Promise<boolean> => {
      try {
        await avatarMutation.mutateAsync(avatarUrl);
        return true;
      } catch {
        return false;
      }
    },
    [avatarMutation],
  );

  const handleDeleteAccount = useCallback(async (): Promise<void> => {
    setError(null);
    const result = await deleteMyAccount();
    if ("error" in result) {
      setError(result.error);
      throw new Error(result.error);
    }
    router.push("/");
  }, [router]);

  // ── Simple navigations ────────────────────────────────────────────────

  const handleRenew = () => {
    router.push("/pricing");
  };

  const handleUpgrade = () => {
    router.push("/pricing");
  };

  const handleViewTemplate = (slug: string) => {
    router.push(`/p/${slug}`);
  };

  const handleDeleteTemplate = async (slug: string) => {
    // TODO: implement via server action
    console.log("Delete template:", slug);
  };

  // ── Render ────────────────────────────────────────────────────────────

  const props = {
    profile,
    avatarOptions: AVATAR_URLS,
    dashboard,
    subscriptionUsage,
    onRenew: handleRenew,
    onUpgrade: handleUpgrade,
    onViewTemplate: handleViewTemplate,
    onDeleteTemplate: handleDeleteTemplate,
    onEditProfile: handleEditProfile,
    onAvatarSelect: handleAvatarSelect,
    onDeleteAccount: handleDeleteAccount,
    className: "",
  };

  return isMobile ? (
    <ProfileMobile {...props} />
  ) : (
    <ProfileDesktop {...props} />
  );
}
