"use client";

import { CheckCircle } from "lucide-react";
import { RegisterFields } from "./RegisterFields";
import { useRegisterForm, type RegisterSubmit } from "./useRegisterForm";
import { REGISTER_SUCCESS_MESSAGE } from "../constants";

interface RegisterFormProps {
  onSubmit: RegisterSubmit;
  isSubmitting: boolean;
  serverError?: string | null;
}

export function RegisterForm({
  onSubmit,
  isSubmitting,
  serverError,
}: RegisterFormProps) {
  const {
    formData,
    errors,
    isSuccess,
    submitError,
    handleFieldChange,
    handleSubmit,
  } = useRegisterForm(onSubmit);

  if (isSuccess) {
    return (
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <p className="text-[#2e3c52] dark:text-white text-hebrew-body text-sm leading-relaxed">
          {REGISTER_SUCCESS_MESSAGE}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full box-border">
      <RegisterFields
        formData={formData}
        errors={errors}
        serverError={serverError}
        submitError={submitError}
        isSubmitting={isSubmitting}
        onFieldChange={handleFieldChange}
      />
    </form>
  );
}
