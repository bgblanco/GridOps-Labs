import type { Metadata } from "next";
import { WhitePapersView } from "@/components/views/WhitePapersView";

export const metadata: Metadata = {
  title: "GridOps White Papers",
  description: "Short pieces on restoration, information, and judgment in electric distribution operations.",
  alternates: { canonical: "/white-papers" },
};

export default function Page() {
  return <WhitePapersView />;
}
