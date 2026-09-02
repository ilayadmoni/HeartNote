import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().trim().min(1).max(254).email(),
  password: z.string().min(1).max(128),
});
export type LoginFormInput = z.infer<typeof LoginFormSchema>;

const HEBREW_REGEX = /[֐-׿]/;

export const RegisterFormSchema = z.object({
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().min(1).max(50),
  email: z.string().trim().toLowerCase().min(1).max(254).email(),
  password: z
    .string()
    .min(8, { message: "errors.registration.passwordTooShort" })
    .max(128, { message: "errors.registration.passwordTooLong" })
    .refine((v) => !HEBREW_REGEX.test(v), {
      message: "errors.registration.passwordHebrew",
    }),
  dateOfBirth: z.string().optional(),
  emailRedirectTo: z.string().url().optional(),
});
export type RegisterFormInput = z.infer<typeof RegisterFormSchema>;
