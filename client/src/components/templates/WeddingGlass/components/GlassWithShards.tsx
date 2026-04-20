"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface GlassWithShardsProps {
  isShattered: boolean;
  onShatterComplete?: () => void;
}

export function GlassWithShards({ isShattered, onShatterComplete }: GlassWithShardsProps) {
  const [showBroken, setShowBroken] = useState(false);

  const shardVariants = {
    hidden: { opacity: 1, x: 0, y: 0, rotate: 0 },
    shatter: (direction: "left" | "right" | "up") => {
      const variants = {
        left: { opacity: 0, x: -40, y: -20, rotate: -45 },
        right: { opacity: 0, x: 40, y: -30, rotate: 45 },
        up: { opacity: 0, x: 10, y: -50, rotate: 90 },
      };
      return variants[direction];
    },
  };

  if (isShattered && !showBroken) {
    setShowBroken(true);
  }

  return (
    <div className="absolute left-[130px] md:left-[145px] bottom-[5px] w-8 h-10 z-10">
      <AnimatePresence mode="wait">
        {!showBroken ? (
          <motion.div
            key="glass"
            className="w-full h-full flex items-end justify-center"
            exit={{ opacity: 0 }}
          >
            <div className="w-6 h-8 bg-steel opacity-60 rounded-sm shadow-lg relative overflow-hidden">
              <div className="w-full h-2 bg-white opacity-50 absolute top-2" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="shards"
            className="absolute bottom-0 left-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onAnimationComplete={onShatterComplete}
          >
            <motion.div
              className="w-4 h-5 bg-steel opacity-60 absolute bottom-0 left-[-10px]"
              custom="left"
              variants={shardVariants}
              initial="hidden"
              animate="shatter"
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <motion.div
              className="w-5 h-4 bg-steel opacity-60 absolute bottom-2 left-4"
              custom="right"
              variants={shardVariants}
              initial="hidden"
              animate="shatter"
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            />
            <motion.div
              className="w-3 h-5 bg-steel opacity-60 absolute bottom-0 left-6"
              custom="up"
              variants={shardVariants}
              initial="hidden"
              animate="shatter"
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            />
            <motion.div
              className="w-2 h-3 bg-steel opacity-60 absolute bottom-4 left-2"
              custom="left"
              variants={shardVariants}
              initial="hidden"
              animate="shatter"
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
