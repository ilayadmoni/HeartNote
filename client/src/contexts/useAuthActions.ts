/**
 * useAuthActions Hook
 *
 * Contains all Supabase auth method implementations
 * (signIn, signUp, signOut, resetPassword, updatePassword).
 * Extracted from AuthContext to keep files under 150 lines.
 */

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { getErrorMessage, formatDateOfBirth } from "./auth-helpers";

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
    try {
      setError(null);
      let formattedDob: string | undefined;
      if (dateOfBirth) {
        const dob = formatDateOfBirth(dateOfBirth);
        if (!dob) { setError("תאריך לידה לא תקין"); throw new Error("Invalid date_of_birth format"); }
        formattedDob = dob;
      }
      const { error: authErr } = await supabase.auth.signUp({
        email, password,
        options: {
          data: { first_name: firstName, last_name: lastName, full_name: `${firstName} ${lastName}`.trim(), date_of_birth: formattedDob },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (authErr) { setError(getErrorMessage(authErr.message)); throw authErr; }
    } catch (err) {
      if (err instanceof Error && !error) setError(getErrorMessage(err.message));
      throw err;
    }
  }, [setError, error]);

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

  const resetPassword = useCallback(async (email: string) => {
    try {
      setError(null);
      const { error: authErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });
      if (authErr) { setError(getErrorMessage(authErr.message)); throw authErr; }
    } catch (err) {
      if (err instanceof Error && !error) setError(getErrorMessage(err.message));
      throw err;
    }
  }, [setError, error]);

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

  return { signIn, signUp, signOut, resetPassword, updatePassword, router };
}
