"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { MotionProps } from "framer-motion";

interface HolidayReferenceLayerProps {
  src: string;
  alt: string;
  animate?: MotionProps["animate"];
}

export function HolidayReferenceLayer({
  src,
  alt,
  animate,
}: HolidayReferenceLayerProps) {
  return (
    <motion.div
      className="absolute inset-0"
      initial={false}
      animate={animate}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={false}
        sizes="(max-width: 640px) 88vw, 430px"
        className="object-contain"
      />
    </motion.div>
  );
}
