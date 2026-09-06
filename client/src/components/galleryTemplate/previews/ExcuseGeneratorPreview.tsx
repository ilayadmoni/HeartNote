"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Dices } from "lucide-react";

const EXCUSE_KEYS = [1, 2, 3, 4, 5] as const;

export function ExcuseGeneratorPreview(): JSX.Element {
  const t = useTranslations("gallery");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIdx((p) => (p + 1) % EXCUSE_KEYS.length), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="w-full max-w-[110px] flex flex-col items-center gap-1.5">
        {/* Output slot */}
        <div className="w-full min-h-[34px] flex items-center justify-center overflow-hidden rounded-lg border border-line bg-surface-raised p-2 shadow-soft">
          <AnimatePresence mode="wait">
            <motion.p
              key={idx}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[6px] font-bold text-ink text-center leading-tight"
            >
              &ldquo;{t(`previews.excuseGenerator.excuse${EXCUSE_KEYS[idx]}`)}&rdquo;
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Generate button */}
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-1 rounded-pill bg-accent px-2.5 py-0.5 text-[6px] font-bold text-accent-ink shadow-soft"
        >
          <Dices size={8} aria-hidden="true" />
          {t("previews.excuseGenerator.cta")}
        </motion.div>
      </div>
    </div>
  );
}
