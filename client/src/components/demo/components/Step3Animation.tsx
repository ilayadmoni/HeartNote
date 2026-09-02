"use client";

import { useEffect, useState } from "react";
import { Heart, MousePointer2 } from "lucide-react";
import { motion, useAnimate } from "framer-motion";
import { useTranslations } from "next-intl";
import { Step3Confetti } from "./Step3Confetti";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function Step3Animation(): JSX.Element {
  const t = useTranslations("demo.step3");
  const [scope, animate] = useAnimate();
  const [accepted, setAccepted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    let isActive = true;

    const runSequence = async (): Promise<void> => {
      try {
        await wait(500);
        if (!isActive) return;

        await animate("#fake-cursor", { top: "52%", left: "50%", opacity: 1 }, { duration: 0.7, ease: "easeOut" });
        await animate("#fake-cursor", { top: "71%", left: "63%" }, { duration: 0.5, ease: "easeInOut" });
        await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.1 });

        await Promise.all([
          animate("#no-btn", { x: -55, y: -28 }, { duration: 0.22, ease: "easeOut" }),
          animate("#fake-cursor", { scale: 1 }, { duration: 0.1 }),
        ]);

        await animate("#fake-cursor", { top: "56%", left: "38%" }, { duration: 0.32, ease: "easeInOut" });
        await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.1 });

        await Promise.all([
          animate("#no-btn", { x: 40, y: 20 }, { duration: 0.2, ease: "easeOut" }),
          animate("#fake-cursor", { scale: 1 }, { duration: 0.1 }),
        ]);
        if (!isActive) return;

        await animate("#fake-cursor", { top: "71%", left: "37%" }, { duration: 0.55, ease: "easeInOut" });
        await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.1 });
        await animate("#yes-btn", { scale: 0.93 }, { duration: 0.1 });

        if (!isActive) return;
        setAccepted(true);
        setShowConfetti(true);
        await Promise.all([
          animate("#fake-cursor", { scale: 1, opacity: 0 }, { duration: 0.3 }),
          animate("#yes-btn", { scale: 1 }, { duration: 0.2 }),
        ]);

        await wait(500);
      } catch {
        // Animation interrupted (e.g. component unmounted)
      }
    };

    runSequence();
    return () => { isActive = false; };
  }, [animate]);

  return (
    <div ref={scope} className="bg-surface-sunken h-full w-full flex flex-col items-center justify-center relative pt-8 pb-8">
      {!accepted ? (
        <div className="bg-surface p-7 rounded-card shadow-lift text-center w-full max-w-[280px] z-10 mx-4 border border-line">
          <div className="bg-accent-soft w-12 h-12 rounded-control flex items-center justify-center mx-auto mb-5">
            <Heart className="w-6 h-6 text-accent" fill="currentColor" />
          </div>
          <h3 className="text-body-lg text-ink mb-2 leading-snug">{t("question")}</h3>
          <p className="text-caption text-ink-muted mb-6">{t("hint")}</p>
          <div className="flex gap-3 w-full">
            <motion.button id="no-btn" className="flex-[0.8] py-2.5 bg-surface-sunken text-ink-muted rounded-pill text-body-sm" aria-label={t("no")}>
              {t("no")}
            </motion.button>
            <motion.button
              id="yes-btn"
              className="flex-[1.2] py-2.5 bg-accent text-accent-ink rounded-pill text-body-sm font-bold flex justify-center items-center gap-1.5 shadow-glow-sm"
              aria-label={t("yes")}
            >
              {t("yes")} <Heart className="w-3.5 h-3.5 fill-current" />
            </motion.button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "backOut" }}
          className="bg-surface p-8 rounded-card shadow-lift text-center w-full max-w-[280px] z-10 mx-4 border border-line"
        >
          <Heart className="w-12 h-12 text-accent mx-auto mb-4" fill="currentColor" />
          <h3 className="text-body-lg text-ink mb-2">{t("acceptedTitle")}</h3>
          <p className="text-body-sm text-ink-muted">{t("acceptedSubtitle")}</p>
        </motion.div>
      )}

      {showConfetti && <Step3Confetti onDone={() => setShowConfetti(false)} />}

      <motion.div id="fake-cursor" className="absolute z-50 pointer-events-none" style={{ top: "80%", left: "85%", opacity: 0 }}>
        <MousePointer2 className="w-6 h-6 text-white fill-black" />
      </motion.div>
    </div>
  );
}
