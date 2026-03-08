"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PersonStanding } from "lucide-react";
import { FocusTrap } from "@/components/accessibility";
import { useAccessibility } from "@/components/accessibility/AccessibilityProvider";
import { AccessibilityModalContent } from "./AccessibilityModalContent";

export function AccessibilityWidget() {
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

  useEffect(() => {
    if (!isOpen && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [isOpen]);

  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 md:bottom-6 md:right-6"
      dir="rtl"
    >
      <motion.button
        ref={triggerRef}
        type="button"
        aria-label="פתח תפריט נגישות"
        onClick={toggle}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="
          w-12 h-12 rounded-full
          bg-[#d4826f] hover:bg-[#c4735f]
          dark:bg-[#e8917a] dark:hover:bg-[#d4826f]
          text-white
          shadow-lg shadow-[#d4826f]/30 dark:shadow-[#e8917a]/30
          hover:shadow-xl hover:shadow-[#d4826f]/40
          flex items-center justify-center
          transition-all duration-200
          backdrop-blur-sm
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5a47]
        "
      >
        <PersonStanding size={24} strokeWidth={2.5} />
      </motion.button>

      {isOpen && (
        <div className="fixed inset-0 z-[150]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={close}
            aria-hidden="true"
          />
          <div
            className="absolute bottom-6 right-6 lg:top-20 lg:bottom-auto w-[320px] max-w-[95vw] max-h-[80vh] lg:max-h-[calc(100vh-6rem)] overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black/5"
            dir="rtl"
          >
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
