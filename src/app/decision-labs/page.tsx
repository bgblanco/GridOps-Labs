import type { Metadata } from "next";
import { DecisionLabsView } from "@/components/views/DecisionLabsView";

export const metadata: Metadata = {
  title: "Scenario Library",
  description:
    "The GridOps scenario library: 50+ distribution operator training scenarios planned across restoration, SCADA & telecom, alarms, loading, protection, and operational judgment. Play DL-001 free, no account needed.",
  keywords: [
    "distribution operator training scenarios",
    "SCADA operator training",
    "distribution restoration training",
    "alarm management training",
    "distribution switching training",
    "scenario-based utility training",
  ],
  alternates: { canonical: "/decision-labs" },
};

export default function Page() {
  return <DecisionLabsView />;
}
