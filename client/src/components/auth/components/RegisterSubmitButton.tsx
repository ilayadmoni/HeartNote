"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

interface RegisterSubmitButtonProps {
  isSubmitting: boolean;
}

export function RegisterSubmitButton({ isSubmitting }: RegisterSubmitButtonProps) {
  const t = useTranslations("auth");
  return (
    <Button type="submit" isLoading={isSubmitting} className="w-full mt-4">
      {t("register.button")}
    </Button>
  );
}
