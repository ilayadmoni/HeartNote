"use client";

/**
 * AvatarSelector Component
 * Netflix-style avatar selection with image-based avatars from API.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";

interface AvatarSelectorProps {
  avatarOptions: string[];
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

      <div className="grid grid-cols-4 gap-3">
        {avatarOptions.map((url, index) => (
          <motion.button
            key={url}
            onClick={() => handleSelect(url)}
            disabled={isSaving}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative aspect-square rounded-2xl overflow-hidden
              transition-all duration-200
              ${
                selected === url
                  ? "ring-4 ring-[#d4826f] dark:ring-[#e8917a] ring-offset-2 dark:ring-offset-gray-800"
                  : "ring-2 ring-gray-200 dark:ring-gray-600 hover:ring-gray-300 dark:hover:ring-gray-500"
              }
              ${isSaving ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
            `}
            aria-label={`אווטאר ${index + 1}`}
          >
            <Image
              src={url}
              alt={`Avatar ${index + 1}`}
              fill
              className="object-cover"
              unoptimized // SVGs from external sources
            />

            {/* Loading indicator for this specific avatar */}
            {savingUrl === url && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              </div>
            )}

            {/* Selected Checkmark */}
            {selected === url && !savingUrl && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-[#d4826f] flex items-center justify-center shadow-lg"
              >
                <Check size={14} className="text-white" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Empty State */}
      {avatarOptions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 text-hebrew-body">
            אין אווטארים זמינים כרגע
          </p>
        </div>
      )}
    </div>
  );
}
