"use client";

import { useEffect, useState } from "react";
import { PageHeader, Section } from "@/components/site/Section";
import { track } from "@/lib/analytics/tracker";
import { isValidEmail } from "@/lib/submissions/sinks";

const INTERESTS = [
  "Decision Lab Pilot",
  "Operator Training",
  "Scenario Library",
  "Custom Scenario Development",
  "Articulate / Rise Learning Content",
  "Workshop / Demonstration",
  "Partnership",
  "Other",
];

const ORG_TYPES = [
  "Investor-Owned Utility",
  "Municipal Utility",
  "Electric Cooperative",
  "Public Power",
  "Training Organization",
  "Consultant",
  "Technology Provider",
  "Other",
];

const OPERATOR_COUNTS = ["1–10", "11–25", "26–50", "51–100", "100+"];

const SCENARIO_AREAS = [
  "Restoration & Switching",
  "SCADA & Telecommunications",
  "Field Communication & Coordination",
  "Alarm Management",
  "Loading & System Configuration",
  "Protection & Abnormal Conditions",
  "Concurrent Events & Workload",
  "Information Quality & Judgment",
];

const TRAINING_ENV = ["LMS", "Simulator", "OJT", "Classroom", "Internal Qualification Program", "Other"];

export function ContactView() {
  const [interests, setInterests] = useState<string[]>([]);
  const [scenarioAreas, setScenarioAreas] = useState<string[]>([]);
  const [trainingEnv, setTrainingEnv] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [delivered, setDelivered] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("interest");
      if (q && INTERESTS.includes(q)) setInterests([q]);
    } catch {}
  }, []);

  const toggle = (set: React.Dispatch<React.SetStateAction<string[]>>, v: string) =>
    set((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Request a conversation."
        intro={<p>Tell us about your team and what you&apos;re looking at. Training leads, operators, trainers, and SMEs who want to review scenarios are all welcome.</p>}
      />
      <Section tight>
        {status === "done" ? (
          <div role="status" className="max-w-2xl rounded-[3px] border border-rule bg-surface p-6">
            <p className="font-display text-2xl font-semibold">Thanks — your request is in.</p>
            <p className="mt-2 text-ink-2">
              {delivered
                ? "We received it and will follow up shortly. Please don't send confidential or system-sensitive utility information by email."
                : "We received your request and will follow up shortly. Please don't send confidential or system-sensitive utility information by email."}
            </p>
          </div>
        ) : (
          <form
            noValidate
            className="grid max-w-2xl gap-6"
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const data = Object.fromEntries(fd.entries()) as Record<string, string>;
              const errs: Record<string, string> = {};
              if (!data.firstName?.trim()) errs.firstName = "Enter your first name.";
              if (!data.lastName?.trim()) errs.lastName = "Enter your last name.";
              if (!isValidEmail(data.email ?? "")) errs.email = "Enter a work email like name@utility.org.";
              if (!data.organization?.trim()) errs.organization = "Enter your organization.";
              if (!data.role?.trim()) errs.role = "Enter your role.";
              if (!data.orgType) errs.orgType = "Select an organization type.";
              if (!data.challenge?.trim()) errs.challenge = "A sentence or two is enough.";
              setErrors(errs);
              if (Object.keys(errs).length) return;
              setStatus("sending");
              try {
                const res = await fetch("/api/lead", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ ...data, interests, scenarioAreas, trainingEnv }),
                });
                const json = await res.json().catch(() => ({ ok: res.ok }));
                if (res.ok && json.ok) {
                  track("contactSubmitted", { interests });
                  setDelivered(Boolean(json.delivered));
                  setStatus("done");
                } else {
                  setServerError(json.error ?? "Something went wrong. Please try again.");
                  setStatus("error");
                }
              } catch {
                setServerError("We couldn't reach the server. Please try again, or email info@sentinelpeaksolutions.com.");
                setStatus("error");
              }
            }}
          >
            {/* Honeypot — hidden from users, catches bots */}
            <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

            <p className="rounded-[3px] border border-[var(--alarm)] px-3 py-2 text-sm text-accent-ink" role="note">
              Do not submit confidential, CEII, credentials, switching instructions, system-specific operating details, or other sensitive operational information.
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="c-first" name="firstName" label="First name *" error={errors.firstName} autoComplete="given-name" />
              <Field id="c-last" name="lastName" label="Last name *" error={errors.lastName} autoComplete="family-name" />
              <Field id="c-email" name="email" label="Work email *" type="email" error={errors.email} autoComplete="email" />
              <Field id="c-phone" name="phone" label="Phone" type="tel" autoComplete="tel" />
              <Field id="c-org" name="organization" label="Organization *" error={errors.organization} autoComplete="organization" />
              <Field id="c-role" name="role" label="Job title / role *" error={errors.role} autoComplete="organization-title" />
            </div>

            <SelectField id="c-orgtype" name="orgType" label="Organization type *" options={ORG_TYPES} error={errors.orgType} />

            <CheckboxGroup legend="Interest" options={INTERESTS} selected={interests} onToggle={(v) => toggle(setInterests, v)} />

            <SelectField id="c-operators" name="operators" label="Approximate operator population" options={OPERATOR_COUNTS} />

            <CheckboxGroup legend="Scenario areas of interest" options={SCENARIO_AREAS} selected={scenarioAreas} onToggle={(v) => toggle(setScenarioAreas, v)} />

            <CheckboxGroup legend="Current training environment" options={TRAINING_ENV} selected={trainingEnv} onToggle={(v) => toggle(setTrainingEnv, v)} />

            <div>
              <label htmlFor="c-challenge" className="field-label">Primary training challenge *</label>
              <textarea id="c-challenge" name="challenge" className="field min-h-[140px]" maxLength={4000} aria-invalid={Boolean(errors.challenge)} aria-describedby={errors.challenge ? "c-challenge-err" : undefined} />
              {errors.challenge && <p id="c-challenge-err" className="mt-1 text-sm" style={{ color: "var(--fault)" }}>{errors.challenge}</p>}
            </div>

            <Field id="c-heard" name="heard" label="How did you hear about GridOps Labs?" />

            {status === "error" && <p role="alert" className="text-sm" style={{ color: "var(--fault)" }}>{serverError}</p>}
            <div>
              <button type="submit" className="btn btn-ink uppercase tracking-[0.06em]" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Request a Conversation"}
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

function SelectField({ id, name, label, options, error }: { id: string; name: string; label: string; options: string[]; error?: string }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      <select id={id} name={name} className="field" defaultValue="" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-err` : undefined}>
        <option value="" disabled>Select one…</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {error && <p id={`${id}-err`} className="mt-1 text-sm" style={{ color: "var(--fault)" }}>{error}</p>}
    </div>
  );
}

function CheckboxGroup({ legend, options, selected, onToggle }: { legend: string; options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <fieldset>
      <legend className="field-label">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <label key={o} className="choice">
            <input type="checkbox" checked={selected.includes(o)} onChange={() => onToggle(o)} />
            <span className="text-[0.97rem]">{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
