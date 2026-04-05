"use client";

/**
 * ContactForm Component
 * Main contact form with validation
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { FormField } from "./FormField";
import {
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  VALIDATION_MESSAGES,
  FORM_MESSAGES,
} from "../constants";
import type { ContactFormData } from "../types";

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  /** Forwarded from the parent's useTransition — covers the server round-trip */
  isPending?: boolean;
}

export function ContactForm({ onSubmit, isPending = false }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null,
  );

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = VALIDATION_MESSAGES.nameRequired;
    }

    if (!formData.email.trim()) {
      newErrors.email = VALIDATION_MESSAGES.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = VALIDATION_MESSAGES.emailInvalid;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = VALIDATION_MESSAGES.subjectRequired;
    }

    if (!formData.message.trim()) {
      newErrors.message = VALIDATION_MESSAGES.messageRequired;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = VALIDATION_MESSAGES.messageMinLength;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 shadow-lg"
      noValidate
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="name"
          label={FORM_LABELS.name}
          placeholder={FORM_PLACEHOLDERS.name}
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
          error={errors.name}
          required
          maxLength={100}
        />
        <FormField
          id="email"
          label={FORM_LABELS.email}
          type="email"
          placeholder={FORM_PLACEHOLDERS.email}
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
          error={errors.email}
          required
          maxLength={254}
        />
      </div>

      <FormField
        id="subject"
        label={FORM_LABELS.subject}
        placeholder={FORM_PLACEHOLDERS.subject}
        value={formData.subject}
        onChange={(value) => setFormData({ ...formData, subject: value })}
        error={errors.subject}
        required
        maxLength={200}
      />

      <FormField
        id="message"
        label={FORM_LABELS.message}
        type="textarea"
        placeholder={FORM_PLACEHOLDERS.message}
        value={formData.message}
        onChange={(value) => setFormData({ ...formData, message: value })}
        error={errors.message}
        required
        maxLength={5000}
      />

      {/* Submit Status Messages */}
      {submitStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 p-4 rounded-xl mb-4 ${
            submitStatus === "success"
              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
              : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
          }`}
        >
          {submitStatus === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="text-hebrew-body">
            {submitStatus === "success"
              ? FORM_MESSAGES.success
              : FORM_MESSAGES.error}
          </span>
        </motion.div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || isPending}
        className="
          w-full py-4 px-6 rounded-xl
          bg-[#d4826f] hover:bg-[#c4735f]
          text-white font-bold text-lg
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
          text-hebrew-heading
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4826f] focus-visible:ring-offset-2
        "
      >
        {isSubmitting || isPending ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {FORM_LABELS.submitting}
          </>
        ) : (
          <>
            <Send size={20} />
            {FORM_LABELS.submit}
          </>
        )}
      </button>
    </motion.form>
  );
}
