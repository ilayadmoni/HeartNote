"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  questionText: string;
}

export function Step2PreviewCard({ questionText }: Props): JSX.Element {
  const t = useTranslations("demo.step2");

  return (
    <div className="bg-surface p-6 rounded-card shadow-lift text-center w-full max-w-[260px] border border-line">
      <div className="bg-accent-soft w-11 h-11 rounded-control flex items-center justify-center mx-auto mb-4">
        <Heart className="w-5 h-5 text-accent" fill="currentColor" />
      </div>
      <h3 className="text-body-md text-ink mb-2 leading-snug">{questionText}</h3>
      <p className="text-caption text-ink-muted mb-5">{t("hint")}</p>
      <div className="flex gap-3 w-full">
        <button type="button" className="flex-[0.8] py-2.5 bg-surface-sunken text-ink-muted rounded-pill text-body-sm" aria-label={t("no")}>
          {t("no")}
        </button>
        <button
          type="button"
          className="flex-[1.2] py-2.5 bg-accent text-accent-ink rounded-pill text-body-sm font-bold flex justify-center items-center gap-1.5 shadow-glow-sm"
          aria-label={t("yes")}
        >
          {t("yes")} <Heart className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>
    </div>
  );
}
