"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

function getReadableError(
  errorDescription: string | null,
  message: string | null,
  fallback: string,
): string {
  const raw = errorDescription ?? message;
  if (!raw) return fallback;

  const normalized = raw.replace(/\+/g, " ").trim();
  return normalized.length > 0 ? normalized : fallback;
}

export default function AuthCodeErrorPage() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();

  const errorMessage = useMemo(() => {
    const errorDescription = searchParams.get("error_description");
    const message = searchParams.get("message");
    return getReadableError(errorDescription, message, t("authCodeError.defaultError"));
  }, [searchParams, t]);

  return (
    <main className="min-h-[100dvh] bg-surface flex items-center justify-center p-6">
      <section className="w-full max-w-xl rounded-card border border-line bg-surface-raised shadow-soft p-8 text-center">
        <p className="text-caption font-bold text-accent">{t("authCodeError.eyebrow")}</p>

        <h1 className="mt-2 text-title-lg text-ink">{t("authCodeError.title")}</h1>

        <p className="mt-4 text-body-md text-ink-muted leading-relaxed">{errorMessage}</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-11 px-6 rounded-pill bg-accent text-accent-ink font-bold text-body-sm shadow-glow-sm hover:bg-accent-hover hover:shadow-glow transition-colors duration-base"
          >
            {t("authCodeError.tryAnotherEmail")}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center h-11 px-6 rounded-pill bg-surface-raised text-ink border border-line-strong font-bold text-body-sm hover:border-accent hover:text-accent transition-colors duration-base"
          >
            {t("authCodeError.backHome")}
          </Link>
        </div>
      </section>
    </main>
  );
}
