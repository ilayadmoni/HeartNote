"use client";

import { useEffect } from "react";
import { MousePointer2 } from "lucide-react";
import { motion, useAnimate } from "framer-motion";
import { useTranslations } from "next-intl";
import { STEP1_CARDS, STEP1_FILTERS } from "../constants/step1Cards";
import { Step1Card } from "./Step1Card";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function Step1Animation(): JSX.Element {
  const t = useTranslations("demo.step1");
  const [scope, animate] = useAnimate();

  useEffect(() => {
    let isActive = true;

    const runSequence = async (): Promise<void> => {
      try {
        await wait(500);
        if (!isActive) return;

        await animate("#fake-cursor", { top: "80%", left: "50%", opacity: 1 }, { duration: 0.1 });
        if (!isActive || !scope.current) return;

        const wrapperEl = scope.current as HTMLElement;
        const buttonEl = wrapperEl.querySelector("#date-btn") as HTMLElement | null;

        if (buttonEl) {
          const btnRect = buttonEl.getBoundingClientRect();
          const wrapRect = wrapperEl.getBoundingClientRect();
          const targetTop = ((btnRect.top + btnRect.height / 2 - wrapRect.top) / wrapRect.height) * 100;
          const targetLeft = ((btnRect.left + btnRect.width / 2 - wrapRect.left) / wrapRect.width) * 100;

          await animate("#fake-cursor", { top: `${targetTop}%`, left: `${targetLeft}%` }, { duration: 1.5, ease: "easeInOut" });
        }
        if (!isActive) return;

        await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.12 });
        await animate("#date-btn", { scale: 0.95 }, { duration: 0.12 });
        await Promise.all([
          animate("#fake-cursor", { scale: 1 }, { duration: 0.12 }),
          animate("#date-btn", { scale: 1 }, { duration: 0.2 }),
        ]);

        await wait(500);
      } catch {
        // Animation interrupted (e.g. component unmounted)
      }
    };

    runSequence();
    return () => { isActive = false; };
  }, [animate, scope]);

  return (
    <div ref={scope} className="bg-surface-sunken h-full w-full flex flex-col pt-4 pb-4 overflow-hidden relative">
      <div className="px-4">
        <h3 className="text-title-md text-ink text-center mb-1">{t("heading")}</h3>
        <p className="text-caption text-ink-muted text-center mb-4">{t("subheading")}</p>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {STEP1_FILTERS.map((filter, index) => (
            <span
              key={filter}
              className={`text-caption px-3 py-1.5 rounded-pill whitespace-nowrap ${
                index === 0 ? "bg-accent text-accent-ink" : "bg-surface text-ink-muted border border-line"
              }`}
            >
              {t(`filters.${filter}`)}
            </span>
          ))}
        </div>
      </div>

      <motion.div id="templates-wrapper" className="px-5 pt-3 pb-8 flex flex-col gap-6">
        {STEP1_CARDS.map((card, index) => (
          <Step1Card key={card.key} card={card} ctaId={index === 0 ? "date-btn" : undefined} />
        ))}
      </motion.div>

      <motion.div id="fake-cursor" className="absolute z-50 pointer-events-none" style={{ top: "80%", left: "80%", opacity: 0 }}>
        <MousePointer2 className="w-6 h-6 text-white fill-black" />
      </motion.div>
    </div>
  );
}
