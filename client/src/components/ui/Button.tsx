"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { transitions } from "@/lib/motion";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-ink shadow-glow-sm hover:bg-accent-hover hover:shadow-glow",
  secondary: "bg-surface-raised text-ink border border-line-strong hover:border-accent hover:text-accent",
  ghost: "bg-transparent text-ink-muted hover:text-ink hover:bg-surface-sunken",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-soft",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-body-sm",
  md: "h-11 px-6 text-body-md",
  lg: "min-h-[3.25rem] px-8 text-body-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const inert = disabled || isLoading;
    return (
      <motion.button
        ref={ref}
        whileHover={inert ? undefined : { y: -1 }}
        whileTap={inert ? undefined : { scale: 0.98, y: 0 }}
        transition={transitions.spring}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-bold rounded-pill select-none",
          "transition-colors duration-base ease-out-quint",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={inert}
        aria-busy={isLoading || undefined}
        // Motion's button props are a superset of the native ones we accept.
        {...(props as HTMLMotionProps<"button">)}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {children}
      </motion.button>
    );
  },
);

Button.displayName = "Button";
