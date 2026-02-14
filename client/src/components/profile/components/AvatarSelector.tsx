"use client";

/**
 * AvatarSelector Component
 * Netflix-style avatar selection with DiceBear Avataaars.
 * Renders a 4×3 grid of selectable circular avatars.
 * Auto-saves to Supabase on click via the `onSelect` prop.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { DEFAULT_AVATAR_OPTIONS } from "../types";

interface AvatarSelectorProps {
  /** Currently persisted avatar URLs from the server (or static fallback list). */
  avatarOptions?: string[];
  currentAvatar?: string | null;
  onSelect: (avatarUrl: string) => Promise<boolean>;
  loading?: boolean;
}

export function AvatarSelector({
  avatarOptions,
  currentAvatar,
  onSelect,
  loading = false,
}: AvatarSelectorProps) {
  const [selected, setSelected] = useState(currentAvatar);
  const [isSaving, setIsSaving] = useState(false);
  const [savingUrl, setSavingUrl] = useState<string | null>(null);

  // Always use the static DiceBear list — ignore any empty / broken API list.
  const avatars = DEFAULT_AVATAR_OPTIONS;

  const handleSelect = async (url: string) => {
    if (url === selected || isSaving) return;

    setIsSaving(true);
    setSavingUrl(url);

    try {
      const success = await onSelect(url);
      if (success) {
        setSelected(url);
      }
    } finally {
      setIsSaving(false);
      setSavingUrl(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-[#2e3c52] dark:text-white mb-4 text-hebrew-heading">
          בחירת אווטאר
        </h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#d4826f]" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-[#2e3c52] dark:text-white mb-2 text-hebrew-heading">
        בחירת אווטאר
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-hebrew-body">
        בחרו דמות שתייצג אתכם
      </p>

      {/* 4-column grid (3 rows × 4 cols = 12 avatars) */}
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
              className={`
                relative flex flex-col items-center gap-1
                rounded-2xl p-1.5 transition-all duration-200
                ${
                  isActive
                    ? "ring-4 ring-[#d4826f] dark:ring-[#e8917a] ring-offset-2 dark:ring-offset-gray-800 bg-[#faf7f5] dark:bg-gray-700"
                    : "ring-2 ring-gray-200 dark:ring-gray-600 hover:ring-gray-300 dark:hover:ring-gray-500"
                }
                ${isSaving ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
              `}
              aria-label={avatar.label}
              aria-pressed={isActive}
            >
              {/* Circular avatar image */}
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-600">
                <Image
                  src={avatar.url}
                  alt={avatar.label}
                  fill
                  className="object-cover"
                  unoptimized // external SVGs
                />

                {/* Loading spinner for this avatar */}
                {isSavingThis && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-full">
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  </div>
                )}

                {/* Selected checkmark */}
                {isActive && !isSavingThis && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 w-5 h-5 rounded-full bg-[#d4826f] flex items-center justify-center shadow-lg"
                  >
                    <Check size={12} className="text-white" />
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
