"use client";

/**
 * Reset Password Page
 * Allows the user to set a new password after clicking the recovery link.
 * The user is already authenticated at this point (session from callback).
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
import { KeyRound, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<
    "form" | "loading" | "success" | "error"
  >("form");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }
    if (password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    setStatus("loading");
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setStatus("error");
      setError(updateError.message);
      return;
    }

    setStatus("success");
    setTimeout(() => {
      router.push("/");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#faf7f5] dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        {status === "success" ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h1 className="text-xl font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
              הסיסמה שונתה בהצלחה!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-hebrew-body">
              מעבירים לעמוד הבית...
            </p>
          </div>
        ) : status === "error" && !password ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle size={32} className="text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
              שגיאה
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-hebrew-body">
              {error}
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 px-6 py-2.5 rounded-lg bg-[#d4826f] hover:bg-[#c4735f] text-white font-bold text-sm transition-all text-hebrew-heading"
            >
              חזרה לעמוד הבית
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-[#faf7f5] dark:bg-gray-700 flex items-center justify-center">
                <KeyRound
                  size={24}
                  className="text-[#2e3c52] dark:text-white"
                />
              </div>
            </div>

            <h1 className="text-xl font-bold text-center text-[#2e3c52] dark:text-white mb-1 text-hebrew-heading">
              הגדרת סיסמה חדשה
            </h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-hebrew-body text-sm">
              הזינו את הסיסמה החדשה שלכם
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400 text-sm text-center text-hebrew-body">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-[#2e3c52] dark:text-gray-200 mb-1 text-hebrew-body"
                >
                  סיסמה חדשה
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="הכניסו סיסמה חדשה"
                    className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#2e3c52] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4826f] text-hebrew-body"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d4826f] dark:hover:text-[#e8917a] transition-colors"
                    aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-[#2e3c52] dark:text-gray-200 mb-1 text-hebrew-body"
                >
                  אימות סיסמה
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="הכניסו סיסמה שוב"
                    className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#2e3c52] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4826f] text-hebrew-body"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d4826f] dark:hover:text-[#e8917a] transition-colors"
                    aria-label={showConfirm ? "הסתר סיסמה" : "הצג סיסמה"}
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="
                  w-full py-2.5 px-4 rounded-lg
                  bg-[#2e3c52] hover:bg-[#1B263B]
                  text-white font-bold text-base
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  text-hebrew-heading
                "
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  </span>
                ) : (
                  "עדכון סיסמה"
                )}
              </button>
            </form>
          </>
        )}

        {/* Bottom Accent */}
        <div className="h-1.5 bg-gradient-to-r from-[#d4826f] to-[#2e3c52] mt-6 rounded-full" />
      </div>
    </div>
  );
}
