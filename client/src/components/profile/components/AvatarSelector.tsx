"use client";

/**
 * AvatarSelector Component
 * Netflix-style avatar selection with DiceBear Avataaars.
 * Renders a 4x3 grid of selectable circular avatars.
 * Auto-saves via the `onSelect` prop (updateMyProfile server action).
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { DEFAULT_AVATAR_OPTIONS } from "../types";

interface AvatarSelectorProps {
  /** Currently persisted avatar URLs from the server (or static fallback list). */
  avatarOptions?: string[];
  currentAvatar?: string | null;
  onSelect: (avatarUrl: string) => Promise<boolean>;
  loading?: boolean;
}

export function AvatarSelector({ currentAvatar, onSelect, loading = false }: AvatarSelectorProps): JSX.Element {
  const t = useTranslations("profile");
  const [selected, setSelected] = useState(currentAvatar);
  const [isSaving, setIsSaving] = useState(false);
  const [savingUrl, setSavingUrl] = useState<string | null>(null);

  // Always use the static DiceBear list — ignore any empty / broken API list.
  const avatars = DEFAULT_AVATAR_OPTIONS;

  const handleSelect = async (url: string): Promise<void> => {
    if (url === selected || isSaving) return;

    setIsSaving(true);
    setSavingUrl(url);

    try {
      const success = await onSelect(url);
      if (success) setSelected(url);
    } finally {
      setIsSaving(false);
      setSavingUrl(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-surface-raised rounded-card p-6 shadow-soft border border-line">
        <h3 className="text-title-sm font-bold text-ink mb-4">{t("avatar.title")}</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-raised rounded-card p-6 shadow-soft border border-line">
      <h3 className="text-title-sm font-bold text-ink mb-2">{t("avatar.title")}</h3>
      <p className="text-body-sm text-ink-muted mb-4">{t("avatar.subtitle")}</p>

      <div className="grid grid-cols-4 gap-3">
        {avatars.map((avatar) => {
          const isActive = selected === avatar.url;
          const isSavingThis = savingUrl === avatar.url;

          return (
            <motion.button
              key={avatar.id}
              onClick={() => handleSelect(avatar.url)}
              disabled={isSaving}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex flex-col items-center gap-1 rounded-card p-1.5 transition-all duration-200 ${
                isActive
                  ? "ring-4 ring-accent ring-offset-2 ring-offset-surface-raised bg-surface"
                  : "ring-2 ring-line hover:ring-line-strong"
              } ${isSaving ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
              aria-label={avatar.label}
              aria-pressed={isActive}
            >
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-surface-sunken">
                <Image src={avatar.url} alt={avatar.label} fill className="object-cover" unoptimized />

                {isSavingThis && (
                  <div className="absolute inset-0 bg-ink/30 flex items-center justify-center rounded-full">
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  </div>
                )}

                {isActive && !isSavingThis && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 end-0 w-5 h-5 rounded-full bg-accent flex items-center justify-center shadow-soft"
                  >
                    <Check size={12} className="text-accent-ink" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
