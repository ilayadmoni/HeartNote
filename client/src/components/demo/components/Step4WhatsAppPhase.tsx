"use client";

import { Heart, Settings, ChevronLeft, Video, Phone, Plus, Camera, Mic, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { dirFor, isLocale, DEFAULT_LOCALE } from "@/i18n/locale";

export function Step4WhatsAppPhase(): JSX.Element {
  const t = useTranslations("demo.step4");
  const rawLocale = useLocale();
  const dir = dirFor(isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full w-full bg-[#0b141a] flex flex-col"
      dir={dir}
    >
      <div className="bg-gradient-to-b from-[#20344b] to-[#12263b] px-3 sm:px-4 pt-2.5 sm:pt-3 pb-2 sm:pb-2.5 border-b border-white/5">
        <div className="flex items-center justify-between text-white/90 text-[8px] sm:text-[10px] mb-1.5 sm:mb-2">
          <span>1:38</span>
          <span>54%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2 text-white">
            <ChevronLeft className="w-3 sm:w-4 h-3 sm:h-4 rtl:-scale-x-100" />
            <span className="text-xs sm:text-sm">2</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-slate-400/40 flex items-center justify-center text-[9px] sm:text-[11px] text-white font-bold">
              {t("wa.contactInitial")}
            </div>
            <p className="text-white text-xs sm:text-base font-semibold">{t("wa.contactName")}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-white/90">
            <Video className="w-3 sm:w-4 h-3 sm:h-4" />
            <Phone className="w-3 sm:w-4 h-3 sm:h-4" />
          </div>
        </div>
      </div>

      <div
        className="flex-1 px-2 sm:px-3 py-3 sm:py-4 flex flex-col gap-1.5 sm:gap-2 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.08), transparent 35%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.05), transparent 38%), linear-gradient(120deg, #233444 0%, #182733 40%, #121b24 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.28 }}
          className="self-start bg-[#202c33] rounded-xl sm:rounded-2xl rounded-tl-sm px-2.5 sm:px-3 py-1.5 sm:py-2 max-w-[220px]"
        >
          <p className="text-white/90 text-xs sm:text-[14px]">{t("wa.receivedMessage")}</p>
          <p className="text-white/40 text-[7px] sm:text-[10px] text-start mt-0.5 sm:mt-1">{t("wa.receivedTime")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.42, duration: 0.32 }}
          className="self-end bg-[#053a6d] rounded-2xl sm:rounded-3xl rounded-tr-md max-w-[292px] overflow-hidden shadow-lift"
        >
          <motion.div id="wa-link" className="m-1 sm:m-1.5 rounded-xl sm:rounded-2xl overflow-hidden bg-white cursor-pointer">
            <div className="h-[80px] sm:h-[140px] bg-[#f7f6f6] flex items-center justify-center">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-[#17233f] text-2xl sm:text-[44px] leading-none font-extrabold">HeartNote</span>
                <div className="relative">
                  <Heart className="w-6 sm:w-9 h-6 sm:h-9 text-[#c99383]" />
                  <Settings className="absolute -bottom-0.5 sm:-bottom-1 -end-1 sm:-end-2 w-3 sm:w-4 h-3 sm:h-4 text-[#17233f] fill-[#17233f]" />
                </div>
              </div>
            </div>

            <div className="bg-[#082d56] px-2 sm:px-3 py-1.5 sm:py-2.5 text-start">
              <p className="text-white text-sm sm:text-[18px] leading-tight">{t("wa.linkTitle")}</p>
              <p className="text-white/80 text-[9px] sm:text-[12px] mt-0.5">{t("wa.linkDesc")}</p>
              <p className="text-white/85 text-[9px] sm:text-[12px] mt-1 sm:mt-2 flex items-center justify-start gap-0.5 sm:gap-1" dir="ltr">
                <LinkIcon className="w-2 sm:w-3 h-2 sm:h-3" /> {t("wa.linkDomain")}
              </p>
            </div>
          </motion.div>

          <div className="px-2 sm:px-3 pb-1.5 sm:pb-2 text-start">
            <p className="text-white text-xs sm:text-[14px] leading-snug">{t("wa.caption")}</p>
            <p className="text-[#53bdeb] text-[8px] sm:text-[13px] mt-0.5 underline" dir="ltr">
              https://heartnote.co.il/p/65c55294-a898-4e8c-b425-f1cdac3028cd
            </p>
            <p className="text-white/45 text-[7px] sm:text-[10px] text-start mt-0.5 sm:mt-1">{t("wa.sentTime")} ✓✓</p>
          </div>
        </motion.div>

        <div className="self-end bg-[#053a6d] text-white text-xs sm:text-[14px] px-2 sm:px-3 py-1 sm:py-2 rounded-xl sm:rounded-2xl rounded-tr-md">
          {t("wa.closing")}
        </div>
      </div>

      <div className="px-2 sm:px-3 pb-2 sm:pb-3 pt-1.5 sm:pt-2 bg-[#111b21] border-t border-white/5">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button className="w-7 sm:w-9 h-7 sm:h-9 rounded-full bg-[#1f2c34] text-white/80 flex items-center justify-center">
            <Plus className="w-3 sm:w-4 h-3 sm:h-4" />
          </button>
          <div className="flex-1 h-8 sm:h-10 rounded-full bg-[#202c33] text-white/60 px-3 sm:px-4 flex items-center justify-between">
            <span className="text-xs sm:text-sm">{t("wa.composerPlaceholder")}</span>
            <Camera className="w-3 sm:w-4 h-3 sm:h-4" />
          </div>
          <button className="w-7 sm:w-10 h-7 sm:h-10 rounded-full bg-[#1f2c34] text-white flex items-center justify-center">
            <Mic className="w-3 sm:w-4 h-3 sm:h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
