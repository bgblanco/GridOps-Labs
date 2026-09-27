export interface UseCase {
  title: string;
  body: string;
}

export const homeUseCases: UseCase[] = [
  { title: "Developing operator training", body: "Give apprentices repeated exposure to situations they might not see on shift for months." },
  { title: "Recurrent proficiency", body: "Keep qualified operators practiced on the decisions that don't come up often." },
  { title: "Abnormal-condition practice", body: "Work through equipment that doesn't behave as expected, without the system at stake." },
  { title: "Facilitated scenario workshops", body: "Run a lab as a group, pause at the decision, and let the room argue it out." },
  { title: "Training-program supplementation", body: "Add a repetition layer alongside your existing qualification path." },
  { title: "Readiness during modernization", body: "Keep operator judgment moving with the new tools, not a step behind them." },
  { title: "Between full simulator sessions", body: "Short, focused practice in the weeks between scheduled simulator time." },
  { title: "Mentor and apprentice discussion", body: "Use the replay as a shared starting point for a real conversation." },
];

export const utilityPageUseCases: UseCase[] = [
  { title: "Developing operator training", body: "Scenario practice matched to where an apprentice is in their progression, used alongside your OJT and mentoring." },
  { title: "Recurrent practice", body: "Short labs qualified operators can run on a regular cycle to stay current on infrequent decisions." },
  { title: "Team scenario workshops", body: "Facilitated sessions where a crew of operators works a lab together and debriefs as a group." },
  { title: "Pilot programs", body: "A scoped trial with a small group of operators and trainers, built around your questions." },
  { title: "Custom scenario development", body: "Labs written around the situations your trainers want practiced, still set in a fictional environment." },
  { title: "Mentor and apprentice discussion", body: "Replays and debriefs that give an experienced operator something concrete to coach from." },
  { title: "Training during technology modernization", body: "Practice the judgment side of operations while new SCADA, ADMS, or OMS tools are being introduced." },
  { title: "Repetition between full simulator sessions", body: "Lightweight practice that doesn't require scheduling a full simulator environment." },
];
