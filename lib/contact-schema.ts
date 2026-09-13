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

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Enter your name."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your work email.")
    .email("Enter a valid email address."),
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
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type ContactFormFieldErrors = Partial<Record<keyof ContactFormValues, string>>;

export const CONTACT_FIELD_ORDER: (keyof ContactFormValues)[] = [
  "name",
  "email",
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
