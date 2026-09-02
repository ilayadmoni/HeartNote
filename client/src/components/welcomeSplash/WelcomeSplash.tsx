"use client";

/**
 * WelcomeSplash Component
 * Full-screen glassmorphism overlay that greets the user after login.
 * Content sits top-center for a modern mobile-first feel.
 * Dismisses when the progress bar animation reaches 100%.
 */

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SplashLogo, GreetingText, SplashProgressBar } from "./components";
import { useWelcomeSplash } from "@/hooks/useWelcomeSplash";
import type { WelcomeSplashProps } from "./types";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5, ease: "easeIn" },
  },
};

export function WelcomeSplash({ className = "" }: WelcomeSplashProps): JSX.Element {
  const t = useTranslations("common.welcome");
  const { isVisible, firstName, lastName, dismiss } = useWelcomeSplash();

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="welcome-splash"
          className={`fixed inset-0 z-[200] flex flex-col items-center justify-start
            pt-28 md:pt-40
            bg-surface/85
            backdrop-blur-2xl ${className}`}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-label={t("dialogLabel")}
          aria-modal="true"
        >
          {/* Decorative radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute top-[15%] start-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2 w-[420px] h-[420px] rounded-full bg-accent/10 blur-3xl" />
          </div>

          {/* Splash Content */}
          <div className="relative z-10 flex flex-col items-center gap-8 md:gap-10 px-6">
            <SplashLogo />
            <GreetingText firstName={firstName} lastName={lastName} />
            <SplashProgressBar onComplete={dismiss} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
