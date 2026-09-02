"use client";

/**
 * HeroSection Component
 * Split hero: text column + phone visual, first-viewport fit, RTL/LTR mirrored.
 */

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Settings } from "lucide-react";
import { fadeUp, stagger, viewportOnce, useMotionOk } from "@/lib/motion";
import { HeroVisual } from "./HeroVisual";
import type { HeroSectionProps } from "../types";

export function HeroSection({ className = "" }: HeroSectionProps): JSX.Element {
  const t = useTranslations("home.hero");
  const locale = useLocale();
  const motionOk = useMotionOk();
  const titleFont = locale === "en" ? "font-display" : "font-body";

  return (
    <section className={`relative overflow-hidden pt-16 lg:pt-20 pb-section-sm px-gutter ${className}`}>
      <div
        className={`absolute top-0 start-0 -ms-20 -mt-20 opacity-10 pointer-events-none ${motionOk ? "animate-spin-slow" : ""}`}
      >
        <Settings size={300} className="text-ink-subtle" />
      </div>
      <div
        className={`absolute bottom-0 end-0 -me-20 -mb-20 opacity-10 pointer-events-none ${motionOk ? "animate-spin-slow-reverse" : ""}`}
      >
        <Settings size={250} className="text-accent" />
      </div>

      <motion.div
        initial={motionOk ? "hidden" : "visible"}
        whileInView="visible"
        viewport={viewportOnce}
        variants={stagger(0.08)}
        className="relative z-10 mx-auto max-w-shell grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-10 lg:gap-16"
      >
        <div className="text-center lg:text-start">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 bg-surface-raised px-4 py-2 rounded-pill shadow-soft mb-6 border border-line"
          >
            <Sparkles size={16} className="text-accent" />
            <span className="text-body-sm font-semibold text-ink">{t("badge")}</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className={`text-display-xl ${titleFont} text-ink mb-6`}
          >
            {t("titleLine1")}
            <br />
            <span className="relative">
              {t("titleLine2")}
              <svg
                className="absolute w-full h-3 -bottom-1 start-0 text-accent opacity-60"
                viewBox="0 0 200 9"
                fill="none"
              >
                <path d="M2 7C48 3 135 -2 198 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-body-lg text-ink-muted mb-8 max-w-prose mx-auto lg:mx-0">
            {t("description")}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-pill text-body-lg font-bold text-accent-ink bg-accent shadow-glow hover:bg-accent-hover whitespace-nowrap transition-colors duration-base ease-out-quint"
            >
              {t("cta")}
              <ArrowRight size={20} className="rtl:-scale-x-100" />
            </Link>

            <Link
              href="/demo"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-pill text-body-lg font-bold border border-line-strong text-ink bg-surface-raised/80 hover:border-accent hover:text-accent whitespace-nowrap transition-colors duration-base ease-out-quint"
            >
              {t("ctaSecondary")}
            </Link>
          </motion.div>
        </div>

        <motion.div variants={fadeUp} className="w-full max-w-[360px] mx-auto lg:mx-0 lg:max-w-none overflow-visible">
          <HeroVisual />
        </motion.div>
      </motion.div>
    </section>
  );
}
