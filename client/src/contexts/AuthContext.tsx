"use client";

/**
 * AuthContext
 * Provides authentication state and methods throughout the app.
 * Backed by NextAuth's SessionProvider — this context is a thin adapter
 * that keeps the same public shape the rest of the app already depends on
 * (`user`, `loading`, `error`, `signIn`, `signUp`, `signOut`, `clearError`),
 * so most consumers needed no changes when the auth backend swapped.
 *
 * Server-Driven Auth model:
 * The middleware is the single source of truth for routing.
 * This context only manages client-side state (user, loading) and does NOT
 * perform any navigation or route-guarding.
 */

import { createContext, useContext, useState, ReactNode } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useAuthActions } from "./useAuthActions";
import Loading from "@/app/(main)/loading";

export interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
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
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthBridge({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, signOut } = useAuthActions({ setError });

  const loading = status === "loading";
  const user: AuthUser | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email ?? null,
        name: session.user.name ?? null,
        image: session.user.image ?? null,
      }
    : null;

  const clearError = () => setError(null);

  const value: AuthContextType = { user, loading, error, signIn, signUp, signOut, clearError };

  if (loading) {
    return (
      <AuthContext.Provider value={value}>
        <Loading />
      </AuthContext.Provider>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthBridge>{children}</AuthBridge>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
