import { z } from "zod";

export const ContactFormSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().min(1).max(254).email(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1).max(5000),
});
export type ContactFormInput = z.infer<typeof ContactFormSchema>;
