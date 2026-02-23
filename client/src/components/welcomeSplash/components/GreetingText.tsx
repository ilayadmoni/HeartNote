"use client";

/**
 * GreetingText Component
 * Animated Hebrew greeting with personalized first + last name.
 * Typography matches the Header Logo sizing on mobile.
 */

import { motion } from "framer-motion";
import {
  GREETING_HELLO,
  GREETING_WELCOME,
  TEXT_ENTRANCE_DELAY,
} from "../constants";
import type { GreetingTextProps } from "../types";

const greetingVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: TEXT_ENTRANCE_DELAY,
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: TEXT_ENTRANCE_DELAY + 0.15,
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export function GreetingText({ firstName, lastName }: GreetingTextProps) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const greeting = fullName
    ? `${GREETING_HELLO}, ${fullName}!`
    : `${GREETING_HELLO}!`;

  return (
    <div className="text-center space-y-2" role="status" aria-live="polite">
      {/* Personalized Greeting — matches Header Logo: text-2xl md:text-3xl font-bold */}
      <motion.h1
        className="text-2xl md:text-3xl font-bold text-hebrew-heading text-navy-700 dark:text-white transition-colors duration-300"
        variants={greetingVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {greeting}
      </motion.h1>

      {/* Welcome Subtitle */}
      <motion.p
        className="text-sm md:text-base text-hebrew-body text-[#5f7794] dark:text-gray-400 transition-colors duration-300"
        variants={subtitleVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {GREETING_WELCOME}
      </motion.p>
    </div>
  );
}
