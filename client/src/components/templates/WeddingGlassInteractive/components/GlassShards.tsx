"use client";

import { motion, AnimatePresence } from "framer-motion";

interface GlassShardsProps {
  active: boolean;
}

const SHARDS = [
  { x: -18, y: -12, rotate: -25, delay: 0 },
  { x: 14, y: -20, rotate: 18, delay: 0.02 },
  { x: -10, y: 16, rotate: 40, delay: 0.04 },
  { x: 20, y: 10, rotate: -12, delay: 0.03 },
  { x: 0, y: -22, rotate: 60, delay: 0.05 },
];

export function GlassShards({ active }: GlassShardsProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0] }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
          {SHARDS.map((shard, i) => (
            <motion.svg
              key={i}
              width="18"
              height="18"
              viewBox="0 0 18 18"
              className="absolute text-white/80 drop-shadow"
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
              animate={{
                x: shard.x * 3,
                y: shard.y * 3,
                opacity: 0,
                rotate: shard.rotate,
                scale: 1,
              }}
              transition={{ duration: 0.5, ease: "easeOut", delay: shard.delay }}
            >
              <polygon points="9,0 18,9 9,18 0,9" fill="currentColor" opacity="0.7" />
            </motion.svg>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
