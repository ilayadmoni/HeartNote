"use client";

/** Draggable handle + tutorial tooltip for BottomSheet. Extracted for the 150-line file cap. */

import { motion, useMotionValue, useTransform, type PanInfo, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface BottomSheetHandleProps {
  isOpen: boolean;
  isDragging: boolean;
  showTutorial: boolean;
  label: string;
  expandedLabel: string;
  handleRotation: ReturnType<typeof useTransform<number, number>>;
  onDragStart: () => void;
  onDrag: (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  onDragEnd: (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  onToggle: () => void;
}

export function BottomSheetHandle({
  isOpen, isDragging, showTutorial, label, expandedLabel, handleRotation,
  onDragStart, onDrag, onDragEnd, onToggle,
}: BottomSheetHandleProps): JSX.Element {
  const t = useTranslations("editor");

  return (
    <>
      <AnimatePresence>
        {showTutorial && !isOpen && (
          <div className="absolute -top-14 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 md:hidden z-50 flex flex-col items-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="bg-accent text-accent-ink px-4 py-2 rounded-control shadow-card whitespace-nowrap">
                <span className="font-bold text-body-sm">{t("bottomSheet.swipeHint")}</span>
              </div>
              <div className="w-0 h-0 border-s-[8px] border-s-transparent border-e-[8px] border-e-transparent border-t-[8px] border-t-accent" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div
        className="cursor-grab active:cursor-grabbing"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
      >
        <button
          onClick={() => { if (!isDragging) onToggle(); }}
          className="w-full py-4 flex flex-col items-center gap-2 select-none"
          aria-label={isOpen ? expandedLabel : label}
          aria-expanded={isOpen}
        >
          <div className="w-12 h-1.5 bg-line-strong rounded-full" />

          <div className="flex items-center gap-2">
            <span className="text-body-sm font-medium text-ink-muted">{isOpen ? expandedLabel : label}</span>
            <div className={!isOpen ? "mobile-bounce" : ""}>
              <motion.svg
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="text-ink-subtle" style={{ rotate: handleRotation }}
              >
                <polyline points="18 15 12 9 6 15" />
              </motion.svg>
            </div>
          </div>
        </button>
      </motion.div>
    </>
  );
}
