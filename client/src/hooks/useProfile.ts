/**
 * useProfile Hook
 * 
 * Custom hook for fetching and managing profile data.
 * Uses the profileApi service to communicate with FastAPI backend.
 */

import { useState, useEffect, useCallback } from "react";
import { 
  getProfile, 
  updateProfile as apiUpdateProfile, 
  deleteAccount as apiDeleteAccount,
  type ProfileData,
  type ProfileUpdateData as ApiProfileUpdateData,
} from "@/services/profileApi";
import { 
  type UserProfile, 
  type ProfileUpdateData,
  mapApiProfileToUserProfile,
  mapProfileUpdateToApi,
  AVATAR_URLS,
} from "@/components/profile/types";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface UseProfileReturn {
  profile: UserProfile | null;
  avatarOptions: string[];
  loading: boolean;
  error: string | null;
  updateProfile: (data: ProfileUpdateData) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  refresh: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [avatarOptions, setAvatarOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const profileData = await getProfile();
      console.log("Fetched profile data:", profileData);

      setProfile(mapApiProfileToUserProfile(profileData));
      // Use static DiceBear avatar list instead of broken API
      setAvatarOptions(AVATAR_URLS);
    } catch (err) {
      const apiError = err as { message: string; status: number };
      setError(apiError.message || "שגיאה בטעינת הפרופיל");
      
      // If unauthorized, redirect to login
      if (apiError.status === 401) {
        await signOut();
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  }, [user, signOut, router]);

  // Initial fetch
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Update profile
  const updateProfileHandler = useCallback(async (data: ProfileUpdateData): Promise<boolean> => {
    try {
      setError(null);
      const apiData = mapProfileUpdateToApi(data) as ApiProfileUpdateData;
      const updatedProfile = await apiUpdateProfile(apiData);
      setProfile(mapApiProfileToUserProfile(updatedProfile));
      return true;
    } catch (err) {
      const apiError = err as { message: string };
      setError(apiError.message || "שגיאה בעדכון הפרופיל");
      return false;
    }
  }, []);

  // Delete account
  const deleteAccountHandler = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      await apiDeleteAccount();
      await signOut();
      router.push("/");
      return true;
    } catch (err) {
      const apiError = err as { message: string };
      setError(apiError.message || "שגיאה במחיקת החשבון");
      return false;
    }
  }, [signOut, router]);

  return {
    profile,
    avatarOptions,
    loading,
    error,
    updateProfile: updateProfileHandler,
    deleteAccount: deleteAccountHandler,
    refresh: fetchProfile,
  };
}
