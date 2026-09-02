"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { transitions } from "@/lib/motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

/** Raised surface with the 24px shape lock and navy-tinted elevation. */
export function Card({ children, className, onClick, hoverable = false }: CardProps): JSX.Element {
  const interactive = hoverable || Boolean(onClick);
  return (
    <motion.div
      whileHover={interactive ? { y: -4 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
      transition={transitions.spring}
      onClick={onClick}
      className={cn(
        "rounded-card p-6 bg-surface-raised border border-line shadow-card",
        "transition-shadow duration-base ease-out-quint",
        interactive && "cursor-pointer hover:shadow-lift hover:border-line-strong",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

interface SlotProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: SlotProps): JSX.Element {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardTitle({ children, className }: SlotProps): JSX.Element {
  return <h3 className={cn("text-title-md text-ink", className)}>{children}</h3>;
}

export function CardContent({ children, className }: SlotProps): JSX.Element {
  return <div className={cn("text-body-md text-ink-muted", className)}>{children}</div>;
}
