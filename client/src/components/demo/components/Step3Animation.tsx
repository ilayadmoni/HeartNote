"use client";

import { useEffect, useState } from "react";
import { Heart, MousePointer2 } from "lucide-react";
import { motion, useAnimate } from "framer-motion";

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function Step3Animation() {
  const [scope, animate] = useAnimate();
  const [accepted, setAccepted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    let isActive = true;

    const runSequence = async () => {
      await wait(500);
      if (!isActive) return;

      // Cursor enters pointing at center of card
      await animate("#fake-cursor", { top: "52%", left: "50%", opacity: 1 }, { duration: 0.7, ease: "easeOut" });

      // Move toward "לא" button (RTL: first DOM element appears on the right)
      await animate("#fake-cursor", { top: "71%", left: "63%" }, { duration: 0.5, ease: "easeInOut" });
      await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.1 });

      // "לא" button escapes — jumps diagonally up-left
      await Promise.all([
        animate("#no-btn", { x: -55, y: -28 }, { duration: 0.22, ease: "easeOut" }),
        animate("#fake-cursor", { scale: 1 }, { duration: 0.1 }),
      ]);

      // Cursor chases
      await animate("#fake-cursor", { top: "56%", left: "38%" }, { duration: 0.32, ease: "easeInOut" });
      await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.1 });

      // Escapes again — jumps down-right
      await Promise.all([
        animate("#no-btn", { x: 40, y: 20 }, { duration: 0.2, ease: "easeOut" }),
        animate("#fake-cursor", { scale: 1 }, { duration: 0.1 }),
      ]);

      if (!isActive) return;

      // Cursor gives up — moves to "כן" (RTL: second DOM element, appears on the left)
      await animate("#fake-cursor", { top: "71%", left: "37%" }, { duration: 0.55, ease: "easeInOut" });
      await animate("#fake-cursor", { scale: 0.8 }, { duration: 0.1 });
      await animate("#yes-btn", { scale: 0.93 }, { duration: 0.1 });

      // Click lands — accept and fade cursor
      if (!isActive) return;
      setAccepted(true);
      setShowConfetti(true);
      await Promise.all([
        animate("#fake-cursor", { scale: 1, opacity: 0 }, { duration: 0.3 }),
        animate("#yes-btn", { scale: 1 }, { duration: 0.2 }),
      ]);

      await wait(500);
    };

    runSequence();
    return () => { isActive = false; };
  }, [animate]);

  return (
    <div ref={scope} className="bg-[#faf9f6] h-full w-full flex flex-col items-center justify-center relative pt-8 pb-8">
      {!accepted ? (
        <div className="bg-white p-7 rounded-3xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)] text-center w-full max-w-[280px] z-10 mx-4 border border-rose-50">
          <div className="bg-rose-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5">
            <Heart className="w-6 h-6 text-[#d98574] fill-[#d98574]" />
          </div>
          <h3 className="text-[17px] text-hebrew-heading text-slate-800 mb-2 leading-snug">
            האם תרצי לצאת איתי לדייט אורלי?
          </h3>
          <p className="text-[11px] text-hebrew-small text-slate-500 mb-6">
            כדאי לך לבחור את התשובה הנכונה...
          </p>
          <div className="flex gap-3 w-full">
            <motion.button
              id="no-btn"
              className="flex-[0.8] py-2.5 bg-gray-100 text-gray-500 rounded-full text-sm text-hebrew-body"
              aria-label="לא"
            >
              לא
            </motion.button>
            <motion.button
              id="yes-btn"
              className="flex-[1.2] py-2.5 bg-[#d98574] text-white rounded-full text-sm text-hebrew-body font-bold flex justify-center items-center gap-1.5 shadow-lg shadow-rose-200"
              aria-label="כן"
            >
              כן <Heart className="w-3.5 h-3.5 fill-current" />
            </motion.button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "backOut" }}
          className="bg-white p-8 rounded-3xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)] text-center w-full max-w-[280px] z-10 mx-4 border border-rose-50"
        >
          <div className="text-5xl mb-4">💕</div>
          <h3 className="text-[17px] text-hebrew-heading text-slate-800 mb-2">ידעתי שתגיד כן!</h3>
          <p className="text-sm text-hebrew-small text-slate-500">יש ניפגש ב9 בגן הפקאן 🌿</p>
        </motion.div>
      )}

      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden" aria-hidden="true">
          {[
            { left: "18%", color: "#f59e0b", delay: 0 },
            { left: "30%", color: "#10b981", delay: 0.04 },
            { left: "42%", color: "#60a5fa", delay: 0.08 },
            { left: "54%", color: "#f472b6", delay: 0.12 },
            { left: "66%", color: "#a78bfa", delay: 0.16 },
            { left: "78%", color: "#fb7185", delay: 0.2 },
          ].map((piece, index) => (
            <motion.span
              key={`${piece.left}-${index}`}
              className="absolute top-[40%] w-2.5 h-2.5 rounded-sm"
              style={{ left: piece.left, backgroundColor: piece.color }}
              initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
              animate={{
                y: [0, -42, 150],
                x: [0, (index - 2.5) * 13, (index - 2.5) * 18],
                rotate: [0, 140, 290],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 1.2, delay: piece.delay, ease: "easeOut" }}
              onAnimationComplete={() => {
                if (index === 5) setShowConfetti(false);
              }}
            />
          ))}
        </div>
      )}

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
