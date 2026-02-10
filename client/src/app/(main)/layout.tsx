import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SkipLinks } from "@/components/accessibility";
import { ScrollToTop } from "@/components/ui";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SkipLinks />
      <Header />
      <main id="main-content" role="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
