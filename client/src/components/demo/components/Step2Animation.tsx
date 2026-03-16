"use client";

import { useEffect, useState } from "react";
import { ChevronUp, MousePointer2, Accessibility } from "lucide-react";
import { motion, useAnimate } from "framer-motion";
import { Step2PreviewCard } from "./Step2PreviewCard";
import { Step2EditorSheet } from "./Step2EditorSheet";

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function Step2Animation() {
  const [scope, animate] = useAnimate();
  const [questionText, setQuestionText] = useState("היי את פנויה מחר בערב ב9 לדייט?");
  const [successText, setSuccessText] = useState("ידעתי שתגידי כן מחכה לך!");
  const [colorActive, setColorActive] = useState(false);

  useEffect(() => {
    let isActive = true;

    const typeText = async (setter: (v: string) => void, newText: string) => {
      setter("");
      for (let i = 0; i <= newText.length; i++) {
        if (!isActive) return;
        setter(newText.slice(0, i));
        await new Promise<void>((r) => setTimeout(r, 40));
      }
    };

    const runSequence = async () => {
      try {
        await wait(500);
        if (!isActive) return;

        // Cursor enters and targets the bottom edit trigger
        await animate("#fake-cursor", { opacity: 1, top: "50%", left: "50%" }, { duration: 0.7, ease: "easeOut" });
        await animate("#fake-cursor", { top: "83%", left: "48%" }, { duration: 0.5, ease: "easeInOut" });
        await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.12 });
        await animate("#edit-trigger", { scale: 0.95 }, { duration: 0.12 });

        // Slide editor sheet up
        await Promise.all([
          animate("#editor-sheet", { y: 0 }, { duration: 0.4, ease: [0.32, 0.72, 0, 1] }),
          animate("#edit-trigger", { scale: 1 }, { duration: 0.15 }),
          animate("#fake-cursor", { scale: 1, opacity: 0 }, { duration: 0.2 }),
        ]);
        if (!isActive) return;

        // Cursor reappears at question input inside the sheet
        await wait(250);
        await animate("#fake-cursor", { opacity: 1, top: "53%", left: "50%", scale: 1 }, { duration: 0 });
        await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.12 });
        await animate("#question-input", { borderColor: "#d98574", backgroundColor: "rgba(253,242,240,0.4)" }, { duration: 0.15 });
        await animate("#fake-cursor", { scale: 1 }, { duration: 0.12 });

        await typeText(setQuestionText, "האם תרצי לצאת איתי לדייט אורלי?");
        if (!isActive) return;

        // Move to success message input
        await animate("#fake-cursor", { top: "68%", left: "50%" }, { duration: 0.45, ease: "easeInOut" });
        await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.12 });
        await animate("#success-input", { borderColor: "#d98574", backgroundColor: "rgba(253,242,240,0.4)" }, { duration: 0.15 });
        await animate("#fake-cursor", { scale: 1 }, { duration: 0.12 });

        await typeText(setSuccessText, "יש ניפגש ב9 בגן הפקאן");
        if (!isActive) return;

        // Move to salmon color circle and confirm
        await animate("#fake-cursor", { top: "83%", left: "40%" }, { duration: 0.45, ease: "easeInOut" });
        await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.12 });
        setColorActive(true);
        await animate("#fake-cursor", { scale: 1 }, { duration: 0.12 });

        await wait(500);
      } catch (e) {
        // Animation interrupted (e.g., component unmounted)
      }
    };

    runSequence();
    return () => { isActive = false; };
  }, [animate]);

  return (
    <div ref={scope} className="bg-[#faf9f6] h-full w-full relative overflow-hidden">

      {/* Layer 1: Preview Card */}
      <div className="absolute inset-0 flex items-center justify-center pb-20 pt-2">
        <Step2PreviewCard questionText={questionText} />
      </div>

      {/* Layer 2: Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 pb-5 px-4 z-20 flex items-center gap-2">
        <button
          id="edit-trigger"
          type="button"
          className="flex-1 flex items-center justify-center gap-2 bg-white rounded-full py-3 px-4 shadow-md border border-slate-100 text-hebrew-body text-sm text-slate-700"
          aria-label="ערוך מאפיינים"
        >
          <ChevronUp className="w-4 h-4 text-[#d98574]" />
          ערוך מאפיינים
        </button>
        <button
          type="button"
          className="bg-white rounded-full p-3 shadow-md border border-slate-100"
          aria-label="נגישות"
        >
          <Accessibility className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* Layer 3: Editor Bottom Sheet */}
      <Step2EditorSheet
        questionText={questionText}
        successText={successText}
        colorActive={colorActive}
      />

      {/* Fake Cursor */}
      <motion.div
        id="fake-cursor"
        className="absolute z-50 pointer-events-none"
        style={{ top: "80%", left: "85%", opacity: 0 }}
      >
        <MousePointer2 className="w-6 h-6 text-white fill-black" />
      </motion.div>
    </div>
  );
}
