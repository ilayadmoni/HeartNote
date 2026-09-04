"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { InteractiveShell } from "@/components/templates/shared/InteractiveShell";
import { BirthdayFlame } from "./BirthdayFlame";
import { BirthdayRevealOverlay } from "./BirthdayRevealOverlay";
import { getBirthdayCandlePlan } from "../utils/candle-utils";
import type { BirthdayInteractiveData, TemplateComponentProps } from "@/components/templates/types";

export function BirthdayCandlesCore({
  data,
}: TemplateComponentProps<BirthdayInteractiveData>) {
  const t = useTranslations("templates");
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

  const litCount = lit.filter(Boolean).length;
  const extinguishedRatio = plan.candleCount > 0 ? 1 - litCount / plan.candleCount : 0;
  const lastLitIndex = lit.reduce((acc, isLit, i) => (isLit ? i : acc), -1);

  const blowCandle = (index: number) => {
    setLit((current) => current.map((item, i) => (i === index ? false : item)));
  };

  const replay = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setShowGreeting(false);
    setLit(Array(plan.candleCount).fill(true));
  };

  const title =
    data.greetingTitle ||
    `${t("birthdayCandles.greetingDefault")}${data.recipientName ? `, ${data.recipientName}` : ""}`;

  return (
    <InteractiveShell title={title} instruction={t("birthdayCandles.instruction")}>
      <div className="relative aspect-square w-full max-w-sm overflow-visible">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, transparent 30%, rgba(20,12,8,0.55) 100%)",
          }}
          animate={{ opacity: extinguishedRatio * 0.6 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.div
          className="relative flex w-full flex-col items-center"
          animate={reduceMotion ? {} : { y: [0, -3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          {plan.showAgeNumber && (
            <div className="absolute top-0 z-20 text-5xl font-black leading-none text-ink drop-shadow-[0_3px_0_rgba(212,130,111,0.24)]">
              {plan.age}
            </div>
          )}
          <div className="relative mt-12 w-full max-w-[500px] sm:max-w-[1000px]">
            <div
              className="absolute left-1/2 z-10 flex -translate-x-1/2 justify-center gap-1 overflow-visible"
              style={{ top: "clamp(30px, 1%, 30px)", width: `${Math.min(92, 32 + plan.candleCount * 6)}%` }}
            >
              {lit.map((isLit, index) => (
                <BirthdayFlame
                  key={index}
                  index={index}
                  isLit={isLit}
                  isLast={isLit && index === lastLitIndex && litCount === 1}
                  reduceMotion={reduceMotion}
                  onClick={() => blowCandle(index)}
                />
              ))}
            </div>
            <Image
              src="/assets/images/birthday-interactive/birthday-cake.svg"
              alt={t("birthdayCandles.cakeAlt")}
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
