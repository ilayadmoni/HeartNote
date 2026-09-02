"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { AccessibilitySettings } from "./AccessibilityProvider";
import { KEYS } from "./constants";
import { ToggleRow } from "./ToggleRow";
import { TextSizeControl } from "./components/TextSizeControl";

interface AccessibilityModalContentProps {
  settings: AccessibilitySettings;
  increaseText: () => void;
  decreaseText: () => void;
  toggleHighContrast: () => void;
  toggleGrayscale: () => void;
  toggleHighlightLinks: () => void;
  toggleReadableFont: () => void;
  toggleStopAnimations: () => void;
  reset: () => void;
  onClose: () => void;
}

export function AccessibilityModalContent({
  settings,
  increaseText,
  decreaseText,
  toggleHighContrast,
  toggleGrayscale,
  toggleHighlightLinks,
  toggleReadableFont,
  toggleStopAnimations,
  reset,
  onClose,
}: AccessibilityModalContentProps): JSX.Element {
  const t = useTranslations("accessibility");

  return (
    <div
      className="flex flex-col gap-4 p-5 text-body-sm text-ink overflow-y-auto max-h-[80vh] lg:max-h-[calc(100vh-6rem)]"
      role="dialog"
      aria-modal="true"
      aria-label={t("modal.title")}
      onKeyDown={(event) => {
        if (event.key === KEYS.ESCAPE) {
          event.preventDefault();
          onClose();
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-body-md font-semibold text-ink">{t("modal.title")}</p>
          <p className="text-caption text-ink-muted">{t("modal.subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-pill p-1 text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={t("modal.closeLabel")}
        >
          <X aria-hidden="true" size={20} />
        </button>
      </div>

      <div className="space-y-3">
        <TextSizeControl
          fontScale={settings.fontScale}
          onIncrease={increaseText}
          onDecrease={decreaseText}
        />

        <ToggleRow
          label={t("toggles.highContrast.label")}
          description={t("toggles.highContrast.description")}
          checked={settings.highContrast}
          onChange={toggleHighContrast}
        />
        <ToggleRow
          label={t("toggles.grayscale.label")}
          description={t("toggles.grayscale.description")}
          checked={settings.grayscale}
          onChange={toggleGrayscale}
        />
        <ToggleRow
          label={t("toggles.highlightLinks.label")}
          description={t("toggles.highlightLinks.description")}
          checked={settings.highlightLinks}
          onChange={toggleHighlightLinks}
        />
        <ToggleRow
          label={t("toggles.readableFont.label")}
          description={t("toggles.readableFont.description")}
          checked={settings.readableFont}
          onChange={toggleReadableFont}
        />
        <ToggleRow
          label={t("toggles.stopAnimations.label")}
          description={t("toggles.stopAnimations.description")}
          checked={settings.stopAnimations}
          onChange={toggleStopAnimations}
        />
      </div>

      <button
        type="button"
        onClick={reset}
        className="mt-1 rounded-control border border-line bg-surface-raised px-4 py-2 text-body-sm font-semibold text-ink hover:bg-surface-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {t("modal.reset")}
      </button>
    </div>
  );
}
