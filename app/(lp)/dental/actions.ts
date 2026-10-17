"use server";

import {
  type DentalLpFormFieldErrors,
  type DentalLpFormState,
  dentalLpFormSchema,
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

/** This entry point's own lead context for Sentry - name/email/phone/practiceName/spend, the two fields that make a dropped dental lead recoverable and worth recovering, in place of the main form's company/goal. */
function leadContext(formData: FormData): Record<string, string> {
  return {
    name: clampField(formData.get("name")),
    email: clampField(formData.get("email")),
    phone: clampField(formData.get("phone")),
    practiceName: clampField(formData.get("practiceName")),
    spend: clampField(formData.get("spend")),
  };
}

export async function submitDentalLpForm(
  _prevState: DentalLpFormState,
  formData: FormData
): Promise<DentalLpFormState> {
  const spamSignals = computeSpamSignals(formData);

  if (spamSignals.signals.length > 0) {
    const signalList = spamSignals.signals.join(",");
    console.warn("[dental-lp-spam-trap] flagged submission", {
      signals: signalList,
      honeypotFilled: spamSignals.honeypotFilled,
      elapsedMs: spamSignals.elapsedMs,
    });
    captureLeadEvent(
      "warning",
      "Dental landing page submission flagged as possible spam",
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

  const rawLocations = formData.get("locations");
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    practiceName: formData.get("practiceName"),
    spend: formData.get("spend"),
    locations: rawLocations === "" ? undefined : rawLocations,
    note: formData.get("note"),
    smsConsent: formData.get("smsConsent") === "on",
  };

  const result = dentalLpFormSchema.safeParse(raw);

  if (!result.success) {
    const flattened = result.error.flatten().fieldErrors;
    const fieldErrors: DentalLpFormFieldErrors = {};
    for (const [key, messages] of Object.entries(flattened)) {
      if (messages && messages.length > 0) {
        fieldErrors[key as keyof DentalLpFormFieldErrors] = messages[0];
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
    locationsLabel: result.data.locations ? LOCATION_BAND_LABELS[result.data.locations] : "",
    spendLabel: SPEND_BAND_LABELS[result.data.spend],
    source: "dental.siteoptz.com",
    smsConsentText: SMS_CONSENT_TEXT_V6,
    // Fields the main contact form collects and this one doesn't - present as "" so the one
    // shared GHL webhook always sees every key on every payload, regardless of which form
    // sent it. See app/(marketing)/contact/actions.ts for the mirror image of this.
    company: "",
    role: "",
    stack: "",
    goal: "",
    ...envelope,
  };

  await postToGhl(submission, leadContext(formData));

  return { status: "success", fieldErrors: {} };
}
