"use client";

import { useState } from "react";
import { AUTH_VALIDATION } from "../constants";

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

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const HEBREW_REGEX = /[֐-׿]/;

function validateField(
  field: keyof RegisterFormData,
  value: string | boolean,
  password: string,
): string | undefined {
  switch (field) {
    case "firstName":
      return !(value as string).trim()
        ? AUTH_VALIDATION.firstNameRequired
        : undefined;
    case "lastName":
      return !(value as string).trim()
        ? AUTH_VALIDATION.lastNameRequired
        : undefined;
    case "email":
      if (!(value as string).trim()) return AUTH_VALIDATION.emailRequired;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string))
        return AUTH_VALIDATION.emailInvalid;
      return undefined;
    case "password":
      if (!value) return AUTH_VALIDATION.passwordRequired;
      if (HEBREW_REGEX.test(value as string))
        return AUTH_VALIDATION.passwordHebrew;
      if ((value as string).length < 8)
        return AUTH_VALIDATION.passwordMinLength;
      if (!PASSWORD_REGEX.test(value as string))
        return AUTH_VALIDATION.passwordFormat;
      return undefined;
    case "confirmPassword":
      if (value !== password) return AUTH_VALIDATION.passwordMismatch;
      return undefined;
    case "dateOfBirth": {
      if (!value) return AUTH_VALIDATION.dateOfBirthRequired;
      const dateStr = value as string;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return "תאריך לא תקין";
      const parsed = new Date(dateStr + "T00:00:00");
      if (isNaN(parsed.getTime())) return "תאריך לא תקין";
      return undefined;
    }
    case "agreedToTerms":
      return !value ? AUTH_VALIDATION.termsRequired : undefined;
    default:
      return undefined;
  }
}

export function useRegisterForm(onSubmit: RegisterSubmit) {
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
      const error = validateField(field, formData[field], formData.password);
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
      console.error("[RegisterForm] Submit error:", err);
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
