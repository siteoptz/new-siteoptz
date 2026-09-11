"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitContactForm } from "@/app/(marketing)/contact/actions";
import FormField from "@/components/ui/FormField";
import {
  CONTACT_FIELD_ORDER,
  contactFormSchema,
  type ContactFormFieldErrors,
  DIRECT_EMAIL,
  initialContactFormState,
  LOCATION_BAND_LABELS,
  LOCATION_BANDS,
  SPEND_BAND_LABELS,
  SPEND_BANDS,
} from "@/lib/contact-schema";

const INPUT_CLASSES =
  "block w-full rounded-default border bg-paper px-3 py-2 text-base text-ink placeholder:text-muted";

function inputClasses(hasError: boolean) {
  return `${INPUT_CLASSES} ${hasError ? "border-danger" : "border-rule"}`;
}

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialContactFormState);
  const [clientErrors, setClientErrors] = useState<ContactFormFieldErrors>({});
  const [clientFormError, setClientFormError] = useState<string | null>(null);
  const loadedAtInputRef = useRef<HTMLInputElement>(null);
  const confirmationRef = useRef<HTMLHeadingElement>(null);

  const displayedErrors = Object.keys(clientErrors).length > 0 ? clientErrors : state.fieldErrors;
  const formErrorMessage = state.status === "error" ? state.formError : clientFormError;
  const showEmailFallback = state.status === "error" && state.emailFallback;

  useEffect(() => {
    // Set once on mount, client-only — a server-rendered timestamp would race the browser's
    // own render and make the trap fire (or fail to) for reasons unrelated to submission speed.
    if (loadedAtInputRef.current) {
      loadedAtInputRef.current.value = String(Date.now());
    }
  }, []);

  useEffect(() => {
    const firstInvalidField = CONTACT_FIELD_ORDER.find((field) => displayedErrors[field]);
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
      event.preventDefault();
      const flattened = result.error.flatten().fieldErrors;
      const errors: ContactFormFieldErrors = {};
      for (const [key, messages] of Object.entries(flattened)) {
        if (messages && messages.length > 0) {
          errors[key as keyof ContactFormFieldErrors] = messages[0];
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
        <h2 ref={confirmationRef} tabIndex={-1}>
          Your submission is in.
        </h2>
        <ol className="mt-6 flex flex-col gap-5">
          <li>
            <p className="font-display text-md font-semibold">
              1. A senior person reads it — within one business day
            </p>
            <p className="mt-1 text-muted">
              Not a queue and not a sales development rep. Whoever would run the engagement reads
              what you sent.
            </p>
          </li>
          <li>
            <p className="font-display text-md font-semibold">
              2. You hear back with one of two things
            </p>
            <p className="mt-1 text-muted">
              A specific time to talk, or a direct referral elsewhere if what you described isn&rsquo;t
              a fit for what we do.
            </p>
          </li>
          <li>
            <p className="font-display text-md font-semibold">3. The first call is 30 minutes</p>
            <p className="mt-1 text-muted">
              What you can currently measure, what you can&rsquo;t, and whether a measurement audit
              is the right place to start.
            </p>
          </li>
          <li>
            <p className="font-display text-md font-semibold">4. If we&rsquo;re not the right fit</p>
            <p className="mt-1 text-muted">
              We say so on that call, directly, rather than stringing out a proposal for an
              engagement we don&rsquo;t think will work.
            </p>
          </li>
        </ol>
      </div>
    );
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div aria-live="assertive" role="alert">
        {formErrorMessage ? (
          <div className="border border-danger bg-[rgba(185,28,28,0.06)] px-4 py-3 text-sm text-danger">
            <p>{formErrorMessage}</p>
            {showEmailFallback ? (
              <p className="mt-1">
                Nothing is lost — email your details directly to{" "}
                <a href={`mailto:${DIRECT_EMAIL}`} className="underline">
                  {DIRECT_EMAIL}
                </a>{" "}
                and we&rsquo;ll pick it up from there.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Hidden from sighted users and screen readers alike; a bot that fills every field trips it. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="company_site">Company site</label>
        <input type="text" id="company_site" name="company_site" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="loaded_at" ref={loadedAtInputRef} defaultValue="" />

      <div className="grid grid-cols-1 gap-5 min-[700px]:grid-cols-2">
        <FormField id="name" label="Name" error={displayedErrors.name}>
          {(props) => <input {...props} type="text" name="name" required className={inputClasses(!!displayedErrors.name)} />}
        </FormField>

        <FormField id="email" label="Work email" error={displayedErrors.email}>
          {(props) => (
            <input {...props} type="email" name="email" required className={inputClasses(!!displayedErrors.email)} />
          )}
        </FormField>

        <FormField id="company" label="Company" error={displayedErrors.company}>
          {(props) => (
            <input {...props} type="text" name="company" required className={inputClasses(!!displayedErrors.company)} />
          )}
        </FormField>

        <FormField id="role" label="Role" error={displayedErrors.role}>
          {(props) => <input {...props} type="text" name="role" required className={inputClasses(!!displayedErrors.role)} />}
        </FormField>

        <FormField id="locations" label="Number of locations" error={displayedErrors.locations}>
          {(props) => (
            <select {...props} name="locations" required defaultValue="" className={inputClasses(!!displayedErrors.locations)}>
              <option value="" disabled>
                Select one
              </option>
              {LOCATION_BANDS.map((band) => (
                <option key={band} value={band}>
                  {LOCATION_BAND_LABELS[band]}
                </option>
              ))}
            </select>
          )}
        </FormField>

        <FormField id="spend" label="Monthly marketing spend" error={displayedErrors.spend}>
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

        <div className="min-[700px]:col-span-2">
          <FormField
            id="stack"
            label="Current stack"
            optional
            hint="Ad platforms, CRM or EMR, call tracking — whatever's already in place."
            error={displayedErrors.stack}
          >
            {(props) => (
              <input {...props} type="text" name="stack" className={inputClasses(!!displayedErrors.stack)} />
            )}
          </FormField>
        </div>

        <div className="min-[700px]:col-span-2">
          <FormField
            id="goal"
            label="What are you trying to measure?"
            error={displayedErrors.goal}
          >
            {(props) => (
              <textarea
                {...props}
                name="goal"
                required
                rows={5}
                placeholder="E.g. which of our six clinics' paid search spend is actually producing booked patients, not just form fills."
                className={inputClasses(!!displayedErrors.goal)}
              />
            )}
          </FormField>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-default border border-blue-600 bg-blue-600 px-6 py-3 font-sans text-sm font-medium text-white transition-[background-color] duration-[120ms] hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-60"
        >
          {isPending ? "Sending…" : "Send"}
        </button>
      </div>
    </form>
  );
}
