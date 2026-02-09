/**
 * Auth Modal Types
 */

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
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
  label: string;
  type?: "text" | "email" | "password" | "date";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  /** Show password toggle for password fields */
  showPasswordToggle?: boolean;
}
