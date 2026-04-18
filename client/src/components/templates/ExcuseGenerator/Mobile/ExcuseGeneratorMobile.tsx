"use client";

/**
 * ExcuseGeneratorMobile Component
 * Mobile layout — compact stacked layout with cog icon and cycling animation
 */

import { useState, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  FooterBranding,
  BackToGallery,
} from "@/components/templates/components";
import type { ExcuseGeneratorViewProps } from "../types";

const DEFAULT_EXCUSES = [
  "הכלב שלי אכל את הזמן הפנוי שלי.",
  "הגשם גרם לי לחשוב מחדש.",
  "הצמח שלי חלה ואני צריך/ה לטפל בו.",
  "השכן שלי נגן על גיטרה ולא הצלחתי להתרכז.",
  "אמא שלי הזמינה אותי לאכול — לא יכול/ה לסרב.",
];

export function ExcuseGeneratorMobile({ data }: ExcuseGeneratorViewProps) {
  const pathname = usePathname();
  const isCreateRoute = pathname?.includes("/create/");
  const excuses =
    data.excuses?.length >= 1 ? data.excuses : DEFAULT_EXCUSES;

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

  return (
    <div
      className={`bg-transparent px-4 relative isolate overflow-hidden flex flex-col justify-between items-center gap-4 py-6 ${
        isCreateRoute ? "min-h-[400px]" : "min-h-[650px]"
      }`}
    >
      {/* Decorative blobs */}
      <div className="absolute top-5 left-0 w-28 h-28 bg-[#fde68a]/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-36 h-36 bg-[#fca5a5]/15 rounded-full blur-2xl pointer-events-none" />

      <div className="flex-1 max-w-sm mx-auto flex flex-col items-center justify-center w-full gap-4">
        <BackToGallery className="mb-1" />

        {/* Cog icon */}
        <motion.div
          animate={cogControls}
          className="p-3 rounded-full"
          style={{ backgroundColor: `${accent}22` }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
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
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-center text-hebrew-heading"
          style={{ color: accent }}
        >
          {data.title || "מכונת התירוצים האוטומטית"}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-sm text-gray-500 text-center text-hebrew-body"
        >
          {data.subtitle || "לא בא לך לצאת? יש לנו תירוץ בשבילך."}
        </motion.p>

        {/* Excuse display box */}
        <div className="w-full bg-white border-2 border-gray-200 rounded-2xl p-6 min-h-[100px] flex items-center justify-center shadow-inner relative overflow-hidden">
          {generating && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 0.16, repeat: Infinity }}
              style={{ backgroundColor: `${accent}22` }}
            />
          )}
          <p className="text-base font-bold text-[#2e3c52] text-center relative z-10 text-hebrew-body">
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
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full font-bold text-base text-white transition-opacity disabled:opacity-60"
          style={{ backgroundColor: accent }}
        >
          <RefreshCw size={18} />
          {generating ? "מחשב תירוץ..." : data.buttonLabel || "ג'נרט תירוץ"}
        </motion.button>

        {/* Disclaimer */}
        {(data.disclaimer !== undefined ? data.disclaimer : true) && (
          <p className="text-xs text-gray-400 text-center text-hebrew-body">
            {data.disclaimer ||
              "* החברה אינה אחראית לתוצאות השימוש בתירוצים אלו."}
          </p>
        )}
      </div>

      <FooterBranding className="mx-auto" />
    </div>
  );
}
