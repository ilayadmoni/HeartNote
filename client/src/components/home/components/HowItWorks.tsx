"use client";

/**
 * HowItWorks Component
 * Numbered timeline: horizontal on desktop, vertical on mobile.
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { MousePointer2, Settings, Send } from "lucide-react";
import { fadeUp, stagger, viewportOnce, useMotionOk } from "@/lib/motion";
import { STEPS } from "../constants";
import type { HowItWorksProps, StepIconKey } from "../types";

const ICONS: Record<StepIconKey, typeof MousePointer2> = {
  click: MousePointer2,
  settings: Settings,
  send: Send,
};

export function HowItWorks({ className = "" }: HowItWorksProps): JSX.Element {
  const t = useTranslations("home.howItWorks");
  const motionOk = useMotionOk();

  return (
    <section id="how-it-works" className={`py-section-sm px-gutter bg-surface relative overflow-hidden ${className}`}>
      <div className="mx-auto max-w-shell text-center relative z-10">
        <motion.h2
          initial={motionOk ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          className="text-display-md text-ink mb-4"
        >
          {t("title")}
        </motion.h2>
        <motion.p
          initial={motionOk ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ delay: 0.1 }}
          className="text-body-lg text-ink-muted mb-16 max-w-prose mx-auto"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          initial={motionOk ? "hidden" : "visible"}
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger(0.12)}
          className="relative flex flex-col md:flex-row md:items-start gap-10 md:gap-6"
        >
          <div className="hidden md:block absolute top-[4.75rem] start-[16%] end-[16%] h-px border-t-2 border-dashed border-line-strong z-0" />

          {STEPS.map((step) => {
            const Icon = ICONS[step.icon];
            return (
              <motion.div key={step.id} variants={fadeUp} className="relative z-10 flex-1 flex flex-col items-center text-center">
                <div className="flex items-center gap-3 md:flex-col md:gap-2 mb-4">
                  <span className="text-display-md text-accent font-display leading-none">{step.id}</span>
                  <div className="w-14 h-14 rounded-pill bg-accent-soft ring-8 ring-surface flex items-center justify-center">
                    <Icon className="text-accent w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-title-sm text-ink mb-2">{t(`step${step.id}.title`)}</h3>
                <p className="text-body-sm text-ink-muted max-w-xs">{t(`step${step.id}.description`)}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
