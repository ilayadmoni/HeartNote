"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  FooterBranding,
  BackToGallery,
} from "@/components/templates/components";
import { ApologySearchResult } from "../components/ApologySearchResult";
import type { ApologySearchDesktopProps } from "../types";

export function ApologySearchDesktop({
  data,
  phase,
  typedText,
  primaryColor,
  onStart,
  onReset,
}: ApologySearchDesktopProps) {
  const t = useTranslations("templates");
  return (
    <div className="flex flex-col h-full min-h-[390px] bg-transparent relative isolate overflow-hidden">
      <BackToGallery className="absolute top-4 end-4" />

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xl mx-auto px-6 py-10 relative z-10">
        <AnimatePresence mode="wait">
          {phase !== "result" ? (
            <motion.div
              key="search-area"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full gap-8"
            >
              {/* Search icon heading */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-2"
              >
                <Search size={48} color={primaryColor} strokeWidth={1.5} />
                <p className="text-2xl font-bold break-words" style={{ color: primaryColor }}>
                  {t("apologySearch.heading")}
                </p>
              </motion.div>

              {/* Search bar */}
              <div className="w-full max-w-lg bg-surface-raised border-2 border-line rounded-pill px-6 py-4 flex items-center shadow-lg gap-3 transition-all focus-within:border-line-strong">
                <Search size={20} className="text-ink-muted" />
                <span
                  dir="auto"
                  className="flex-1 text-lg text-ink bg-transparent outline-none min-h-[1.5rem] break-words"
                >
                  {typedText || (
                    <span className="text-ink-subtle">{t("apologySearch.placeholder")}</span>
                  )}
                  {(phase === "typing") && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-0.5 h-5 bg-ink align-middle ms-0.5"
                    />
                  )}
                </span>
              </div>

              {/* Bouncing dots */}
              <AnimatePresence>
                {phase === "loading" && (
                  <motion.div
                    key="dots"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2"
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: primaryColor }}
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                          duration: 0.6,
                          delay: i * 0.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Start button */}
              <AnimatePresence>
                {phase === "idle" && (
                  <motion.button
                    key="start-btn"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    onClick={onStart}
                    className="px-8 py-3 rounded-pill font-medium text-accent-ink shadow-md hover:opacity-90 active:scale-95 transition-all"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {data.startButtonLabel ?? t("apologySearch.startButton")}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <ApologySearchResult data={data} primaryColor={primaryColor} onReset={onReset} />
          )}
        </AnimatePresence>
      </div>

      <FooterBranding className="shrink-0 mt-auto pb-4 relative z-10" />
    </div>
  );
}
