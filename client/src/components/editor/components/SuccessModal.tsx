"use client";

/**
 * SuccessModal Component
 * Shows after card creation with shareable link + WhatsApp share.
 * Uses React Portal to break out of DOM hierarchy and cover entire screen.
 */

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { pushToDataLayer } from "@/utils/gtm";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { SuccessModalActions } from "./SuccessModalActions";
import { SuccessModalBody } from "./SuccessModalBody";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  expiresAt: string | null;
  templateName?: string;
  verificationCode?: string | null;
}

export function SuccessModal({
  isOpen,
  onClose,
  url,
  templateName = "unknown",
  verificationCode,
}: SuccessModalProps): JSX.Element | null {
  const t = useTranslations("editor");
  const CLOSE_THEN_NAVIGATE_DELAY_MS = 60;
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  const baseUrl = (typeof window !== "undefined" ? window.location.origin : null) || process.env.NEXT_PUBLIC_SITE_URL || "";
  const rawUrl = url || `${baseUrl}/p/card`;
  const shareUrl = verificationCode
    ? `${rawUrl}${rawUrl.includes("?") ? "&" : "?"}code=${verificationCode}`
    : rawUrl;

  const handleCopy = async () => {
    pushToDataLayer({ event: "share", method: "copy", template_name: templateName });
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    pushToDataLayer({ event: "share", method: "whatsapp", template_name: templateName });
    const encodedUrl = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(`${t("success.whatsappMessage")} `);
    window.open(`https://wa.me/?text=${text}${encodedUrl}`, "_blank");
  };

  const handleClose = () => {
    onClose();
    window.setTimeout(() => router.push("/"), CLOSE_THEN_NAVIGATE_DELAY_MS);
  };

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pointer-events-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-raised rounded-card shadow-lift w-full max-w-sm mx-auto overflow-hidden pointer-events-auto"
          >
            {/* Header */}
            <div className="bg-accent p-5 text-center relative">
              <button onClick={onClose} className="absolute top-3 start-3 text-white/80 hover:text-white transition-colors" aria-label={t("success.close")}>
                <X size={18} />
              </button>
              <span className="text-4xl block mb-2">🎉</span>
              <h2 className="text-title-sm font-bold text-white">{t("success.title")}</h2>
            </div>

            <SuccessModalBody shareUrl={shareUrl} verificationCode={verificationCode} copied={copied} onCopy={handleCopy} />

            <SuccessModalActions
              shareUrl={shareUrl}
              templateName={templateName}
              onWhatsAppShare={handleWhatsAppShare}
              onClose={handleClose}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
