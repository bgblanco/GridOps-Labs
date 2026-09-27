export interface WhitePaper {
  slug: string;
  title: string;
  dek: string;
  topic: "Restoration" | "Information" | "Training design" | "Judgment";
  readMinutes: number;
  relatedLab?: string;
  body: string[];
}

/**
 * GridOps White Papers. Short pieces on the reasoning behind distribution operations.
 * General observations only: no utility-specific procedures or data.
 */
export const whitepapers: WhitePaper[] = [
  {
    slug: "available-tie-not-available-path",
    title: "An Available Tie Doesn't Mean an Available Restoration Path",
    dek: "The tie is only the last device in the path. Everything between it and the source has a say.",
    topic: "Restoration",
    readMinutes: 3,
    relatedLab: "dl-001",
    body: [
      "When a feeder is out and the fault is isolated, the one-line starts suggesting answers. A normally-open tie sits right at the edge of the interrupted section. It shows open, it shows available, and closing it would pick everyone up in one step.",
      "That's exactly why it deserves a second look. \"Available\" describes the device. It says nothing about the conductor, the regulators, the breaker, or the substation transformer that will carry the load once the tie closes.",
      "The useful question is about the whole path. Starting at the alternate source, what does the transferred load flow through, what is each piece already carrying, and what is each piece rated for? A breaker with plenty of margin can sit upstream of a short run of smaller conductor that has almost none.",
      "None of this is new to experienced operators. What's hard is building the habit before it's needed, so that checking the complete path happens at 02:40 on a storm night, when the closest tie is right there and the phones are ringing.",
      "DL-001, The Easy Tie, is built around this exact moment.",
    ],
  },
  {
    slug: "scada-says-closed",
    title: "SCADA Says Closed. Do You Know It's Closed?",
    dek: "An indication is a report from a device. It's usually right. Usually is the part worth training.",
    topic: "Information",
    readMinutes: 3,
    body: [
      "Control systems are very good at showing state. They're so good that it's easy to forget the screen is showing an indication: a signal from an auxiliary contact, a position sensor, or a communication path, each of which can be wrong on its own.",
      "Most of the time the indication and the device agree. The cases where they don't tend to show up at bad times: after a storm, after maintenance, after a communications outage, or when a mechanism doesn't finish its travel.",
      "GridOps labels information by where it comes from. INDICATED means the control system shows it. REPORTED means someone told you. KNOWN means it's been confirmed or comes from a fixed record. These aren't a ranking of trust; each has strengths and failure modes.",
      "The skill is noticing which kind of information a decision is resting on, and whether the decision would still be sound if that one piece turned out to be wrong. That's a habit, and habits come from repetition.",
    ],
  },
  {
    slug: "perfect-scenarios-arent-enough",
    title: "Why Perfect Training Scenarios Aren't Enough",
    dek: "If every device behaves and every report is accurate, the scenario is teaching recall, not judgment.",
    topic: "Training design",
    readMinutes: 2,
    body: [
      "A clean scenario is a good place to learn a concept. The breaker trips, the crew finds the fault where the indicators say it is, every switch operates, and restoration follows the textbook.",
      "Real operating conditions are rarely that tidy. Reports conflict. A device doesn't respond. Load is higher than the planning number. A second event lands in the middle of the first.",
      "GridOps holds every Decision Lab to one rule: it has to contain at least one real judgment element. A reasonable choice that turns out poorly. An obvious option with a hidden consequence. Information that's incomplete unless you go looking. A good reason to wait.",
      "If a scenario can be answered by recalling a rule, it's a quiz. Quizzes have their place. They just aren't what builds the kind of judgment that holds up on a bad night.",
    ],
  },
  {
    slug: "restored-doesnt-mean-normal",
    title: "Restored Doesn't Mean Normal",
    dek: "Customers back on is a milestone. It isn't the end of the event.",
    topic: "Restoration",
    readMinutes: 2,
    body: [
      "When the last customer is picked up, the pressure drops. The phones slow down. It feels finished.",
      "But a feeder restored through a tie is in an abnormal configuration. Load is sitting on equipment that wasn't planned to carry it long term. Protection may be seeing a system it wasn't set for. The next switching decision, and the one after that, now starts from a different place.",
      "Good operators keep track of the abnormal state until normal is restored: what was moved, what it's riding on now, what has to happen to put it back, and what would change if load climbs or another event lands nearby.",
      "A future Decision Lab picks up hours after a transfer that was the right call at the time, and asks what's changed since.",
    ],
  },
  {
    slug: "what-does-an-operator-know",
    title: "What Does an Operator Actually Know?",
    dek: "Known, indicated, reported, inferred, assumed. Five words that change how a decision reads.",
    topic: "Information",
    readMinutes: 3,
    body: [
      "Ask an operator what they know during an event and you'll get a confident list. Ask where each item came from and the list gets more interesting.",
      "Some of it is KNOWN: confirmed, or from a fixed record. Some is INDICATED by the control system. Some is REPORTED by a crew or a customer. Some is INFERRED from other facts, like a fault location worked out from which device operated. And some is ASSUMED, often without anyone noticing it's an assumption.",
      "None of these are bad. Operators make good decisions on reported and inferred information every day. The risk is losing track of which is which, especially when the pace picks up.",
      "Every GridOps Decision Lab labels its information this way. The goal isn't to slow people down. It's to make the distinction automatic, so it's there when it matters.",
    ],
  },
  {
    slug: "when-doing-nothing-is-right",
    title: "When Doing Nothing Is the Right Operating Decision",
    dek: "Waiting is an action. Sometimes it's the best one on the board.",
    topic: "Judgment",
    readMinutes: 2,
    body: [
      "There is real pressure on a control desk to do something. Customers are out, supervisors want updates, and every available operation looks like progress.",
      "Some situations call for a pause: a report that doesn't match the indications, a crew that isn't clear yet, a piece of information that's on its way. Operating before it arrives can turn a manageable event into a harder one.",
      "Waiting well is still an active decision. It means knowing what you're waiting for, how long that's reasonable, what you'll do when it arrives, and what would make you act sooner.",
      "It's also one of the hardest things to practice, because most training rewards action. A planned Decision Lab is built so that the strongest move is to hold.",
    ],
  },
];

export const getWhitePaper = (slug: string) => whitepapers.find((a) => a.slug === slug);
