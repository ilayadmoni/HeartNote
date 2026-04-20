"use client";

/**
 * TemplatePreview Component
 * Visual miniature previews for different template types
 * Shows a small preview of how the template looks
 */

import { motion } from "framer-motion";
import {
  DecisionWheelPreview,
  SteamyWindowPreview,
  SurpriseGiftPreview,
  SlotMachinePreview,
  PunchingBagPreview,
  ApologySearchPreview,
  BirthdayCandlesPreview,
  ExcuseGeneratorPreview,
  WeddingGlassPreview,
  HolidayCardPreview,
  BarBatMitzvahPreview,
} from "./MorePreviews";
import { LivePreview } from "./LivePreview";
import type { TemplateComponentKey } from "../types";

interface TemplatePreviewProps {
  componentKey: TemplateComponentKey;
}

export function TemplatePreview({ componentKey }: TemplatePreviewProps) {
  switch (componentKey) {
    case "DateInvite":
      return <DateInvitePreview />;
    case "ScratchCard":
      return <ScratchCardPreview />;
    case "Timeline":
      return <TimelinePreview />;
    case "LoveCoupons":
      return <LoveCouponsPreview />;
    case "RelationshipQuiz":
      return <RelationshipQuizPreview />;
    case "OpenWhen":
      return <OpenWhenPreview />;
    case "DecisionWheel":
      return <DecisionWheelPreview />;
    case "SteamyWindow":
      return <SteamyWindowPreview />;
    case "SurpriseGift":
      return <SurpriseGiftPreview />;
    case "SlotMachine":
      return <SlotMachinePreview />;
    case "PunchingBag":
      return <PunchingBagPreview />;
    case "ApologySearch":
      return <ApologySearchPreview />;
    case "BirthdayCandles":
      return <BirthdayCandlesPreview />;
    case "ExcuseGenerator":
      return <ExcuseGeneratorPreview />;
    case "WeddingGlass":
      return <WeddingGlassPreview />;
    case "HolidayCard":
      return <HolidayCardPreview />;
    case "BarBatMitzvah":
      return <BarBatMitzvahPreview />;
    default:
      return <LivePreview componentKey={componentKey} />;
  }
}

function DateInvitePreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="bg-white dark:bg-gray-600 px-4 py-3 rounded-xl shadow-md text-center">
        <p className="text-[10px] font-bold text-[#2e3c52] dark:text-white mb-2 text-hebrew-heading">
          ?תצא/י איתי
        </p>
        <div className="flex gap-2 justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-6 w-12 bg-[#d4826f] rounded-md flex items-center justify-center text-[9px] text-white font-bold"
          >
            כן!
          </motion.div>
          <motion.div
            animate={{ x: [0, 5, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="h-6 w-12 bg-gray-200 dark:bg-gray-500 rounded-md flex items-center justify-center text-[9px] text-gray-500 dark:text-gray-300"
          >
            לא
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ScratchCardPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="w-full max-w-[100px] aspect-[4/3] rounded-lg overflow-hidden relative border border-gray-200 dark:border-gray-600">
        {/* Prize behind */}
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-600">
          <span className="text-2xl">🎁</span>
        </div>
        {/* Scratch layer with hole */}
        <motion.div
          initial={{ clipPath: "inset(0 0 0 0)" }}
          animate={{
            clipPath:
              "polygon(0 0, 100% 0, 100% 100%, 50% 100%, 65% 45%, 30% 35%, 0 60%)",
          }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400"
        />
      </div>
    </div>
  );
}

function TimelinePreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex items-center gap-1 relative h-12">
        {/* Horizontal line */}
        <div className="absolute left-2 right-2 h-0.5 bg-[#d4826f]/50" />
        {/* Dots */}
        {["❤️", "✨", "💒"].map((emoji, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.2, duration: 0.3 }}
            className="z-10 w-7 h-7 bg-white dark:bg-gray-600 rounded-full border-2 border-[#d4826f] flex items-center justify-center text-xs shadow-sm"
          >
            {emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LoveCouponsPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="space-y-1">
        {[
          { emoji: "💆", redeemed: false },
          { emoji: "🍽️", redeemed: true },
        ].map((coupon, i) => (
          <motion.div
            key={i}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.15 }}
            className={`flex items-center gap-2 px-2 py-1 rounded-lg border-2 border-dashed ${
              coupon.redeemed
                ? "border-gray-300 bg-gray-100 dark:bg-gray-700 opacity-60"
                : "border-[#d4826f] bg-white dark:bg-gray-600"
            }`}
          >
            <span className="text-sm">{coupon.emoji}</span>
            {coupon.redeemed && (
              <span className="text-[8px] text-red-500 font-bold">✓</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RelationshipQuizPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="bg-white dark:bg-gray-600 rounded-lg p-2 shadow-md w-full max-w-[90px]">
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-200 dark:bg-gray-500 rounded-full mb-2 overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "66%" }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            className="h-full bg-[#d4826f]"
          />
        </div>
        {/* Question */}
        <p className="text-[8px] text-center text-[#2e3c52] dark:text-white mb-1 font-bold">
          ?
        </p>
        {/* Options */}
        <div className="grid grid-cols-2 gap-1">
          {[1, 2, 3, 4].map((n) => (
            <motion.div
              key={n}
              whileHover={{ scale: 1.05 }}
              className="h-3 bg-gray-100 dark:bg-gray-500 rounded text-[6px] flex items-center justify-center"
            >
              {n}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OpenWhenPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { emoji: "😢", locked: false },
          { emoji: "💪", locked: false },
          { emoji: "🎁", locked: true },
          { emoji: "💕", locked: true },
        ].map((env, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`w-8 h-6 rounded flex items-center justify-center text-xs ${
              env.locked
                ? "bg-gray-200 dark:bg-gray-600"
                : "bg-[#f5e6d3] dark:bg-gray-500"
            }`}
          >
            {env.locked ? "🔒" : env.emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

