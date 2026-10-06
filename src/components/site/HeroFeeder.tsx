/**
 * Homepage hero visual: the Summit Electric distribution-system scene for DL-001
 * ("the tie is available — is the path?"). Story-layer art, scene-setting only;
 * the interactive one-line lives inside the Decision Lab.
 */
export function HeroFeeder({ className = "" }: { className?: string }) {
  return (
    <figure className={`on-desk overflow-hidden rounded-[4px] border border-desk-rule ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/summit-grid-hero.jpg"
        alt="Summit Electric distribution system at night in a storm: Feeder 120 is in CB-120 lockout with 1,842 customers interrupted, a normally-open tie reaches alternate source Feeder 88 — the tie is available, but is the path?"
        width={1400}
        height={613}
        decoding="async"
        className="block w-full"
      />
    </figure>
  );
}
