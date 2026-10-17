import { headers } from "next/headers";
// Imported directly in this server-only module, and initialized manually below rather than
// through the Next.js instrumentation hooks (instrumentation.ts / instrumentation-client.ts)
// Sentry's own setup docs point to - those auto-instrument the client and edge runtimes too,
// and this project consolidated its nav into a single client island specifically to control
// client bundle weight. This module is never imported by a "use client" file, so it is never
// bundled for the browser; importing Sentry only here makes server-only a property of the
// module graph, not a setting that could drift. No sentry.client.config /
// instrumentation-client.ts exists anywhere in this project.
import * as Sentry from "@sentry/nextjs";
import { waitUntil } from "@vercel/functions";
import { isRateLimited } from "@/lib/rate-limit";

const SENTRY_DSN = process.env.SENTRY_DSN;

// Guarded by Sentry.getClient() so this runs once per server process no matter how many
// lead forms import this module - exactly one Sentry.init() call-site in the codebase.
if (SENTRY_DSN && !Sentry.getClient()) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.VERCEL_ENV ?? "development",
    // Error capture only - no performance/session-replay instrumentation, and no sampling on
    // either axis. A rare, high-value event must notify on its first occurrence, not get
    // dropped by a sample rate tuned for high-volume noise.
    tracesSampleRate: 0,
    sampleRate: 1,
  });
}

/**
 * Every entry point that posts into the same GoHighLevel pipeline, as the exact literal
 * already stored on every lead collected to date - "siteoptz.com/contact" predates this
 * union and is never renamed; "dental.siteoptz.com" is new, in the same style.
 */
export type LeadSource = "siteoptz.com/contact" | "dental.siteoptz.com";

/**
 * Enough to recover the lead by hand, attached to every captured event - an alert that only
 * says "webhook post failed" tells you a lead was lost; the same alert with the contact's
 * details lets you call them in the morning. The lead context is passed in by the caller
 * rather than read from fixed keys, because different entry points have different fields
 * worth alerting on (company/goal for the main form, practiceName/spend for the dental
 * form) - a fixed five-key shape would silently carry undefined fields for one entry point
 * or the other.
 */
export function captureLeadEvent(
  level: "error" | "warning",
  message: string,
  lead: Record<string, string>,
  options: { extra?: Record<string, unknown>; error?: unknown } = {}
) {
  if (!SENTRY_DSN) return;
  Sentry.withScope((scope) => {
    scope.setLevel(level);
    scope.setContext("lead", lead);
    for (const [key, value] of Object.entries(options.extra ?? {})) {
      scope.setExtra(key, value);
    }
    if (options.error instanceof Error) {
      Sentry.captureException(options.error);
    } else {
      Sentry.captureMessage(message);
    }
  });
  // captureException/captureMessage only queue the event - they don't send it. The server
  // action's response already went back to the visitor by the time this line runs, and Vercel
  // is free to freeze or tear down the invocation immediately after that, mid-flight on the
  // queued event's network delivery. waitUntil keeps this invocation alive in the background
  // long enough for the flush to actually complete, without making the visitor wait on it.
  waitUntil(Sentry.flush(2000));
}

// Below this elapsed time, the form could not have been read and filled by a person.
export const MIN_ELAPSED_MS = 2500;
// Every failure path below already returns success to the visitor - a longer timeout has no
// visitor-facing cost, the spinner just runs a bit longer either way - while giving
// GoHighLevel more chance to actually respond before the attempt is logged as failed and left
// for manual recovery. Optimized for recovering more leads automatically, not for bounding
// visitor wait time.
export const GHL_TIMEOUT_MS = 8000;

export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  // x-forwarded-for can carry a comma-separated proxy chain on Vercel - always take the
  // first entry, never the whole header, so a consent record holds one address.
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  return headerList.get("x-real-ip") ?? "unknown";
}

// Referer is client-supplied like any other header, so this is a reliability fallback, not a
// spoofing guard: it only records the page the form was submitted from, not where the
// session started, which is why the hidden consentPage/landingPage fields take priority.
export async function getRefererPage(): Promise<string> {
  const headerList = await headers();
  const referer = headerList.get("referer");
  if (!referer) return "";
  try {
    return new URL(referer).pathname;
  } catch {
    return "";
  }
}

// Audit metadata, not a security boundary - trimmed and length-capped so a pathological
// query string can't bloat the record, nothing more.
export function clampField(value: FormDataEntryValue | null, maxLength = 512): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

/** Logged on every path that could otherwise silently drop a lead. Grep for this tag in production logs. */
export function logDroppedSubmission(reason: string, payload: unknown) {
  console.error(`[contact-webhook-failure] ${reason}`, JSON.stringify(payload));
}

