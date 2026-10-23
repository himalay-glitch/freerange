/** Chrome-less pages (archetype quiz and result screens render without the site header/footer). */
export default function BareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
