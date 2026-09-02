"use client";

/**
 * GalleryLoadingWrapper — Hydration-Safe Loading Guard
 * Shows the loader until hydration + data are ready. After 5s of loading
 * it switches to a SafeModeFallback with a manual refresh button. Wraps
 * the gallery in MobileErrorBoundary so a render crash shows a message
 * instead of a white screen.
 */

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Loading from "@/app/[locale]/(main)/loading";
import { GalleryTemplate } from "./index";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useActiveTemplates } from "@/hooks/useActiveTemplates";
import { useSafeModeTimeout } from "@/hooks/useSafeModeTimeout";
import { MobileErrorBoundary } from "@/components/ErrorBoundary/MobileErrorBoundary";
import { SafeModeFallback } from "@/components/ErrorBoundary/SafeModeFallback";
import { logger } from "@/lib/utils/logger";
import { TEMPLATES } from "./data/templates";

export function GalleryLoadingWrapper(): JSX.Element {
  const t = useTranslations("gallery");
  const hasMounted = useHasMounted();
  const { loading, error } = useActiveTemplates(TEMPLATES);

  const isReady = hasMounted && !loading;
  const safeMode = useSafeModeTimeout(!isReady, 5000);

  if (error) {
    logger.error("[GalleryLoadingWrapper] Gallery template fetch failed", { error });
  }

  if (safeMode) {
    return (
      <SafeModeFallback
        message={error ? t("states.loadFailed", { error }) : t("states.safeModeTimeout")}
      />
    );
  }

  return (
    <MobileErrorBoundary scope="Gallery">
      <AnimatePresence>
        {!isReady && (
          <motion.div
            key="loading-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[9999]"
          >
            <Loading />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 1 : 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <GalleryTemplate skipLoadingGate />
      </motion.div>
    </MobileErrorBoundary>
  );
}
