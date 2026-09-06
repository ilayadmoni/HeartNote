"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

export function ApologySearchPreview(): JSX.Element {
  const t = useTranslations("gallery");
  const searchText = t("previews.apologySearch.searchText");
  const results = [
    `💌 ${t("previews.apologySearch.result1")}`,
    `🌹 ${t("previews.apologySearch.result2")}`,
    `🍫 ${t("previews.apologySearch.result3")}`,
  ];
  const [chars, setChars] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setChars((p) => (p >= searchText.length ? 0 : p + 1)),
      150,
    );
    return () => clearInterval(interval);
  }, [searchText.length]);

  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="w-full max-w-[110px] rounded-lg border border-line bg-surface-raised p-1.5 shadow-soft flex flex-col gap-1.5">
        {/* Browser chrome */}
        <div className="flex items-center gap-0.5" aria-hidden="true">
          <span className="h-1 w-1 rounded-full bg-salmon-400" />
          <span className="h-1 w-1 rounded-full bg-amber-400" />
          <span className="h-1 w-1 rounded-full bg-line-strong" />
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-1 bg-surface-sunken rounded-pill border border-line px-2 py-1">
          <Search size={8} className="text-ink-subtle" aria-hidden="true" />
          <span className="text-[6px] text-ink font-medium flex-1 truncate">
            {searchText.slice(0, chars)}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-px h-2 bg-accent ms-0.5 align-middle"
            />
          </span>
        </div>

        {/* Results */}
        {results.map((result, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.2 }}
            className="text-[5px] text-ink-muted px-1 py-0.5 rounded bg-surface-sunken/70 border border-line/60"
          >
            {result}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
