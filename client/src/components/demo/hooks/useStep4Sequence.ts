"use client";

import { useEffect, useState, type RefObject } from "react";
import type { useAnimate } from "framer-motion";

export type Step4Phase = "preview" | "modal" | "whatsapp";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type AnimateFn = ReturnType<typeof useAnimate>[1];

/** Cursor-driven phase sequence: preview -> share modal -> WhatsApp share. */
export function useStep4Sequence(scope: RefObject<HTMLElement>, animate: AnimateFn): Step4Phase {
  const [phase, setPhase] = useState<Step4Phase>("preview");

  useEffect(() => {
    let isActive = true;

    const runSequence = async (): Promise<void> => {
      try {
        await wait(500);
        if (!isActive || !scope.current) return;

        const wrapperEl = scope.current;
        const sendButtonEl = wrapperEl.querySelector("#send-btn") as HTMLElement | null;

        if (sendButtonEl) {
          const btnRect = sendButtonEl.getBoundingClientRect();
          const wrapRect = wrapperEl.getBoundingClientRect();
          const targetTop = ((btnRect.top + btnRect.height / 2 - wrapRect.top) / wrapRect.height) * 100;
          const targetLeft = ((btnRect.left + btnRect.width / 2 - wrapRect.left) / wrapRect.width) * 100;
          await animate("#fake-cursor", { top: `${targetTop}%`, left: `${targetLeft}%`, opacity: 1 }, { duration: 0.8, ease: "easeOut" });
        } else {
          await animate("#fake-cursor", { top: "13%", left: "18%", opacity: 1 }, { duration: 0.8, ease: "easeOut" });
        }
        if (!isActive) return;

        await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.1 });
        await animate("#send-btn", { scale: 0.95 }, { duration: 0.1 });
        await animate("#fake-cursor", { scale: 1 }, { duration: 0.1 });
        await animate("#send-btn", { scale: 1 }, { duration: 0.1 });

        if (!isActive) return;
        setPhase("modal");
        await wait(400);

        await animate("#fake-cursor", { top: "68%", left: "34%" }, { duration: 0.8, ease: "easeInOut" });
        if (!isActive) return;

        await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.1 });
        await animate("#wa-btn", { scale: 0.95 }, { duration: 0.1 });
        await animate("#fake-cursor", { scale: 1 }, { duration: 0.1 });

        if (!isActive) return;
        setPhase("whatsapp");
        await wait(600);

        await animate("#fake-cursor", { top: "53%", left: "34%" }, { duration: 0.8, ease: "easeInOut" });
        if (!isActive) return;

        await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.1 });
        await animate("#wa-link", { opacity: 0.8 }, { duration: 0.1 });
        await animate("#fake-cursor", { scale: 1 }, { duration: 0.1 });

        await wait(1000);
      } catch {
        // Animation interrupted (e.g. component unmounted)
      }
    };

    runSequence();
    return () => { isActive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate]);

  return phase;
}
