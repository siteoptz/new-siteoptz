/**
 * Single source of truth for navigation: all 40 routes from docs/sitemap-seo-plan.md.
 * No hardcoded hrefs anywhere else in the codebase — read routes and links from here.
 */

export type FunnelStage = "tof" | "mof" | "bof" | "cross";
export type PageType = "page" | "hub" | "service" | "index";

export interface RouteEntry {
  path: string;
  label: string;
  shortLabel: string;
  parent: string | null;
  funnelStage: FunnelStage | null;
  pageType: PageType;
  /** 2-4 approved anchor text variants, drawn from this page's H1 vocabulary. */
  anchorVariants: readonly string[];
}

const routes = [
  // Supporting pages
  {
    path: "/",
    label: "Home",
    shortLabel: "Home",
    parent: null,
    funnelStage: null,
    pageType: "page",
    anchorVariants: ["SiteOptz", "marketing intelligence for operators"],
  },
  {
    path: "/how-it-works",
    label: "How It Works",
    shortLabel: "How it works",
    parent: "/",
    funnelStage: null,
    pageType: "page",
    anchorVariants: ["how it works", "our four-stage engagement process", "our process"],
  },
  {
    path: "/about",
    label: "About",
    shortLabel: "About",
    parent: "/",
    funnelStage: null,
    pageType: "page",
    anchorVariants: ["about SiteOptz", "about us"],
  },
  {
    path: "/contact",
    label: "Contact",
    shortLabel: "Contact",
    parent: "/",
    funnelStage: null,
    pageType: "page",
    anchorVariants: ["contact us", "book a call", "get in touch"],
  },
  {
    path: "/privacy",
    label: "Privacy Policy",
    shortLabel: "Privacy",
    parent: "/",
    funnelStage: null,
    pageType: "page",
    anchorVariants: ["privacy policy"],
  },
  {
    path: "/terms",
    label: "Terms of Service",
    shortLabel: "Terms",
    parent: "/",
    funnelStage: null,
    pageType: "page",
    anchorVariants: ["terms of service"],
  },

  // Services — pillar, three funnel hubs, 22 service pages
  {
    path: "/services",
    label: "Services",
    shortLabel: "Services",
    parent: "/",
    funnelStage: null,
    pageType: "index",
    anchorVariants: ["marketing intelligence services", "our services", "what we do"],
  },
  {
    path: "/services/marketing-attribution",
    label: "Marketing Attribution",
    shortLabel: "Attribution",
    parent: "/services",
    funnelStage: "cross",
    pageType: "service",
    anchorVariants: [
      "marketing attribution consulting",
      "attribution built to your revenue system",
      "attribution built to where your revenue is recorded",
    ],
  },

  {
    path: "/services/top-of-funnel",
    label: "Top of Funnel",
    shortLabel: "Top of funnel",
    parent: "/services",
    funnelStage: "tof",
    pageType: "hub",
    anchorVariants: [
      "top of funnel marketing services",
      "reaching people who do not know you yet",
      "top-of-funnel programs",
    ],
  },
  {
    path: "/services/paid-social-advertising",
    label: "Paid Social Advertising",
    shortLabel: "Paid social",
    parent: "/services/top-of-funnel",
    funnelStage: "tof",
    pageType: "service",
    anchorVariants: [
      "paid social advertising agency",
      "paid social measured past the platform's own report",
      "paid social advertising",
    ],
  },
  {
    path: "/services/paid-search-ppc",
    label: "Paid Search (PPC)",
    shortLabel: "Paid search",
    parent: "/services/top-of-funnel",
    funnelStage: "tof",
    pageType: "service",
    anchorVariants: [
      "enterprise PPC management",
      "non-brand paid search judged on booked outcomes",
      "paid search (PPC)",
    ],
  },
  {
    path: "/services/creative-ads-strategy",
    label: "Creative Ads Strategy",
    shortLabel: "Creative strategy",
    parent: "/services/top-of-funnel",
    funnelStage: "tof",
    pageType: "service",
    anchorVariants: [
      "ad creative strategy services",
      "creative as a testable hypothesis",
      "creative ads strategy",
    ],
  },
  {
    path: "/services/campaign-launch-strategy",
    label: "Campaign Launch Strategy",
    shortLabel: "Campaign launch",
    parent: "/services/top-of-funnel",
    funnelStage: "tof",
    pageType: "service",
    anchorVariants: [
      "marketing campaign launch strategy",
      "launches that produce a decision, not a report",
      "campaign launch strategy",
    ],
  },
  {
    path: "/services/seo",
    label: "SEO",
    shortLabel: "SEO",
    parent: "/services/top-of-funnel",
    funnelStage: "tof",
    pageType: "service",
    anchorVariants: [
      "multi-location SEO services",
      "organic visibility measured per location",
      "SEO",
    ],
  },
  {
    path: "/services/generative-engine-optimization",
    label: "Generative Engine Optimization",
    shortLabel: "GEO",
    parent: "/services/top-of-funnel",
    funnelStage: "tof",
    pageType: "service",
    anchorVariants: [
      "generative engine optimization services",
      "what the assistant says when someone asks about you",
      "GEO",
    ],
  },
  {
    path: "/services/answer-engine-optimization",
    label: "Answer Engine Optimization",
    shortLabel: "AEO",
    parent: "/services/top-of-funnel",
    funnelStage: "tof",
    pageType: "service",
    anchorVariants: [
      "answer engine optimization services",
      "being the answer, not the tenth result",
      "AEO",
    ],
  },
  {
    path: "/services/programmatic-advertising",
    label: "Programmatic Advertising",
    shortLabel: "Programmatic",
    parent: "/services/top-of-funnel",
    funnelStage: "tof",
    pageType: "service",
    anchorVariants: [
      "programmatic advertising agency",
      "programmatic with the view-through window closed",
      "programmatic advertising",
    ],
  },
  {
    path: "/services/influencer-marketing",
    label: "Influencer Marketing",
    shortLabel: "Influencer",
    parent: "/services/top-of-funnel",
    funnelStage: "tof",
    pageType: "service",
    anchorVariants: [
      "influencer marketing agency",
      "creator partnerships you can actually attribute",
      "influencer marketing",
    ],
  },
  {
    path: "/services/amazon-non-brand-search",
    label: "Amazon Non-Brand Search",
    shortLabel: "Amazon non-brand",
    parent: "/services/top-of-funnel",
    funnelStage: "tof",
    pageType: "service",
    anchorVariants: [
      "Amazon PPC management agency",
      "Amazon non-brand, reported separately from brand",
      "Amazon non-brand search",
    ],
  },

  {
    path: "/services/middle-of-funnel",
    label: "Middle of Funnel",
    shortLabel: "Middle of funnel",
    parent: "/services",
    funnelStage: "mof",
    pageType: "hub",
    anchorVariants: [
      "middle of funnel marketing services",
      "the stage where most measurement gives up",
      "middle-of-funnel programs",
    ],
  },
  {
    path: "/services/social-media",
    label: "Social Media",
    shortLabel: "Social media",
    parent: "/services/middle-of-funnel",
    funnelStage: "mof",
    pageType: "service",
    anchorVariants: [
      "organic social media management agency",
      "organic social, reported honestly against paid",
      "social media management",
    ],
  },
  {
    path: "/services/content-marketing",
    label: "Content Marketing",
    shortLabel: "Content marketing",
    parent: "/services/middle-of-funnel",
    funnelStage: "mof",
    pageType: "service",
    anchorVariants: [
      "B2B content marketing agency",
      "content measured by the deals it appeared in",
      "content marketing",
    ],
  },
  {
    path: "/services/affiliate-marketing",
    label: "Affiliate Marketing",
    shortLabel: "Affiliate marketing",
    parent: "/services/middle-of-funnel",
    funnelStage: "mof",
    pageType: "service",
    anchorVariants: [
      "affiliate marketing management agency",
      "affiliates that create demand, separated from those intercepting it",
      "affiliate marketing",
    ],
  },
  {
    path: "/services/branded-search-ppc",
    label: "Branded Search (PPC)",
    shortLabel: "Branded search",
    parent: "/services/middle-of-funnel",
    funnelStage: "mof",
    pageType: "service",
    anchorVariants: [
      "branded search PPC management",
      "paying for brand terms, only where it is incremental",
      "branded search (PPC)",
    ],
  },
  {
    path: "/services/amazon-branded-search",
    label: "Amazon Branded Search",
    shortLabel: "Amazon branded",
    parent: "/services/middle-of-funnel",
    funnelStage: "mof",
    pageType: "service",
    anchorVariants: [
      "Amazon brand defense advertising",
      "holding your own listings on Amazon",
      "Amazon branded search",
    ],
  },

  {
    path: "/services/bottom-of-funnel",
    label: "Bottom of Funnel",
    shortLabel: "Bottom of funnel",
    parent: "/services",
    funnelStage: "bof",
    pageType: "hub",
    anchorVariants: [
      "bottom of funnel marketing services",
      "converting the demand you already have",
      "bottom-of-funnel programs",
    ],
  },
  {
    path: "/services/conversion-rate-optimization",
    label: "Conversion Rate Optimization",
    shortLabel: "CRO",
    parent: "/services/bottom-of-funnel",
    funnelStage: "bof",
    pageType: "service",
    anchorVariants: [
      "conversion rate optimization agency",
      "testing that runs long enough to mean something",
      "conversion rate optimization",
    ],
  },
  {
    path: "/services/email-marketing",
    label: "Email Marketing",
    shortLabel: "Email marketing",
    parent: "/services/bottom-of-funnel",
    funnelStage: "bof",
    pageType: "service",
    anchorVariants: [
      "email marketing and lifecycle agency",
      "lifecycle email measured on incremental revenue",
      "email marketing",
    ],
  },
  {
    path: "/services/organic-capture",
    label: "Organic Capture",
    shortLabel: "Organic capture",
    parent: "/services/bottom-of-funnel",
    funnelStage: "bof",
    pageType: "service",
    anchorVariants: [
      "Google Business Profile management",
      "capturing demand at the moment of decision",
      "organic capture",
    ],
  },
  {
    path: "/services/retargeting",
    label: "Retargeting",
    shortLabel: "Retargeting",
    parent: "/services/bottom-of-funnel",
    funnelStage: "bof",
    pageType: "service",
    anchorVariants: [
      "retargeting advertising services",
      "retargeting, with the incrementality question answered",
      "retargeting",
    ],
  },
  {
    path: "/services/partnerships",
    label: "Partnerships",
    shortLabel: "Partnerships",
    parent: "/services/bottom-of-funnel",
    funnelStage: "bof",
    pageType: "service",
    anchorVariants: [
      "strategic marketing partnerships",
      "partnerships with the attribution agreed up front",
      "marketing partnerships",
    ],
  },
  {
    path: "/services/creative-production",
    label: "Creative Production",
    shortLabel: "Creative production",
    parent: "/services/bottom-of-funnel",
    funnelStage: "bof",
    pageType: "service",
    anchorVariants: [
      "creative production services",
      "producing creative at the volume testing requires",
      "creative production",
    ],
  },
  {
    path: "/services/marketing-operations",
    label: "Marketing Operations",
    shortLabel: "Marketing ops",
    parent: "/services/bottom-of-funnel",
    funnelStage: "bof",
    pageType: "service",
    anchorVariants: [
      "marketing operations consulting",
      "the plumbing everything else depends on",
      "marketing operations",
    ],
  },

  // Industries
  {
    path: "/industries",
    label: "Industries",
    shortLabel: "Industries",
    parent: "/",
    funnelStage: null,
    pageType: "index",
    anchorVariants: ["industries we serve", "industries", "who we work with"],
  },
  {
    path: "/industries/healthcare-marketing",
    label: "Healthcare",
    shortLabel: "Healthcare",
    parent: "/industries",
    funnelStage: null,
    pageType: "page",
    anchorVariants: [
      "healthcare marketing",
      "marketing for multi-location healthcare groups",
      "healthcare",
    ],
  },
  {
    path: "/industries/self-storage-marketing",
    label: "Self-Storage",
    shortLabel: "Self-storage",
    parent: "/industries",
    funnelStage: null,
    pageType: "page",
    anchorVariants: [
      "self-storage marketing",
      "marketing for self-storage portfolio operators",
      "self-storage",
    ],
  },
  {
    path: "/industries/professional-services-marketing",
    label: "Professional Services",
    shortLabel: "Professional services",
    parent: "/industries",
    funnelStage: null,
    pageType: "page",
    anchorVariants: [
      "professional services marketing",
      "marketing for professional services firms",
      "professional services",
    ],
  },
  {
    path: "/industries/agency-partners",
    label: "Agency Partners",
    shortLabel: "Agency partners",
    parent: "/industries",
    funnelStage: null,
    pageType: "page",
    anchorVariants: ["agency partners", "partnering with agencies", "agency partnerships"],
  },

  // Proof
  {
    path: "/proof",
    label: "Proof",
    shortLabel: "Proof",
    parent: "/",
    funnelStage: null,
    pageType: "index",
    anchorVariants: ["proof", "client results", "case studies"],
  },

  // Point of view
  {
    path: "/point-of-view",
    label: "Point of View",
    shortLabel: "Point of view",
    parent: "/",
    funnelStage: null,
    pageType: "index",
    anchorVariants: ["point of view", "our point of view", "articles"],
  },
] as const satisfies readonly RouteEntry[];

