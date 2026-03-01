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
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { getErrorMessage, formatDateOfBirth } from "./auth-helpers";
import { registerUser } from "@/actions/registration";

const supabase = createClient();

export { supabase };

interface AuthActionsConfig {
  setError: (error: string | null) => void;
  setUser: (user: User | null) => void;
  setSession: (session: null) => void;
  error: string | null;
}

export function useAuthActions({ setError, setUser, setSession, error }: AuthActionsConfig) {
  const router = useRouter();

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
      setUser(null);
      setSession(null);
      router.refresh();
      router.push("/");
    } catch (err) {
      if (err instanceof Error && !error) setError(getErrorMessage(err.message));
      throw err;
    }
  }, [setError, setUser, setSession, router, error]);

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
