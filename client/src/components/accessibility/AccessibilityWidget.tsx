"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PersonStanding } from "lucide-react";
import { useTranslations } from "next-intl";
import { FocusTrap } from "@/components/accessibility";
import { useAccessibility } from "@/components/accessibility/AccessibilityProvider";
import { useMotionOk } from "@/lib/motion";
import { AccessibilityModalContent } from "./AccessibilityModalContent";

export function AccessibilityWidget(): JSX.Element {
  const t = useTranslations("accessibility.widget");
  const {
    settings,
    increaseText,
    decreaseText,
    toggleHighContrast,
    toggleGrayscale,
    toggleHighlightLinks,
    toggleReadableFont,
    toggleStopAnimations,
    reset,
  } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const motionOk = useMotionOk();

  useEffect(() => {
    if (!isOpen && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [isOpen]);

  const close = (): void => setIsOpen(false);
  const toggle = (): void => setIsOpen((prev) => !prev);

  return (
    <div className="fixed bottom-6 end-6 z-40 flex flex-col items-end gap-3">
      <motion.button
        ref={triggerRef}
        type="button"
        aria-label={t("openLabel")}
        onClick={toggle}
        initial={motionOk ? { opacity: 0, scale: 0.8, y: 20 } : undefined}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={motionOk ? { opacity: 0, scale: 0.8, y: 20 } : undefined}
        transition={{ duration: 0.2, ease: "easeOut" }}
        whileHover={motionOk ? { scale: 1.06 } : undefined}
        whileTap={motionOk ? { scale: 0.95 } : undefined}
        className="
          w-12 h-12 rounded-pill
          bg-accent hover:bg-accent-hover text-accent-ink
          shadow-glow-sm hover:shadow-glow
          flex items-center justify-center
          transition-all duration-200
          backdrop-blur-sm
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
        "
      >
        <PersonStanding size={24} strokeWidth={2.5} />
      </motion.button>

      {isOpen && (
        <div className="fixed inset-0 z-[150]">
          <div className="absolute inset-0 bg-ink/40" onClick={close} aria-hidden="true" />
          <div className="absolute bottom-6 end-6 lg:top-20 lg:bottom-auto w-[320px] max-w-[95vw] max-h-[80vh] lg:max-h-[calc(100vh-6rem)] overflow-hidden rounded-card bg-surface-raised shadow-lift ring-1 ring-line">
            <FocusTrap active={isOpen} onEscape={close}>
              <AccessibilityModalContent
                settings={settings}
                increaseText={increaseText}
                decreaseText={decreaseText}
                toggleHighContrast={toggleHighContrast}
                toggleGrayscale={toggleGrayscale}
                toggleHighlightLinks={toggleHighlightLinks}
                toggleReadableFont={toggleReadableFont}
                toggleStopAnimations={toggleStopAnimations}
                reset={reset}
                onClose={close}
              />
            </FocusTrap>
          </div>
        </div>
      )}
    </div>
  );
}
