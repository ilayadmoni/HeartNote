"use client";

/**
 * EditProfileCard Component
 * Allows user to edit their first name and last name
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Edit3, Save, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";

interface EditProfileCardProps {
  firstName: string;
  lastName: string;
  onSave: (firstName: string, lastName: string) => Promise<void>;
}

export function EditProfileCard({
  firstName: initialFirstName,
  lastName: initialLastName,
  onSave,
}: EditProfileCardProps): JSX.Element {
  const t = useTranslations("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (): Promise<void> => {
    if (!firstName.trim() || !lastName.trim()) {
      setError(t("editProfile.errors.required"));
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(firstName.trim(), lastName.trim());
      setIsEditing(false);
    } catch {
      setError(t("editProfile.errors.saveFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = (): void => {
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="bg-surface-raised rounded-card p-6 shadow-soft border border-line">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-title-sm font-bold text-ink">{t("editProfile.title")}</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-control bg-surface-sunken hover:bg-line transition-colors text-body-sm text-ink"
          >
            <Edit3 size={14} />
            <span>{t("editProfile.edit")}</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Input
            label={t("editProfile.firstNameLabel")}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            label={t("editProfile.lastNameLabel")}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          {error && <p className="text-body-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-control bg-accent hover:bg-accent-hover text-accent-ink font-bold text-body-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-accent-ink border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={16} />
                  <span>{t("editProfile.save")}</span>
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-control bg-surface-sunken hover:bg-line text-ink font-bold text-body-sm transition-all disabled:opacity-50"
            >
              <X size={16} />
              <span>{t("editProfile.cancel")}</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-line">
            <span className="text-body-sm text-ink-muted">{t("editProfile.firstNameLabel")}</span>
            <span className="text-body-sm font-medium text-ink">{initialFirstName}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-body-sm text-ink-muted">{t("editProfile.lastNameLabel")}</span>
            <span className="text-body-sm font-medium text-ink">{initialLastName}</span>
          </div>
        </div>
      )}
    </div>
  );
}
