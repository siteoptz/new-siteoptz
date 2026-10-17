"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitDentalLpForm } from "@/app/(lp)/dental/actions";
import LeadFormHiddenFields from "@/components/blocks/LeadFormHiddenFields";
import SmsConsentField from "@/components/blocks/SmsConsentField";
import FormField from "@/components/ui/FormField";
import {
  dentalLpFormSchema,
  type DentalLpFormFieldErrors,
  DENTAL_LP_FIELD_ORDER,
  DIRECT_EMAIL,
  initialDentalLpFormState,
  LOCATION_BAND_LABELS,
  LOCATION_BANDS,
  SPEND_BAND_LABELS,
  SPEND_BANDS,
} from "@/lib/contact-schema";

const INPUT_CLASSES =
  "block w-full rounded-default border bg-raised px-3 py-2 text-base text-text placeholder:text-muted";

function inputClasses(hasError: boolean) {
  return `${INPUT_CLASSES} ${hasError ? "border-danger" : "border-field-border"}`;
}

const CALENDAR_URL = "https://api.leadconnectorhq.com/widget/bookings/siteoptz-calendar";

/**
 * dental.siteoptz.com's own form - instruction 23a. Deliberately not a second, parallel
 * implementation of ContactForm: same consent component, same hidden-fields component, same
 * server-action contract shape, same honeypot/elapsed/Sentry/webhook pipeline underneath
 * (see lib/lead-submission.ts). Only the field set and the server action it posts to differ.
 */
export default function DentalLpForm() {
  const [state, formAction, isPending] = useActionState(
    submitDentalLpForm,
    initialDentalLpFormState
  );
  const [clientErrors, setClientErrors] = useState<DentalLpFormFieldErrors>({});
  const [clientFormError, setClientFormError] = useState<string | null>(null);
  const confirmationRef = useRef<HTMLHeadingElement>(null);

  const displayedErrors = Object.keys(clientErrors).length > 0 ? clientErrors : state.fieldErrors;
  const formErrorMessage = state.status === "error" ? state.formError : clientFormError;
  const showEmailFallback = state.status === "error" && state.emailFallback;

  useEffect(() => {
    const firstInvalidField = DENTAL_LP_FIELD_ORDER.find((field) => displayedErrors[field]);
    if (firstInvalidField) {
      document.getElementById(firstInvalidField)?.focus();
    }
  }, [displayedErrors]);

  useEffect(() => {
    if (state.status === "success") {
      confirmationRef.current?.focus();
    }
  }, [state.status]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
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
      event.preventDefault();
      const flattened = result.error.flatten().fieldErrors;
      const errors: DentalLpFormFieldErrors = {};
      for (const [key, messages] of Object.entries(flattened)) {
        if (messages && messages.length > 0) {
          errors[key as keyof DentalLpFormFieldErrors] = messages[0];
        }
      }
      setClientErrors(errors);
      setClientFormError("Fix the highlighted fields and try again.");
    } else {
      setClientErrors({});
      setClientFormError(null);
    }
  }

  if (state.status === "success") {
    return (
      <div>
        <div className="border border-accent bg-accent/10 px-4 py-3">
          <h2 ref={confirmationRef} tabIndex={-1} className="text-accent">
            Your audit request is in.
          </h2>
        </div>
        <div className="mt-6 flex flex-col gap-4 text-muted">
          <p>We&rsquo;ll review your accounts and come back within one business day.</p>
          <p>
            That review needs read-only access to your ad accounts - we&rsquo;ll reach out with
            exactly what to share, same as stated above.
          </p>
          <p>
            Want to pick a time now instead of waiting to hear back?{" "}
            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:text-accent-lt"
            >
              Book a slot on our calendar
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div aria-live="assertive" role="alert">
        {formErrorMessage ? (
          <div className="border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">
            <p>{formErrorMessage}</p>
            {showEmailFallback ? (
              <p className="mt-1">
                Nothing is lost - email your details directly to{" "}
                <a href={`mailto:${DIRECT_EMAIL}`} className="underline">
                  {DIRECT_EMAIL}
                </a>{" "}
                and we&rsquo;ll pick it up from there.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <LeadFormHiddenFields />

      <div className="grid grid-cols-1 gap-5 min-[700px]:grid-cols-2">
        <FormField id="name" label="Name" required error={displayedErrors.name}>
          {(props) => (
            <input {...props} type="text" name="name" required className={inputClasses(!!displayedErrors.name)} />
          )}
        </FormField>

        <FormField id="email" label="Work email" required error={displayedErrors.email}>
          {(props) => (
            <input {...props} type="email" name="email" required className={inputClasses(!!displayedErrors.email)} />
          )}
        </FormField>

        <div className="min-[700px]:col-span-2">
          <FormField id="phone" label="Phone" required error={displayedErrors.phone}>
            {(props) => (
              <input
                {...props}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                name="phone"
                required
                className={inputClasses(!!displayedErrors.phone)}
              />
            )}
          </FormField>
        </div>

        <SmsConsentField />

        <FormField id="practiceName" label="Practice name" required error={displayedErrors.practiceName}>
          {(props) => (
            <input
              {...props}
              type="text"
              name="practiceName"
              required
              className={inputClasses(!!displayedErrors.practiceName)}
            />
          )}
        </FormField>

        <FormField id="spend" label="Monthly ad spend" required error={displayedErrors.spend}>
          {(props) => (
            <select {...props} name="spend" required defaultValue="" className={inputClasses(!!displayedErrors.spend)}>
              <option value="" disabled>
                Select one
              </option>
              {SPEND_BANDS.map((band) => (
                <option key={band} value={band}>
                  {SPEND_BAND_LABELS[band]}
                </option>
              ))}
            </select>
          )}
        </FormField>

        <FormField id="locations" label="Number of locations" optional error={displayedErrors.locations}>
          {(props) => (
            <select {...props} name="locations" defaultValue="" className={inputClasses(!!displayedErrors.locations)}>
              <option value="">Prefer not to say</option>
              {LOCATION_BANDS.map((band) => (
                <option key={band} value={band}>
                  {LOCATION_BAND_LABELS[band]}
                </option>
              ))}
            </select>
          )}
        </FormField>

        <div className="min-[700px]:col-span-2">
          <FormField id="note" label="Anything we should know?" optional error={displayedErrors.note}>
            {(props) => (
              <textarea {...props} name="note" rows={4} className={inputClasses(!!displayedErrors.note)} />
            )}
          </FormField>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-default border border-accent bg-accent px-6 py-3 font-sans text-sm font-medium text-[#1A1008] transition-[background-color] duration-[120ms] hover:border-accent-lt hover:bg-accent-lt disabled:pointer-events-none disabled:opacity-60"
        >
          {isPending ? "Sending…" : "Get my free audit"}
        </button>
      </div>
    </form>
  );
}
