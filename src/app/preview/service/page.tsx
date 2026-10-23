import type { Metadata } from "next";
import { ServicePage } from "@/components/templates/ServicePage";
import { SERVICE_PAGES } from "@/lib/data/services-pages";

export const metadata: Metadata = {
  title: "Websites & Software Development — service page preview",
};

/** Preview of the service page template. The 182px top padding stands in for the fixed site header. */
export default function ServicePreviewPage() {
  return (
    <div style={{ paddingTop: 182 }}>
      <ServicePage data={SERVICE_PAGES["/websites-software-development"]} />
    </div>
  );
}
