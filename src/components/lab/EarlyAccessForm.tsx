"use client";

import { useState } from "react";
import { track } from "@/lib/analytics/tracker";
import { isValidEmail, submit, submissionMode } from "@/lib/submissions/sinks";

export function EarlyAccessForm({ scenarioId, tone = "desk", idPrefix = "ea" }: { scenarioId?: string; tone?: "desk" | "page"; idPrefix?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const muted = tone === "desk" ? "text-desk-muted" : "text-muted";

  if (status === "done") {
    return (
      <div role="status">
        <p className="font-display text-lg font-semibold">You&apos;re on the Field Test list.</p>
        <p className={`mt-1 text-sm ${muted}`}>
          {submissionMode === "local" ? "In this build, your address is kept in your browser only." : "We'll write when the next scenario is ready."}
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="grid gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!isValidEmail(email)) {
          setError("Enter an email address like name@utility.org.");
          setStatus("error");
          return;
        }
        setStatus("sending");
        const res = await submit("early-access", { email: email.trim() }, scenarioId);
        if (res.ok) {
          track("emailSubmitted", {}, scenarioId);
          setStatus("done");
        } else {
          setError(res.error ?? "Something went wrong.");
          setStatus("error");
        }
      }}
    >
      <label htmlFor={`${idPrefix}-email`} className="field-label">Work email</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={`${idPrefix}-email`}
          type="email"
          autoComplete="email"
          inputMode="email"
          className="field sm:max-w-sm"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
          aria-invalid={status === "error"}
          aria-describedby={status === "error" ? `${idPrefix}-error` : undefined}
        />
        <button type="submit" className="btn btn-primary uppercase tracking-[0.08em]" disabled={status === "sending"}>
          Join Field Test
        </button>
      </div>
      {status === "error" && <p id={`${idPrefix}-error`} role="alert" className="text-sm" style={{ color: "var(--fault)" }}>{error}</p>}
      <p className={`text-xs ${muted}`}>One email per new scenario. No account needed to play.</p>
    </form>
  );
}
