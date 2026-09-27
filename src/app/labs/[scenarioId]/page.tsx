import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LabView } from "@/components/views/LabView";
import { getScenario, scenarios } from "@/lib/scenarios";

export function generateStaticParams() {
  return scenarios.map((s) => ({ scenarioId: s.metadata.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ scenarioId: string }> }): Promise<Metadata> {
  const s = getScenario((await params).scenarioId);
  return s
    ? { title: `${s.metadata.id} — ${s.metadata.title}`, description: s.metadata.summary, alternates: { canonical: `/labs/${s.metadata.slug}` } }
    : {};
}

export default async function Page({ params }: { params: Promise<{ scenarioId: string }> }) {
  const s = getScenario((await params).scenarioId);
  if (!s) notFound();
  return <LabView scenario={s} />;
}
