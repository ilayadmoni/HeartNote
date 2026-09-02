"use client";

/**
 * DeleteAccountCard Component
 * Danger zone section for account deletion with a typed confirmation modal.
 */

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { DeleteAccountModal } from "./DeleteAccountModal";

interface DeleteAccountCardProps {
  onDelete: () => Promise<void>;
}

export function DeleteAccountCard({ onDelete }: DeleteAccountCardProps): JSX.Element {
  const t = useTranslations("profile");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-surface-raised rounded-card p-6 shadow-soft border-2 border-red-200 dark:border-red-900/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-title-sm font-bold text-red-600 dark:text-red-400">
              {t("deleteAccount.dangerZoneTitle")}
            </h3>
            <p className="text-body-sm text-ink-muted">{t("deleteAccount.dangerZoneSubtitle")}</p>
          </div>
        </div>

        <p className="text-body-sm text-ink-muted mb-4">{t("deleteAccount.body")}</p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-control bg-red-500 hover:bg-red-600 text-white font-bold text-body-sm transition-all duration-200"
        >
          <Trash2 size={16} />
          <span>{t("deleteAccount.cta")}</span>
        </button>
      </div>

      <DeleteAccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onDelete={onDelete} />
    </>
  );
}
