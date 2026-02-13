"use client";

/**
 * ProfileClient Component
 *
 * Client-side interactive wrapper for the profile page.
 * Receives server-fetched profile + dashboard data as props (from the RSC page).
 * Uses server actions (updateMyProfile, deleteMyAccount) for mutations — no
 * legacy fetchClient / FastAPI calls.
 */

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ProfileDesktop } from "./Desktop/ProfileDesktop";
import { ProfileMobile } from "./Mobile/ProfileMobile";
import { ProfileSkeleton } from "./components";
import { updateMyProfile, deleteMyAccount } from "@/actions/profile";
import { mapApiProfileToUserProfile, AVATAR_URLS } from "./types";
import type { UserProfile, ProfileUpdateData } from "./types";
import type { ProfileResponse } from "@/lib/validations";
import type { DashboardData } from "@/hooks/useDashboard";

// ---------------------------------------------------------------------------
// Props — everything the RSC page passes down
// ---------------------------------------------------------------------------

export interface SubscriptionUsage {
  used: number;
  limit: number | null;   // null = unlimited
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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isPending, startTransition] = useTransition();

  // Local state seeded from server data — lets us update optimistically
  const [profile, setProfile] = useState<UserProfile>(
    mapApiProfileToUserProfile(initialProfile),
  );
  const [dashboard] = useState<DashboardData | null>(initialDashboard);
  const [error, setError] = useState<string | null>(null);

  // ── Mutations via server actions ──────────────────────────────────────

  const handleEditProfile = useCallback(
    async (firstName: string, lastName: string): Promise<void> => {
      setError(null);
      // Optimistic: update UI immediately
      setProfile((prev) => ({ ...prev, firstName, lastName }));

      startTransition(async () => {
        const result = await updateMyProfile({
          first_name: firstName,
          last_name: lastName,
        });

        if ("error" in result) {
          setError(result.error);
          // Revert on failure
          setProfile(mapApiProfileToUserProfile(initialProfile));
          return;
        }

        setProfile(mapApiProfileToUserProfile(result.data));
      });
    },
    [initialProfile],
  );

  const handleAvatarSelect = useCallback(
    async (avatarUrl: string): Promise<boolean> => {
      setError(null);
      // Optimistic: update avatar immediately
      setProfile((prev) => ({ ...prev, avatarUrl }));

      return new Promise((resolve) => {
        startTransition(async () => {
          const result = await updateMyProfile({ avatar_url: avatarUrl });

          if ("error" in result) {
            setError(result.error);
            setProfile(mapApiProfileToUserProfile(initialProfile));
            resolve(false);
            return;
          }

          setProfile(mapApiProfileToUserProfile(result.data));
          resolve(true);
        });
      });
    },
    [initialProfile],
  );

  const handleDeleteAccount = useCallback(async (): Promise<void> => {
    setError(null);
    const result = await deleteMyAccount();

    if ("error" in result) {
      setError(result.error);
      throw new Error(result.error);
    }

    // Account deleted — redirect to home
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
