"use client";

/**
 * ContactForm Component
 * Main contact form with client-side validation.
 */

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useMotionOk } from "@/lib/motion";
import { Textarea } from "./Textarea";
import { SubmitStatus } from "./SubmitStatus";
import { CONTACT_MAX_LENGTHS } from "../constants";
import type { ContactFormData } from "../types";

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  /** Forwarded from the parent's useTransition — covers the server round-trip */
  isPending?: boolean;
}

const EMPTY_FORM: ContactFormData = { name: "", email: "", subject: "", message: "" };

export function ContactForm({ onSubmit, isPending = false }: ContactFormProps): JSX.Element {
  const t = useTranslations("contact");
  const motionOk = useMotionOk();
  const [formData, setFormData] = useState<ContactFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [serverError, setServerError] = useState<string>();

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};
    if (!formData.name.trim()) newErrors.name = t("form.validation.nameRequired");
    if (!formData.email.trim()) {
      newErrors.email = t("form.validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("form.validation.emailInvalid");
    }
    if (!formData.subject.trim()) newErrors.subject = t("form.validation.subjectRequired");
    if (!formData.message.trim()) {
      newErrors.message = t("form.validation.messageRequired");
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t("form.validation.messageMinLength");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setSubmitStatus(null);
    setServerError(undefined);
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setSubmitStatus("success");
      setFormData(EMPTY_FORM);
    } catch (err) {
      setSubmitStatus("error");
      setServerError(err instanceof Error ? err.message : undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={motionOk ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: motionOk ? 0.3 : 0 }}
      onSubmit={handleSubmit}
      className="bg-surface-raised rounded-card p-6 lg:p-8 shadow-card border border-line"
      noValidate
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
        <Input
          id="name"
          label={t("form.labels.name")}
          placeholder={t("form.placeholders.name")}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
          maxLength={CONTACT_MAX_LENGTHS.name}
        />
        <Input
          id="email"
          type="email"
          label={t("form.labels.email")}
          placeholder={t("form.placeholders.email")}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          required
          maxLength={CONTACT_MAX_LENGTHS.email}
        />
      </div>

      <div className="mb-1">
        <Input
          id="subject"
          label={t("form.labels.subject")}
          placeholder={t("form.placeholders.subject")}
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          error={errors.subject}
          required
          maxLength={CONTACT_MAX_LENGTHS.subject}
        />
      </div>

      <div className="mb-5">
        <Textarea
          id="message"
          label={t("form.labels.message")}
          placeholder={t("form.placeholders.message")}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          error={errors.message}
          required
          maxLength={CONTACT_MAX_LENGTHS.message}
        />
      </div>

      {submitStatus && <SubmitStatus status={submitStatus} errorMessage={serverError} />}

      <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting || isPending} className="w-full">
        {!isSubmitting && !isPending && <Send size={20} aria-hidden="true" />}
        {isSubmitting || isPending ? t("form.labels.submitting") : t("form.labels.submit")}
      </Button>
    </motion.form>
  );
}
