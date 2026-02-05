"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({
  children,
  className,
  onClick,
  hoverable = false,
}: CardProps) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -4, scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
      onClick={onClick}
      className={cn(
        "rounded-2xl p-6 transition-all duration-300",
        "bg-white/70 dark:bg-white/5 backdrop-blur-xl",
        "border border-gray-100 dark:border-white/10",
        "shadow-lg shadow-gray-200/50 dark:shadow-black/20",
        hoverable &&
          "cursor-pointer hover:shadow-xl hover:shadow-primary-500/10",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold text-gray-900 dark:text-white",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("text-gray-600 dark:text-gray-300", className)}>
      {children}
    </div>
  );
}
