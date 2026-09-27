export const site = {
  name: "GridOps Labs",
  domain: "GridOpsLabs.com",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://gridopslabs.com",
  tagline: "Practice the decisions before they happen on the desk.",
  description:
    "Scenario-based proficiency training for electric distribution system operators. Practice restoration, abnormal conditions, conflicting information, and competing priorities in a fictional training grid.",
  disclaimer:
    "Summit Grid is a fictional training environment. GridOps Labs provides educational training content and does not replace employer operating procedures, qualification requirements, safety rules, or authorization to operate electrical systems.",
  nav: [
    { href: "/decision-labs", label: "Decision Labs" },
    { href: "/for-utilities", label: "For Utilities" },
    { href: "/challenge", label: "You're the Operator" },
    { href: "/white-papers", label: "White Papers" },
    { href: "/about", label: "About" },
  ],
  /** Editable founder note for /about. Keep it free of employer-specific details. */
  founder: {
    heading: "Who's building this",
    body: [
      "GridOps Labs was started by a distribution operations practitioner with experience on the operating desk and on the control-system side of the work: configuring equipment, supporting implementations, and training the people who use them.",
      "The Decision Lab method comes from that mix. Equipment and screens change from utility to utility. The judgment calls operators make when the picture is incomplete look much more alike.",
    ],
  },
};

export const CTA = {
  primary: { label: "Try a Decision Lab", href: "/#decision-lab" },
  secondary: { label: "Bring GridOps to Your Team", href: "/for-utilities" },
  tertiary: { label: "Join GridOps Field Test", href: "/decision-labs#field-test" },
  conversation: { label: "Request a Conversation", href: "/contact" },
};
