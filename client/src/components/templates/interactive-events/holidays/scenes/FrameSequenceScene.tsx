"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { HolidaySceneProps } from "../holiday-scene-types";

interface FrameSequenceSceneProps extends HolidaySceneProps {
  frames: readonly string[];
  alt: string;
}

export function FrameSequenceScene({
  frames,
  alt,
  status,
  reduceMotion,
  progress,
}: FrameSequenceSceneProps) {
  const activeFrame =
    status === "revealed" ? frames.length - 1 : Math.min(progress, frames.length - 1);

  return (
    <div className="absolute inset-0">
      {frames.map((src, index) => (
        <motion.div
          key={src}
          className="absolute inset-0"
          initial={false}
          animate={{
            opacity: index === activeFrame ? 1 : 0,
            scale: index === activeFrame && status !== "idle" ? 1.01 : 1,
          }}
          transition={{ duration: reduceMotion ? 0.05 : 0.22, ease: "easeInOut" }}
          aria-hidden={index !== activeFrame}
        >
          <Image
            src={src}
            alt={index === activeFrame ? alt : ""}
            fill
            sizes="(max-width: 640px) 88vw, 430px"
            className="object-contain"
          />
        </motion.div>
      ))}
    </div>
  );
}
