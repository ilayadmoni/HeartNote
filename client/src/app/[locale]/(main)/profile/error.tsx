"use client";

/**
 * Error boundary for the /profile route group.
 */

import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function ProfileError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element {
  const t = useTranslations("profile");
  const common = useTranslations("common");

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-full bg-accent-soft flex items-center justify-center mb-4">
        <AlertTriangle className="text-accent" size={28} aria-hidden="true" />
      </div>

      <h2 className="text-title-lg font-black text-ink mb-2">{t("error.title")}</h2>

      <p className="text-ink-muted mb-6 max-w-prose text-body-sm leading-relaxed">{t("error.body")}</p>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-accent-ink font-bold text-body-sm rounded-pill shadow-soft transition-all duration-200"
        >
          {common("actions.retry")}
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 bg-surface-sunken hover:bg-line text-ink font-bold text-body-sm rounded-pill transition-all duration-200"
        >
          {common("actions.home")}
        </Link>
      </div>
    </div>
  );
}
