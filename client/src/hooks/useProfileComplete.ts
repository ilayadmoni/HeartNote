/**
 * useProfileComplete
 *
 * Lightweight hook that checks if the current user's profile is complete.
 * Used by the action-based guard in /create/* pages to determine whether
 * to save the user's work and redirect them to /complete-profile.
 */

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/hooks/useUser";

function isNonEmpty(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function useProfileComplete(): {
  isProfileComplete: boolean;
  loading: boolean;
} {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useUser();

  const loading = authLoading || profileLoading;

  if (loading || !user) {
    return { isProfileComplete: false, loading };
  }

  const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;

  const complete =
    isNonEmpty(metadata.first_name) &&
    isNonEmpty(metadata.last_name) &&
    (isNonEmpty(metadata.birth_date) || isNonEmpty(metadata.date_of_birth)) &&
    isNonEmpty(profile?.first_name) &&
    isNonEmpty(profile?.last_name) &&
    isNonEmpty(profile?.date_of_birth);

  return { isProfileComplete: complete, loading };
}
