"use client";

/**
 * Contact Component
 * Main contact page with form and full submission lifecycle:
 * – Pending state via useTransition
 * – Sonner toast for success / error feedback
 * – Redirect to Home on success
 */

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { ContactHeader, ContactForm } from "./components";
import { sendContactEmail } from "@/actions/contact";
import type { ContactProps, ContactFormData } from "./types";

export function Contact({ className = "" }: ContactProps): JSX.Element {
  const t = useTranslations("contact");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (data: ContactFormData): Promise<void> => {
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("email", data.email);
    fd.append("subject", data.subject);
    fd.append("message", data.message);

    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          const result = await sendContactEmail(fd);

          if (result.error) {
            // Fire error toast, then reject so ContactForm's catch
            // block also sets its inline error state with this message.
            toast.error(result.error, { description: t("toast.errorDescription") });
            reject(new Error(result.error));
            return;
          }

          toast.success(t("toast.successTitle"), {
            description: t("toast.successDescription", { name: data.name }),
            duration: 5000,
          });

          resolve(); // Let ContactForm know the submission succeeded
          setTimeout(() => router.push("/"), 1800);
        } catch (err) {
          const message = err instanceof Error ? err.message : t("toast.unexpectedError");
          toast.error(message);
          reject(err);
        }
      });
    });
  };

  return (
    <section className={`relative py-section-sm px-gutter min-h-[100dvh] bg-surface ${className}`}>
      {/* Background Decorative Gears */}
      <div className="absolute top-20 start-10 opacity-15 pointer-events-none">
        <Settings size={180} className="animate-spin-slow text-ink" />
      </div>
      <div className="absolute bottom-20 end-10 opacity-15 pointer-events-none">
        <Settings size={150} className="animate-spin-slow-reverse text-ink" />
      </div>

      <div className="mx-auto max-w-3xl relative z-10">
        <ContactHeader />

        {/* ContactForm owns field state + inline validation alerts.
            isPending drives its submit-button disabled/spinner state. */}
        <ContactForm onSubmit={handleSubmit} isPending={isPending} />
      </div>
    </section>
  );
}
