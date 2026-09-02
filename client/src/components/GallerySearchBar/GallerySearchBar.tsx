"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GallerySearchBarProps } from "./GallerySearchBar.types";

export function GallerySearchBar({
  value,
  onChange,
  className,
}: GallerySearchBarProps): React.ReactElement {
  const t = useTranslations("gallery");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = (): void => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div role="search" className={cn("w-full max-w-[640px] mx-auto", className)}>
      <div className="relative flex items-center">
        {/* Search icon — hidden when value present */}
        <AnimatePresence>
          {!value && (
            <motion.span
              key="search-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute start-3 inset-y-0 flex items-center pointer-events-none"
            >
              <Search size={20} className="text-ink-subtle" aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Clear button — replaces search icon when value present */}
        <AnimatePresence>
          {value && (
            <motion.button
              key="clear"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={handleClear}
              type="button"
              aria-label={t("search.clear")}
              className="absolute start-3 inset-y-0 flex items-center p-0.5 rounded-pill text-accent hover:text-accent-hover transition-colors duration-base"
            >
              <X size={18} aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={t("search.label")}
          placeholder={t("search.placeholder")}
          className={cn(
            "w-full min-h-[48px] ps-10 pe-4 py-3 rounded-control border border-line bg-surface-raised",
            "text-body-md text-ink placeholder:text-ink-subtle transition-colors duration-base",
            "focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25",
          )}
        />
      </div>
    </div>
  );
}
