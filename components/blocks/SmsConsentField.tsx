import { SMS_CONSENT_TEXT_V6 } from "@/lib/contact-schema";

// Splits on the two link phrases so the rendered label turns them into links while the
// concatenation of its text content stays byte-identical to SMS_CONSENT_TEXT_V6 - the
// payload sends that same constant, so the disclaimer the person saw and the one recorded
// as consented-to can never drift apart.
const SMS_CONSENT_LINK_PATTERN = /(our Privacy Policy|Terms of Service)/g;
const SMS_CONSENT_LINK_TARGETS: Record<string, string> = {
  "our Privacy Policy": "/privacy",
  "Terms of Service": "/terms",
};

function renderSmsConsentLabel(text: string) {
  return text.split(SMS_CONSENT_LINK_PATTERN).map((part, index) => {
    const href = SMS_CONSENT_LINK_TARGETS[part];
    if (!href) return part;
    return (
      <a
        key={index}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => event.stopPropagation()}
        className="underline"
      >
        {part}
      </a>
    );
  });
}

/**
 * The one SMS consent checkbox+disclosure block in the codebase - every lead form that
 * collects a phone number imports this rather than rendering its own copy, so there is
 * exactly one place SMS_CONSENT_TEXT_V6, the stopPropagation handling, and the
 * not-required/unchecked-on-load mechanics can live. Each caller is responsible for
 * placing it immediately after its own Phone field and for giving it the same
 * `min-[700px]:col-span-2` treatment Phone gets, inside a `grid-cols-1 min-[700px]:grid-cols-2`
 * wrapper, so the pairing reads as one full-width visual unit.
 */
export default function SmsConsentField() {
  return (
    <div className="min-[700px]:col-span-2 flex items-start gap-3">
      <input
        type="checkbox"
        id="smsConsent"
        name="smsConsent"
        className="consent-checkbox mt-0.5 shrink-0"
      />
      {/* Lead-in and full disclosure both live inside this one <label>, not a separate
          heading above it, so the complete text stays programmatically tied to the
          checkbox via the for/id association - a screen reader announces all of it as
          this control's label, not just the bold first line. */}
      <label htmlFor="smsConsent" className="block">
        <span className="block text-sm font-semibold text-text">Text me about my inquiry</span>
        <span className="mt-1 block text-2xs text-muted">
          {renderSmsConsentLabel(SMS_CONSENT_TEXT_V6)}
        </span>
      </label>
    </div>
  );
}
