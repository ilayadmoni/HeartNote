import { notFound } from "next/navigation";

/** Any path that no route matched inside a locale renders the localized 404. */
export default function CatchAllPage(): never {
  notFound();
}
