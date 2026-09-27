import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WhitePaperView } from "@/components/views/WhitePapersView";
import { getWhitePaper, whitepapers } from "@/lib/content/whitepapers";

export function generateStaticParams() {
  return whitepapers.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getWhitePaper((await params).slug);
  return a ? { title: a.title, description: a.dek, alternates: { canonical: `/white-papers/${a.slug}` } } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const a = getWhitePaper((await params).slug);
  if (!a) notFound();
  return <WhitePaperView paper={a} />;
}
