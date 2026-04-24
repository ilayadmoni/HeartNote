"use client";

import { motion } from "framer-motion";

interface GroomFigureProps {
  isStomping?: boolean;
}

export function GroomFigure({ isStomping = false }: GroomFigureProps) {
  return (
    <div className="relative w-full h-full select-none">
      <img
        src="/assets/images/weddingtemplate/groom_body.svg"
        alt=""
        draggable={false}
        className="absolute inset-0 w-full h-full object-contain object-bottom pointer-events-none drop-shadow-md"
      />
      <motion.img
        src="/assets/images/weddingtemplate/groom_leg_animated.svg"
        alt=""
        draggable={false}
        className="absolute inset-0 w-full h-full object-contain object-bottom pointer-events-none"
        style={{ transformOrigin: "top center" }}
        initial={{ y: 0, rotate: 0 }}
        animate={
          isStomping
            ? { y: [0, -30, 28, 5, 0], rotate: [0, -22, 14, 3, 0] }
            : { y: 0, rotate: 0 }
        }
        transition={{
          duration: 1.0,
          times: [0, 0.28, 0.60, 0.78, 1.0],
          ease: ["easeOut", "easeIn", "easeOut", "easeInOut"],
        }}
      />
    </div>
  );
}
