"use client";

/**
 * EditProfileCard Component
 * Allows user to edit their first name and last name
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Edit3, Save, X } from "lucide-react";

interface EditProfileCardProps {
  firstName: string;
  lastName: string;
  onSave: (firstName: string, lastName: string) => Promise<void>;
}

export function EditProfileCard({
  firstName: initialFirstName,
  lastName: initialLastName,
  onSave,
}: EditProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("יש למלא שם פרטי ושם משפחה");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(firstName.trim(), lastName.trim());
      setIsEditing(false);
    } catch {
      setError("שגיאה בשמירת הפרטים");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
          עריכת פרטים
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm text-[#2e3c52] dark:text-white"
          >
            <Edit3 size={14} />
            <span className="text-hebrew-body">עריכה</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* First Name */}
          <div>
            <label
              htmlFor="edit-firstName"
              className="block text-xs font-bold text-[#2e3c52] dark:text-gray-200 mb-1 text-right text-hebrew-heading"
            >
              שם פרטי
            </label>
            <input
              id="edit-firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-[#d4826f] dark:focus:border-[#e8917a] transition-all duration-200 text-[#2e3c52] dark:text-white text-right text-hebrew-body focus:outline-none"
              dir="rtl"
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="edit-lastName"
              className="block text-xs font-bold text-[#2e3c52] dark:text-gray-200 mb-1 text-right text-hebrew-heading"
            >
              שם משפחה
            </label>
            <input
              id="edit-lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-[#d4826f] dark:focus:border-[#e8917a] transition-all duration-200 text-[#2e3c52] dark:text-white text-right text-hebrew-body focus:outline-none"
              dir="rtl"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 text-right text-hebrew-body">
              {error}
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#d4826f] hover:bg-[#c4735f] text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed text-hebrew-heading"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={16} />
                  <span>שמירה</span>
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-[#2e3c52] dark:text-white font-bold text-sm transition-all disabled:opacity-50 text-hebrew-heading"
            >
              <X size={16} />
              <span>ביטול</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400 text-hebrew-body">
              שם פרטי
            </span>
            <span className="text-sm font-medium text-[#2e3c52] dark:text-white text-hebrew-body">
              {initialFirstName}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 text-hebrew-body">
              שם משפחה
            </span>
            <span className="text-sm font-medium text-[#2e3c52] dark:text-white text-hebrew-body">
              {initialLastName}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
