import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme";
import { AuthProvider } from "@/contexts/AuthContext";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SkipLinks } from "@/components/accessibility";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HeartNote - מפעל הברכות הדיגיטלי",
  description: "צור ברכות דיגיטליות מרהיבות בקלות ובמהירות",
  keywords: ["ברכות", "ברכה דיגיטלית", "אירועים", "HeartNote"],
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
            <SkipLinks />
            <Header />
            <main id="main-content" role="main" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
