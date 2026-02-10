"use client";

/**
 * AuthContext
 * Provides authentication state and methods throughout the app
 * Uses Supabase Auth with backend sync
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

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
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter(); // Initialize router
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Force Next.js to re-render server components when auth state
      // changes (login / logout).  Without this the header buttons stay
      // "locked" until a manual page refresh.
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(getErrorMessage(error.message));
        throw error;
      }
    } catch (err) {
      if (err instanceof Error && !error) {
        setError(getErrorMessage(err.message));
      }
      throw err;
    }
  };

  // Sign up with email/password
  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dateOfBirth?: string,
  ) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`.trim(),
            date_of_birth: dateOfBirth,
          },
          // Don't auto-sign in - require email verification
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setError(getErrorMessage(error.message));
        throw error;
      }
      // Don't set user - they need to verify email first
    } catch (err) {
      if (err instanceof Error && !error) {
        setError(getErrorMessage(err.message));
      }
      throw err;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(getErrorMessage(error.message));
        throw error;
      }
      setUser(null);
      setSession(null);
      router.refresh();
      router.push("/");
    } catch (err) {
      if (err instanceof Error && !error) {
        setError(getErrorMessage(err.message));
      }
      throw err;
    }
  };

  // Clear error
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
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper: Convert Supabase errors to Hebrew messages
function getErrorMessage(errorMessage: string): string {
  const lowerMessage = errorMessage.toLowerCase();

  if (
    lowerMessage.includes("email already registered") ||
    lowerMessage.includes("user already registered")
  ) {
    return "כתובת האימייל כבר בשימוש";
  }
  if (lowerMessage.includes("invalid email")) {
    return "כתובת אימייל לא תקינה";
  }
  if (lowerMessage.includes("password") && lowerMessage.includes("weak")) {
    return "הסיסמה חלשה מדי";
  }
  if (lowerMessage.includes("password") && lowerMessage.includes("short")) {
    return "הסיסמה קצרה מדי (מינימום 6 תווים)";
  }
  if (
    lowerMessage.includes("invalid login credentials") ||
    lowerMessage.includes("invalid credentials")
  ) {
    return "פרטי ההתחברות שגויים";
  }
  if (lowerMessage.includes("email not confirmed")) {
    return "יש לאמת את כתובת האימייל";
  }
  if (lowerMessage.includes("user not found")) {
    return "משתמש לא נמצא";
  }
  if (lowerMessage.includes("too many requests")) {
    return "יותר מדי ניסיונות. נסו שוב מאוחר יותר";
  }
  if (lowerMessage.includes("network")) {
    return "שגיאת רשת. בדקו את החיבור לאינטרנט";
  }

  return "אירעה שגיאה. נסו שנית";
}
