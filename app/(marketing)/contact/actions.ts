"use server";

import { headers } from "next/headers";
// Imported directly in this server-action module only, and initialized manually below rather
// than through the Next.js instrumentation hooks (instrumentation.ts / instrumentation-client.ts)
// Sentry's own setup docs point to - those auto-instrument the client and edge runtimes too,
// and this project consolidated its nav into a single client island specifically to control
// client bundle weight. A "use server" file is never bundled for the browser, so importing
// Sentry only here makes server-only a property of the file structure, not a setting that could
// drift. No sentry.client.config / instrumentation-client.ts exists anywhere in this project.
import * as Sentry from "@sentry/nextjs";
import { waitUntil } from "@vercel/functions";
import {
  contactFormSchema,
  type ContactFormFieldErrors,
  type ContactFormState,
  LOCATION_BAND_LABELS,
  SMS_CONSENT_TEXT_V1,
  SPEND_BAND_LABELS,
} from "@/lib/contact-schema";
import { isRateLimited } from "@/lib/rate-limit";

const SENTRY_DSN = process.env.SENTRY_DSN;

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

interface LeadInfo {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  goal?: string;
}

/**
 * Enough to recover the lead by hand, attached to every captured event - an alert that only
 * says "webhook post failed" tells you a lead was lost; the same alert with the contact's
 * details lets you call them in the morning.
 */
