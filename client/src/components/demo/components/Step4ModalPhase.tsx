"use client";

import { Copy, Share2, MessageCircle, Sparkles, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Step4Card } from "./Step4Card";

export function Step4ModalPhase(): JSX.Element {
  const t = useTranslations("demo.step4");

  return (
    <div className="h-full w-full relative">
      <div className="h-full w-full flex flex-col items-center justify-center pt-8 pb-8">
        <Step4Card />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm flex items-center justify-center z-20"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: "backOut" }}
          className="bg-surface rounded-2xl sm:rounded-card w-full max-w-[300px] mx-3 sm:mx-4 overflow-hidden shadow-lift"
        >
          <div className="bg-accent text-accent-ink text-center py-4 sm:py-6 px-3 sm:px-4 relative">
            <Sparkles className="absolute top-2 sm:top-3 end-2 sm:end-3 w-3 sm:w-4 h-3 sm:h-4 opacity-50" />
            <Sparkles className="absolute bottom-2 sm:bottom-3 start-2 sm:start-3 w-3 sm:w-3.5 h-3 sm:h-3.5 opacity-50" />
            <PartyPopper className="w-7 h-7 sm:w-9 sm:h-9 mb-1 sm:mb-2 mx-auto" />
            <h3 className="font-bold text-base sm:text-lg">{t("modalTitle")}</h3>
          </div>

          <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-3">
            <p className="text-[9px] sm:text-[11px] text-ink-muted text-center font-medium">{t("shareLinkLabel")}</p>
            <div className="flex border border-line rounded-lg sm:rounded-control overflow-hidden bg-surface-sunken">
              <button className="bg-accent p-2 sm:p-3 text-accent-ink flex items-center justify-center">
                <Copy size={12} className="sm:w-[15px] sm:h-[15px]" />
              </button>
              <div className="p-2 sm:p-2.5 text-[8px] sm:text-[10px] text-ink-muted flex-1 flex items-center border-s border-line" dir="ltr">
                <span className="truncate">{t("linkPreview")}</span>
              </div>
            </div>
            <div className="flex gap-1.5 sm:gap-2 mt-1">
              <button className="flex-1 bg-navy-700 text-white py-1.5 sm:py-2.5 rounded-lg sm:rounded-control flex justify-center items-center shadow-soft">
                <Share2 size={13} className="sm:w-[17px] sm:h-[17px]" />
              </button>
              <motion.button
                id="wa-btn"
                className="flex-[2.5] bg-[#25D366] text-white py-1.5 sm:py-2.5 rounded-lg sm:rounded-control flex justify-center items-center gap-1 sm:gap-2 font-bold text-xs sm:text-base shadow-soft"
              >
                <MessageCircle size={13} className="sm:w-[17px] sm:h-[17px]" /> {t("whatsapp")}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
