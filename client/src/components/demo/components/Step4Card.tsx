"use client";

import { Heart, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface Step4CardProps {
  /** Preview phase uses responsive sm: sizing; modal background stays compact. */
  responsive?: boolean;
  sendBtnId?: string;
}

export function Step4Card({ responsive = false, sendBtnId }: Step4CardProps): JSX.Element {
  const t = useTranslations("demo.step4");
  const r = (base: string, sm: string): string => (responsive ? `${base} ${sm}` : base);

  return (
    <>
      <motion.button
        id={sendBtnId}
        className={`absolute ${r("top-2", "sm:top-4")} ${r("start-2", "sm:start-4")} bg-accent text-accent-ink ${r("px-3", "sm:px-5")} ${r("py-1.5", "sm:py-2")} rounded-pill font-medium flex items-center ${r("gap-1.5", "sm:gap-2")} ${r("text-xs", "sm:text-sm")} shadow-soft z-10`}
      >
        {t("createCta")} <Send size={12} className={responsive ? "sm:w-4 sm:h-4" : ""} />
      </motion.button>

      <div className={`bg-surface ${r("p-4", "sm:p-7")} ${r("rounded-2xl", "sm:rounded-card")} shadow-lift text-center w-full max-w-[280px] ${r("mx-3", "sm:mx-4")} border border-line`}>
        <div className={`bg-accent-soft ${r("w-10", "sm:w-12")} ${r("h-10", "sm:h-12")} ${r("rounded-lg", "sm:rounded-control")} flex items-center justify-center mx-auto ${r("mb-3", "sm:mb-5")}`}>
          <Heart className={`${r("w-5", "sm:w-6")} ${r("h-5", "sm:h-6")} text-accent`} fill="currentColor" />
        </div>
        <h3 className={`${r("text-sm", "sm:text-[17px]")} text-ink mb-2 leading-snug`}>{t("question")}</h3>
        <p className={`${r("text-[9px]", "sm:text-[11px]")} text-ink-muted ${r("mb-4", "sm:mb-6")}`}>{t("hint")}</p>
        <div className={`flex ${r("gap-2", "sm:gap-3")} w-full`}>
          <button className={`flex-[0.8] ${r("py-1.5", "sm:py-2.5")} bg-surface-sunken text-ink-muted rounded-pill ${r("text-xs", "sm:text-sm")}`}>
            {t("no")}
          </button>
          <button className={`flex-[1.2] ${r("py-1.5", "sm:py-2.5")} bg-accent text-accent-ink rounded-pill ${r("text-xs", "sm:text-sm")} font-bold flex justify-center items-center ${r("gap-1", "sm:gap-1.5")} shadow-glow-sm`}>
            {t("yes")} <Heart className={`${r("w-3", "sm:w-3.5")} ${r("h-3", "sm:h-3.5")} fill-current`} />
          </button>
        </div>
      </div>
    </>
  );
}
