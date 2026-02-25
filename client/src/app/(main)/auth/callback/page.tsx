"use client";

/**
 * Auth Callback Page
 * Handles email verification redirects from Supabase
 */

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error) {
        setStatus("error");
        setMessage(errorDescription || "אירעה שגיאה בתהליך האימות");
        return;
      }

      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setStatus("error");
            setMessage(error.message);
            return;
          }

          // Check if this is a password recovery flow
          const type = searchParams.get("type");
          if (type === "recovery") {
            setStatus("success");
            setMessage("מעבירים לשינוי סיסמה...");
            setTimeout(() => {
              router.push("/?reset_password=true");
            }, 1500);
            return;
          }

          setStatus("success");
          setMessage("האימייל אומת בהצלחה! מעבירים לעמוד הבית...");

          // Redirect after a short delay
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } catch {
          setStatus("error");
          setMessage("אירעה שגיאה בתהליך האימות");
        }
      } else {
        // No code provided, check for existing session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setStatus("success");
          setMessage("כבר מחוברים! מעבירים לעמוד הבית...");
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          setStatus("error");
          setMessage("לא נמצא קוד אימות");
        }
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#faf7f5] dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        {status === "loading" && (
          <>
            <Loader2
              size={48}
              className="mx-auto text-[#d4826f] animate-spin mb-4"
            />
            <h1 className="text-xl font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
              מאמתים את החשבון...
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-hebrew-body">
              אנא המתינו
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h1 className="text-xl font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
              אימות הצליח!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-hebrew-body">
              {message}
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle size={32} className="text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
              שגיאה באימות
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-hebrew-body">
              {message}
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 px-6 py-2.5 rounded-lg bg-[#d4826f] hover:bg-[#c4735f] text-white font-bold text-sm transition-all text-hebrew-heading"
            >
              חזרה לעמוד הבית
            </button>
          </>
        )}
      </div>
    </div>
  );
}
