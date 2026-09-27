import type { Metadata } from "next";
import { ContactView } from "@/components/views/ContactView";

export const metadata: Metadata = {
  title: "Contact",
  description: "Request a conversation about Decision Labs, a utility training pilot, a scenario workshop, or SME review.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return <ContactView />;
}
