"use client";

import { useEffect, useState } from "react";
import { ChevronUp, MousePointer2, Accessibility } from "lucide-react";
import { motion, useAnimate } from "framer-motion";
import { useTranslations } from "next-intl";
import { Step2PreviewCard } from "./Step2PreviewCard";
import { Step2EditorSheet } from "./Step2EditorSheet";

const ACCENT = "rgb(216 90 48)";
const ACCENT_TINT = "rgba(216, 90, 48, 0.08)";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function Step2Animation(): JSX.Element {
  const t = useTranslations("demo.step2");
  const [scope, animate] = useAnimate();
  const [questionText, setQuestionText] = useState(t("questionTyped"));
  const [successText, setSuccessText] = useState(t("successTyped"));
  const [colorActive, setColorActive] = useState(false);

  useEffect(() => {
    let isActive = true;

    const typeText = async (setter: (v: string) => void, newText: string): Promise<void> => {
      setter("");
      for (let i = 0; i <= newText.length; i++) {
        if (!isActive) return;
        setter(newText.slice(0, i));
        await new Promise<void>((r) => setTimeout(r, 40));
      }
    };

    const runSequence = async (): Promise<void> => {
      try {
        await wait(500);
        if (!isActive) return;

        await animate("#fake-cursor", { opacity: 1, top: "50%", left: "50%" }, { duration: 0.7, ease: "easeOut" });
        await animate("#fake-cursor", { top: "83%", left: "48%" }, { duration: 0.5, ease: "easeInOut" });
        await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.12 });
        await animate("#edit-trigger", { scale: 0.95 }, { duration: 0.12 });

        await Promise.all([
          animate("#editor-sheet", { y: 0 }, { duration: 0.4, ease: [0.32, 0.72, 0, 1] }),
          animate("#edit-trigger", { scale: 1 }, { duration: 0.15 }),
          animate("#fake-cursor", { scale: 1, opacity: 0 }, { duration: 0.2 }),
        ]);
        if (!isActive) return;

        await wait(250);
        await animate("#fake-cursor", { opacity: 1, top: "53%", left: "50%", scale: 1 }, { duration: 0 });
        await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.12 });
        await animate("#question-input", { borderColor: ACCENT, backgroundColor: ACCENT_TINT }, { duration: 0.15 });
        await animate("#fake-cursor", { scale: 1 }, { duration: 0.12 });

        await typeText(setQuestionText, t("questionTyped"));
        if (!isActive) return;

        await animate("#fake-cursor", { top: "68%", left: "50%" }, { duration: 0.45, ease: "easeInOut" });
        await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.12 });
        await animate("#success-input", { borderColor: ACCENT, backgroundColor: ACCENT_TINT }, { duration: 0.15 });
        await animate("#fake-cursor", { scale: 1 }, { duration: 0.12 });

        await typeText(setSuccessText, t("successTyped"));
        if (!isActive) return;

        await animate("#fake-cursor", { top: "83%", left: "40%" }, { duration: 0.45, ease: "easeInOut" });
        await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.12 });
        setColorActive(true);
        await animate("#fake-cursor", { scale: 1 }, { duration: 0.12 });

        await wait(500);
      } catch {
        // Animation interrupted (e.g. component unmounted)
      }
    };

    runSequence();
    return () => { isActive = false; };
  }, [animate, t]);

  return (
    <div ref={scope} className="bg-surface-sunken h-full w-full relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pb-20 pt-2">
        <Step2PreviewCard questionText={questionText} />
      </div>

      <div className="absolute bottom-0 inset-x-0 pb-5 px-4 z-20 flex items-center gap-2">
        <button id="edit-trigger" type="button" className="flex-1 flex items-center justify-center gap-2 bg-surface rounded-pill py-3 px-4 shadow-soft border border-line text-body-sm text-ink" aria-label={t("editTrigger")}>
          <ChevronUp className="w-4 h-4 text-accent" />
          {t("editTrigger")}
        </button>
        <button type="button" className="bg-surface rounded-pill p-3 shadow-soft border border-line" aria-label={t("accessibility")}>
          <Accessibility className="w-5 h-5 text-ink-muted" />
        </button>
      </div>

      <Step2EditorSheet questionText={questionText} successText={successText} colorActive={colorActive} />

      <motion.div id="fake-cursor" className="absolute z-50 pointer-events-none" style={{ top: "80%", left: "85%", opacity: 0 }}>
        <MousePointer2 className="w-6 h-6 text-white fill-black" />
      </motion.div>
    </div>
  );
}
