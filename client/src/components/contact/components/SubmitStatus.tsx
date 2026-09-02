"use client";

/**
 * SubmitStatus Component
 * Composed success/error banner shown after a submission attempt.
 */

import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useMotionOk } from "@/lib/motion";

interface SubmitStatusProps {
  status: "success" | "error";
  errorMessage?: string;
}

export function SubmitStatus({ status, errorMessage }: SubmitStatusProps): JSX.Element {
  const t = useTranslations("contact");
  const motionOk = useMotionOk();
  const isSuccess = status === "success";

  return (
    <motion.div
      initial={motionOk ? { opacity: 0, y: -10 } : false}
      animate={{ opacity: 1, y: 0 }}
      role={isSuccess ? "status" : "alert"}
      className={cn(
        "flex items-center gap-2 p-4 rounded-control mb-4",
        isSuccess ? "bg-accent-soft text-accent" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
      )}
    >
      {isSuccess ? <CheckCircle2 size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
      <span className="text-body-sm">{isSuccess ? t("form.status.success") : errorMessage ?? t("form.status.error")}</span>
    </motion.div>
  );
}
