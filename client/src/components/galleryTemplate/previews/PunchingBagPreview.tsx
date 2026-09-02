"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function PunchingBagPreview(): JSX.Element {
  const t = useTranslations("gallery");

  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="flex flex-col items-center gap-0.5">
        {/* Chain links */}
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-px h-2 bg-navy-300" />
        ))}

        {/* Bag */}
        <motion.div
          animate={{ rotate: [0, 14, -10, 7, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5, ease: "easeInOut" }}
          style={{ transformOrigin: "top center" }}
          className="flex flex-col items-center"
        >
          <div className="w-8 h-2 bg-salmon-700 rounded-t-full" />
          <div className="w-10 h-12 rounded-b-full flex items-center justify-center shadow-lift bg-gradient-to-b from-salmon-600 to-salmon-800">
            <span className="text-[18px] mt-2">👊</span>
          </div>
        </motion.div>

        <p className="text-[6px] font-bold text-salmon-600 text-center mt-1.5">
          {t("previews.punchingBag.caption")}
        </p>
      </div>
    </div>
  );
}
