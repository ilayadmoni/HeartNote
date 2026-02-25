import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme";
import {
  AccessibilityProvider,
  AccessibilityWidget,
} from "@/components/accessibility";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

// Construct metadataBase from environment or fallback
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const metadataBase = new URL(siteUrl);

export const metadata: Metadata = {
  metadataBase,
  title: "HeartNote - מפעל הברכות הדיגיטלי",
  description: "צור ברכות דיגיטליות מרהיבות בקלות ובמהירות",
  keywords: ["ברכות", "ברכה דיגיטלית", "אירועים", "HeartNote"],
  authors: [{ name: "HeartNote", url: siteUrl }],
  creator: "HeartNote",
  icons: {
    icon: "/assets/images/logo_heartnote.png",
    apple: "/assets/images/logo_heartnote.png",
    shortcut: "/assets/images/logo_heartnote.png",
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: siteUrl,
    siteName: "HeartNote",
    title: "HeartNote - מפעל הברכות הדיגיטלי",
    description: "צור ברכות דיגיטליות מרהיבות בקלות ובמהירות",
    images: [
      {
        url: "/assets/images/full_logo.png",
        width: 1200,
        height: 630,
        alt: "HeartNote - מפעל הברכות הדיגיטלי",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HeartNote - מפעל הברכות הדיגיטלי",
    description: "צור ברכות דיגיטליות מרהיבות בקלות ובמהירות",
    images: ["/assets/images/full_logo.png"],
    creator: "@HeartNote",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf7f5",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.className} overflow-x-hidden`}>
        <ThemeProvider>
          <AccessibilityProvider>
            <AuthProvider>
              <QueryProvider>{children}</QueryProvider>
            </AuthProvider>
            <AccessibilityWidget />
          </AccessibilityProvider>
        </ThemeProvider>
        <Toaster
          position="bottom-right"
          richColors
          duration={4000}
          closeButton
        />
      </body>
    </html>
  );
}
