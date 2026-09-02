"use client";

/**
 * GreetingText Component
 * Animated personalized greeting with first + last name.
 * Typography matches the Header Logo sizing on mobile.
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { TEXT_ENTRANCE_DELAY } from "../constants";
import type { GreetingTextProps } from "../types";

const greetingVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: TEXT_ENTRANCE_DELAY, duration: 0.5, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: TEXT_ENTRANCE_DELAY + 0.15, duration: 0.5, ease: "easeOut" },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export function GreetingText({ firstName, lastName }: GreetingTextProps): JSX.Element {
  const t = useTranslations("common.welcome");
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const greeting = fullName ? t("helloName", { name: fullName }) : `${t("hello")}!`;

  return (
    <div className="text-center space-y-2" role="status" aria-live="polite">
      <motion.h1
        className="text-title-lg md:text-display-md text-ink transition-colors duration-300"
        variants={greetingVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {greeting}
      </motion.h1>

      <motion.p
        className="text-body-sm md:text-body-md text-ink-muted transition-colors duration-300"
        variants={subtitleVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {t("subtitle")}
      </motion.p>
    </div>
  );
}
