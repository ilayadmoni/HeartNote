import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HeartNote - מפעל הברכות הדיגיטלי",
  description: "צור ברכות דיגיטליות מרהיבות בקלות ובמהירות",
  keywords: ["ברכות", "ברכה דיגיטלית", "אירועים", "HeartNote"],
  icons: {
    icon: "/assets/images/logo_heartnote.png",
    apple: "/assets/images/logo_heartnote.png",
    shortcut: "/assets/images/logo_heartnote.png",
  },
  openGraph: {
    title: "HeartNote - מפעל הברכות הדיגיטלי",
    description: "צור ברכות דיגיטליות מרהיבות בקלות ובמהירות",
    images: ["/assets/images/logo_heartnote.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "HeartNote - מפעל הברכות הדיגיטלי",
    description: "צור ברכות דיגיטליות מרהיבות בקלות ובמהירות",
    images: ["/assets/images/logo_heartnote.png"],
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
          <AuthProvider>
            <QueryProvider>{children}</QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
