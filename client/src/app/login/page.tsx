import { redirect } from "next/navigation";

export default function LoginPage() {
  redirect("/gallery?login=true");
}