import { Suspense } from "react";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SkipLinks } from "@/components/accessibility";
import { ScrollToTop } from "@/components/ui";
import { WelcomeSplash } from "@/components/welcomeSplash";
import ClientFontLoader from "@/components/ClientFontLoader";
import { createClient } from "@/lib/supabase/server";
import { getTemplates } from "@/actions/templates";
import { templateKeys } from "@/lib/queryKeys/templateKeys";
import { PROFILE_QUERY_KEY } from "@/lib/queryKeys/profileKeys";
import type { TemplateResponse } from "@/lib/validations";

const PROFILE_SELECT =
  "id, first_name, last_name, date_of_birth, avatar_url, email, " +
  "subscription_tier, creations_count_free, creations_count_pro, " +
  "additional_creation_free, additional_creation_pro, premium_expiry";

async function prefetchTemplates(): Promise<TemplateResponse[]> {
  const res = await getTemplates();
  if ("error" in res) throw new Error(res.error);
  return res.data;
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  await queryClient.prefetchQuery({
    queryKey: templateKeys.list(),
    queryFn: prefetchTemplates,
    staleTime: 1000 * 60 * 15,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await queryClient.prefetchQuery({
      queryKey: [...PROFILE_QUERY_KEY, user.id],
      queryFn: async () => {
        const { data } = await supabase
          .from("profiles")
          .select(PROFILE_SELECT)
          .eq("id", user.id)
          .single();
        return data ?? null;
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
          className="bg-[#faf7f5] dark:bg-gray-900 pb-px"
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
