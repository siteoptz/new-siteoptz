// Written once per browser session, on whichever page the visitor actually lands on first -
// a Meta or Google landing page, the home page, or /contact directly - and read back
// (never rewritten) on every later page. This is what lets smsConsentLandingPage and the ad
// parameters survive a landing-page -> /contact navigation instead of being overwritten by
// whatever page the form happened to be filled out on.
export const LANDING_SESSION_KEY = "so_landing_session";

export const AD_PARAM_NAMES = [
  "fbclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
] as const;

export const SESSION_FIELD_NAMES = ["landingPage", ...AD_PARAM_NAMES] as const;

export function readOrWriteLandingSession(): Record<string, string> {
  const empty = Object.fromEntries(SESSION_FIELD_NAMES.map((name) => [name, ""]));
  try {
    const stored = window.sessionStorage.getItem(LANDING_SESSION_KEY);
    if (stored) return { ...empty, ...JSON.parse(stored) };

    const params = new URLSearchParams(window.location.search);
    const session = {
      landingPage: `${window.location.pathname}${window.location.search}`,
      ...Object.fromEntries(AD_PARAM_NAMES.map((name) => [name, params.get(name) ?? ""])),
    };
    window.sessionStorage.setItem(LANDING_SESSION_KEY, JSON.stringify(session));
    return session;
  } catch {
    // Private-mode sessionStorage throws on read or write - a thrown consent field is worse
    // than a missing one, so every value falls back to empty and the server-side Referer
    // fallback takes over for the page fields.
    return empty;
  }
}
