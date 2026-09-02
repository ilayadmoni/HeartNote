import { Suspense } from "react";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SkipLinks } from "@/components/accessibility";
import { ScrollToTop } from "@/components/ui";
import { WelcomeSplash } from "@/components/welcomeSplash";
import ClientFontLoader from "@/components/ClientFontLoader";
import { auth } from "@/lib/auth";
import { getTemplates } from "@/actions/templates";
import { getMyProfile } from "@/actions/profile/get";
import { templateKeys } from "@/lib/queryKeys/templateKeys";
import { PROFILE_QUERY_KEY } from "@/lib/queryKeys/profileKeys";
import { mapProfileResponseToQueryData } from "@/lib/profileQueryData";
import type { TemplateResponse } from "@/lib/validations";

async function prefetchTemplates(): Promise<TemplateResponse[]> {
  const res = await getTemplates();
  if ("error" in res) throw new Error(res.error);
  return res.data;
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const queryClient = new QueryClient();
  const session = await auth();

  await queryClient.prefetchQuery({
    queryKey: templateKeys.list(),
    queryFn: prefetchTemplates,
    staleTime: 1000 * 60 * 15,
  });

  if (session?.user?.id) {
    const userId = session.user.id;
    await queryClient.prefetchQuery({
      queryKey: [...PROFILE_QUERY_KEY, userId],
      queryFn: async () => {
        const result = await getMyProfile();
        return result.success ? mapProfileResponseToQueryData(result.data) : null;
      },
      staleTime: 1000 * 60 * 5,
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientFontLoader>
        <SkipLinks />
        <Suspense>
          <Header />
        </Suspense>
        <main
          id="main-content"
          role="main"
          tabIndex={-1}
          className="bg-surface pb-px"
        >
          {children}
        </main>
        <Footer />
        <ScrollToTop />
        <WelcomeSplash />
      </ClientFontLoader>
    </HydrationBoundary>
  );
}
