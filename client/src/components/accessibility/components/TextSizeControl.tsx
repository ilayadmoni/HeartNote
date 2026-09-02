"use client";

import { useTranslations } from "next-intl";

interface TextSizeControlProps {
  fontScale: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const MIN_SCALE = 0.85;
const MAX_SCALE = 1.3;

/** Text-size stepper row inside the accessibility modal. */
export function TextSizeControl({ fontScale, onIncrease, onDecrease }: TextSizeControlProps): JSX.Element {
  const t = useTranslations("accessibility.modal");

  return (
    <div className="flex items-center justify-between rounded-control border border-line bg-surface-sunken px-3 py-2">
      <span className="text-caption sm:text-body-sm font-medium text-ink">{t("textSize")}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDecrease}
          disabled={fontScale <= MIN_SCALE}
          className="h-8 w-8 rounded-pill border border-line bg-surface-raised text-body-md font-semibold hover:bg-surface-sunken disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={t("decreaseLabel")}
        >
          A−
        </button>
        <span className="w-8 text-center text-caption text-ink-muted">{Math.round(fontScale * 100)}%</span>
        <button
          type="button"
          onClick={onIncrease}
          disabled={fontScale >= MAX_SCALE}
          className="h-8 w-8 rounded-pill border border-line bg-surface-raised text-body-md font-semibold hover:bg-surface-sunken disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={t("increaseLabel")}
        >
          A+
        </button>
      </div>
    </div>
  );
}
