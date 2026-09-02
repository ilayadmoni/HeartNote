"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";

const COLORS = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#FF6FC8",
  "#FF9F43",
  "#A29BFE",
  "#FD79A8",
] as const;

type Shape = "oval" | "round" | "rect";
const SHAPES: readonly Shape[] = ["oval", "round", "rect"] as const;

interface Particle {
  id: number;
  startX: number;
  driftX: number;
  endX: number;
  endY: number;
  rotate: number;
  duration: number;
  delay: number;
  color: string;
  shape: Shape;
}

interface CandyBurstProps {
  trigger: boolean;
  onComplete: () => void;
}

function shapeStyle(shape: Shape, color: string): React.CSSProperties {
  const base: React.CSSProperties = {
    backgroundColor: color,
    outline: "1.5px solid rgba(255,255,255,0.6)",
    outlineOffset: "-1px",
  };
  if (shape === "oval") {
    return { ...base, width: 10, height: 18, borderRadius: "50% / 30%" };
  }
  if (shape === "round") {
    return { ...base, width: 12, height: 12, borderRadius: "50%" };
  }
  return { ...base, width: 8, height: 14, borderRadius: 3 };
}

function buildParticles(): Particle[] {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1024;
  const vh = typeof window !== "undefined" ? window.innerHeight : 768;
  return Array.from({ length: 40 }, (_, i) => {
    const startX = Math.random() * vw;
    const wobble = (Math.random() - 0.5) * 80;
    const drift = (Math.random() - 0.5) * 160;
    return {
      id: i,
      startX,
      driftX: startX + wobble,
      endX: startX + drift,
      endY: vh * (0.6 + Math.random() * 0.4),
      rotate: (Math.random() - 0.5) * 1080,
      duration: 1.0 + Math.random() * 0.8,
      delay: Math.random() * 1.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)] as string,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)] as Shape,
    };
  });
}

export function CandyBurst({ trigger, onComplete }: CandyBurstProps) {
  const particles = useMemo<Particle[]>(
    () => (trigger ? buildParticles() : []),
    [trigger],
  );
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!trigger) return;
    const t = window.setTimeout(() => onCompleteRef.current(), 2500);
    return () => window.clearTimeout(t);
  }, [trigger]);

  if (!trigger) return null;

  return (
    <div
      className="fixed top-0 start-0 pointer-events-none overflow-hidden"
      style={{ width: "100vw", height: "100vh", zIndex: 9999 }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ top: 0, left: 0, ...shapeStyle(p.shape, p.color) }}
          initial={{ x: p.startX, y: -20, rotate: 0, scale: 1 }}
          animate={{
            x: [p.startX, p.driftX, p.endX],
            y: p.endY,
            rotate: p.rotate,
            scale: 0.6,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}
