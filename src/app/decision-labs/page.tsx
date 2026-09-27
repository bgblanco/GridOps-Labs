import type { Metadata } from "next";
import { DecisionLabsView } from "@/components/views/DecisionLabsView";

export const metadata: Metadata = {
  title: "Decision Labs",
  description: "Short, scenario-based distribution operations exercises built around one judgment call each. Play DL-001 free, no account needed.",
  alternates: { canonical: "/decision-labs" },
};

export default function Page() {
  return <DecisionLabsView />;
}
