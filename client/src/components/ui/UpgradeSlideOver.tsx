"use client";

/**
 * UpgradeSlideOver
 *
 * Shared end-anchored drawer panel opened when an active Lite or Premium
 * subscriber hits their creation quota. Replaces full-page navigation —
 * the background content stays visible and unedited. Rendered through a
 * portal so it always escapes any Framer Motion transform ancestor.
 *
 * Tier-aware content: lite → upgrade CTA to /pricing; premium → contact
 * support CTA to /contact.
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Zap } from "lucide-react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { UpgradeSlideOverHeader } from "./UpgradeSlideOverHeader";
import { UpgradeSlideOverBody } from "./UpgradeSlideOverBody";

export interface UpgradeSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  /** The user's current paid tier. */
  tier: "lite" | "premium";
  /** Plan creation limit (including bonus quota). */
  creationLimit: number;
  /** ISO string — displayed as the subscription's active-until date. */
  expiryDate?: string | null;
}

function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function UpgradeSlideOver({ isOpen, onClose, tier, creationLimit, expiryDate }: UpgradeSlideOverProps): JSX.Element | null {
  const t = useTranslations("editor");
  const locale = useLocale();
  useLockBodyScroll(isOpen);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus();
  }, [isOpen]);

  const formattedExpiry = formatDate(expiryDate);
  const isLite = tier === "lite";
  // Panel is end-anchored: right in LTR, left in RTL — so the offscreen
  // starting position flips with the reading direction.
  const offscreenX = locale === "he" ? "-100%" : "100%";

  if (!mounted) return null;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="slide-over-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            key="slide-over-panel"
            initial={{ x: offscreenX }}
            animate={{ x: 0 }}
            exit={{ x: offscreenX }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed end-0 top-0 h-full z-[1001] w-full sm:w-[420px] bg-surface-raised shadow-lift flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label={isLite ? t("upgrade.titleLite") : t("upgrade.titlePremium")}
          >
            <UpgradeSlideOverHeader
              isLite={isLite}
              creationLimit={creationLimit}
              formattedExpiry={formattedExpiry}
              closeButtonRef={closeButtonRef}
              onClose={onClose}
            />

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <UpgradeSlideOverBody isLite={isLite} creationLimit={creationLimit} formattedExpiry={formattedExpiry} />
            </div>

            {/* Footer CTA */}
            <div className="flex-shrink-0 p-4 border-t border-line space-y-2.5 bg-surface-raised">
              {isLite ? (
                <>
                  <Link
                    href="/pricing"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-pill font-bold text-body-sm shadow-soft transition-colors flex items-center justify-center gap-2"
                  >
                    <Zap size={16} className="fill-white" />
                    {t("upgrade.upgradeNow")}
                  </Link>
                  <p className="text-[11px] text-center text-ink-subtle px-2">{t("upgrade.newTabHint")}</p>
                </>
              ) : (
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="w-full py-3.5 bg-navy-700 hover:bg-navy-600 text-white rounded-pill font-bold text-body-sm shadow-soft transition-colors flex items-center justify-center gap-2"
                >
                  {t("upgrade.contactSupport")}
                </Link>
              )}

              <button onClick={onClose} className="w-full py-2.5 text-body-sm text-ink-muted hover:text-ink transition-colors">
                {isLite ? t("upgrade.maybeLater") : t("upgrade.back")}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
