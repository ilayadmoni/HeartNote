"use client";

import { motion } from "framer-motion";

const PIECES = [
  { left: "18%", color: "#f59e0b", delay: 0 },
  { left: "30%", color: "#10b981", delay: 0.04 },
  { left: "42%", color: "#60a5fa", delay: 0.08 },
  { left: "54%", color: "#f472b6", delay: 0.12 },
  { left: "66%", color: "#a78bfa", delay: 0.16 },
  { left: "78%", color: "#fb7185", delay: 0.2 },
];

interface Step3ConfettiProps {
  onDone: () => void;
}

export function Step3Confetti({ onDone }: Step3ConfettiProps): JSX.Element {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden" aria-hidden="true">
      {PIECES.map((piece, index) => (
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
            if (index === PIECES.length - 1) onDone();
          }}
        />
      ))}
    </div>
  );
}