function captureLeadEvent(
  level: "error" | "warning",
  message: string,
  lead: LeadInfo,
  options: { extra?: Record<string, unknown>; error?: unknown } = {}
) {
  if (!SENTRY_DSN) return;
  Sentry.withScope((scope) => {
    scope.setLevel(level);
    scope.setContext("lead", {
      name: lead.name ?? "",
      email: lead.email ?? "",
      phone: lead.phone ?? "",
      company: lead.company ?? "",
      goal: lead.goal ?? "",
    });
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
const MIN_ELAPSED_MS = 2500;
// Every failure path below already returns success to the visitor - a longer timeout has no
// visitor-facing cost, the spinner just runs a bit longer either way - while giving
// GoHighLevel more chance to actually respond before the attempt is logged as failed and left
// for manual recovery. Optimized for recovering more leads automatically, not for bounding
// visitor wait time.
const GHL_TIMEOUT_MS = 8000;

async function getClientIp(): Promise<string> {
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
async function getRefererPage(): Promise<string> {
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
function clampField(value: FormDataEntryValue | null, maxLength = 512): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

/** Logged on every path that could otherwise silently drop a lead. Grep for this tag in production logs. */
function logDroppedSubmission(reason: string, payload: unknown) {
  console.error(`[contact-webhook-failure] ${reason}`, JSON.stringify(payload));
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Field name is a meaningless token, not "company_site" - see ContactForm.tsx for why a
  // name describing any real field is exactly what attracts autofill to a honeypot.
  const honeypot = String(formData.get("qzx92f") ?? "").trim();
  const loadedAt = Number(formData.get("loaded_at"));
  const elapsed = Date.now() - loadedAt;

  // Neither signal vetoes the submission anymore. A password manager or browser autofill
  // routinely fills a hidden decoy field on a real visitor's behalf - a filled honeypot is not
  // reliable evidence of a bot for this form's audience - and a false veto silently discards a
  // real enterprise lead with no error, no retry, and no record. Both signals are carried on
  // the payload instead, for a human to review in GoHighLevel rather than a heuristic that
  // can't be audited to make the call.
  const spamSignals: string[] = [];
  if (honeypot.length > 0) spamSignals.push("honeypot");
  if (!Number.isFinite(loadedAt) || elapsed < MIN_ELAPSED_MS) spamSignals.push("elapsed-too-fast");

  if (spamSignals.length > 0) {
    const signalList = spamSignals.join(",");
    console.warn("[contact-spam-trap] flagged submission", {
      signals: signalList,
      honeypotFilled: honeypot.length > 0,
      elapsedMs: Number.isFinite(elapsed) ? elapsed : null,
    });
    // A separate, lower-severity event from the three webhook-failure captures below - this
    // fires on the signal alone, independent of whether the submission goes on to deliver
    // successfully, so it stays distinguishable in the inbox rather than folded into "a
    // delivery failed." Raw formData here, not the Zod-parsed result: this must fire even if
    // the submission is otherwise invalid, since spam-flagged-and-invalid is still a human
    // worth a two-second look, not a reason to lose the alert.
    captureLeadEvent(
      "warning",
      "Contact form submission flagged as possible spam",
      {
        name: clampField(formData.get("name")),
        email: clampField(formData.get("email")),
        phone: clampField(formData.get("phone")),
        company: clampField(formData.get("company")),
        goal: clampField(formData.get("goal")),
      },
      { extra: { signals: signalList } }
    );
  }

  const ip = await getClientIp();
  if (isRateLimited(ip)) {
    return {
      status: "error",
      fieldErrors: {},
      formError: "You've submitted a few times in a short window.",
      emailFallback: true,
    };
  }

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    role: formData.get("role"),
    locations: formData.get("locations"),
    spend: formData.get("spend"),
    stack: formData.get("stack"),
    goal: formData.get("goal"),
    smsConsent: formData.get("smsConsent") === "on",
  };

  const result = contactFormSchema.safeParse(raw);

  if (!result.success) {
    const flattened = result.error.flatten().fieldErrors;
    const fieldErrors: ContactFormFieldErrors = {};
    for (const [key, messages] of Object.entries(flattened)) {
      if (messages && messages.length > 0) {
        fieldErrors[key as keyof ContactFormFieldErrors] = messages[0];
      }
    }
    return {
      status: "error",
      fieldErrors,
      formError: "Fix the highlighted fields and try again.",
    };
  }

  const submittedAt = new Date().toISOString();
  const refererPage = await getRefererPage();
  const consentPage = clampField(formData.get("consentPage"));
  const landingPage = clampField(formData.get("landingPage"));

  const submission = {
    ...result.data,
    locationsLabel: LOCATION_BAND_LABELS[result.data.locations],
    spendLabel: SPEND_BAND_LABELS[result.data.spend],
    submittedAt,
    source: "siteoptz.com/contact",
    // development locally, preview on a Vercel preview deploy, production on production -
    // read from VERCEL_ENV rather than the hostname so it can't be fooled by a custom domain.
    // Every GHL workflow's entry condition gates on this being "production".
    environment: process.env.VERCEL_ENV ?? "development",
    // Sent on every submission, including a declined consent - a record showing consent was
    // declined at a given time is as useful as one showing it was given, and GHL won't expose
    // a field in its mapping UI if it's sometimes absent from the payload. Same reasoning
    // applies to the page/landing/ad-parameter fields below: never omitted, empty string or
    // "(unknown)" instead.
    smsConsentText: SMS_CONSENT_TEXT_V1,
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
    // click has happened at all this session - lets a lead be told apart as an ad click
    // straight to the form versus a returning organic visitor who got retargeted.
    adParamsSource: clampField(formData.get("adParamsSource")),
    // A heuristic flag, not a verdict - a human reviewing the contact in GoHighLevel makes the
    // actual call. false/"" on every clean submission so the field is never absent from the
    // payload, the same reasoning as every other audit field above.
    spamSuspected: spamSignals.length > 0,
    spamSignals: spamSignals.join(","),
  };

  const webhookUrl = process.env.GHL_WEBHOOK_URL;

  // From here down, every failure path - a missing webhook URL, a GHL timeout, a non-2xx
  // response, a network error - is something the visitor cannot fix and a retry cannot
  // improve: retrying only risks a duplicate contact once whatever was wrong resolves itself.
  // So every one of them is logged at error level, for a human to recover by hand from the
  // logs, and answered with the same success state a real delivery gets. A visitor who already
  // typed everything should never be asked to solve a GoHighLevel outage.
  if (!webhookUrl) {
    logDroppedSubmission("GHL_WEBHOOK_URL is not configured", submission);
    captureLeadEvent("error", "GHL_WEBHOOK_URL is not configured", result.data);
    return { status: "success", fieldErrors: {} };
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
        result.data,
        { extra: { status: response.status } }
      );
      return { status: "success", fieldErrors: {} };
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown fetch error";
    logDroppedSubmission(reason, submission);
    captureLeadEvent("error", reason, result.data, { error });
    return { status: "success", fieldErrors: {} };
  }

  return { status: "success", fieldErrors: {} };
}
