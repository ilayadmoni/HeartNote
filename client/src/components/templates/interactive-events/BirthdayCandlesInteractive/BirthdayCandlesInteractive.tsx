"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { InteractiveShell } from "../shared/InteractiveShell";
import { BirthdayFlame } from "./components/BirthdayFlame";
import { BirthdayRevealOverlay } from "./components/BirthdayRevealOverlay";
import { getBirthdayCandlePlan } from "./utils/candle-utils";
import type { BirthdayInteractiveData } from "../types";
import type { TemplateComponentProps } from "../../types";


export function BirthdayCandlesInteractive({
  data,
}: TemplateComponentProps<BirthdayInteractiveData>) {
  const reduceMotion = Boolean(useReducedMotion());
  const plan = useMemo(() => getBirthdayCandlePlan(data.recipientAge), [data.recipientAge]);
  const [lit, setLit] = useState<boolean[]>(() => Array(plan.candleCount).fill(true));
  const [showGreeting, setShowGreeting] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    setLit(Array(plan.candleCount).fill(true));
    setShowGreeting(false);
  }, [plan.candleCount]);

  useEffect(() => {
    if (lit.every((item) => !item) && !showGreeting) {
      timers.current.forEach(clearTimeout);
      timers.current = [];

      if (reduceMotion) {
        setShowGreeting(true);
      } else {
        timers.current.push(setTimeout(() => setShowGreeting(true), 800));
      }
    }

    return () => timers.current.forEach(clearTimeout);
  }, [lit, showGreeting, reduceMotion]);

  const blowCandle = (index: number) => {
    setLit((current) => current.map((item, i) => (i === index ? false : item)));
  };

  const replay = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setShowGreeting(false);
    setLit(Array(plan.candleCount).fill(true));
  };

  const title = data.greetingTitle || `יום הולדת שמח${data.recipientName ? `, ${data.recipientName}` : ""}`;

  return (
    <InteractiveShell
      title={title}
      instruction="לחצו על הלהבות כדי לכבות את הנרות"
    >
      <div className="relative aspect-square w-full max-w-sm overflow-visible">
        <motion.div
          className="relative flex w-full flex-col items-center"
          animate={reduceMotion ? {} : { y: [0, -3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          {plan.showAgeNumber && (
            <div className="absolute top-0 z-20 text-5xl font-black leading-none text-[#1b263b] drop-shadow-[0_3px_0_rgba(212,130,111,0.24)] dark:text-white">
              {plan.age}
            </div>
          )}

          <div className="relative mt-12 w-full max-w-[500px] sm:max-w-[1000px]">
            <div
              className="absolute left-1/2 z-10 flex -translate-x-1/2 justify-center gap-1 overflow-visible"
              style={{
                top: 'clamp(30px, 1%, 30px)',
                width: `${Math.min(92, 32 + plan.candleCount * 6)}%`,
              }}
            >
              {lit.map((isLit, index) => (
                <BirthdayFlame
                  key={index}
                  index={index}
                  isLit={isLit}
                  reduceMotion={reduceMotion}
                  onClick={() => blowCandle(index)}
                />
              ))}
            </div>

            <Image
              src="/assets/images/birthday-interactive/birthday-cake.svg"
              alt="עוגת יום הולדת חגיגית"
              width={384}
              height={384}
              priority={false}
              className="mx-auto h-auto w-full drop-shadow-2xl"
            />
          </div>
        </motion.div>

        <AnimatePresence>
          {showGreeting && <BirthdayRevealOverlay data={data} onReplay={replay} />}
        </AnimatePresence>
      </div>
    </InteractiveShell>
  );
}
