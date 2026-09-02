/**
 * useAuthActions Hook
 *
 * Contains all NextAuth action implementations (signIn, signUp, signOut).
 * Extracted from AuthContext to keep files under 150 lines.
 *
 * SEC-2: signUp delegates to the registerUser server action so banned-email
 * checks happen server-side before any account is created. The client
 * always sees a generic success message.
 */

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";
import { getErrorMessage, formatDateOfBirth } from "./auth-helpers";
import { registerUser } from "@/actions/registration";

interface AuthActionsConfig {
  setError: (error: string | null) => void;
}

// Routes that require authentication
const PROTECTED_ROUTES = ["/profile", "/settings", "/dashboard", "/complete-profile"];

function isProtectedRoute(path: string) {
  return PROTECTED_ROUTES.some((route) => path.startsWith(route));
}

export function useAuthActions({ setError }: AuthActionsConfig) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const t = useTranslations("auth");

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    const result = await nextAuthSignIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      const msg = t("login.errorMessage");
      setError(msg);
      throw new Error(msg);
    }
  }, [setError, t]);

  const signUp = useCallback(async (
    email: string, password: string,
    firstName: string, lastName: string, dateOfBirth?: string,
  ) => {
    setError(null);
    try {
      let formattedDob: string | undefined;
      if (dateOfBirth) {
        const dob = formatDateOfBirth(dateOfBirth);
        if (!dob) {
          const msg = t("validation.dateInvalid");
          setError(msg);
          return { error: msg };
        }
        formattedDob = dob;
      }
      const result = await registerUser(firstName, lastName, email, password, formattedDob);
      if (result.error) {
        // Server errors already come back translated — set directly.
        setError(result.error);
        return { error: result.error };
      }
      return { success: result.success || true };
    } catch (err) {
      const msg = err instanceof Error
        ? getErrorMessage(err.message, (key) => t(key))
        : t("errorMap.internal");
      setError(msg);
      return { error: msg };
    }
  }, [setError, t]);

  const signOut = useCallback(async () => {
    setError(null);
    queryClient.clear();
    await nextAuthSignOut({ redirect: false });
    router.refresh();

    // Smart Redirect: Only push to home if leaving a protected route
    if (pathname && isProtectedRoute(pathname)) {
      router.push("/");
    }
  }, [setError, queryClient, router, pathname]);

  return { signIn, signUp, signOut, router };
}
