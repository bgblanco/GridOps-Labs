export interface Challenge {
  id: string;
  clock: string;
  utility: string;
  headline: string;
  lines: string[];
  question: string;
  options: { id: string; label: string; response: string }[];
  scenarioSlug: string;
}

export const challenges: Challenge[] = [
  {
    id: "ch-001",
    clock: "02:37",
    utility: "Summit Electric",
    headline: "Feeder 120 lockout",
    lines: ["Fault isolated.", "Three alternate restoration paths are available.", "The closest tie is available."],
    question: "Do you close it?",
    options: [
      {
        id: "a",
        label: "Yes — restore the customers.",
        response: "Plenty of operators would. It's close, it's available, and customers are waiting. The full scenario shows what's on the other side of that tie.",
      },
      {
        id: "b",
        label: "Not enough information.",
        response: "That's a fair instinct. So what would you check first? The full scenario lets you inspect each path, then shows what happens with the one you pick.",
      },
    ],
    scenarioSlug: "dl-001",
  },
];

export const getChallenge = (id: string) => challenges.find((c) => c.id === id);
