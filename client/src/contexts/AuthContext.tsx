"use client";

/**
 * AuthContext
 * Provides authentication state and methods throughout the app.
 * Uses Supabase Auth with backend sync.
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
import type { User, Session } from "@supabase/supabase-js";
import { supabase, useAuthActions } from "./useAuthActions";

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
  ) => Promise<void>;
  signOut: () => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { signIn, signUp, signOut, updatePassword, router } =
    useAuthActions({
      setError,
      setUser,
      setSession: () => setSession(null),
      error,
    });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [router]);

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
