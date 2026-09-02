"use client";

/**
 * Error boundary for the public pages route group (shared links like /p/[slug]).
 */

import { Frown } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PublicError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element {
  const t = useTranslations("common");

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-surface">
      <Frown aria-hidden="true" size={48} className="text-accent mb-4" />

      <h2 className="text-title-md text-ink mb-2">{t("errors.title")}</h2>

      <p className="text-body-sm text-ink-muted mb-6 max-w-prose leading-relaxed">
        {t("errors.loadFailed")}
      </p>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-accent-ink font-bold text-body-sm rounded-pill shadow-soft transition-all duration-base"
        >
          {t("actions.retry")}
        </button>
        <a
          href="/"
          className="px-5 py-2.5 bg-surface-sunken hover:bg-surface-raised text-ink font-bold text-body-sm rounded-pill transition-all duration-base"
        >
          {t("actions.home")}
        </a>
      </div>
    </div>
  );
}
