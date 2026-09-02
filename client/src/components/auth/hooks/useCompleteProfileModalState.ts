"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { USER_QUERY_KEY } from "@/hooks/useUser";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfileQuery";
import { getMyProfile } from "@/actions/profile/get";
import { updateMyProfile } from "@/actions/profile/update";
import type { CompleteProfileFormData } from "../types";

interface Options {
  isOpen: boolean;
  step: "auth" | "profile";
  redirectTo?: string | null;
  clearModalQuery: () => void;
  closeThen: (afterClose?: () => void) => void;
  pushRedirect: (path: string) => void;
}

/**
 * Complete-profile step of the login modal (Google OAuth users finishing
 * sign-up). Extracted from useAuthModalState to keep it under the
 * file-length cap.
 */
export function useCompleteProfileModalState({
  isOpen, step, redirectTo, clearModalQuery, closeThen, pushRedirect,
}: Options) {
  const t = useTranslations("auth");
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [profileForm, setProfileForm] = useState<CompleteProfileFormData>({
    firstName: "", lastName: "", dateOfBirth: "",
  });
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileAgreedToTerms, setProfileAgreedToTerms] = useState(false);
  const [profileTermsError, setProfileTermsError] = useState<string | null>(null);
  const profileCompletedRef = useRef(false);

  const resetProfileState = useCallback(() => {
    setIsProfileLoading(false);
    setProfileError(null);
    setProfileAgreedToTerms(false);
    setProfileTermsError(null);
    profileCompletedRef.current = false;
    setProfileForm({ firstName: "", lastName: "", dateOfBirth: "" });
  }, []);

  useEffect(() => {
    const checkProfileState = async () => {
      if (!isOpen || step !== "profile" || !user) return;
      setIsProfileLoading(true);
      setProfileError(null);
      try {
        const result = await getMyProfile();
        if (!result.success) {
          setProfileError(t("completeProfile.loadFailed"));
          return;
        }
        const { first_name, last_name, date_of_birth } = result.data;
        if (date_of_birth) { clearModalQuery(); closeThen(); return; }

        setProfileForm({
          firstName: first_name ?? "",
          lastName: last_name ?? "",
          dateOfBirth: date_of_birth ?? "",
        });
      } finally { setIsProfileLoading(false); }
    };
    void checkProfileState();
  }, [isOpen, step, user, clearModalQuery, closeThen, t]);

  const completeProfileMutation = useMutation({
    mutationFn: async (values: CompleteProfileFormData) => {
      const result = await updateMyProfile({
        first_name: values.firstName.trim(),
        last_name: values.lastName.trim(),
        date_of_birth: values.dateOfBirth,
      });
      if (!result.success) throw new Error(t("completeProfile.saveFailed"));
      return values;
    },
    onSuccess: () => {
      profileCompletedRef.current = true;
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      clearModalQuery();
      closeThen(() => { if (redirectTo) pushRedirect(redirectTo); });
    },
    onError: (err: unknown) => {
      setProfileError(err instanceof Error ? err.message : t("completeProfile.saveFailedRetry"));
    },
  });

  const handleCompleteProfile = useCallback(() => {
    setProfileError(null);
    if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
      setProfileError(t("completeProfile.nameRequired")); return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(profileForm.dateOfBirth)) {
      setProfileError(t("completeProfile.dateInvalid")); return;
    }
    if (!profileAgreedToTerms) {
      setProfileTermsError(t("validation.termsRequired")); return;
    }
    setProfileTermsError(null);
    completeProfileMutation.mutate(profileForm);
  }, [profileForm, completeProfileMutation, profileAgreedToTerms, t]);

  return {
    profileForm, setProfileForm,
    isProfileLoading,
    profileError,
    profileAgreedToTerms, setProfileAgreedToTerms,
    profileTermsError, setProfileTermsError,
    completeProfileMutation,
    handleCompleteProfile,
    resetProfileState,
  };
}