/**
 * The honeypot and elapsed-time spam signals - one computation, shared by every entry
 * point. Neither signal vetoes a submission: a password manager or browser autofill
 * routinely fills a hidden decoy field on a real visitor's behalf, so a filled honeypot is
 * not reliable evidence of a bot for this audience, and a false veto silently discards a
 * real lead with no error, no retry, and no record. Both signals are carried on the
 * payload instead, for a human to review in GoHighLevel rather than a heuristic that
 * can't be audited to make the call.
 */
export interface SpamSignals {
  signals: string[];
  honeypotFilled: boolean;
  elapsedMs: number | null;
}

export function computeSpamSignals(formData: FormData): SpamSignals {
  // Field name is a meaningless token, not "company_site" - see SmsConsentField/the hidden
  // fields component for why a name describing any real field is exactly what attracts
  // autofill to a honeypot.
  const honeypot = String(formData.get("qzx92f") ?? "").trim();
  const loadedAt = Number(formData.get("loaded_at"));
  const elapsed = Date.now() - loadedAt;

  const signals: string[] = [];
  if (honeypot.length > 0) signals.push("honeypot");
  if (!Number.isFinite(loadedAt) || elapsed < MIN_ELAPSED_MS) signals.push("elapsed-too-fast");

  return {
    signals,
    honeypotFilled: honeypot.length > 0,
    elapsedMs: Number.isFinite(elapsed) ? elapsed : null,
  };
}

export { isRateLimited };

/**
 * Every field every submission carries regardless of entry point, never omitted - a field
 * GHL's mapping UI hasn't seen present on at least one payload never becomes mappable, so
 * ad-param and consent-audit fields are always "" rather than absent when they don't apply.
 */
export async function buildCommonEnvelope(
  formData: FormData,
  ip: string,
  spamSignals: SpamSignals
): Promise<Record<string, unknown>> {
  const submittedAt = new Date().toISOString();
  const refererPage = await getRefererPage();
  const consentPage = clampField(formData.get("consentPage"));
  const landingPage = clampField(formData.get("landingPage"));

  return {
    submittedAt,
    // development locally, preview on a Vercel preview deploy, production on production -
    // read from VERCEL_ENV rather than the hostname so it can't be fooled by a custom domain.
    // Every GHL workflow's entry condition gates on this being "production".
    environment: process.env.VERCEL_ENV ?? "development",
    smsConsentAt: submittedAt,
    smsConsentPage: consentPage || refererPage || "(unknown)",
    smsConsentLandingPage: landingPage || refererPage || "(unknown)",
    smsConsentIp: ip,
    fbclid: clampField(formData.get("fbclid")),
    utm_source: clampField(formData.get("utm_source")),
    utm_medium: clampField(formData.get("utm_medium")),
    utm_campaign: clampField(formData.get("utm_campaign")),
    utm_content: clampField(formData.get("utm_content")),
    utm_term: clampField(formData.get("utm_term")),
    gclid: clampField(formData.get("gclid")),
    // "landing" when the ad params came from the same page load as the session's first page,
    // "mid-session" when a later page load overwrote them with a new click, "" when no ad
    // click has happened at all this session.
    adParamsSource: clampField(formData.get("adParamsSource")),
    // A heuristic flag, not a verdict - a human reviewing the contact in GoHighLevel makes the
    // actual call. false/"" on every clean submission so the field is never absent from the
    // payload, the same reasoning as every other audit field above.
    spamSuspected: spamSignals.signals.length > 0,
    spamSignals: spamSignals.signals.join(","),
  };
}

/**
 * POSTs the assembled submission to GHL. Every failure path - a missing webhook URL, a GHL
 * timeout, a non-2xx response, a network error - is something the visitor cannot fix and a
 * retry cannot improve, so every one is logged at error level for manual recovery and
 * reported to Sentry via the caller-supplied lead context; the caller still answers success
 * to the visitor regardless of what this returns.
 */
export async function postToGhl(
  submission: Record<string, unknown>,
  leadForSentry: Record<string, string>
): Promise<void> {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;

  if (!webhookUrl) {
    logDroppedSubmission("GHL_WEBHOOK_URL is not configured", submission);
    captureLeadEvent("error", "GHL_WEBHOOK_URL is not configured", leadForSentry);
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
      signal: AbortSignal.timeout(GHL_TIMEOUT_MS),
    });

    if (!response.ok) {
      logDroppedSubmission(`GHL responded with status ${response.status}`, submission);
      captureLeadEvent(
        "error",
        `GHL responded with status ${response.status}`,
        leadForSentry,
        { extra: { status: response.status } }
      );
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown fetch error";
    logDroppedSubmission(reason, submission);
    captureLeadEvent("error", reason, leadForSentry, { error });
  }
}
