import type { Metadata } from "next";
import { AboutView } from "@/components/views/AboutView";

export const metadata: Metadata = {
  title: "About",
  description: "Why GridOps Labs builds scenario-based practice for distribution system operators.",
  alternates: { canonical: "/about" },
};

export default function Page() {
  return <AboutView />;
}
