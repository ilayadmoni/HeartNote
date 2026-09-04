"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { InteractiveShell } from "../shared/InteractiveShell";
import { HolidayCardFrame } from "./HolidayCardFrame";
import { HolidayRevealOverlay } from "./HolidayRevealOverlay";
import { HolidayScene } from "./HolidayScene";
import { HOLIDAY_INTERACTIVE_CONFIGS } from "./holiday-config";
import type { HolidayInteractiveSlug, InteractiveGreetingData, TemplateComponentProps } from "../types";
import type { HolidaySceneStatus } from "./holiday-scene-types";

interface HolidayInteractiveCardProps extends TemplateComponentProps<InteractiveGreetingData> {
  slug: HolidayInteractiveSlug;
}

const FRAME_COUNTS: Partial<Record<string, number>> = {
  honey: 4,
  mask: 3,
  bloom: 3,
  sukkah: 3,
  hanukkah: 4,
};

export function HolidayInteractiveCard({ data, slug }: HolidayInteractiveCardProps) {
  const t = useTranslations("templates");
  const reduceMotion = Boolean(useReducedMotion());
  const [status, setStatus] = useState<HolidaySceneStatus>("idle");
  const [progress, setProgress] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const config = HOLIDAY_INTERACTIVE_CONFIGS[slug];
  const defaultTitle = t(config.defaultTitle);
  const prompt = t(config.prompt);
  const revealLine = t(config.revealLine);

  useEffect(() => {
    if (status !== "playing") return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const frameCount = FRAME_COUNTS[config.interaction];

    if (reduceMotion) {
      setProgress(frameCount ? frameCount - 1 : 1);
      timers.current.push(setTimeout(() => setStatus("revealed"), 260));
      return;
    }

    if (frameCount) {
      Array.from({ length: frameCount - 1 }).forEach((_, index) => {
        timers.current.push(setTimeout(() => setProgress(index + 1), (index + 1) * 500));
      });
      timers.current.push(setTimeout(() => setStatus("revealed"), frameCount * 500 + 250));
    } else {
      setProgress(1);
      timers.current.push(setTimeout(() => setStatus("revealed"), 1050));
    }

    return () => timers.current.forEach(clearTimeout);
  }, [config.interaction, reduceMotion, status]);

  const start = () => {
    if (status !== "idle") return;
    setProgress(0);
    setStatus("playing");
  };

  const replay = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setProgress(0);
    setStatus("idle");
  };

  const isFrameSequence = Boolean(FRAME_COUNTS[config.interaction]);

  return (
    <InteractiveShell title={data.greetingTitle || defaultTitle} instruction={prompt}>
      <HolidayCardFrame shape={isFrameSequence ? "square" : "rectangle"} wash={config.wash}>
        <div className="absolute inset-0">
          {status === "idle" && (
            <button
              type="button"
              onClick={start}
              className="absolute inset-0 z-10 rounded-card focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={prompt}
            />
          )}
          <HolidayScene
            config={config}
            status={status}
            reduceMotion={reduceMotion}
            progress={progress}
          />
          <AnimatePresence>
            {status === "revealed" && (
              <HolidayRevealOverlay
                data={data}
                titleFallback={revealLine}
                accentColor={data.primaryColor || config.accent}
                revealMotion={config.revealMotion}
                onReplay={replay}
              />
            )}
          </AnimatePresence>
        </div>
      </HolidayCardFrame>
    </InteractiveShell>
  );
}
