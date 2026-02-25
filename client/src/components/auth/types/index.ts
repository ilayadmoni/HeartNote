/**
 * Auth Modal Types
 */

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
  /** URL to redirect to after successful login (deep linking) */
  redirectTo?: string | null;
  /** Initial view to render: 'login' (default) or 'update-password' */
  initialView?: "login" | "update-password";
}

export interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
}

export interface AuthInputProps {
  id: string;
  /** HTML name attribute — required for FormData / useFormState */
  name?: string;
  label: string;
  type?: "text" | "email" | "password" | "date";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  /** Show password toggle for password fields */
  showPasswordToggle?: boolean;
}
