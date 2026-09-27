"use client";

import Link from "next/link";
import { useState } from "react";
import type { Challenge } from "@/lib/content/challenges";
import { track } from "@/lib/analytics/tracker";

export function ChallengeCard({ challenge, headingLevel = 3 }: { challenge: Challenge; headingLevel?: 2 | 3 }) {
  const [picked, setPicked] = useState<string>();
  const H = headingLevel === 2 ? "h2" : "h3";
  const chosen = challenge.options.find((o) => o.id === picked);
  return (
    <article className="on-desk overflow-hidden rounded-[4px] border border-desk-rule bg-desk-2 text-desk-ink">
      <div className="grid gap-6 p-5 sm:p-8 md:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="mono text-4xl text-desk-ink">{challenge.clock}</p>
          <p className="nameplate mt-2 text-desk-muted">{challenge.utility}</p>
          <H className="mt-3 font-display text-3xl font-bold uppercase tracking-[0.03em] text-[var(--fault)]">{challenge.headline}</H>
          <ul className="mt-4 grid gap-1 text-desk-ink">
            {challenge.lines.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-center">
          <fieldset>
            <legend className="font-display text-3xl font-semibold">{challenge.question}</legend>
            <div className="mt-4 grid gap-2">
              {challenge.options.map((o, i) => (
                <label key={o.id} className="choice">
                  <input
                    type="radio"
                    name={`challenge-${challenge.id}`}
                    value={o.id}
                    checked={picked === o.id}
                    onChange={() => {
                      setPicked(o.id);
                      track("challengeAnswered", { challengeId: challenge.id, option: o.id });
                    }}
                  />
                  <span>
                    <span className="nameplate mr-2 text-desk-muted">Option {String.fromCharCode(65 + i)}</span>
                    {o.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div aria-live="polite">
            {chosen && <p className="rise-in mt-4 text-[0.98rem] leading-relaxed text-desk-muted">{chosen.response}</p>}
          </div>
          <div className="mt-5">
            <Link href={`/labs/${challenge.scenarioSlug}`} className="btn btn-primary">
              See the full scenario
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
