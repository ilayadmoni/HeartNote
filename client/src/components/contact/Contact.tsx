"use client";

/**
 * Contact Component
 * Main contact page with form
 */

import { Settings } from "lucide-react";
import { ContactHeader, ContactForm } from "./components";
import type { ContactProps, ContactFormData } from "./types";

export function Contact({ className = "" }: ContactProps) {
  const handleSubmit = async (data: ContactFormData) => {
    // Simulate API call - replace with actual email sending logic
    console.log("Form submitted:", data);

    // For now, we'll simulate a delay and success
    // In production, this would call your backend API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // You can integrate with services like:
    // - Resend (https://resend.com)
    // - SendGrid
    // - Nodemailer via API route
    // - Formspree
    // - EmailJS
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

        {/* Contact Form */}
        <ContactForm onSubmit={handleSubmit} />
      </div>
    </section>
  );
}
