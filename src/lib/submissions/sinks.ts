/**
 * Submission sinks for feedback, early access and contact forms.
 *
 * Default: stored in the visitor's own browser (localStorage), never published.
 * When NEXT_PUBLIC_SUBMIT_ENDPOINT is set, submissions are POSTed as JSON to it
 * instead, so a CRM, waitlist or database can be connected without UI changes.
 */
export type SubmissionKind = "feedback" | "early-access" | "contact";

export interface Submission<T = Record<string, unknown>> {
  kind: SubmissionKind;
  scenarioId?: string;
  createdAt: string;
  data: T;
}

export interface SubmitResult {
  ok: boolean;
  /** "remote" when delivered to an endpoint, "local" when kept in this browser */
  mode: "remote" | "local";
  error?: string;
}

const ENDPOINT = process.env.NEXT_PUBLIC_SUBMIT_ENDPOINT || "";
const KEY = "gridops.submissions.v1";

export const submissionMode: SubmitResult["mode"] = ENDPOINT ? "remote" : "local";

function storeLocally(sub: Submission): SubmitResult {
  try {
    const all: Submission[] = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    all.push(sub);
    window.localStorage.setItem(KEY, JSON.stringify(all.slice(-100)));
    return { ok: true, mode: "local" };
  } catch {
    // Storage blocked (private mode, sandbox). The submission is still acknowledged
    // in the UI; nothing is transmitted anywhere.
    return { ok: true, mode: "local" };
  }
}

export async function submit(kind: SubmissionKind, data: Record<string, unknown>, scenarioId?: string): Promise<SubmitResult> {
  const sub: Submission = { kind, scenarioId, createdAt: new Date().toISOString(), data };
  if (!ENDPOINT) return storeLocally(sub);
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });
    if (!res.ok) return { ok: false, mode: "remote", error: `The server returned ${res.status}. Please try again.` };
    return { ok: true, mode: "remote" };
  } catch {
    return { ok: false, mode: "remote", error: "The submission couldn't be sent. Check your connection and try again." };
  }
}

export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
