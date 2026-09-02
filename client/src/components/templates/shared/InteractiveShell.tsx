"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { BackToGallery, FooterBranding } from "@/components/templates/components";

interface InteractiveShellProps {
  title: string;
  instruction: string;
  children: ReactNode;
}

export function InteractiveShell({
  title,
  instruction,
  children,
}: InteractiveShellProps) {
  return (
    <div className="relative flex min-h-[560px] flex-col overflow-hidden rounded-card bg-surface px-4 py-5 text-ink">
      <BackToGallery className="absolute end-4 top-4 z-20" />
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-8 max-w-lg text-center"
      >
        <h1 className="text-title-lg font-black sm:text-display-md" dir="auto">
          {title}
        </h1>
        <p className="mt-2 text-sm text-ink-muted" dir="auto">
          {instruction}
        </p>
      </motion.header>
      <main className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-6 py-6">
        {children}
      </main>
      <FooterBranding className="relative z-10 pb-1" />
    </div>
  );
}
