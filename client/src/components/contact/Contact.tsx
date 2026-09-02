"use client";

/**
 * Contact Component
 * Main contact page with form and full submission lifecycle:
 * – Pending state via useTransition
 * – Sonner toast for success / error feedback
 * – Redirect to Home on success
 */

import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { ContactHeader, ContactForm } from "./components";
import { sendContactEmail } from "@/actions/contact";
import type { ContactProps, ContactFormData } from "./types";

export function Contact({ className = "" }: ContactProps) {
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
            // block also sets its inline error state.
            toast.error(result.error, {
              description: "אנא נסו שוב או פנו אלינו ישירות.",
            });
            reject(new Error(result.error));
            return;
          }

          // ── Success path ─────────────────────────────────────────
          toast.success("ההודעה נשלחה בהצלחה! 🎉", {
            description: `תודה ${data.name}, נחזור אליך בהקדם האפשרי.`,
            duration: 5000,
          });

          resolve(); // Let ContactForm know the submission succeeded

          // Redirect to home after the toast has a moment to display
          setTimeout(() => router.push("/"), 1800);
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "שגיאה בלתי צפויה. נסו שוב מאוחר יותר.";
          toast.error(message);
          reject(err);
        }
      });
    });
  };

  return (
    <section
      className={`relative py-16 lg:py-24 px-4 min-h-screen bg-[#faf7f5] dark:bg-gray-900 ${className}`}
    >
      {/* Background Decorative Gears */}
      <div className="absolute top-20 left-10 opacity-15 pointer-events-none">
        <Settings size={180} className="animate-spin-slow text-[#2e3c52]" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-15 pointer-events-none">
        <Settings
          size={150}
          className="animate-spin-slow-reverse text-[#2e3c52]"
        />
      </div>

      <div className="container mx-auto max-w-3xl relative z-10">
        <ContactHeader />

        {/* ContactForm owns field state + inline validation alerts.
            isPending drives its submit-button disabled/spinner state. */}
        <ContactForm onSubmit={handleSubmit} isPending={isPending} />
      </div>
    </section>
  );
}
