import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

export default async function LoginPage(): Promise<void> {
  const locale = await getLocale();
  return redirect({ href: "/gallery?login=true", locale });
}
