/** Matches the shape next.config.ts's redirects() must return — kept local rather than importing Next's internal Redirect type from next/dist. */
export interface RedirectRule {
  source: string;
  destination: string;
  statusCode: number;
}

/**
 * 301 redirect map from the old WordPress site (siteoptz.com) to this build.
 * Single source of truth for both next.config.ts's redirects() and
 * scripts/check-redirects.ts, so the two can never drift apart.
 *
 * Next.js's own `permanent: true` produces a 308 (Permanent Redirect), not a
 * 301 — verified against node_modules/next/dist/lib/redirect-status.js.
 * Every rule here sets `statusCode: 301` explicitly instead, which is what
 * was asked for and is itself an unambiguous permanent-redirect status.
 *
 * The 40 concrete mappings below come from docs/redirect-source-urls.md
 * (the old site's Yoast sitemap export) — see that file and the redirect
 * review conversation for the destination reasoning per URL. The old root
 * "/" is not included: it maps to the same "/" on the new site, and a
 * source-equals-destination rule is a no-op Next.js rejects as a cycle.
 *
 * wp-admin, wp-login.php, and xmlrpc.php are deliberately absent — left to
 * 404, not redirected.
 *
 * Every source below is registered without a trailing slash only. This
 * project uses Next's default `trailingSlash: false`, under which Next
 * normalizes any inbound trailing-slash request (its own 308) *before*
 * custom redirects are evaluated — confirmed by testing "/plans-compare/"
 * directly against a running server, which returns Next's own 308 to
 * "/plans-compare" first, not a rule matching the slash-suffixed source. A
 * redirect rule registered for the slash-suffixed form can therefore never
 * fire and is dead config, not a second, reachable path. Real inbound
 * requests to the old trailing-slash URLs (the old site's actual canonical
 * form) still land correctly — Next's built-in normalization strips the
 * slash first, then the rule below completes the trip — just as two
 * permanent hops (308, then 301) rather than one.
 */
const VERIFIED_MAP: ReadonlyArray<readonly [string, string]> = [
  // page-sitemap.xml
  ["/plans-compare", "/services"],
  ["/partners", "/industries/agency-partners"],
  ["/plans", "/services"],
  ["/ux-ui", "/services/conversion-rate-optimization"],
  ["/earn-backlinks-that-advance-serps-ai-search", "/services/seo"],
  ["/why-us", "/about"],
  ["/speed", "/services/seo"],
  ["/usability", "/services/conversion-rate-optimization"],
  ["/traffic", "/services/top-of-funnel"],
  ["/conversion", "/services/conversion-rate-optimization"],
  ["/ai-seo-service", "/services/generative-engine-optimization"],
  ["/privacy-policy", "/privacy"],
  ["/page-testing", "/services/conversion-rate-optimization"],
  ["/seo-services", "/services/seo"],
  ["/seo-services-for-ecommerce", "/services/seo"],
  ["/seo-services-for-attorneys", "/industries/professional-services-marketing"],
  ["/seo-services-for-travel", "/services/seo"],
  ["/seo-services-for-dentists", "/industries/dental-marketing"],
  ["/automotive-seo-services", "/services/seo"],
  ["/fashion-seo-services-agency", "/services/seo"],
  ["/restaurant-seo-services", "/services/seo"],
  ["/real-estate-seo-services", "/services/seo"],
  ["/seo-services-for-photographers", "/services/seo"],
  ["/plumber-seo-services", "/services/seo"],
  ["/car-dealership-ai-services", "/services/generative-engine-optimization"],
  ["/marketing-attribution-for-healthcare", "/industries/healthcare-marketing"],

  // post-sitemap.xml
  ["/blog", "/point-of-view"],
  ["/seo-for-ai-search-engines", "/point-of-view"],
  ["/is-ai-generated-content-good-for-seo", "/point-of-view"],
  ["/how-can-ai-seo-improve-website-ranking", "/point-of-view"],
  ["/uses-of-artificial-intelligence-in-seo", "/point-of-view"],
  ["/what-effect-does-seo-have-on-your-search", "/point-of-view"],
  ["/is-seo-worth-it-for-small-business", "/point-of-view"],
  ["/what-is-the-difference-between-local-and-organic-seo", "/point-of-view"],
  ["/what-elements-are-foundational-for-seo-with-ai", "/point-of-view"],
  ["/ai-seo-tools", "/point-of-view"],
  ["/ai-for-link-building", "/point-of-view"],

  // category-sitemap.xml
  ["/ai-seo", "/point-of-view"],

  // author-sitemap.xml
  ["/author/ashikurr", "/point-of-view"],
] as const;

const VERIFIED_REDIRECTS: RedirectRule[] = VERIFIED_MAP.map(([source, destination]) => ({
  source,
  destination,
  statusCode: 301,
}));

/**
 * General WordPress patterns for traffic that won't show up as a literal
 * URL in the sitemap export: unlisted category/tag archives, and RSS/Atom
 * feed URLs (site-wide and per-archive/per-post). All land on the same
 * /point-of-view hub the listed blog content and the /ai-seo/ category
 * itself already redirect to. Trailing-slash requests against these are
 * handled the same way as the verified list above — Next's own
 * normalization strips the slash first, then the pattern below matches.
 */
const PATTERN_REDIRECTS: RedirectRule[] = [
  { source: "/category/:slug*", destination: "/point-of-view", statusCode: 301 },
  { source: "/tag/:slug*", destination: "/point-of-view", statusCode: 301 },
  { source: "/feed", destination: "/point-of-view", statusCode: 301 },
  { source: "/:path*/feed", destination: "/point-of-view", statusCode: 301 },
];

export const REDIRECTS: RedirectRule[] = [...VERIFIED_REDIRECTS, ...PATTERN_REDIRECTS];
