"use client";

/**
 * AuthContext
 * Provides authentication state and methods throughout the app
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    }
  };

  // Sign up with email/password
  const signUp = async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Update display name
      if (result.user) {
        await updateProfile(result.user, { displayName });
      }
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      // Using popup - if this fails, user should check Firebase Console settings
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      // Log the full error for debugging
      console.error("Google Sign-In Error:", err);

      const errorCode = (err as { code?: string }).code;
      const errorMessage = (err as { message?: string }).message;

      console.error("Error Code:", errorCode);
      console.error("Error Message:", errorMessage);

      // Handle specific popup errors
      if (errorCode === "auth/popup-blocked") {
        setError("חלון הקופץ נחסם. אנא אפשרו חלונות קופצים עבור אתר זה");
      } else if (errorCode === "auth/unauthorized-domain") {
        setError("הדומיין אינו מורשה. יש להוסיף אותו בהגדרות Firebase");
      } else if (errorCode === "auth/configuration-not-found") {
        setError("Google Sign-In לא מוגדר. הפעילו אותו ב-Firebase Console");
      } else if (errorCode === "auth/internal-error") {
        setError("שגיאה פנימית. וודאו ש-Google Sign-In מופעל ב-Firebase");
      } else {
        const message = getErrorMessage(err);
        setError(message);
      }
      throw err;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    }
  };

  // Clear error
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signInWithGoogle,
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

// Helper: Convert Firebase errors to Hebrew messages
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const code = (error as { code?: string }).code;

    switch (code) {
      case "auth/email-already-in-use":
        return "כתובת האימייל כבר בשימוש";
      case "auth/invalid-email":
        return "כתובת אימייל לא תקינה";
      case "auth/operation-not-allowed":
        return "הפעולה אינה מורשית";
      case "auth/weak-password":
        return "הסיסמה חלשה מדי";
      case "auth/user-disabled":
        return "החשבון הושבת";
      case "auth/user-not-found":
        return "משתמש לא נמצא";
      case "auth/wrong-password":
        return "סיסמה שגויה";
      case "auth/invalid-credential":
        return "פרטי ההתחברות שגויים";
      case "auth/popup-closed-by-user":
        return "החלון נסגר לפני השלמת ההתחברות";
      case "auth/cancelled-popup-request":
        return "הבקשה בוטלה";
      default:
        return "אירעה שגיאה. נסו שנית";
    }
  }
  return "אירעה שגיאה לא צפויה";
}
