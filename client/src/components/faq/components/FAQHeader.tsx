"use client";

/**
 * FAQHeader Component
 * Header section for FAQ page with icon, title, and subtitle.
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { HelpCircle } from "lucide-react";
import { useMotionOk } from "@/lib/motion";

export function FAQHeader(): JSX.Element {
  const t = useTranslations("faq");
  const motionOk = useMotionOk();

  return (
    <div className="text-center mb-10">
      <motion.div
        initial={motionOk ? { opacity: 0, scale: 0.8 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-soft mb-5"
      >
        <HelpCircle size={32} className="text-accent" />
      </motion.div>

      <motion.h1
        initial={motionOk ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: motionOk ? 0.1 : 0 }}
        className="text-title-lg text-ink mb-3"
      >
        {t("title")}
      </motion.h1>

      <motion.p
        initial={motionOk ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: motionOk ? 0.2 : 0 }}
        className="text-body-md text-ink-muted max-w-md mx-auto"
      >
        {t("subtitle")}
      </motion.p>
    </div>
  );
}
