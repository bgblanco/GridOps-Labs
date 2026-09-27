"use client";

import { useEffect, useState } from "react";
import { PageHeader, Section } from "@/components/site/Section";
import { track } from "@/lib/analytics/tracker";
import { isValidEmail, submissionMode, submit } from "@/lib/submissions/sinks";

const INTERESTS = ["Decision Labs", "Utility training pilot", "Scenario workshop", "Custom training", "SME feedback", "General inquiry"];

export function ContactView() {
  const [interests, setInterests] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("interest");
      if (q && INTERESTS.includes(q)) setInterests([q]);
    } catch {}
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Request a conversation."
        intro={<p>Tell us a little about your team and what you&apos;re looking at. Training leads, operators, trainers, and SMEs who want to review scenarios are all welcome.</p>}
      />
      <Section tight>
        {status === "done" ? (
          <div role="status" className="max-w-2xl rounded-[3px] border border-rule bg-surface p-6">
            <p className="font-display text-2xl font-semibold">Thanks. Your message is recorded.</p>
            <p className="mt-2 text-ink-2">
              {submissionMode === "local"
                ? "In this build, messages are kept in your browser only; nothing has been sent yet."
                : "We'll reply to the address you gave."}
            </p>
          </div>
        ) : (
          <form
            noValidate
            className="grid max-w-2xl gap-5"
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const data = Object.fromEntries(fd.entries()) as Record<string, string>;
              const errs: Record<string, string> = {};
              if (!data.name?.trim()) errs.name = "Enter your name.";
              if (!isValidEmail(data.email ?? "")) errs.email = "Enter an email address like name@utility.org.";
              if (!data.message?.trim()) errs.message = "Add a short message so we know where to start.";
              setErrors(errs);
              if (Object.keys(errs).length) return;
              setStatus("sending");
              const res = await submit("contact", { ...data, interests });
              if (res.ok) {
                track("contactSubmitted", { interests });
                setStatus("done");
              } else {
                setServerError(res.error ?? "Something went wrong.");
                setStatus("error");
              }
            }}
          >
            <p className="rounded-[3px] border border-[var(--alarm)] px-3 py-2 text-sm text-accent-ink" role="note">
              Please do not submit confidential or operationally sensitive utility information.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="c-name" name="name" label="Name" error={errors.name} autoComplete="name" />
              <Field id="c-org" name="organization" label="Organization" autoComplete="organization" />
              <Field id="c-role" name="role" label="Role" autoComplete="organization-title" />
              <Field id="c-email" name="email" label="Email" type="email" error={errors.email} autoComplete="email" />
            </div>
            <fieldset>
              <legend className="field-label">Interested in</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {INTERESTS.map((i) => (
                  <label key={i} className="choice">
                    <input type="checkbox" checked={interests.includes(i)} onChange={() => setInterests((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]))} />
                    <span className="text-[0.97rem]">{i}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="c-message" className="field-label">Message</label>
              <textarea id="c-message" name="message" className="field min-h-[140px]" maxLength={4000} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "c-message-err" : undefined} />
              {errors.message && <p id="c-message-err" className="mt-1 text-sm" style={{ color: "var(--fault)" }}>{errors.message}</p>}
            </div>
            {status === "error" && <p role="alert" className="text-sm" style={{ color: "var(--fault)" }}>{serverError}</p>}
            <div>
              <button type="submit" className="btn btn-ink" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
            </div>
          </form>
        )}
      </Section>
    </>
  );
}

function Field({ id, name, label, type = "text", error, autoComplete }: { id: string; name: string; label: string; type?: string; error?: string; autoComplete?: string }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      <input id={id} name={name} type={type} className="field" autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-err` : undefined} />
      {error && <p id={`${id}-err`} className="mt-1 text-sm" style={{ color: "var(--fault)" }}>{error}</p>}
    </div>
  );
}
