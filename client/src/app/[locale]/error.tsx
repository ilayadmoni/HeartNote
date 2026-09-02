"use client";

import { RotateCw, Frown } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element {
  const t = useTranslations("common");

  return (
    <div className="min-h-[100dvh] bg-surface flex flex-col items-center justify-center p-6 text-center">
      <Frown aria-hidden="true" size={56} className="text-accent mb-6" />

      <h1 className="text-title-lg text-ink mb-3">{t("errors.title")}</h1>

      <p className="text-body-sm text-ink-muted mb-2 max-w-prose leading-relaxed">
        {t("errors.generic")}
      </p>

      {error?.digest && (
        <p className="text-caption text-ink-subtle mb-8 max-w-sm truncate">
          {t("errors.code", { digest: error.digest })}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="
            inline-flex items-center gap-2 px-6 py-3 rounded-pill
            bg-accent hover:bg-accent-hover text-accent-ink font-bold text-body-sm
            transition-all duration-base shadow-glow-sm hover:shadow-glow
          "
        >
          <RotateCw aria-hidden="true" size={18} />
          {t("actions.retry")}
        </button>

        <a
          href="/"
          className="
            inline-flex items-center gap-2 px-6 py-3 rounded-pill
            bg-surface-sunken hover:bg-surface-raised
            text-ink font-bold text-body-sm
            transition-all duration-base
          "
        >
          {t("actions.home")}
        </a>
      </div>
    </div>
  );
}
