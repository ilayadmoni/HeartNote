"use client";

/**
 * Public Page Loading State
 * Minimal branded loader for viewer pages
 */

import { useTranslations } from "next-intl";

export default function PublicLoading() {
  const t = useTranslations("share");
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-surface">
      <div className="w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-sm text-ink-subtle">{t("loading")}</p>
    </div>
  );
}
