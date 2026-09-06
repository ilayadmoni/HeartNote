"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function PunchingBagPreview(): JSX.Element {
  const t = useTranslations("gallery");

  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="relative flex flex-col items-center gap-0.5">
        {/* Ceiling mount + chain */}
        <div className="w-4 h-1 rounded-sm bg-navy-400" aria-hidden="true" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-px h-2 bg-navy-300" aria-hidden="true" />
        ))}

        {/* Bag */}
        <motion.div
          animate={{ rotate: [0, 15, -10, 8, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5, ease: "easeInOut" }}
          style={{ transformOrigin: "top center" }}
          className="flex flex-col items-center"
        >
          <div className="w-8 h-2 rounded-t-full bg-salmon-700" />
          <div className="w-10 h-12 rounded-b-full shadow-lift bg-gradient-to-b from-salmon-600 to-salmon-800 flex items-center justify-center">
            <span className="text-[18px] mt-2">👊</span>
          </div>
        </motion.div>

        {/* Impact flash on each swing */}
        <motion.span
          animate={{ scale: [0, 1.15, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.06, 0.18] }}
          className="pointer-events-none absolute top-[42%] left-1/2 -translate-x-1/2 h-6 w-6 rounded-full border-2 border-amber-400"
          aria-hidden="true"
        />

        <p className="mt-1.5 text-[6px] font-bold text-salmon-600 text-center">
          {t("previews.punchingBag.caption")}
        </p>
      </div>
    </div>
  );
}
