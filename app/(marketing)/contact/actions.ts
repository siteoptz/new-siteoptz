"use server";

import { headers } from "next/headers";
import {
  contactFormSchema,
  type ContactFormFieldErrors,
  type ContactFormState,
  LOCATION_BAND_LABELS,
  SMS_CONSENT_TEXT_V1,
  SPEND_BAND_LABELS,
} from "@/lib/contact-schema";
import { isRateLimited } from "@/lib/rate-limit";

// Below this elapsed time, the form could not have been read and filled by a person.
const MIN_ELAPSED_MS = 2500;
// Generous for a webhook POST and well inside what a person will wait on paid traffic, where a
// stalled "Sending…" spinner after a paid click is the single most expensive place to lose a
// lead in the funnel.
const GHL_TIMEOUT_MS = 5000;

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
  const honeypot = String(formData.get("company_site") ?? "").trim();
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
    console.warn("[contact-spam-trap] flagged submission", {
      signals: spamSignals.join(","),
      honeypotFilled: honeypot.length > 0,
      elapsedMs: Number.isFinite(elapsed) ? elapsed : null,
    });
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
      return { status: "success", fieldErrors: {} };
    }
  } catch (error) {
    logDroppedSubmission(
      error instanceof Error ? error.message : "unknown fetch error",
      submission
    );
    return { status: "success", fieldErrors: {} };
  }

  return { status: "success", fieldErrors: {} };
}
