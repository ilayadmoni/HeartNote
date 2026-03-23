"use client";

/**
 * BottomSheet Component
 * Draggable bottom sheet with physics-based gestures and snap points
 * iOS Control Center style interaction
 */

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  PanInfo,
  AnimatePresence,
} from "framer-motion";

interface BottomSheetProps {
  children: React.ReactNode;
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

// Snap thresholds
const VELOCITY_THRESHOLD = 500;
const DRAG_THRESHOLD = 0.3;

export function BottomSheet({
  children,
  isOpen,
  onOpenChange,
  collapsedHeight = 72,
  expandedHeight = 65,
  label = "ערוך מאפיינים",
  expandedLabel = "סגור עריכה",
}: BottomSheetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = localStorage.getItem("hasSeenPropertiesTutorial");
      setHasSeenTutorial(!!seen);
    }
  }, []);

  const markTutorialAsSeen = () => {
    if (!hasSeenTutorial) {
      setHasSeenTutorial(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("hasSeenPropertiesTutorial", "true");
      }
    }
  };

  // Calculate expanded height in pixels
  const getExpandedPx = () => {
    if (typeof window !== "undefined") {
      return (window.innerHeight * expandedHeight) / 100;
    }
    return 500;
  };

  const y = useMotionValue(0);
  const height = useMotionValue(isOpen ? getExpandedPx() : collapsedHeight);

  // Progress from 0 (collapsed) to 1 (expanded)
  const progress = useTransform(
    height,
    [collapsedHeight, getExpandedPx()],
    [0, 1],
  );

  // Handle rotation based on progress
  const handleRotation = useTransform(progress, [0, 1], [0, 180]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    setIsDragging(false);
    markTutorialAsSeen();
    const currentHeight = height.get();
    const expandedPx = getExpandedPx();
    const range = expandedPx - collapsedHeight;
    const normalizedPosition = (currentHeight - collapsedHeight) / range;

    // Use velocity and position to determine snap point
    if (info.velocity.y < -VELOCITY_THRESHOLD) {
      // Fast swipe up - expand
      onOpenChange(true);
    } else if (info.velocity.y > VELOCITY_THRESHOLD) {
      // Fast swipe down - collapse
      onOpenChange(false);
    } else {
      // Use position threshold
      onOpenChange(normalizedPosition > DRAG_THRESHOLD);
    }
  };

  const handleDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const expandedPx = getExpandedPx();
    // Calculate new height based on drag (inverted because dragging up = larger height)
    const newHeight = Math.min(
      Math.max(
        (isOpen ? expandedPx : collapsedHeight) - info.offset.y,
        collapsedHeight,
      ),
      expandedPx,
    );
    height.set(newHeight);
  };

  return (
    <>
      <style>{`
        @keyframes gentleBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .mobile-bounce {
          animation: gentleBounce 2s ease-in-out infinite;
        }
        @media (min-width: 768px) {
          .mobile-bounce {
            animation: none !important;
          }
        }
      `}</style>
      <motion.div
        ref={containerRef}
        className="fixed bottom-0 left-0 right-0 z-40 touch-none"
        animate={{
          height: isOpen ? getExpandedPx() : collapsedHeight,
        }}
        style={{ height }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 300,
        }}
      >
        <AnimatePresence>
          {!hasSeenTutorial && !isOpen && (
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 md:hidden z-50 flex flex-col items-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="bg-[#d4826f] text-white px-4 py-2 rounded-xl shadow-lg whitespace-nowrap">
                  <span className="font-bold text-hebrew-body text-sm">
                    לחצו או החליקו לעריכת היצירה
                  </span>
                </div>
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#d4826f]" />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        <div className="h-full bg-white dark:bg-gray-800 rounded-t-[28px] shadow-[0_-4px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_-4px_30px_rgba(0,0,0,0.4)] border-t border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
          {/* Draggable Handle Area */}
          <motion.div
            className="cursor-grab active:cursor-grabbing"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragStart={() => setIsDragging(true)}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          >
            <button
              onClick={() => {
                markTutorialAsSeen();
                if (!isDragging) onOpenChange(!isOpen);
              }}
              className="w-full py-4 flex flex-col items-center gap-2 select-none"
              aria-label={isOpen ? expandedLabel : label}
              aria-expanded={isOpen}
            >
              {/* Visual Handle Pill */}
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 text-hebrew-body">
                  {isOpen ? expandedLabel : label}
                </span>
                <div className={!isOpen ? "mobile-bounce" : ""}>
                  <motion.svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                    style={{ rotate: handleRotation }}
                  >
                    <polyline points="18 15 12 9 6 15" />
                  </motion.svg>
                </div>
              </div>
            </button>
          </motion.div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pb-safe">
            {children}
          </div>
        </div>
      </motion.div>
    </>
  );
}
