"use client";

/**
 * Template Preview Page
 * For testing and previewing template components
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DateInvite,
  ScratchCard,
  Timeline,
  LoveCoupons,
  RelationshipQuiz,
  OpenWhen,
} from "@/components/templates";

// Sample data for each template
const SAMPLE_DATA = {
  DateInvite: {
    question: "?האם תצאי איתי לדייט",
    yesText: "כן",
    noText: "לא",
    successMessage: "!יש לנו דייט",
  },
  ScratchCard: {
    title: "גרד וגלה את ההפתעה",
    prizeContent: "🎉 זכית בארוחת ערב רומנטית!",
  },
  Timeline: {
    title: "הסיפור שלנו",
    events: [
      {
        id: "1",
        date: "2023-01-15",
        title: "הפגישה הראשונה",
        description: "נפגשנו בבית קפה",
      },
      {
        id: "2",
        date: "2023-02-14",
        title: "יום האהבה",
        description: "ארוחת ערב רומנטית",
      },
      {
        id: "3",
        date: "2023-06-20",
        title: "הטיול הראשון",
        description: "שבוע באיטליה",
      },
    ],
  },
  LoveCoupons: {
    title: "קופונים מיוחדים",
    coupons: [
      {
        id: "1",
        title: "ארוחת ערב",
        description: "במסעדה לבחירתך",
        icon: "🍽️",
        isRedeemed: false,
      },
      {
        id: "2",
        title: "עיסוי מפנק",
        description: "30 דקות פינוק",
        icon: "💆",
        isRedeemed: false,
      },
      {
        id: "3",
        title: "סרט לבחירתך",
        description: "כולל פופקורן!",
        icon: "🎬",
        isRedeemed: true,
      },
    ],
  },
  RelationshipQuiz: {
    title: "?כמה את/ה מכיר/ה אותי",
    questions: [
      {
        id: "1",
        question: "?מה הצבע האהוב עליי",
        options: ["אדום", "כחול", "ירוק", "סגול"],
        correctIndex: 1,
      },
      {
        id: "2",
        question: "?מה האוכל האהוב עליי",
        options: ["פיצה", "סושי", "המבורגר", "פסטה"],
        correctIndex: 0,
      },
    ],
    scoreMessages: [
      { minScore: 80, message: "!מכיר/ה אותי מעולה", emoji: "🎉" },
      { minScore: 50, message: "לא רע!", emoji: "😊" },
      { minScore: 0, message: "כדאי לשפר", emoji: "💪" },
    ],
  },
  OpenWhen: {
    title: "מכתבים מיוחדים",
    envelopes: [
      {
        id: "1",
        title: "כשאת/ה עצוב/ה",
        content: "אני תמיד כאן בשבילך ❤️",
        dateOpen: "2023-01-01", // Past date (unlocked)
        emoji: "😢",
      },
      {
        id: "2",
        title: "כשמתגעגעים",
        content: "גם אני מתגעגע/ת...",
        dateOpen: "2023-01-01", // Past date (unlocked)
        emoji: "💕",
      },
      {
        id: "3",
        title: "ביום המיוחד",
        content: "הפתעה!",
        dateOpen: "2030-01-01", // Future date (locked)
        emoji: "🎁",
      },
    ],
  },
};

type TemplateKey = keyof typeof SAMPLE_DATA;

const TEMPLATES: { key: TemplateKey; name: string }[] = [
  { key: "DateInvite", name: "הזמנה לדייט" },
  { key: "ScratchCard", name: "כרטיס גירוד" },
  { key: "Timeline", name: "ציר זמן" },
  { key: "LoveCoupons", name: "קופוני אהבה" },
  { key: "RelationshipQuiz", name: "חידון חברות" },
  { key: "OpenWhen", name: "פתח כש..." },
];

export default function TemplatePreviewPage() {
  const [activeTemplate, setActiveTemplate] =
    useState<TemplateKey>("DateInvite");

  return (
    <div className="min-h-screen bg-[#faf7f5] dark:bg-gray-900">
      {/* Template Selector */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {TEMPLATES.map(({ key, name }) => (
              <button
                key={key}
                onClick={() => setActiveTemplate(key)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all text-hebrew-heading ${
                  activeTemplate === key
                    ? "bg-[#d4826f] text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Template Preview */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTemplate}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTemplate === "DateInvite" && (
            <DateInvite data={SAMPLE_DATA.DateInvite} />
          )}
          {activeTemplate === "ScratchCard" && (
            <ScratchCard data={SAMPLE_DATA.ScratchCard} />
          )}
          {activeTemplate === "Timeline" && (
            <Timeline data={SAMPLE_DATA.Timeline} />
          )}
          {activeTemplate === "LoveCoupons" && (
            <LoveCoupons data={SAMPLE_DATA.LoveCoupons} />
          )}
          {activeTemplate === "RelationshipQuiz" && (
            <RelationshipQuiz data={SAMPLE_DATA.RelationshipQuiz} />
          )}
          {activeTemplate === "OpenWhen" && (
            <OpenWhen data={SAMPLE_DATA.OpenWhen} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
