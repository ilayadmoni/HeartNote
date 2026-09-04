"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { WeddingInteractiveData } from "@/components/templates/types";

interface WeddingRevealOverlayProps {
  data: WeddingInteractiveData;
  onReplay: () => void;
}

export function WeddingRevealOverlay({ data, onReplay }: WeddingRevealOverlayProps) {
  const t = useTranslations("templates");
  const title = data.greetingTitle || t("weddingGlass.mazalTov");
  const [showReplay, setShowReplay] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowReplay(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center bg-surface/60 p-4 backdrop-blur-[1px] sm:p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <motion.section
        className="w-full max-w-[22rem] overflow-hidden rounded-card border border-line bg-surface-raised/95 p-5 text-center shadow-2xl backdrop-blur-md sm:p-6"
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        aria-live="polite"
      >
        <h2 className="max-w-full break-words text-title-lg font-black text-ink" dir="auto">
          {title}
        </h2>
        {data.coupleNames && (
          <p className="mt-1 max-w-full break-words text-sm font-bold text-accent" dir="auto">
            {data.coupleNames}
          </p>
        )}
        <p className="mt-4 max-w-full whitespace-pre-line break-words text-base leading-7 text-ink-muted" dir="auto">
          {data.message || t("weddingGlass.messageDefault")}
        </p>
        {data.senderName && (
          <p className="mt-4 max-w-full break-words text-sm font-bold text-ink-muted" dir="auto">
            {data.senderName}
          </p>
        )}
        {showReplay && (
          <motion.button
            type="button"
            onClick={onReplay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-5 rounded-pill bg-ink px-5 py-2.5 text-sm font-bold text-surface shadow-md transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {t("weddingGlass.replay")}
          </motion.button>
        )}
      </motion.section>
    </motion.div>
  );
}
