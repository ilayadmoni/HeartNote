"use client";

/**
 * AuthContext
 * Provides authentication state and methods throughout the app.
 * Uses Supabase Auth with backend sync.
 *
 * Server-Driven Auth model:
 * The middleware is the single source of truth for routing.
 * This context only manages client-side state (user, session, loading)
 * and does NOT perform any navigation or route-guarding.
 *
 * Auth methods live in ./useAuthActions.ts.
 * Error translation lives in ./auth-helpers.ts.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { User, Session } from "@supabase/supabase-js";
import { supabase, useAuthActions } from "./useAuthActions";
import Loading from "@/app/(main)/loading";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dateOfBirth?: string,
    redirectTo?: string,
  ) => Promise<{ error?: string; success?: boolean | string }>;
  signOut: () => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { signIn, signUp, signOut, updatePassword, router } = useAuthActions({
    setError,
    setUser,
    setSession,
    error,
  });

  // ── Bootstrap + subscribe to auth changes ──────────────────────────

  useEffect(() => {
    let isMounted = true;

    // Keep loading=true until initial auth session hydration is resolved.
    const bootstrapSession = async () => {
      setLoading(true);
      try {
        const {
          data: { session: s },
        } = await supabase.auth.getSession();

        if (!isMounted) return;
        setSession(s);
        setUser(s?.user ?? null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void bootstrapSession();

    // Listen for auth state changes (sign in, sign out, token refresh).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, s) => {
      if (!isMounted) return;

      if (event === "SIGNED_OUT") {
        queryClient.clear();
        setSession(null);
        setUser(null);
        setError(null);
        setLoading(false);
        router.refresh();
        return;
      }

      setSession(s);
      setUser(s?.user ?? null);

      // OAuth callback and standard sign-in both converge here.
      // Dropping loading on SIGNED_IN prevents unauth flashes.
      if (event === "SIGNED_IN") {
        setLoading(false);
      }

      // Fallback for events that still carry authoritative auth state.
      if (event !== "SIGNED_IN") {
        setLoading(false);
      }

      // Refresh server components when auth state changes.
      router.refresh();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [queryClient, router]);

  const clearError = () => setError(null);

  // Global auth-hydration gate to prevent UI flash during OAuth callback return.
  if (loading) {
    return (
      <AuthContext.Provider
        value={{
          user,
          session,
          loading,
          error,
          signIn,
          signUp,
          signOut,
          updatePassword,
          clearError,
        }}
      >
        <Loading />
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        updatePassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
