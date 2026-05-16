"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { InteractiveShell } from "../shared/InteractiveShell";
import { WeddingRevealOverlay } from "./WeddingRevealOverlay";
import type { TemplateComponentProps } from "../../types";
import type { WeddingInteractiveData } from "../types";

const FRAMES = [
  "/assets/images/wedding-interactive/wedding-1.svg",
  "/assets/images/wedding-interactive/wedding-2.svg",
  "/assets/images/wedding-interactive/wedding-3.svg",
] as const;

export function WeddingGlassInteractive({
  data,
}: TemplateComponentProps<WeddingInteractiveData>) {
  const reduceMotion = Boolean(useReducedMotion());
  const [frame, setFrame] = useState(0);
  const [started, setStarted] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!started) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];

    if (reduceMotion) {
      setFrame(2);
      timers.current.push(setTimeout(() => setShowGreeting(true), 260));
      return;
    }

    timers.current.push(setTimeout(() => setFrame(1), 620));
    timers.current.push(setTimeout(() => setFrame(2), 1240));
    timers.current.push(setTimeout(() => setShowGreeting(true), 1900));
    return () => timers.current.forEach(clearTimeout);
  }, [started, reduceMotion]);

  const start = () => {
    if (started) return;
    setShowGreeting(false);
    setStarted(true);
  };

  const replay = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStarted(false);
    setShowGreeting(false);
    setFrame(0);
  };

  return (
    <InteractiveShell
      title={data.greetingTitle || data.coupleNames || "מזל טוב לזוג האהוב"}
      instruction="לחצו כדי להפעיל את רגע החתונה"
    >
      <div className="relative aspect-square w-full max-w-md overflow-visible">
        {!started && (
          <button
            type="button"
            onClick={start}
            className="absolute inset-0 z-10 rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4826f]"
            aria-label="הפעילו את רגע החתונה"
          />
        )}

        {FRAMES.map((src, index) => (
          <motion.img
            key={src}
            src={src}
            alt={index === frame ? "איור חתונה אינטראקטיבי" : ""}
            aria-hidden={index !== frame}
            className="absolute inset-0 h-full w-full object-contain drop-shadow-2xl"
            initial={false}
            animate={{
              opacity: index === frame ? (showGreeting ? 0.62 : 1) : 0,
              scale: index === frame ? (showGreeting ? 1.025 : 1) : 0.985,
              y: index === frame ? 0 : 6,
            }}
            transition={{ duration: reduceMotion ? 0.12 : 0.56, ease: "easeInOut" }}
          />
        ))}

        <AnimatePresence>
          {showGreeting && <WeddingRevealOverlay data={data} onReplay={replay} />}
        </AnimatePresence>
      </div>

      {!started && (
        <button
          type="button"
          onClick={start}
          className="rounded-full bg-[#d4826f] px-6 py-3 text-sm font-bold text-white shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b263b]"
        >
          להפעיל את הרגע
        </button>
      )}
    </InteractiveShell>
  );
}
