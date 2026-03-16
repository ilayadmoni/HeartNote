"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { BrandCalendar } from "@/components/ui/BrandCalendar";
import { useAuth } from "@/contexts/AuthContext";
import { USER_QUERY_KEY, useUser } from "@/hooks/useUser";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfileQuery";
import { getPendingCreation } from "@/lib/pendingCreation";

interface FormState {
  firstName: string;
  lastName: string;
  birthDate: string;
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
  const [form, setForm] = useState<FormState>({ firstName: "", lastName: "", birthDate: "" });
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/gallery");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || isHydrated) return;
    const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
    const parsed = splitGoogleName(typeof metadata.full_name === "string" ? metadata.full_name : undefined);
    setForm({
      firstName: profile?.first_name ?? parsed.firstName,
      lastName: profile?.last_name ?? parsed.lastName,
      birthDate: profile?.date_of_birth ?? "",
    });
    setIsHydrated(true);
  }, [user, profile, isHydrated]);

  const isValid = useMemo(() => {
    if (!form.firstName.trim() || !form.lastName.trim()) return false;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.birthDate)) return false;
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
    const supabase = createClient();
    await supabase.auth.signOut();
    await queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    router.replace("/gallery");
  };

  if (loading || profileLoading) {
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

          <p className={`text-xs text-center text-hebrew-body transition-opacity ${error ? "opacity-100 text-red-500" : "opacity-0"}`}>
            {error || "\u00A0"}
          </p>

          <button
            type="button"
            disabled={!isValid || saveMutation.isPending}
            onClick={() => {
              setError(null);
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
