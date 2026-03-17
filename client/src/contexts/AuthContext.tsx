"use client";

/**
 * AuthContext
 * Provides authentication state and methods throughout the app.
 * Uses Supabase Auth with backend sync.
 *
 * "Polite Logout" client-side behavior:
 * When the middleware drops a session (incomplete Google profile), the
 * onAuthStateChange listener fires a SIGNED_OUT event. We clear local
 * state immediately so the Navbar reacts, but we do NOT call
 * router.replace('/') — the native `<Link>` navigation must finish
 * without being hijacked.
 *
 * Auth methods live in ./useAuthActions.ts.
 * Error translation lives in ./auth-helpers.ts.
 */

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  useRef,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase, useAuthActions } from "./useAuthActions";
import { isGoogleUser, isProfileIncomplete } from "./googleProfileGuard";

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
  ) => Promise<{ error?: string; success?: boolean | string }>;
  signOut: () => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** Prevents duplicate guard executions while one is in-flight. */
  const guardRunningRef = useRef(false);

  const { signIn, signUp, signOut, updatePassword, router } = useAuthActions({
    setError,
    setUser,
    setSession: () => setSession(null),
    error,
  });

  /**
   * Enforce the Google profile guard on the client side.
   *
   * CRITICAL: When the guard signs the user out, we clear local state
   * but do NOT navigate. The middleware already handled the response
   * (redirect or pass-through), and the user's intended `<Link>`
   * navigation should complete naturally.
   */
  const enforceGoogleProfileGuard = useCallback(
    async (nextSession: Session | null, event?: AuthChangeEvent) => {
      // If middleware already dropped the session (SIGNED_OUT event),
      // just clear local state without navigating.
      if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      if (!nextSession?.user) {
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      const nextUser = nextSession.user;

      // Non-Google users pass through immediately.
      if (!isGoogleUser(nextUser)) {
        setSession(nextSession);
        setUser(nextUser);
        setLoading(false);
        return;
      }

      // Prevent concurrent guard executions.
      if (guardRunningRef.current) return;
      guardRunningRef.current = true;

      try {
        const { data: profileRow } = await supabase
          .from("profiles")
          .select("first_name, last_name, date_of_birth")
          .eq("id", nextUser.id)
          .maybeSingle();

        const incomplete = isProfileIncomplete(nextUser, profileRow);

        if (incomplete && pathname !== "/complete-profile") {
          // Sign out locally. Do NOT navigate — let middleware handle it.
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }

        if (!incomplete && pathname === "/complete-profile") {
          router.replace("/gallery");
        }

        setSession(nextSession);
        setUser(nextUser);
        setLoading(false);
      } finally {
        guardRunningRef.current = false;
      }
    },
    [pathname, router],
  );

  // ── Bootstrap + subscribe to auth changes ──────────────────────────

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      void enforceGoogleProfileGuard(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      void enforceGoogleProfileGuard(session, event);
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [router, enforceGoogleProfileGuard]);

  // Re-evaluate guard when the pathname changes (e.g. user navigates
  // away from /complete-profile via a <Link>).
  useEffect(() => {
    if (loading) return;
    void enforceGoogleProfileGuard(session);
  }, [pathname, loading, session, enforceGoogleProfileGuard]);

  const clearError = () => setError(null);

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
