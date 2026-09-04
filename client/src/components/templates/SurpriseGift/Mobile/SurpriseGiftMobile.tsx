"use client";

/** SurpriseGiftMobile – gift box that shakes on tap and opens to reveal a greeting. */

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { GiftBox, SurpriseGiftReveal, TapProgressDots } from "../components";
import {
  FooterBranding,
  TemplateResetButton,
} from "@/components/templates/components";
import type { SurpriseGiftProps } from "../types";
import { FloatingIcons } from "../../OpenWhen/components";
import { useSurpriseGiftState } from "../hooks/useSurpriseGiftState";

const CONFETTI_CONFIG = {
  burst1: { particleCount: 80, spread: 60 },
  burst2: { particleCount: 50, spread: 80 },
};

export function SurpriseGiftMobile({ data }: SurpriseGiftProps) {
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

  const pathname = usePathname();
  const isCreateRoute = pathname?.includes("/create/");

  return (
    <div
      className={`w-full flex flex-col justify-between items-center gap-6 bg-transparent px-4 py-6 overflow-auto relative isolate ${
        isCreateRoute ? "min-h-[450px]" : "min-h-[100dvh]"
      }`}
    >
      <FloatingIcons />
      {/* Main Content - Top */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* Title */}
        <h1
          className="text-title-lg font-bold mb-6 text-center"
          style={{ color: primaryColor }}
          dir="auto"
        >
          {title}
        </h1>

        {!isOpen && (
          <TapProgressDots clicks={clicks} needed={needed} primaryColor={primaryColor} className="mb-5" />
        )}

        {/* Stable transition zone — min-height holds the gift box footprint so
            neither the box (absolute) nor the greeting (normal flow) can shift
            surrounding content when they swap. */}
        <div className="relative w-full flex items-center justify-center" style={{ minHeight: 200 }}>
          {/* Gift Box – absolutely positioned so it cannot affect layout height */}
          <AnimatePresence>
            {boxVisible && (
              <motion.button
                onClick={handleTap}
                animate={shaking ? { rotate: shakeKeyframes } : {}}
                transition={{ duration: 0.4 }}
                whileTap={{ scale: 0.95 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                className="absolute cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 rounded-control"
                aria-label={t("surpriseGift.tapAria", { clicks, needed })}
              >
                <GiftBox boxColor={boxColor} ribbonColor={ribbonColor} isOpen={isOpen} size={180} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Revealed greeting – normal flow so the container can grow to fit */}
          <AnimatePresence>
            {isOpen && (
              <SurpriseGiftReveal greeting={greeting} primaryColor={primaryColor} size="sm" scrollable />
            )}
          </AnimatePresence>
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

      {/* Footer Credit - Bottom */}
      <FooterBranding className="mx-auto" />
    </div>
  );
}
