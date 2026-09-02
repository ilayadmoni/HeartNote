"use client";

/**
 * Error boundary for the /create editor route group.
 * Catches crashes in the editor without replacing the entire layout (header/footer).
 * MED-4: Granular error boundaries for better UX.
 */

import { useTranslations } from "next-intl";

export default function CreateError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element {
  const t = useTranslations("editor");

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <span className="text-5xl mb-4" aria-hidden="true">
        😵‍💫
      </span>

      <h2 className="text-title-md font-black text-ink mb-2">
        {t("errorBoundary.title")}
      </h2>

      <p className="text-ink-muted mb-6 max-w-prose text-body-sm leading-relaxed">
        {t("errorBoundary.body")}
      </p>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-accent-ink font-bold text-body-sm rounded-pill shadow-soft transition-colors duration-200"
        >
          {t("errorBoundary.retry")}
        </button>
        <a
          href="/gallery"
          className="px-5 py-2.5 bg-surface-sunken hover:bg-line text-ink font-bold text-body-sm rounded-pill transition-colors duration-200"
        >
          {t("shell.backToGallery")}
        </a>
      </div>
    </div>
  );
}
