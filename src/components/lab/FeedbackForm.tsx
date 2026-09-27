"use client";

import { useRef, useState } from "react";
import { track } from "@/lib/analytics/tracker";
import { submit, submissionMode } from "@/lib/submissions/sinks";

const ROLES = ["Distribution operator", "Apprentice/developing operator", "Trainer", "Supervisor/manager", "Engineer", "Other"];
const EXPERIENCE = ["Less than 1 year", "1–5 years", "5–10 years", "10–20 years", "20+ years"];
const YES_NO = ["Yes", "Somewhat", "No", "Not sure"];

export const SENSITIVE_INFO_WARNING = "Please do not submit confidential, proprietary, or utility-specific operational information.";

export function FeedbackForm({ scenarioId, tone = "desk" }: { scenarioId: string; tone?: "desk" | "page" }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const started = useRef(false);
  const muted = tone === "desk" ? "text-desk-muted" : "text-muted";
  const onFirstInput = () => {
    if (started.current) return;
    started.current = true;
    track("feedbackStarted", {}, scenarioId);
  };

  if (status === "done") {
    return (
      <div role="status" className="rounded-[3px] border border-[var(--live)] p-4">
        <p className="font-display text-lg font-semibold">Thank you. Your feedback is recorded.</p>
        {submissionMode === "local" && <p className={`mt-1 text-sm ${muted}`}>In this build, feedback is kept in your browser only. Nothing is published.</p>}
      </div>
    );
  }

  return (
    <form
      onInput={onFirstInput}
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const data = Object.fromEntries(fd.entries());
        setStatus("sending");
        const res = await submit("feedback", data, scenarioId);
        if (res.ok) {
          track("feedbackSubmitted", { role: String(data.role ?? ""), experience: String(data.experience ?? "") }, scenarioId);
          setStatus("done");
        } else {
          setError(res.error ?? "Something went wrong.");
          setStatus("error");
        }
      }}
      className="grid gap-5"
      aria-describedby="feedback-warning"
    >
      <p id="feedback-warning" className="rounded-[3px] border border-[var(--alarm)] px-3 py-2 text-sm" style={{ color: tone === "desk" ? "var(--alarm)" : "var(--accent-ink)" }}>
        {SENSITIVE_INFO_WARNING}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fb-role" className="field-label">Role</label>
          <select id="fb-role" name="role" className="field" defaultValue="">
            <option value="" disabled>Select a role</option>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="fb-exp" className="field-label">Experience</label>
          <select id="fb-exp" name="experience" className="field" defaultValue="">
            <option value="" disabled>Select experience</option>
            {EXPERIENCE.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="fb-unrealistic" className="field-label">Was anything unrealistic?</label>
        <textarea id="fb-unrealistic" name="unrealistic" className="field" maxLength={1000} />
      </div>
      <div>
        <label htmlFor="fb-want" className="field-label">What information would you want before making this decision?</label>
        <textarea id="fb-want" name="wantedInformation" className="field" maxLength={1000} />
      </div>
      {[
        ["useful-training", "Would this type of scenario have been useful during your operator training?"],
        ["use-developing", "Would you use something like this for developing operators?"],
      ].map(([name, q]) => (
        <fieldset key={name}>
          <legend className="field-label">{q}</legend>
          <div className="flex flex-wrap gap-2">
            {YES_NO.map((v) => (
              <label key={v} className="choice">
                <input type="radio" name={name} value={v} />
                <span className="text-sm">{v}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <div>
        <label htmlFor="fb-missing" className="field-label">Was anything important missing?</label>
        <textarea id="fb-missing" name="missing" className="field" maxLength={1000} />
      </div>
      <div>
        <label htmlFor="fb-comment" className="field-label">
          Anything else? <span className={`font-normal ${muted}`}>(optional)</span>
        </label>
        <textarea id="fb-comment" name="comment" className="field" maxLength={2000} />
      </div>
      {status === "error" && <p role="alert" className="text-sm" style={{ color: "var(--fault)" }}>{error}</p>}
      <div>
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send feedback"}
        </button>
      </div>
    </form>
  );
}
