"use client";

import { useState, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { RefreshCw } from "lucide-react";
import {
  FooterBranding,
  BackToGallery,
  TemplateResetButton,
} from "@/components/templates/components";
import type { ExcuseGeneratorViewProps } from "../types";

const DEFAULT_EXCUSES = [
  "הכלב שלי אכל את הזמן הפנוי שלי.",
  "הגשם גרם לי לחשוב מחדש.",
  "הצמח שלי חלה ואני צריך/ה לטפל בו.",
  "השכן שלי נגן על גיטרה ולא הצלחתי להתרכז.",
  "אמא שלי הזמינה אותי לאכול — לא יכול/ה לסרב.",
];

const EXCUSE_MAX_LENGTH = 80;

export function ExcuseGeneratorDesktop({ data }: ExcuseGeneratorViewProps) {
  const excuses =
    data.excuses
      ?.map((excuse) => excuse.slice(0, EXCUSE_MAX_LENGTH))
      .filter((excuse) => excuse.length > 0) || DEFAULT_EXCUSES;

  const [displayText, setDisplayText] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const cogControls = useAnimationControls();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const accent = data.primaryColor || "#d4826f";

  function generateExcuse() {
    if (generating) return;
    setGenerating(true);
    cogControls.start({ rotate: 360 * 6, transition: { duration: 1.1, ease: "linear" } });

    let count = 0;
    intervalRef.current = setInterval(() => {
      setDisplayText(excuses[Math.floor(Math.random() * excuses.length)]);
      count++;
      if (count > 10) {
        clearInterval(intervalRef.current!);
        setDisplayText(excuses[Math.floor(Math.random() * excuses.length)]);
        cogControls.stop();
        cogControls.set({ rotate: 0 });
        setGenerating(false);
      }
    }, 80);
  }

  function handleReset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    cogControls.stop();
    cogControls.set({ rotate: 0 });
    setDisplayText(null);
    setGenerating(false);
  }

  return (
    <div className="flex flex-col min-h-[390px] bg-transparent relative isolate">
      <BackToGallery className="top-4 right-4 absolute" />

      {/* Decorative blobs */}
      <div className="absolute top-8 left-8 w-44 h-44 bg-[#fde68a]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 right-8 w-52 h-52 bg-[#fca5a5]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex-1 flex flex-col items-center w-full max-w-md mx-auto px-6 py-8">
        {/* Cog icon */}
        <motion.div
          animate={cogControls}
          className="p-4 rounded-full mb-5"
          style={{ backgroundColor: `${accent}22` }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke={accent}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-2 text-hebrew-heading break-words"
          style={{ color: accent }}
        >
          {data.title || "מכונת התירוצים האוטומטית"}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-base text-gray-500 text-center mb-6 text-hebrew-body break-words"
        >
          {data.subtitle || "לא בא לך לצאת? יש לנו תירוץ בשבילך."}
        </motion.p>

        {/* Excuse display box */}
        <div className="w-full bg-white border-2 border-gray-200 rounded-2xl p-8 mb-6 min-h-[120px] flex items-center justify-center shadow-inner relative overflow-hidden">
          {generating && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 0.16, repeat: Infinity }}
              style={{ backgroundColor: `${accent}22` }}
            />
          )}
          <p
            className="text-xl font-black text-center relative z-10 text-hebrew-body break-words"
            style={{ color: accent }}
          >
            {displayText
              ? `"${displayText}"`
              : '"לחץ על הכפתור וקבל תירוץ מושלם"'}
          </p>
        </div>

        {/* Generate button */}
        <motion.button
          whileTap={generating ? undefined : { scale: 0.97 }}
          onClick={generateExcuse}
          disabled={generating}
          className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-lg text-white transition-opacity disabled:opacity-60"
          style={{ backgroundColor: accent }}
        >
          <RefreshCw size={20} />
          {generating ? "מחשב תירוץ..." : data.buttonLabel || "ג'נרט תירוץ"}
        </motion.button>

        {/* Reset button — shown after first excuse is generated */}
        {displayText && !generating && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4"
          >
          </motion.div>
        )}

        {/* Disclaimer */}
        {(data.disclaimer !== undefined ? data.disclaimer : true) && (
          <p className="text-xs text-gray-400 mt-4 text-center text-hebrew-body">
            {data.disclaimer ||
              "* החברה אינה אחראית לתוצאות השימוש בתירוצים אלו."}
          </p>
        )}
      </div>

      <FooterBranding className="shrink-0 pb-4" />
    </div>
  );
}
