/**
 * Public Layout
 * Minimal layout for viewer pages — NO main site Header or Footer.
 * Only renders children + a subtle HeartNote branding footer.
 */

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
