"use client";

import { usePathname } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { FooterBranding } from "@/components/templates/components";
import { ApologySearchResult } from "../components/ApologySearchResult";
import { SkeletonResultRows } from "../components/SkeletonResultRows";
import type { ApologySearchMobileProps } from "../types";

export function ApologySearchMobile({
  data,
  phase,
  typedText,
  primaryColor,
  onStart,
  onReset,
}: ApologySearchMobileProps) {
  const pathname = usePathname();
  const isCreateRoute = pathname?.includes('/create/');
  const t = useTranslations("templates");

  return (
    <div className={`flex flex-col h-full bg-transparent relative isolate overflow-hidden ${
      isCreateRoute ? 'min-h-[450px]' : 'min-h-[650px]'
    }`}>
      <div className="flex-1 flex flex-col items-center justify-center w-full px-5 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {phase !== "result" ? (
            <motion.div
              key="search-area"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full gap-6"
            >
              {/* Search icon heading */}
              <div className="flex flex-col items-center gap-1">
                <Search size={36} color={primaryColor} strokeWidth={1.5} />
                <p className="text-xl font-bold break-words" style={{ color: primaryColor }}>
                  {t("apologySearch.heading")}
                </p>
              </div>

              {/* Search bar */}
              <div className="w-full bg-surface-raised border-2 border-line rounded-pill px-4 py-3 flex items-center shadow-md gap-2">
                <Search size={16} className="text-ink-muted" />
                <span
                  dir="auto"
                  className="flex-1 text-base text-ink bg-transparent outline-none min-h-[1.25rem] break-words"
                >
                  {typedText || (
                    <span className="text-ink-subtle">{t("apologySearch.placeholder")}</span>
                  )}
                  {phase === "typing" && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-0.5 h-4 bg-ink align-middle ms-0.5"
                    />
                  )}
                </span>
              </div>

              {/* Skeleton result rows */}
              <AnimatePresence>
                {phase === "loading" && (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full flex justify-center"
                  >
                    <SkeletonResultRows size="mobile" />
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
                    className="px-7 py-2.5 rounded-pill font-medium text-accent-ink text-sm shadow-md hover:opacity-90 active:scale-95 transition-all"
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

      <FooterBranding className="shrink-0 mt-auto pb-3 relative z-10" />
    </div>
  );
}
