import type { Scenario } from "../scenario/schema";
import { dl001 } from "./dl-001";

/** Playable scenarios. Add DL-002+ here once authored. */
export const scenarios: Scenario[] = [dl001];

export const getScenario = (slug: string): Scenario | undefined =>
  scenarios.find((s) => s.metadata.slug === slug.toLowerCase());

/**
 * Scenario concepts in development. These are shown on /decision-labs as
 * planned work only; none are playable and none make claims about results.
 */
export interface PlannedLab {
  id: string;
  title: string;
  premise: string;
  judgment: string;
}

export const plannedLabs: PlannedLab[] = [
  {
    id: "DL-002",
    title: "Closed on the Screen",
    premise: "A switch indicates closed. The crew on site says the blades aren't fully seated.",
    judgment: "Conflicting information: indicated versus reported state.",
  },
  {
    id: "DL-003",
    title: "Restored Isn't Normal",
    premise: "Hours after a transfer, load climbs on a feeder that was only meant to carry it temporarily.",
    judgment: "Changing conditions after a decision that was sound at the time.",
  },
  {
    id: "DL-004",
    title: "Two Calls at Once",
    premise: "A second lockout comes in while you're midway through a restoration.",
    judgment: "Competing priorities and workload.",
  },
  {
    id: "DL-005",
    title: "The Case for Waiting",
    premise: "Every option on the board restores customers. One piece of information hasn't come back yet.",
    judgment: "A valid reason to take no action yet.",
  },
];
