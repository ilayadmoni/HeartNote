"use client";

import { useState } from "react";
import { logger } from "@/lib/utils/logger";
import type { AuthLabels } from "../hooks/useAuthLabels";

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  agreedToTerms: boolean;
}

export interface RegisterFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  dateOfBirth?: string;
  agreedToTerms?: string;
}

export type RegisterSubmit = (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  dateOfBirth: string,
) => Promise<{ error?: string; success?: boolean | string } | void>;

type Validation = AuthLabels["AUTH_VALIDATION"];

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const HEBREW_REGEX = /[֐-׿]/;

function validateField(
  field: keyof RegisterFormData,
  value: string | boolean,
  password: string,
  v: Validation,
): string | undefined {
  switch (field) {
    case "firstName":
      return !(value as string).trim() ? v.firstNameRequired : undefined;
    case "lastName":
      return !(value as string).trim() ? v.lastNameRequired : undefined;
    case "email":
      if (!(value as string).trim()) return v.emailRequired;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string)) return v.emailInvalid;
      return undefined;
    case "password":
      if (!value) return v.passwordRequired;
      if (HEBREW_REGEX.test(value as string)) return v.passwordHebrew;
      if ((value as string).length < 8) return v.passwordMinLength;
      if (!PASSWORD_REGEX.test(value as string)) return v.passwordFormat;
      return undefined;
    case "confirmPassword":
      if (value !== password) return v.passwordMismatch;
      return undefined;
    case "dateOfBirth": {
      if (!value) return v.dateOfBirthRequired;
      const dateStr = value as string;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return v.dateInvalid;
      const parsed = new Date(dateStr + "T00:00:00");
      if (isNaN(parsed.getTime())) return v.dateInvalid;
      return undefined;
    }
    case "agreedToTerms":
      return !value ? v.termsRequired : undefined;
    default:
      return undefined;
  }
}

export function useRegisterForm(onSubmit: RegisterSubmit, validation: Validation) {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    agreedToTerms: false,
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFieldChange = (
    field: keyof RegisterFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: RegisterFormErrors = {};
    (Object.keys(formData) as (keyof RegisterFormData)[]).forEach((field) => {
      const error = validateField(field, formData[field], formData.password, validation);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError(null);

    try {
      const result = await onSubmit(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.dateOfBirth,
      );
      if (result && "error" in result && result.error) {
        setSubmitError(result.error);
        return;
      }
      setIsSuccess(true);
    } catch (err) {
      logger.error("[RegisterForm] Submit error", { error: err });
    }
  };

  return {
    formData,
    errors,
    isSuccess,
    submitError,
    handleFieldChange,
    handleSubmit,
  };
}
