import { NextResponse } from "next/server";

/**
 * Utility inquiry (lead) handler. Runs only on the server, so the mail key is
 * never exposed to the client.
 *
 * Delivery uses the Resend REST API (no SDK dependency). Required env vars:
 *   RESEND_API_KEY     — server-only secret; when absent the lead is accepted
 *                        and logged but not emailed (delivered:false).
 *   LEAD_TO_EMAIL      — destination (default info@sentinelpeaksolutions.com)
 *   LEAD_FROM_EMAIL    — verified sender, e.g. "GridOps Labs <leads@gridopslabs.com>"
 */

const TO = process.env.LEAD_TO_EMAIL || "info@sentinelpeaksolutions.com";
const FROM = process.env.LEAD_FROM_EMAIL || "GridOps Labs <onboarding@resend.dev>";
const KEY = process.env.RESEND_API_KEY || "";

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const list = (v: unknown) => (Array.isArray(v) ? v.filter((x) => typeof x === "string") : []);

async function sendMail(to: string, subject: string, text: string, replyTo?: string) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], subject, text, reply_to: replyTo }),
  });
}

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (str(data.company_website)) return NextResponse.json({ ok: true, delivered: false });

  const firstName = str(data.firstName);
  const lastName = str(data.lastName);
  const email = str(data.email);
  const organization = str(data.organization);
  const role = str(data.role);
  const challenge = str(data.challenge);

  if (!firstName || !lastName || !emailOk(email) || !organization || !role || !str(data.orgType) || !challenge) {
    return NextResponse.json({ ok: false, error: "Please complete the required fields." }, { status: 422 });
  }

  const interests = list(data.interests);
  const primaryInterest = interests[0] || "General inquiry";
  const subject = `[GridOps Lead] ${organization} — ${primaryInterest}`;
  const body = [
    `Name: ${firstName} ${lastName}`,
    `Work email: ${email}`,
    `Organization: ${organization}`,
    `Organization type: ${str(data.orgType) || "—"}`,
    `Role: ${role}`,
    str(data.phone) ? `Phone: ${str(data.phone)}` : null,
    `Interest: ${interests.join(", ") || "—"}`,
    `Operator population: ${str(data.operators) || "—"}`,
    `Scenario areas: ${list(data.scenarioAreas).join(", ") || "—"}`,
    `Current training environment: ${list(data.trainingEnv).join(", ") || "—"}`,
    `How they heard: ${str(data.heard) || "—"}`,
    "",
    "Primary training challenge:",
    challenge,
  ]
    .filter((l) => l !== null)
    .join("\n");

  if (!KEY) {
    // Accept the lead so the UX isn't broken, but be honest that mail isn't configured.
    console.warn(`[lead] RESEND_API_KEY not set — received but not emailed: ${subject}`);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await sendMail(TO, subject, body, email);
    if (!res.ok) {
      console.error("[lead] delivery failed", res.status, await res.text().catch(() => ""));
      return NextResponse.json({ ok: false, error: "We couldn't send that just now. Please try again or email info@sentinelpeaksolutions.com." }, { status: 502 });
    }
    // Best-effort confirmation to the submitter.
    await sendMail(
      email,
      "Thanks for contacting GridOps Labs",
      "Thanks for contacting GridOps Labs. We received your request and will follow up shortly.\n\nPlease do not send confidential or system-sensitive utility information by email.\n\n— GridOps Labs",
    ).catch(() => {});
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[lead] error", err);
    return NextResponse.json({ ok: false, error: "We couldn't send that just now. Please try again or email info@sentinelpeaksolutions.com." }, { status: 502 });
  }
}
