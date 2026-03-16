"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

const DEFAULT_ERROR = "Authentication failed. The link may be invalid or expired.";

function getReadableError(
  errorDescription: string | null,
  message: string | null,
): string {
  const raw = errorDescription ?? message;
  if (!raw) return DEFAULT_ERROR;

  const normalized = raw.replace(/\+/g, " ").trim();
  return normalized.length > 0 ? normalized : DEFAULT_ERROR;
}

export default function AuthCodeErrorPage() {
  const searchParams = useSearchParams();

  const errorMessage = useMemo(() => {
    const errorDescription = searchParams.get("error_description");
    const message = searchParams.get("message");
    return getReadableError(errorDescription, message);
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-[#faf7f5] dark:bg-gray-900 flex items-center justify-center p-6">
      <section className="w-full max-w-xl rounded-2xl border border-[#ebe7e0] dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-8 text-center">
        <p className="text-sm text-[#d4826f] dark:text-[#e8917a] text-english-heading">
          Authentication Error
        </p>

        <h1 className="mt-2 text-2xl md:text-3xl text-[#2e3c52] dark:text-white text-english-heading">
          המייל שהשתמשתם בו לא חוקי
        </h1>

        <p className="mt-4 text-[#4b5563] dark:text-gray-300 text-english-body leading-relaxed">
          במידה ויש בעיה פנו לתמיכה דרך דף 'יצירת קשר'
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-[#d4826f] hover:bg-[#c4735f] text-white px-6 py-3 text-english-body transition-colors duration-200"
          >
            התחברות עם מייל אחר
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-[#d9d3cb] dark:border-gray-600 text-[#2e3c52] dark:text-gray-200 hover:bg-[#f7f3ef] dark:hover:bg-gray-700 px-6 py-3 text-english-body transition-colors duration-200"
          >
            חזרה לעמוד הראשי
          </Link>
        </div>
      </section>
    </main>
  );
}