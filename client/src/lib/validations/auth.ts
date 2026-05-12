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
    .min(8, "הסיסמה חייבת להכיל לפחות 8 תווים.")
    .max(128, "הסיסמה ארוכה מידי.")
    .refine((v) => !HEBREW_REGEX.test(v), {
      message: "הסיסמה חייבת להכיל אותיות באנגלית ומספרים בלבד. אין להשתמש בתווים בעברית.",
    }),
  dateOfBirth: z.string().optional(),
  emailRedirectTo: z.string().url().optional(),
});
export type RegisterFormInput = z.infer<typeof RegisterFormSchema>;
