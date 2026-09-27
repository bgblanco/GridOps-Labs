import Link from "next/link";
import { DecisionLabShell } from "@/components/lab/DecisionLabShell";
import type { Scenario } from "@/lib/scenario/schema";

export function LabView({ scenario }: { scenario: Scenario }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
      <p className="text-sm text-muted">
        <Link href="/decision-labs" className="underline underline-offset-4">Decision Labs</Link> / {scenario.metadata.id}
      </p>
      <h1 className="sr-only">
        {scenario.metadata.series}: {scenario.metadata.id} {scenario.metadata.title}
      </h1>
      <div className="mt-4">
        <DecisionLabShell scenario={scenario} headingLevel={2} />
      </div>
    </div>
  );
}
