"use client";

/**
 * PricingTeaser Component
 * Free baseline vs Lite/Premium upgrade cards.
 */

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Crown, ArrowRight, Sparkles } from "lucide-react";
import { fadeUp, stagger, viewportOnce, useMotionOk } from "@/lib/motion";
import type { PricingTeaserProps } from "../types";

const TIERS = ["free", "lite", "premium"] as const;

export function PricingTeaser({ className = "" }: PricingTeaserProps): JSX.Element {
  const t = useTranslations("home.pricing");
  const motionOk = useMotionOk();

  return (
    <section className={`py-section-sm px-gutter bg-surface-sunken text-center relative overflow-hidden ${className}`}>
      <div className="mx-auto max-w-shell relative z-10">
        <motion.div
          initial={motionOk ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          className="inline-flex items-center gap-2 bg-surface px-4 py-2 rounded-pill shadow-soft mb-6 border border-line"
        >
          <Crown size={16} className="text-accent" />
          <span className="text-body-sm font-bold text-ink">{t("badge")}</span>
        </motion.div>

        <motion.h2
          initial={motionOk ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ delay: 0.1 }}
          className="text-display-md text-ink mb-4"
        >
          {t("title")} <span className="text-accent">{t("titleHighlight")}</span> {t("titleEnd")}
        </motion.h2>

        <motion.p
          initial={motionOk ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ delay: 0.15 }}
          className="text-body-lg text-ink-muted mb-10 max-w-prose mx-auto"
        >
          {t("description")}
        </motion.p>

        <motion.div
          initial={motionOk ? "hidden" : "visible"}
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger(0.08)}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto"
        >
          {TIERS.map((tier) => {
            const isUpgrade = tier !== "free";
            return (
              <motion.div
                key={tier}
                variants={fadeUp}
                className={
                  isUpgrade
                    ? "relative rounded-card p-5 bg-accent-soft border border-accent/30 shadow-card"
                    : "relative rounded-card p-5 bg-surface border border-line"
                }
              >
                {isUpgrade && (
                  <span className="absolute -top-3 start-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-accent text-accent-ink text-caption font-bold px-3 py-1 rounded-pill shadow-soft">
                    <Sparkles size={12} />
                    {t(`${tier}.badge`)}
                  </span>
                )}
                <p className="text-title-sm text-ink mb-1">{t(`${tier}.name`)}</p>
                <p className="text-caption text-ink-muted">{t(`${tier}.detail`)}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={motionOk ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-pill text-body-lg font-bold text-accent-ink bg-accent shadow-glow-sm hover:bg-accent-hover hover:shadow-glow transition-colors duration-base ease-out-quint"
          >
            {t("cta")}
            <ArrowRight size={20} className="rtl:-scale-x-100" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
