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
import { useRouter, usePathname } from "next/navigation";
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

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    const result = await nextAuthSignIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      const msg = "שם משתמש או סיסמה שגויים";
      setError(msg);
      throw new Error(msg);
    }
  }, [setError]);

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
          setError("תאריך לידה לא תקין");
          return { error: "תאריך לידה לא תקין" };
        }
        formattedDob = dob;
      }
      const result = await registerUser(firstName, lastName, email, password, formattedDob);
      if (result.error) {
        // Server errors are already in Hebrew — set directly, don't translate
        setError(result.error);
        return { error: result.error };
      }
      return { success: result.success || true };
    } catch (err) {
      const msg = err instanceof Error ? getErrorMessage(err.message) : "שגיאה פנימית";
      setError(msg);
      return { error: msg };
    }
  }, [setError]);

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
