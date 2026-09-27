import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChallengeDetailView } from "@/components/views/ChallengeView";
import { challenges, getChallenge } from "@/lib/content/challenges";

export function generateStaticParams() {
  return challenges.map((c) => ({ challengeId: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ challengeId: string }> }): Promise<Metadata> {
  const c = getChallenge((await params).challengeId);
  return c ? { title: `${c.headline} · You're the Operator`, description: `${c.question} ${c.lines.join(" ")}` } : {};
}

export default async function Page({ params }: { params: Promise<{ challengeId: string }> }) {
  const c = getChallenge((await params).challengeId);
  if (!c) notFound();
  return <ChallengeDetailView challenge={c} />;
}
