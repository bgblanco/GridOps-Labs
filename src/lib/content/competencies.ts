import type { CompetencyId } from "../scenario/schema";

export const COMPETENCY_LABELS: Record<CompetencyId, { name: string; description: string }> = {
  SYSTEM_AWARENESS: { name: "System awareness", description: "Understanding sources, topology, energized and de-energized state, and configuration." },
  ELECTRICAL_AWARENESS: { name: "Electrical awareness", description: "Considering loading, equipment limitations, voltage, protection, and source-path consequences." },
  INFORMATION_AWARENESS: { name: "Information awareness", description: "Distinguishing what is known, indicated, reported, inferred, or assumed." },
  OPERATIONAL_JUDGMENT: { name: "Operational judgment", description: "Choosing an appropriate course of action based on available conditions." },
  EXECUTION_DISCIPLINE: { name: "Execution discipline", description: "Verifying, communicating, maintaining state awareness, and confirming outcomes." },
  WORKLOAD_PRIORITIZATION: { name: "Workload & prioritization", description: "Determining what matters first when multiple events compete for attention." },
};

export const COMPETENCY_ORDER: CompetencyId[] = [
  "SYSTEM_AWARENESS",
  "ELECTRICAL_AWARENESS",
  "INFORMATION_AWARENESS",
  "OPERATIONAL_JUDGMENT",
  "EXECUTION_DISCIPLINE",
  "WORKLOAD_PRIORITIZATION",
];
