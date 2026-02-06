/**
 * Contact Page Types
 */

export interface ContactProps {
  className?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  isSubmitting: boolean;
}

export interface ContactInfoItem {
  id: string;
  icon: "mail" | "phone" | "mapPin" | "clock";
  title: string;
  value: string;
  href?: string;
}

export interface FormFieldProps {
  id: string;
  label: string;
  type?: "text" | "email" | "textarea";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}
