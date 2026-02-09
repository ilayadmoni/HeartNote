"use client";

/**
 * Profile Component
 * Main export with responsive wrapper - switches between Desktop and Mobile.
 * Fetches real data from FastAPI backend using the useProfile hook.
 */

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useProfile } from "@/hooks/useProfile";
import { ProfileDesktop } from "./Desktop/ProfileDesktop";
import { ProfileMobile } from "./Mobile/ProfileMobile";
import { ProfileSkeleton } from "./components";
import { ApiHealthCheck } from "@/components/debug/ApiHealthCheck";
import type { ProfileProps } from "./types";

export function Profile({ className = "" }: ProfileProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const {
    profile,
    avatarOptions,
    loading,
    error,
    updateProfile,
    deleteAccount,
    refresh,
  } = useProfile();

  // Show skeleton while loading
  if (loading) {
    return (
      <>
        <ApiHealthCheck />
        <ProfileSkeleton isMobile={isMobile} />
      </>
    );
  }

  // Show error state
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#faf7f5] dark:bg-gray-900 flex items-center justify-center p-4">
        <ApiHealthCheck />
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#2e3c52] dark:text-white mb-2 text-hebrew-heading">
            {error || "לא ניתן לטעון את הפרופיל"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-hebrew-body">
            נסו לרענן את הדף
          </p>
          <button
            onClick={refresh}
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

  const handleViewTemplate = (id: string) => {
    window.location.href = `/p/${id}`;
  };

  const handleDeleteTemplate = async (id: string) => {
    // TODO: Implement template deletion via API
    console.log("Delete template:", id);
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
