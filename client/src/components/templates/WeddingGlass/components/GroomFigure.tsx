"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface GroomFigureProps {
  isStomping?: boolean;
}

export function GroomFigure({ isStomping = false }: GroomFigureProps) {
  return (
    <div className="relative w-full h-full select-none">
      <Image
        src="/assets/images/weddingtemplate/groom_body.svg"
        alt=""
        fill
        draggable={false}
        className="object-contain object-bottom pointer-events-none drop-shadow-md"
        sizes="(max-width: 768px) 112px, 140px"
        unoptimized
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
