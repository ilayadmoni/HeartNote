"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { BrandCalendar } from "@/components/ui/BrandCalendar";
import { AUTH_VALIDATION } from "@/components/auth/constants";
import { useAuth } from "@/contexts/AuthContext";
import { USER_QUERY_KEY, useUser } from "@/hooks/useUser";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfileQuery";
import { getPendingCreation } from "@/lib/pendingCreation";

interface FormState {
  firstName: string;
  lastName: string;
  birthDate: string;
  agreedToTerms: boolean;
}

function splitGoogleName(fullName: string | undefined): Pick<FormState, "firstName" | "lastName"> {
  if (!fullName) return { firstName: "", lastName: "" };
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export function CompleteProfileForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();
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
  const [isSessionValidating, setIsSessionValidating] = useState(true);
  const didCompleteRef = useRef(false);
  const isForceLogoutRunningRef = useRef(false);

  const forceLogoutToLogin = useCallback(async () => {
    if (isForceLogoutRunningRef.current || didCompleteRef.current) return;
    isForceLogoutRunningRef.current = true;

    try {
      // Server-side signOut ensures httpOnly SSR cookies are cleared.
      await fetch("/api/auth/logout", { method: "POST" });
      await queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    } finally {
      // CRITICAL: Do NOT call router.replace('/') here.
      // The middleware already handles where to send the user.
      // Calling replace would hijack <Link> navigation.
      isForceLogoutRunningRef.current = false;
    }
  }, [queryClient]);

  useEffect(() => {
    let isMounted = true;

    async function validateSession() {
      // Wait for the context's initial sweep to finish loading
      if (loading) return;

      console.log("[ProfileGuard] AuthContext state:", { loading, hasUser: !!user });

      const supabase = createClient();
      const { data: { session }, error } = await supabase.auth.getSession();
      
      console.log("[ProfileGuard] Supabase getSession result:", { 
        hasSession: !!session, 
        error: error?.message 
      });

      if (!isMounted) return;

      if (session) {
        console.log("[ProfileGuard] Session valid. Allowing form render.");
        setIsSessionValidating(false);
      } else {
        console.log("[ProfileGuard] No session found. Kicking user to /.");
        router.replace("/");
      }
    }

    void validateSession();

    return () => {
      isMounted = false;
    };
  }, [loading, user, router]);

  useEffect(() => {
    if (loading || !user) return;

    const handleBackNavigation = () => {
      if (!didCompleteRef.current) {
        void forceLogoutToLogin();
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!didCompleteRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("popstate", handleBackNavigation);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handleBackNavigation);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [loading, user, forceLogoutToLogin]);

  useEffect(() => {
    if (!user || isHydrated) return;
    const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
    const parsed = splitGoogleName(typeof metadata.full_name === "string" ? metadata.full_name : undefined);
    setForm({
      firstName: profile?.first_name ?? parsed.firstName,
      lastName: profile?.last_name ?? parsed.lastName,
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
      if (!user) throw new Error("המשתמש לא מחובר.");
      const supabase = createClient();
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          first_name: values.firstName.trim(),
          last_name: values.lastName.trim(),
          date_of_birth: values.birthDate,
        },
        { onConflict: "id" },
      );
      if (profileError) throw new Error("שמירת פרופיל נכשלה.");

      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          first_name: values.firstName.trim(),
          last_name: values.lastName.trim(),
          birth_date: values.birthDate,
          date_of_birth: values.birthDate,
          full_name: `${values.firstName.trim()} ${values.lastName.trim()}`.trim(),
        },
      });
      if (metadataError) throw new Error("שמירת פרטי משתמש נכשלה.");
    },
    onSuccess: async () => {
      didCompleteRef.current = true;
      await queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      const pending = getPendingCreation();
      if (pending?.returnPath) {
        router.replace(pending.returnPath);
        return;
      }
      router.replace("/gallery");
    },
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : "שמירה נכשלה. נסו שוב.");
    },
  });

  const handleLogout = async () => {
    didCompleteRef.current = true;
    // Server-side signOut ensures httpOnly SSR cookies are cleared.
    await fetch("/api/auth/logout", { method: "POST" });
    await queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    router.replace("/");
  };

  if (loading || profileLoading || isSessionValidating) {
    return <div className="min-h-[50vh] flex items-center justify-center text-hebrew-body">טוען...</div>;
  }

  return (
    <main className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-8" dir="rtl">
      <section className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl text-[#2e3c52] dark:text-white text-hebrew-heading mb-2 text-center">השלמת פרופיל</h1>
        <p className="text-sm text-gray-500 dark:text-gray-300 text-hebrew-body text-center mb-5">כדי להמשיך עם Google יש להשלים שם פרטי, שם משפחה ותאריך לידה.</p>

        <div className="space-y-3">
          <div>
            <label htmlFor="cp-first-name" className="block text-xs mb-1 text-hebrew-body text-gray-600 dark:text-gray-300">שם פרטי</label>
            <input
              id="cp-first-name"
              value={form.firstName}
              onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm text-[#2e3c52] dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="cp-last-name" className="block text-xs mb-1 text-hebrew-body text-gray-600 dark:text-gray-300">שם משפחה</label>
            <input
              id="cp-last-name"
              value={form.lastName}
              onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm text-[#2e3c52] dark:text-white"
            />
          </div>

          <BrandCalendar
            value={form.birthDate}
            onChange={(value) => setForm((prev) => ({ ...prev, birthDate: value }))}
            label="תאריך לידה"
          />

          <div className="mt-4 mb-1">
            <div
              role="checkbox"
              aria-checked={form.agreedToTerms}
              tabIndex={0}
              onClick={() => {
                setForm((prev) => ({ ...prev, agreedToTerms: !prev.agreedToTerms }));
                if (termsError) setTermsError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  setForm((prev) => ({ ...prev, agreedToTerms: !prev.agreedToTerms }));
                  if (termsError) setTermsError(null);
                }
              }}
              className="flex items-center gap-2 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#2e3c52] focus-visible:ring-offset-1 rounded"
              dir="rtl"
            >
              <span className="text-xs text-[#2e3c52] dark:text-gray-300 text-hebrew-body leading-relaxed">
                קראתי ואני מאשר/ת את{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="underline text-[#d4826f] hover:text-[#c4725f] dark:text-[#e8917a] dark:hover:text-[#f0a18a] font-semibold"
                >
                  תנאי השימוש ומדיניות הפרטיות
                </Link>
              </span>

              <span
                className={`
                  shrink-0 flex items-center justify-center
                  w-[18px] h-[18px] rounded-[4px] border-2
                  transition-all duration-150
                  ${
                    form.agreedToTerms
                      ? "bg-[#2e3c52] border-[#2e3c52] dark:bg-[#d4826f] dark:border-[#d4826f]"
                      : "bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-500"
                  }
                `}
              >
                <svg
                  className={`w-[11px] h-[11px] text-white pointer-events-none transition-all duration-150 ${
                    form.agreedToTerms ? "opacity-100 scale-100" : "opacity-0 scale-50"
                  }`}
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 6l3 3 5-5" />
                </svg>
              </span>
            </div>

            {termsError && (
              <p className="text-xs text-red-500 mt-1 text-hebrew-body text-right">
                {termsError}
              </p>
            )}
          </div>

          <p className={`text-xs text-center text-hebrew-body transition-opacity ${error ? "opacity-100 text-red-500" : "opacity-0"}`}>
            {error || "\u00A0"}
          </p>

          <button
            type="button"
            disabled={!isValid || saveMutation.isPending}
            onClick={() => {
              setError(null);
              if (!form.agreedToTerms) {
                setTermsError(AUTH_VALIDATION.termsRequired);
                return;
              }
              setTermsError(null);
              saveMutation.mutate(form);
            }}
            className="w-full py-2.5 rounded-lg bg-[#2e3c52] hover:bg-[#1B263B] text-white text-hebrew-heading disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveMutation.isPending ? "שומר..." : "שמירה והמשך"}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-[#2e3c52] dark:text-gray-200 text-hebrew-body hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            התנתקות
          </button>
        </div>
      </section>
    </main>
  );
}
