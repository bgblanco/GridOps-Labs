import Link from "next/link";

export function NotFoundView() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
      <p className="mono text-sm text-muted">404 · Not found</p>
      <h1 className="mt-3 text-[clamp(2.2rem,5vw,3.4rem)] font-semibold">That page isn&apos;t on this one-line.</h1>
      <p className="mt-4 max-w-[55ch] text-lg text-ink-2">The address may have changed, or the page doesn&apos;t exist yet.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-ink">Home</Link>
        <Link href="/decision-labs" className="btn btn-ghost">Decision Labs</Link>
      </div>
    </div>
  );
}
