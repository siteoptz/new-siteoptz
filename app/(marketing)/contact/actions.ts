"use server";

import { headers } from "next/headers";
import {
  contactFormSchema,
  type ContactFormFieldErrors,
  type ContactFormState,
  LOCATION_BAND_LABELS,
  SPEND_BAND_LABELS,
} from "@/lib/contact-schema";
import { isRateLimited } from "@/lib/rate-limit";

// Below this elapsed time, the form could not have been read and filled by a person.
const MIN_ELAPSED_MS = 2500;
const GHL_TIMEOUT_MS = 8000;

async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  return headerList.get("x-real-ip") ?? "unknown";
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

  // Both traps fail closed: a filled honeypot or an implausible timestamp is treated as a
  // bot, logged, and answered with the same confirmation a real submission gets, so a
  // scripted sender has no signal telling it what tripped.
  if (honeypot.length > 0 || !Number.isFinite(loadedAt) || elapsed < MIN_ELAPSED_MS) {
    console.warn("[contact-spam-trap] rejected submission", {
      honeypotFilled: honeypot.length > 0,
      elapsedMs: Number.isFinite(elapsed) ? elapsed : null,
    });
    return { status: "success", fieldErrors: {} };
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
    company: formData.get("company"),
    role: formData.get("role"),
    locations: formData.get("locations"),
    spend: formData.get("spend"),
    stack: formData.get("stack"),
    goal: formData.get("goal"),
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

  const submission = {
    ...result.data,
    locationsLabel: LOCATION_BAND_LABELS[result.data.locations],
    spendLabel: SPEND_BAND_LABELS[result.data.spend],
    submittedAt: new Date().toISOString(),
    source: "siteoptz.com/contact",
  };

  const webhookUrl = process.env.GHL_WEBHOOK_URL;

  if (!webhookUrl) {
    logDroppedSubmission("GHL_WEBHOOK_URL is not configured", submission);
    return {
      status: "error",
      fieldErrors: {},
      formError: `We couldn't submit this automatically.`,
      emailFallback: true,
    };
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
      return {
        status: "error",
        fieldErrors: {},
        formError: `We couldn't submit this automatically.`,
        emailFallback: true,
      };
    }
  } catch (error) {
    logDroppedSubmission(
      error instanceof Error ? error.message : "unknown fetch error",
      submission
    );
    return {
      status: "error",
      fieldErrors: {},
      formError: `We couldn't submit this automatically.`,
      emailFallback: true,
    };
  }

  return { status: "success", fieldErrors: {} };
}
