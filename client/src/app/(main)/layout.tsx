import { Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SkipLinks } from "@/components/accessibility";
import { ScrollToTop } from "@/components/ui";
import { WelcomeSplash } from "@/components/welcomeSplash";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SkipLinks />
      <Suspense>
        <Header />
      </Suspense>
      <main id="main-content" role="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <ScrollToTop />
      <WelcomeSplash />
    </>
  );
}
