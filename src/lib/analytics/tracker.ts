import type { AnalyticsEvent, AnalyticsEventName } from "./events";

/**
 * Pluggable analytics. The default adapter keeps a bounded buffer in
 * sessionStorage so a backend can be wired later by registering an adapter
 * (e.g. POST to an ingestion endpoint) without touching components.
 */
export interface AnalyticsAdapter {
  send(event: AnalyticsEvent): void;
}

const KEY = "gridops.analytics.v1";
const SESSION_KEY = "gridops.session.v1";
const MAX = 300;

function safeSession(): Storage | null {
  try {
    return typeof window !== "undefined" ? window.sessionStorage : null;
  } catch {
    return null;
  }
}

export const sessionBufferAdapter: AnalyticsAdapter = {
  send(event) {
    const s = safeSession();
    if (!s) return;
    try {
      const buf: AnalyticsEvent[] = JSON.parse(s.getItem(KEY) ?? "[]");
      buf.push(event);
      s.setItem(KEY, JSON.stringify(buf.slice(-MAX)));
    } catch {
      /* storage unavailable: drop silently */
    }
  },
};

const adapters: AnalyticsAdapter[] = [sessionBufferAdapter];

export function registerAnalyticsAdapter(adapter: AnalyticsAdapter) {
  adapters.push(adapter);
}

let memorySession: string | undefined;
function sessionId(): string {
  const s = safeSession();
  try {
    const existing = s?.getItem(SESSION_KEY);
    if (existing) return existing;
  } catch {
    /* ignore */
  }
  const id = memorySession ?? `s_${Math.random().toString(36).slice(2, 10)}`;
  memorySession = id;
  try {
    s?.setItem(SESSION_KEY, id);
  } catch {
    /* ignore */
  }
  return id;
}

export function track(name: AnalyticsEventName, props?: AnalyticsEvent["props"], scenarioId?: string) {
  const event: AnalyticsEvent = { name, props, scenarioId, sessionId: sessionId(), at: new Date().toISOString() };
  for (const a of adapters) {
    try {
      a.send(event);
    } catch {
      /* never let analytics break the lab */
    }
  }
}

export function readBufferedEvents(): AnalyticsEvent[] {
  try {
    return JSON.parse(safeSession()?.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}
