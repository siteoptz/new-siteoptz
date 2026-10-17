"use server";

import {
  contactFormSchema,
  type ContactFormFieldErrors,
  type ContactFormState,
  LOCATION_BAND_LABELS,
  SMS_CONSENT_TEXT_V6,
  SPEND_BAND_LABELS,
} from "@/lib/contact-schema";
import {
  buildCommonEnvelope,
  captureLeadEvent,
  clampField,
  computeSpamSignals,
  getClientIp,
  isRateLimited,
  postToGhl,
} from "@/lib/lead-submission";

/** This entry point's own lead context for Sentry - name/email/phone/company/goal, the same five keys this form has always alerted on. */
function leadContext(formData: FormData): Record<string, string> {
  return {
    name: clampField(formData.get("name")),
    email: clampField(formData.get("email")),
    phone: clampField(formData.get("phone")),
    company: clampField(formData.get("company")),
    goal: clampField(formData.get("goal")),
  };
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const spamSignals = computeSpamSignals(formData);

  if (spamSignals.signals.length > 0) {
    const signalList = spamSignals.signals.join(",");
    console.warn("[contact-spam-trap] flagged submission", {
      signals: signalList,
      honeypotFilled: spamSignals.honeypotFilled,
      elapsedMs: spamSignals.elapsedMs,
    });
    // A separate, lower-severity event from the webhook-failure captures below - this fires
    // on the signal alone, independent of whether the submission goes on to deliver
    // successfully, so it stays distinguishable in the inbox rather than folded into "a
    // delivery failed." Raw formData here, not the Zod-parsed result: this must fire even if
    // the submission is otherwise invalid, since spam-flagged-and-invalid is still a human
    // worth a two-second look, not a reason to lose the alert.
    captureLeadEvent(
      "warning",
      "Contact form submission flagged as possible spam",
      leadContext(formData),
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

  const envelope = await buildCommonEnvelope(formData, ip, spamSignals);

  const submission = {
    ...result.data,
    locationsLabel: LOCATION_BAND_LABELS[result.data.locations],
    spendLabel: SPEND_BAND_LABELS[result.data.spend],
    // Unchanged - already mapped in GoHighLevel and stored on every lead collected to date.
    source: "siteoptz.com/contact",
    smsConsentText: SMS_CONSENT_TEXT_V6,
    // Fields the dental landing page form collects and this one doesn't - present as "" so
    // the one shared GHL webhook always sees every key on every payload, regardless of which
    // form sent it. See app/(lp)/dental/actions.ts for the mirror image of this.
    practiceName: "",
    note: "",
    ...envelope,
  };

  await postToGhl(submission, leadContext(formData));

  return { status: "success", fieldErrors: {} };
}
