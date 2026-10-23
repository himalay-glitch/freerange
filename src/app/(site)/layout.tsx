import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

/** Standard site chrome: fixed header (with notification banner) and footer. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
