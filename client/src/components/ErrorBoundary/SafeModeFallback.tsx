"use client";

import { useTranslations } from "next-intl";

interface SafeModeFallbackProps {
  message?: string;
}

export function SafeModeFallback({ message }: SafeModeFallbackProps): JSX.Element {
  const t = useTranslations("common.errors");

  return (
    <div
      role="alert"
      className="min-h-[100dvh] flex flex-col items-center justify-center gap-4 px-6 text-center bg-surface"
    >
      <p className="text-body-md text-ink-muted max-w-prose break-words">
        {message ?? t("safeModeMessage")}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 rounded-pill bg-accent text-accent-ink font-bold"
      >
        {t("safeModeReload")}
      </button>
    </div>
  );
}
