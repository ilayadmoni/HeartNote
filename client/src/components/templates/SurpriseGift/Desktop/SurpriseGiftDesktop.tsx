"use client";

/** SurpriseGiftDesktop – gift box that shakes on click and opens to reveal a greeting. */

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { GiftBox, SurpriseGiftReveal, TapProgressDots } from "../components";
import {
  FooterBranding,
  BackToGallery,
  TemplateResetButton,
} from "@/components/templates/components";
import type { SurpriseGiftProps } from "../types";
import { FloatingIcons } from "../../OpenWhen/components";
import { useSurpriseGiftState } from "../hooks/useSurpriseGiftState";

const CONFETTI_CONFIG = {
  burst1: { particleCount: 100, spread: 70 },
  burst2: { particleCount: 60, spread: 90 },
};

export function SurpriseGiftDesktop({ data }: SurpriseGiftProps) {
  const t = useTranslations("templates");
  const {
    title,
    greeting,
    boxColor,
    ribbonColor,
    primaryColor,
    clicks,
    isOpen,
    shaking,
    showReset,
    boxVisible,
    needed,
    shakeKeyframes,
    handleTap,
    handleReset,
  } = useSurpriseGiftState(data, t, CONFETTI_CONFIG);

  return (
    <div className="flex flex-col h-full min-h-[390px] 2xl:min-h-[650px] bg-transparent relative isolate overflow-hidden">
      <FloatingIcons />
      <BackToGallery className="top-4 end-4 absolute" />
      {/* Content Area */}
      <div className="flex-1 flex flex-col w-full max-w-md 2xl:max-w-2xl mx-auto px-6 pt-6 pb-4 2xl:pt-8 2xl:pb-6">
        {/* Title */}
        <h1
          className="text-display-md 2xl:text-display-xl font-bold mb-4 2xl:mb-6 text-center"
          style={{ color: primaryColor }}
          dir="auto"
        >
          {title}
        </h1>

        {!isOpen && (
          <TapProgressDots
            clicks={clicks}
            needed={needed}
            primaryColor={primaryColor}
            className="mb-4 2xl:mb-6 justify-center"
          />
        )}

        {/* Stable transition zone — min-height holds the gift box footprint so
            neither the box (absolute) nor the greeting (normal flow) can shift
            surrounding content when they swap. */}
        <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
          <div
            className="relative w-full max-w-md 2xl:max-w-2xl flex items-center justify-center"
            style={{ minHeight: 260 }}
          >
            {/* Gift Box – absolutely positioned so it cannot affect layout height */}
            <AnimatePresence>
              {boxVisible && (
                <motion.button
                  onClick={handleTap}
                  animate={shaking ? { rotate: shakeKeyframes } : {}}
                  transition={{ duration: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  className="absolute cursor-pointer 2xl:scale-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 rounded-control"
                  style={{ focusVisibleRingColor: primaryColor } as React.CSSProperties}
                  aria-label={t("surpriseGift.shakeAria", { clicks, needed })}
                >
                  <GiftBox boxColor={boxColor} ribbonColor={ribbonColor} isOpen={isOpen} size={240} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Revealed greeting – normal flow so the container can grow to fit */}
            <AnimatePresence>
              {isOpen && <SurpriseGiftReveal greeting={greeting} primaryColor={primaryColor} />}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {showReset && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-3"
        >
          <TemplateResetButton onClick={handleReset} label={t("common.resetDefault")} />
        </motion.div>
      )}

      {/* Footer Credit */}
      <FooterBranding className="shrink-0 mt-auto pb-4" />
    </div>
  );
}
