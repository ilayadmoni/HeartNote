"use client";

/**
 * Profile Component
 * Main export with responsive wrapper - switches between Desktop and Mobile
 */

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ProfileDesktop } from "./Desktop/ProfileDesktop";
import { ProfileMobile } from "./Mobile/ProfileMobile";
import { MOCK_USER_PROFILE } from "./constants";
import type { ProfileProps } from "./types";

export function Profile({ className = "" }: ProfileProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // TODO: Replace with API call in the future
  const profile = MOCK_USER_PROFILE;

  const handleRenew = () => {
    // TODO: Implement renew logic - redirect to pricing page
    console.log("Renew clicked");
    window.location.href = "/pricing";
  };

  const handleUpgrade = () => {
    // TODO: Implement upgrade logic - redirect to pricing page
    console.log("Upgrade clicked");
    window.location.href = "/pricing";
  };

  const handleViewTemplate = (id: string) => {
    // TODO: Implement view logic - redirect to template preview
    console.log("View template:", id);
    window.location.href = `/p/${id}`;
  };

  const handleDeleteTemplate = (id: string) => {
    // TODO: Implement delete logic - call API and update state
    console.log("Delete template:", id);
  };

  const props = {
    profile,
    onRenew: handleRenew,
    onUpgrade: handleUpgrade,
    onViewTemplate: handleViewTemplate,
    onDeleteTemplate: handleDeleteTemplate,
    className,
  };

  return isMobile ? (
    <ProfileMobile {...props} />
  ) : (
    <ProfileDesktop {...props} />
  );
}
