"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import type { MotionProps } from "framer-motion";

interface HolidayAssetLayerProps {
  src: string;
  alt?: string;
  className: string;
  imgClassName?: string;
  animate?: MotionProps["animate"];
  initial?: MotionProps["initial"];
  transition?: MotionProps["transition"];
  style?: CSSProperties;
}

export function HolidayAssetLayer({
  src,
  alt = "",
  className,
  imgClassName = "object-contain",
  animate,
  initial = false,
  transition,
  style,
}: HolidayAssetLayerProps) {
  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      transition={transition}
      style={style}
      aria-hidden={!alt}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 86vw, 420px"
        className={imgClassName}
      />
    </motion.div>
  );
}
