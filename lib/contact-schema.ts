import { z } from "zod";

/**
 * Shared between the client component (pre-submit validation, so errors show
 * before a round trip) and the server action (the authoritative check). One
 * schema, so the two can never drift apart.
 */

export const LOCATION_BANDS = ["1", "2-5", "6-20", "21-50", "50+"] as const;

export const LOCATION_BAND_LABELS: Record<(typeof LOCATION_BANDS)[number], string> = {
  "1": "1 location",
  "2-5": "2–5 locations",
  "6-20": "6–20 locations",
  "21-50": "21–50 locations",
  "50+": "50+ locations",
};

export const SPEND_BANDS = ["under-10k", "10k-25k", "25k-75k", "75k-200k", "200k-plus"] as const;

export const SPEND_BAND_LABELS: Record<(typeof SPEND_BANDS)[number], string> = {
  "under-10k": "Under $10k/month",
  "10k-25k": "$10k–$25k/month",
  "25k-75k": "$25k–$75k/month",
  "75k-200k": "$75k–$200k/month",
  "200k-plus": "$200k+/month",
};

/**
 * The exact string shown next to the SMS consent checkbox. Sent verbatim in the webhook
 * payload so a consent record stays resolvable to the wording actually displayed. If this
 * text ever changes, add SMS_CONSENT_TEXT_V2 and leave this one in place rather than editing
 * it in place - old records must keep pointing at what they actually saw.
 */
export const SMS_CONSENT_TEXT_V1 =
  "By checking this box, you agree to receive text messages (i.e. conversational, marketing, promotional, customer care, etc.) from SiteOptz related to our services at the phone number provided above. Message frequency varies. Message and data rates may apply. Reply STOP to opt out of SMS messages or HELP for help. Visit https://siteoptz.com/privacy for our privacy policy and https://siteoptz.com/terms for our Terms of Service.";

/**
 * V2 - the registered business name (as filed on the 10DLC brand registration, not just our
 * own "doing business as" framing) added for 10DLC review, plus the 18+ line that was flagged
 * against /terms but belongs at the point of consent too. The form and the payload reference
 * this one from this commit forward; V1 stays above, unedited, since every consent collected
 * before this change resolves to that exact string.
 */
export const SMS_CONSENT_TEXT_V2 =
  "By checking this box, you agree to receive text messages (i.e. conversational, marketing, promotional, customer care, etc.) from SiteOptz (Vortex Demand, LLC) related to our services at the phone number provided above. You must be 18 or older to consent. Message frequency varies. Message and data rates may apply. Reply STOP to opt out of SMS messages or HELP for help. Visit https://siteoptz.com/privacy for our privacy policy and https://siteoptz.com/terms for our Terms of Service.";

/**
 * V3 - same disclosure as V2, with the two policy links shown as friendly anchor text
 * ("our privacy policy" / "our Terms of Service") instead of the literal URL. The form and
 * the payload reference this one from this commit forward; V1 and V2 stay above, unedited.
 */
export const SMS_CONSENT_TEXT_V3 =
  "By checking this box, you agree to receive text messages (i.e. conversational, marketing, promotional, customer care, etc.) from SiteOptz (Vortex Demand, LLC) related to our services at the phone number provided above. You must be 18 or older to consent. Message frequency varies. Message and data rates may apply. Reply STOP to opt out of SMS messages or HELP for help. Visit our privacy policy and our Terms of Service.";

/**
 * V4 - shortened: drops the message-category parenthetical, the message-frequency sentence,
 * and the HELP option, and links "our Privacy Policy" / "Terms of Service" rather than
 * restating "our" before both. The form and the payload reference this one from this commit
 * forward; V1, V2, and V3 stay above, unedited.
 */
export const SMS_CONSENT_TEXT_V4 =
  "By checking this box, you agree to receive text messages from SiteOptz (Vortex Demand, LLC) related to our services at the phone number provided above. You must be 18 or older to consent. Message and data rates may apply. Reply STOP to opt out of SMS messages. Visit our Privacy Policy, and Terms of Service.";

/**
 * V5 - restores a shortened message-category parenthetical ("conversational, marketing,
 * customer care" - no "promotional") and the message-frequency sentence that V4 dropped,
 * keeping V4's other trims (no HELP option) and its link phrasing unchanged. The form and
 * the payload reference this one from this commit forward; V1 through V4 stay above,
 * unedited.
 */
export const SMS_CONSENT_TEXT_V5 =
  "By checking this box, you agree to receive text messages (i.e. conversational, marketing, customer care, etc) from SiteOptz (Vortex Demand, LLC) related to our services at the phone number provided above. You must be 18 or older to consent. Message frequency varies. Message and data rates may apply. Reply STOP to opt out of SMS messages. Visit our Privacy Policy, and Terms of Service.";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Enter your name."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your work email.")
    .email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .transform((v) => v.replace(/\D/g, ""))
    .refine((d) => d.length === 10 || (d.length === 11 && d.startsWith("1")), {
      message: "Enter a 10-digit US phone number",
    })
    .transform((d) => `+1${d.slice(-10)}`),
  company: z.string().trim().min(1, "Enter your company name."),
  role: z.string().trim().min(1, "Enter your role."),
  locations: z.enum(LOCATION_BANDS, { message: "Select the number of locations." }),
  spend: z.enum(SPEND_BANDS, { message: "Select a monthly marketing spend band." }),
  stack: z
    .string()
    .trim()
    .max(500, "Keep this under 500 characters.")
    .optional()
    .or(z.literal("")),
  goal: z
    .string()
    .trim()
    .min(20, "Give us a couple of sentences - this is the field that matters.")
    .max(2000, "Keep this under 2000 characters."),
  smsConsent: z.boolean(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type ContactFormFieldErrors = Partial<Record<keyof ContactFormValues, string>>;

export const CONTACT_FIELD_ORDER: (keyof ContactFormValues)[] = [
  "name",
  "email",
  "phone",
  "company",
  "role",
  "locations",
  "spend",
  "stack",
  "goal",
];

export const DIRECT_EMAIL = "info@siteoptz.com";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  fieldErrors: ContactFormFieldErrors;
  formError?: string;
  /** True when the lead was captured (logged) but GHL never received it, or the request was throttled. */
  emailFallback?: boolean;
}

export const initialContactFormState: ContactFormState = {
  status: "idle",
  fieldErrors: {},
};