export type RoutePath = (typeof routes)[number]["path"];

export const ROUTES: readonly RouteEntry[] = routes;

/** Throws on an unknown path rather than returning undefined. */
export function getRoute(path: string): RouteEntry {
  const route = ROUTES.find((entry) => entry.path === path);
  if (!route) {
    throw new Error(`lib/nav: unknown route path "${path}"`);
  }
  return route;
}

/**
 * Service entries in the given funnel stage, in the order listed in the SEO plan.
 * Excludes stage hubs — only pageType 'service' entries.
 */
export function servicesByStage(stage: FunnelStage): RouteEntry[] {
  if (!(["tof", "mof", "bof", "cross"] as const).includes(stage)) {
    throw new Error(`lib/nav: unknown funnel stage "${stage}"`);
  }
  return ROUTES.filter((entry) => entry.pageType === "service" && entry.funnelStage === stage);
}

/**
 * Cannibalization boundary table — section 3 of docs/sitemap-seo-plan.md.
 * Transcribed exactly as authored: the table is intentionally asymmetric in
 * places (e.g. SEO's counterparts are Organic Capture and GEO only, even
 * though AEO separately names SEO as one of its own counterparts).
 */
const BOUNDARY_TABLE: Record<string, readonly string[]> = {
  "paid-search-ppc": ["branded-search-ppc"],
  "branded-search-ppc": ["paid-search-ppc"],
  "amazon-non-brand-search": ["amazon-branded-search"],
  "amazon-branded-search": ["amazon-non-brand-search"],
  "paid-social-advertising": ["retargeting"],
  retargeting: ["paid-social-advertising"],
  "social-media": ["paid-social-advertising"],
  seo: ["organic-capture", "generative-engine-optimization"],
  "generative-engine-optimization": ["answer-engine-optimization", "seo"],
  "answer-engine-optimization": ["generative-engine-optimization", "seo"],
  "organic-capture": ["seo"],
  "creative-ads-strategy": ["creative-production"],
  "creative-production": ["creative-ads-strategy"],
  "content-marketing": ["seo"],
};

