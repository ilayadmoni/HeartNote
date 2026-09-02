"use client";

/**
 * FactoryIllustration Component
 * Animated conveyor belt illustration for the hero section.
 * Currently unused by any Home layout; kept on tokens for future reuse.
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Gift, Layers, Heart } from "lucide-react";

export function FactoryIllustration(): JSX.Element {
  const t = useTranslations("home.factory");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-surface-raised rounded-card p-6 lg:p-8 shadow-lift border border-line relative overflow-hidden"
    >
      <div className="flex justify-center gap-2 mb-6 opacity-30">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-12 h-2 rounded-pill bg-ink" />
        ))}
      </div>

      <div className="h-56 flex flex-col items-center justify-center relative">
        <div className="flex justify-between w-full px-4 absolute top-4 z-10">
          <div className="animate-float bg-surface-sunken p-3 rounded-card shadow-soft border border-line">
            <Gift className="text-ink h-8 w-8" />
          </div>
          <div className="animate-float bg-surface-sunken p-3 rounded-card shadow-soft border border-line" style={{ animationDelay: "0.5s" }}>
            <Layers className="text-ink-muted h-8 w-8" />
          </div>
          <div className="animate-float bg-surface-sunken p-3 rounded-card shadow-soft border border-line" style={{ animationDelay: "1s" }}>
            <Heart className="text-accent h-8 w-8" />
          </div>
        </div>

        <div className="w-full h-24 bg-surface-sunken rounded-card border-2 border-dashed border-ink/30 mt-16 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-surface/50 to-transparent animate-pulse" />
          <span className="text-ink-muted font-bold z-20 bg-surface-raised px-4 py-1 rounded-control shadow-soft">
            {t("processing")}
          </span>
        </div>

        <div className="w-full h-3 bg-line-strong mt-6 rounded-pill relative overflow-hidden border border-line">
          <div className="absolute inset-0 conveyor-belt opacity-50" />
        </div>

        <div className="absolute -bottom-4 start-4 bg-ink text-white px-4 py-2 rounded-t-xl text-body-sm font-bold shadow-lift">
          {t("result")}
        </div>
      </div>
    </motion.div>
  );
}
