"use client";

/**
 * ContactHeader Component
 * Header section with title and subtitle.
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { useMotionOk } from "@/lib/motion";

export function ContactHeader(): JSX.Element {
  const t = useTranslations("contact");
  const motionOk = useMotionOk();

  return (
    <div className="text-center mb-12">
      <motion.div
        initial={motionOk ? { opacity: 0, scale: 0.8 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-soft mb-6"
      >
        <MessageCircle size={40} className="text-accent" />
      </motion.div>

      <motion.h1
        initial={motionOk ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: motionOk ? 0.1 : 0 }}
        className="text-title-lg text-ink mb-4"
      >
        {t("header.title")}
      </motion.h1>

      <motion.p
        initial={motionOk ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: motionOk ? 0.2 : 0 }}
        className="text-body-lg text-ink-muted max-w-2xl mx-auto"
      >
        {t("header.subtitle")}
      </motion.p>
    </div>
  );
}
