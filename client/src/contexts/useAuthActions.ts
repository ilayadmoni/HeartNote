/**
 * useAuthActions Hook
 *
 * Contains all Supabase auth method implementations
 * (signIn, signUp, signOut, updatePassword).
 * Extracted from AuthContext to keep files under 150 lines.
 *
 * SEC-2: signUp now delegates to the registerUser server action
 * so banned-email checks happen server-side before any account
 * is created. The client always sees a generic success message.
 */

import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import type { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { getErrorMessage, formatDateOfBirth } from "./auth-helpers";
import { registerUser } from "@/actions/registration";

const supabase = createClient();

export { supabase };

interface AuthActionsConfig {
  setError: (error: string | null) => void;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  error: string | null;
}

// Define routes that require authentication
const PROTECTED_ROUTES = ["/profile", "/settings", "/dashboard", "/complete-profile"];

function isProtectedRoute(path: string) {
  return PROTECTED_ROUTES.some((route) => path.startsWith(route));
}

export function useAuthActions({ setError, setUser, setSession, error }: AuthActionsConfig) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      const { error: authErr } = await supabase.auth.signInWithPassword({ email, password });
      if (authErr) { setError(getErrorMessage(authErr.message)); throw authErr; }
    } catch (err) {
      if (err instanceof Error && !error) setError(getErrorMessage(err.message));
      throw err;
    }
  }, [setError, error]);

  const signUp = useCallback(async (
    email: string, password: string,
    firstName: string, lastName: string, dateOfBirth?: string,
    redirectTo?: string,
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
      // Build emailRedirectTo on the client where window.location.origin is available
      let emailRedirectTo: string | undefined;
      if (redirectTo) {
        emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
      }
      const result = await registerUser(firstName, lastName, email, password, formattedDob, emailRedirectTo);
      if (result.error) {
        // Server errors are already in Hebrew — set directly, don't translate
        setError(result.error);
        return { error: result.error };
      }
      // result.success → caller shows generic success UI
      return { success: result.success || true };
    } catch (err) {
      const msg = err instanceof Error ? getErrorMessage(err.message) : "שגיאה פנימית";
      setError(msg);
      return { error: msg };
    }
  }, [setError]);

  const signOut = useCallback(async () => {
    try {
      setError(null);
      const { error: authErr } = await supabase.auth.signOut();
      if (authErr) { setError(getErrorMessage(authErr.message)); throw authErr; }

      // Prevent stale cross-account UI by wiping all React Query data on logout.
      queryClient.clear();
      setUser(null);
      setSession(null);
      
      router.refresh();
      
      // Smart Redirect: Only push to home if leaving a protected route
      if (pathname && isProtectedRoute(pathname)) {
        router.push("/");
      }
    } catch (err) {
      if (err instanceof Error && !error) setError(getErrorMessage(err.message));
      throw err;
    }
  }, [setError, queryClient, setUser, setSession, router, pathname, error]);

  // NOTE: resetPassword was removed (SEC-5). All password reset flows
  // must go through the server action requestPasswordReset() in actions/password.ts
  // which enforces the 3-strike rate limit.

  const updatePassword = useCallback(async (password: string) => {
    try {
      setError(null);
      const { error: authErr } = await supabase.auth.updateUser({ password });
      if (authErr) { setError(getErrorMessage(authErr.message)); throw authErr; }
    } catch (err) {
      if (err instanceof Error && !error) setError(getErrorMessage(err.message));
      throw err;
    }
  }, [setError, error]);

  return { signIn, signUp, signOut, updatePassword, router };
}
