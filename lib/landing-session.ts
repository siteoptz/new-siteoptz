// Two sessionStorage keys with two different policies, because the two things they hold
// answer different questions:
//
// so_landing    - first touch. The page someone first arrived on is a fact about the browser
//                 session and should never change, so this is written once (if absent) and
//                 read back on every later page.
// so_ad_params  - last touch. Meta and Google both attribute on last click within their own
//                 window, so a capture that stayed first-touch would disagree with Ads
//                 Manager by construction - an organic visitor retargeted two days later would
//                 record no ad parameters at all, crediting the click that actually produced
//                 the lead to nothing. Overwritten wholesale (never merged field by field)
//                 whenever the current URL carries any ad parameter; left untouched when it
//                 carries none, so a plain navigation to a clean path can't erase a real click.
export const LANDING_KEY = "so_landing";
export const AD_PARAMS_KEY = "so_ad_params";

export const AD_PARAM_NAMES = [
  "fbclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
] as const;

// Every field name the contact form's hidden inputs populate from session storage.
export const SESSION_FIELD_NAMES = ["landingPage", ...AD_PARAM_NAMES, "adParamsSource"] as const;

function emptySessionFields(): Record<string, string> {
  return Object.fromEntries(SESSION_FIELD_NAMES.map((name) => [name, ""]));
}

function readOrWriteLandingPage(): string {
  try {
    const stored = window.sessionStorage.getItem(LANDING_KEY);
    if (stored !== null) return stored;
    const landingPage = `${window.location.pathname}${window.location.search}`;
    window.sessionStorage.setItem(LANDING_KEY, landingPage);
    return landingPage;
  } catch {
    // Private-mode sessionStorage throws on read or write - a thrown field is worse than a
    // missing one, so this just falls back to empty and the server-side Referer fallback
    // takes over.
    return "";
  }
}

function captureAdParams(hadLandingAlready: boolean): void {
  const params = new URLSearchParams(window.location.search);
  const hasAdParam = AD_PARAM_NAMES.some((name) => params.has(name));
  if (!hasAdParam) return;

  const adParams = {
    ...Object.fromEntries(AD_PARAM_NAMES.map((name) => [name, params.get(name) ?? ""])),
    // "landing" when this click produced the very first page of the session (so_landing
    // didn't exist yet when this ran); "mid-session" when it happened on a later page - the
    // distinction between an ad click straight to the form and a returning visitor retargeted
    // mid-browse, which are different funnels worth spending against differently.
    adParamsSource: hadLandingAlready ? "mid-session" : "landing",
  };
  try {
    window.sessionStorage.setItem(AD_PARAMS_KEY, JSON.stringify(adParams));
  } catch {
    // Same reasoning as above - this click's params just don't get recorded.
  }
}

/**
 * Call once per page load. Idempotent: safe to call from every page (so the real landing page
 * and any ad click are captured no matter which page a visitor happens to land on first) and
 * safe to call again later on /contact (so a direct visit to /contact, with no earlier page
 * this session, still captures correctly). Returns the full current session state so the
 * caller can populate hidden form fields directly from it.
 */
export function syncLandingSession(): Record<string, string> {
  let hadLandingAlready = false;
  try {
    hadLandingAlready = window.sessionStorage.getItem(LANDING_KEY) !== null;
  } catch {
    // Unreadable storage either way - the writes below will also fail their own try/catch.
  }

  const landingPage = readOrWriteLandingPage();
  captureAdParams(hadLandingAlready);

  const result = emptySessionFields();
  result.landingPage = landingPage;
  try {
    const stored = window.sessionStorage.getItem(AD_PARAMS_KEY);
    if (stored) Object.assign(result, JSON.parse(stored));
  } catch {
    // Leave the ad-param fields empty.
  }
  return result;
}
