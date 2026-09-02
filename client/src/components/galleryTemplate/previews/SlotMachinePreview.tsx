"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function SlotMachinePreview(): JSX.Element {
  const t = useTranslations("gallery");
  const columns = [
    [
      t("previews.slotMachine.reel1Word1"),
      t("previews.slotMachine.reel1Word2"),
      t("previews.slotMachine.reel1Word3"),
    ],
    [
      t("previews.slotMachine.reel2Word1"),
      t("previews.slotMachine.reel2Word2"),
      t("previews.slotMachine.reel2Word3"),
    ],
    [
      t("previews.slotMachine.reel3Word1"),
      t("previews.slotMachine.reel3Word2"),
      t("previews.slotMachine.reel3Word3"),
    ],
  ];

  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex gap-1">
          {columns.map((labels, col) => (
            <div
              key={col}
              className="w-7 h-10 rounded-md bg-cream-200 border border-line shadow-soft overflow-hidden relative"
            >
              <motion.div
                animate={{ y: [0, -40, -80, -40, 0] }}
                transition={{
                  duration: 2,
                  times: [0, 0.25, 0.5, 0.75, 1],
                  repeat: Infinity,
                  repeatDelay: 1,
                  delay: col * 0.15,
                  ease: "easeInOut",
                }}
                className="flex flex-col"
              >
                {labels.map((label, i) => (
                  <div key={i} className="h-10 flex items-center justify-center text-[8px] font-bold text-ink">
                    {label}
                  </div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="px-3 py-1 rounded-pill bg-accent text-accent-ink text-[8px] font-bold shadow-soft"
        >
          {t("previews.slotMachine.cta")}
        </motion.div>
      </div>
    </div>
  );
}
