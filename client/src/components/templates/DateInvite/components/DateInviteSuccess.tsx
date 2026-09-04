"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { TemplateResetButton } from "@/components/templates/components";
import type { DateInviteData } from "@/components/templates/types";

interface DateInviteSuccessProps {
  data: DateInviteData;
  primaryColor: string;
  onReset: () => void;
}

export function DateInviteSuccess({ data, primaryColor, onReset }: DateInviteSuccessProps) {
  const t = useTranslations("templates");
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowReset(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center w-full py-2"
    >
      <motion.div
        animate={{ rotate: [0, -8, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="mb-4"
      >
        <span className="text-5xl">💖</span>
      </motion.div>

      <h2
        className="text-xl 2xl:text-display-md font-bold mb-1.5 2xl:mb-2.5 break-words w-full overflow-hidden"
        style={{ color: primaryColor }}
        dir="auto"
      >
        {data.successMessage}
      </h2>

      <p className="text-xs text-ink-subtle mb-5">{t("dateInvite.successHint")}</p>

      {showReset && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <TemplateResetButton onClick={onReset} label={t("dateInvite.askAgain")} />
        </motion.div>
      )}
    </motion.div>
  );
}
