"use client";

import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { FooterBranding } from "@/components/templates/components";
import type { ExcuseGeneratorViewProps } from "../types";
import { ExcuseSlip } from "../components/ExcuseSlip";
import { useExcuseRoll } from "../hooks/useExcuseRoll";

const EXCUSE_MAX_LENGTH = 80;

export function ExcuseGeneratorMobile({ data }: ExcuseGeneratorViewProps) {
  const pathname = usePathname();
  const isCreateRoute = pathname?.includes("/create/");
  const t = useTranslations("templates");
  const defaultExcuses = t.raw("excuseGenerator.defaults") as string[];
  const excuses =
    data.excuses
      ?.map((excuse) => excuse.slice(0, EXCUSE_MAX_LENGTH))
      .filter((excuse) => excuse.length > 0) || defaultExcuses;

  const accent = data.primaryColor || "#d4826f";
  const { displayText, generating, cogControls, generateExcuse } = useExcuseRoll(excuses);

  return (
    <div
      className={`bg-transparent px-4 relative isolate overflow-hidden flex flex-col justify-between items-center gap-4 py-6 ${
        isCreateRoute ? "min-h-[450px]" : "min-h-[100dvh]"
      }`}
    >
      {/* Decorative blobs */}
      <div className="absolute top-5 start-0 w-28 h-28 bg-accent-soft/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 end-0 w-36 h-36 bg-accent-soft/30 rounded-full blur-2xl pointer-events-none" />

      <div className="flex-1 max-w-sm mx-auto flex flex-col items-center justify-center w-full gap-4">
        {/* Cog icon */}
        <motion.div
          animate={cogControls}
          className="p-3 rounded-full"
          style={{ backgroundColor: `${accent}22` }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke={accent}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-title-lg font-bold text-center break-words"
          style={{ color: accent }}
          dir="auto"
        >
          {data.title || t("excuseGenerator.titleDefault")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-sm text-ink-muted text-center break-words"
          dir="auto"
        >
          {data.subtitle || t("excuseGenerator.subtitleDefault")}
        </motion.p>

        {/* Excuse display box */}
        <ExcuseSlip
          text={displayText ? `"${displayText}"` : `"${t("excuseGenerator.promptDefault")}"`}
          accent={accent}
          generating={generating}
          size="sm"
        />

        {/* Generate button */}
        <motion.button
          whileTap={generating ? undefined : { scale: 0.97 }}
          onClick={generateExcuse}
          disabled={generating}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-pill font-bold text-base text-accent-ink transition-opacity disabled:opacity-60"
          style={{ backgroundColor: accent }}
        >
          <RefreshCw size={18} />
          {generating ? t("excuseGenerator.generating") : data.buttonLabel || t("excuseGenerator.buttonLabel")}
        </motion.button>

        {/* Disclaimer */}
        {(data.disclaimer !== undefined ? data.disclaimer : true) && (
          <p className="text-xs text-ink-subtle text-center" dir="auto">
            {data.disclaimer || t("excuseGenerator.disclaimer")}
          </p>
        )}
      </div>

      <FooterBranding className="mx-auto" />
    </div>
  );
}
