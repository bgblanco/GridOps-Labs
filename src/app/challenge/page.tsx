import type { Metadata } from "next";
import { ChallengeView } from "@/components/views/ChallengeView";

export const metadata: Metadata = {
  title: "You're the Operator",
  description: "One-question operating challenges from the fictional Summit Grid. Pick an answer, then play the full scenario.",
  alternates: { canonical: "/challenge" },
};

export default function Page() {
  return <ChallengeView />;
}
