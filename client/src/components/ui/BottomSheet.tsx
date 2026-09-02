"use client";

/**
 * BottomSheet Component
 * Draggable bottom sheet with physics-based gestures and snap points.
 * iOS Control Center style interaction. Rendered through a portal so it
 * always escapes any Framer Motion transform ancestor.
 */

import { useRef, useState, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { useTranslations } from "next-intl";
import { BottomSheetHandle } from "./BottomSheetHandle";

interface BottomSheetProps {
  children: ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** Height when collapsed (showing handle only) in px */
  collapsedHeight?: number;
  /** Height when expanded as percentage of viewport */
  expandedHeight?: number;
  /** Label for the toggle button */
  label?: string;
  /** Label when expanded */
  expandedLabel?: string;
}

const VELOCITY_THRESHOLD = 500;
const DRAG_THRESHOLD = 0.3;

export function BottomSheet({
  children,
  isOpen,
  onOpenChange,
  collapsedHeight = 72,
  expandedHeight = 65,
  label,
  expandedLabel,
}: BottomSheetProps): JSX.Element | null {
  const t = useTranslations("editor");
  const resolvedLabel = label ?? t("bottomSheet.editLabel");
  const resolvedExpandedLabel = expandedLabel ?? t("bottomSheet.closeEditLabel");

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setHasSeenTutorial(!!localStorage.getItem("hasSeenPropertiesTutorial"));
    }
  }, []);

  const markTutorialAsSeen = () => {
    if (!hasSeenTutorial) {
      setHasSeenTutorial(true);
      if (typeof window !== "undefined") localStorage.setItem("hasSeenPropertiesTutorial", "true");
    }
  };

  const getExpandedPx = () => (typeof window !== "undefined" ? (window.innerHeight * expandedHeight) / 100 : 500);

  const y = useMotionValue(0);
  const height = useMotionValue(isOpen ? getExpandedPx() : collapsedHeight);
  const progress = useTransform(height, [collapsedHeight, getExpandedPx()], [0, 1]);
  const handleRotation = useTransform(progress, [0, 1], [0, 180]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    markTutorialAsSeen();
    const currentHeight = height.get();
    const expandedPx = getExpandedPx();
    const range = expandedPx - collapsedHeight;
    const normalizedPosition = (currentHeight - collapsedHeight) / range;

    if (info.velocity.y < -VELOCITY_THRESHOLD) onOpenChange(true);
    else if (info.velocity.y > VELOCITY_THRESHOLD) onOpenChange(false);
    else onOpenChange(normalizedPosition > DRAG_THRESHOLD);
  };

  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const expandedPx = getExpandedPx();
    const newHeight = Math.min(Math.max((isOpen ? expandedPx : collapsedHeight) - info.offset.y, collapsedHeight), expandedPx);
    height.set(newHeight);
  };

  if (!mounted) return null;

  const sheet = (
    <>
      <style>{`
        @keyframes gentleBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .mobile-bounce { animation: gentleBounce 2s ease-in-out infinite; }
        @media (min-width: 768px) { .mobile-bounce { animation: none !important; } }
      `}</style>
      <motion.div
        ref={containerRef}
        className="fixed bottom-0 start-0 end-0 z-40 touch-none"
        animate={{ height: isOpen ? getExpandedPx() : collapsedHeight }}
        style={{ height }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        <div className="h-full max-h-[85dvh] bg-surface-raised rounded-t-card shadow-lift border-t border-line flex flex-col overflow-hidden">
          <BottomSheetHandle
            isOpen={isOpen}
            isDragging={isDragging}
            showTutorial={!hasSeenTutorial}
            label={resolvedLabel}
            expandedLabel={resolvedExpandedLabel}
            handleRotation={handleRotation}
            onDragStart={() => setIsDragging(true)}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onToggle={() => { markTutorialAsSeen(); onOpenChange(!isOpen); }}
          />

          <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pb-safe">
            {children}
          </div>
        </div>
      </motion.div>
    </>
  );

  return createPortal(sheet, document.body);
}
