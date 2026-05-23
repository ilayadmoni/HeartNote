"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GallerySearchBarProps } from "./GallerySearchBar.types";

export function GallerySearchBar({
  value,
  onChange,
  className,
}: GallerySearchBarProps): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = (): void => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div
      role="search"
      dir="rtl"
      className={cn(
        "w-full max-w-[640px] mx-auto",
        className
      )}
    >
      <div className="relative flex items-center">
        {/* Search icon — right side (RTL start) */}
        <Search
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={20}
          aria-hidden="true"
        />

        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="חיפוש תבניות"
          placeholder="חפש תבניות..."
          className={cn(
            "w-full min-h-[48px] pr-10 pl-10 py-3",
            "rounded-xl border border-gray-200 bg-white",
            "text-right text-gray-800 placeholder:text-gray-400",
            "text-base transition-all duration-200",
            "focus:outline-none",
            "dark:bg-gray-800 dark:border-gray-700 dark:text-white",
            "dark:placeholder:text-gray-500"
          )}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = "0 0 0 2px #D85A30";
            e.currentTarget.style.borderColor = "transparent";
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = "";
            e.currentTarget.style.borderColor = "";
          }}
        />

        {/* Clear button — left side (RTL end) */}
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
              aria-label="נקה חיפוש"
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2",
                "p-0.5 rounded-full",
                "text-[#D85A30] hover:text-[#b84e28]",
                "transition-colors duration-150"
              )}
            >
              <X size={18} aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