/**
 * Counterpart pages for a service slug, from the boundary table above.
 * Returns an array, not a single value — some pages have two counterparts
 * (e.g. SEO has Organic Capture and GEO). Returns an empty array for a valid
 * slug with no declared boundary; throws only when the slug is not a known
 * route at all.
 */
export function counterpartsOf(slug: string): RouteEntry[] {
  // getRoute throws if the slug is not a known route, satisfying the "throw on
  // unknown input" contract even when the slug has no declared boundary below.
  getRoute(`/services/${slug}`);
  const counterpartSlugs = BOUNDARY_TABLE[slug] ?? [];
  return counterpartSlugs.map((counterpartSlug) => getRoute(`/services/${counterpartSlug}`));
}

/** Exactly six services mapped to the given industry — section 5 of the SEO plan. */
const INDUSTRY_SERVICES: Record<string, readonly string[]> = {
  "healthcare-marketing": [
    "marketing-attribution",
    "paid-search-ppc",
    "organic-capture",
    "seo",
    "conversion-rate-optimization",
    "marketing-operations",
  ],
  "self-storage-marketing": [
    "marketing-attribution",
    "paid-search-ppc",
    "organic-capture",
    "seo",
    "retargeting",
    "marketing-operations",
  ],
  "professional-services-marketing": [
    "marketing-attribution",
    "content-marketing",
    "seo",
    "email-marketing",
    "branded-search-ppc",
    "marketing-operations",
  ],
  "agency-partners": [
    "marketing-attribution",
    "marketing-operations",
    "seo",
    "generative-engine-optimization",
    "conversion-rate-optimization",
    "creative-ads-strategy",
  ],
};

export function industryServices(industrySlug: string): RouteEntry[] {
  const services = INDUSTRY_SERVICES[industrySlug];
  if (!services) {
    throw new Error(`lib/nav: unknown industry slug "${industrySlug}"`);
  }
  return services.map((slug) => getRoute(`/services/${slug}`));
}
