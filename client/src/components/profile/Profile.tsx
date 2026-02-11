"use client";

/**
 * Profile Component
 * Main export with responsive wrapper - switches between Desktop and Mobile.
 * Fetches real data from FastAPI backend using the useProfile and useDashboard hooks.
 */

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useProfile } from "@/hooks/useProfile";
import { useDashboard } from "@/hooks/useDashboard";
import { ProfileDesktop } from "./Desktop/ProfileDesktop";
import { ProfileMobile } from "./Mobile/ProfileMobile";
import { ProfileSkeleton } from "./components";
import type { ProfileProps } from "./types";

export function Profile({ className = "" }: ProfileProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const {
    profile,
    avatarOptions,
    loading: profileLoading,
    error: profileError,
    updateProfile,
    deleteAccount,
    refresh: refreshProfile,
  } = useProfile();

  const {
    dashboard,
    loading: dashboardLoading,
    error: dashboardError,
    refresh: refreshDashboard,
  } = useDashboard();

  const loading = profileLoading || dashboardLoading;
  const error = profileError || dashboardError;

  // Show skeleton while loading
  if (loading) {
    return (
      <ProfileSkeleton isMobile={isMobile} />
    );
  }

  // Show error state
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#faf7f5] dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#2e3c52] dark:text-white mb-2 text-hebrew-heading">
            {error || "לא ניתן לטעון את הפרופיל"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-hebrew-body">
            נסו לרענן את הדף
          </p>
          <button
            onClick={() => {
              refreshProfile();
              refreshDashboard();
            }}
            className="px-6 py-2.5 rounded-lg bg-[#d4826f] hover:bg-[#c4735f] text-white font-bold text-sm transition-all text-hebrew-heading"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  const handleRenew = () => {
    window.location.href = "/pricing";
  };

  const handleUpgrade = () => {
    window.location.href = "/pricing";
  };

  const handleViewTemplate = (slug: string) => {
    window.location.href = `/p/${slug}`;
  };

  const handleDeleteTemplate = async (slug: string) => {
    // TODO: Implement template deletion via API
    console.log("Delete template:", slug);
  };

  const handleEditProfile = async (
    firstName: string,
    lastName: string,
  ): Promise<void> => {
    const success = await updateProfile({ firstName, lastName });
    if (!success) {
      throw new Error("Failed to update profile");
    }
  };

  const handleAvatarSelect = async (avatarUrl: string): Promise<boolean> => {
    return updateProfile({ avatarUrl });
  };

  const handleDeleteAccount = async (): Promise<void> => {
    const success = await deleteAccount();
    if (!success) {
      throw new Error("Failed to delete account");
    }
  };

  const props = {
    profile,
    avatarOptions,
    dashboard,
    onRenew: handleRenew,
    onUpgrade: handleUpgrade,
    onViewTemplate: handleViewTemplate,
    onDeleteTemplate: handleDeleteTemplate,
    onEditProfile: handleEditProfile,
    onAvatarSelect: handleAvatarSelect,
    onDeleteAccount: handleDeleteAccount,
    className,
  };

  return isMobile ? (
    <ProfileMobile {...props} />
  ) : (
    <ProfileDesktop {...props} />
  );
}
