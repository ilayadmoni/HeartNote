"use client";

/**
 * CompleteProfileForm
 *
 * "Dumb" form — middleware handles all routing. This component
 * trusts the server to enforce that the user is authenticated and
 * has an incomplete profile. It only handles:
 * - Hydrating the form from user_metadata / profile row
 * - Saving the completed profile
 * - Logout (Dual Wipe + hard reload)
 * - Displaying a reason-based alert from searchParams
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyProfile } from "@/actions/profile/update";
import { useAuth } from "@/contexts/AuthContext";
import { USER_QUERY_KEY, useUser } from "@/hooks/useUser";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfileQuery";
import { pushToDataLayer } from "@/utils/gtm";
import { useAuthLabels } from "@/components/auth/hooks/useAuthLabels";
import { CompleteProfileReasonAlert } from "./CompleteProfileReasonAlert";
import { CompleteProfileFields } from "./CompleteProfileFields";

interface FormState {
  firstName: string;
  lastName: string;
  birthDate: string;
  agreedToTerms: boolean;
}

export function CompleteProfileForm() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const t = useTranslations("auth");
  const labels = useAuthLabels();
  const { user, loading, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading } = useUser();
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    birthDate: "",
    agreedToTerms: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const didCompleteRef = useRef(false);

  // `next` comes from the OAuth callback chain, `returnTo` from the editor's action-guard.
  const nextParam = searchParams.get("next");
  const returnToParam = searchParams.get("returnTo");
  const returnTo = nextParam || returnToParam || "/";
  const reason = searchParams.get("reason");

  useEffect(() => {
    if (!user || isHydrated) return;
    setForm({
      firstName: profile?.first_name ?? "",
      lastName: profile?.last_name ?? "",
      birthDate: profile?.date_of_birth ?? "",
      agreedToTerms: false,
    });
    setIsHydrated(true);
  }, [user, profile, isHydrated]);

  const isValid = useMemo(() => {
    if (!form.firstName.trim() || !form.lastName.trim()) return false;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.birthDate)) return false;
    if (!form.agreedToTerms) return false;
    return !Number.isNaN(new Date(`${form.birthDate}T00:00:00`).getTime());
  }, [form]);

  const saveMutation = useMutation({
    mutationFn: async (values: FormState) => {
      if (!user) throw new Error(t("completeProfile.userNotSignedIn"));
      const result = await updateMyProfile({
        first_name: values.firstName.trim(),
        last_name: values.lastName.trim(),
        date_of_birth: values.birthDate,
      });
      if (!result.success) throw new Error(t("completeProfile.saveFailed"));
    },
    onSuccess: async () => {
      pushToDataLayer({ event: "sign_up", method: "google" });
      didCompleteRef.current = true;
      await queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });

      const siteUrl = window.location.origin || process.env.NEXT_PUBLIC_SITE_URL || "";
      const fullUrl = returnTo.startsWith("http") ? returnTo : `${siteUrl}${returnTo}`;
      window.location.href = fullUrl;
    },
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : t("completeProfile.saveFailedRetry"));
    },
  });

  const handleLogout = async () => {
    didCompleteRef.current = true;
    await signOut();
    queryClient.clear();
    window.location.href = "/";
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-body-md text-ink-muted">
        {t("completeProfile.loading")}
      </div>
    );
  }

  return (
    <main className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-8">
      <section className="w-full max-w-md bg-surface border border-line rounded-card shadow-card p-6">
        <h1 className="text-title-lg text-ink mb-2 text-center">{t("completeProfile.title")}</h1>
        <p className="text-body-sm text-ink-muted text-center mb-5">{t("completeProfile.subtitle")}</p>

        <CompleteProfileReasonAlert reason={reason} />

        <CompleteProfileFields
          form={form}
          setForm={setForm}
          termsError={termsError}
          setTermsError={setTermsError}
          error={error}
          isValid={isValid}
          isSaving={saveMutation.isPending}
          onSave={() => {
            setError(null);
            if (!form.agreedToTerms) {
              setTermsError(labels.AUTH_VALIDATION.termsRequired);
              return;
            }
            setTermsError(null);
            saveMutation.mutate(form);
          }}
          onLogout={handleLogout}
        />
      </section>
    </main>
  );
}
