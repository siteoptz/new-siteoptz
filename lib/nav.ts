/**
 * Single source of truth for navigation: all 44 routes from docs/sitemap-seo-plan.md.
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
  /** One-line description for internal linking blocks (CrossLinks, mega menu). */
  description: string;
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
    description: "Marketing intelligence for operators who need it measured, not promised.",
  },
  {
    path: "/how-it-works",
    label: "How It Works",
    shortLabel: "How it works",
    parent: "/",
    funnelStage: null,
    pageType: "page",
    anchorVariants: ["how it works", "our four-stage engagement process", "our process"],
    description: "The four-stage engagement process, from audit to reporting.",
  },
  {
    path: "/about",
    label: "About",
    shortLabel: "About",
    parent: "/",
    funnelStage: null,
    pageType: "page",
    anchorVariants: ["about SiteOptz", "about us"],
    description: "How the firm is structured, and how we choose clients.",
  },
  {
    path: "/contact",
    label: "Contact",
    shortLabel: "Contact",
    parent: "/",
    funnelStage: null,
    pageType: "page",
    anchorVariants: ["contact us", "book a call", "get in touch"],
    description: "Book a call with a senior person, not a form.",
  },
  {
    path: "/privacy",
    label: "Privacy Policy",
    shortLabel: "Privacy",
    parent: "/",
    funnelStage: null,
    pageType: "page",
    anchorVariants: ["privacy policy"],
    description: "How we handle data, plainly stated.",
  },
  {
    path: "/terms",
    label: "Terms of Service",
    shortLabel: "Terms",
    parent: "/",
    funnelStage: null,
    pageType: "page",
    anchorVariants: ["terms of service"],
    description: "The terms governing use of this site and our services.",
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
    description: "Three funnel stages and the attribution layer underneath them.",
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
    description: "Attribution built to your revenue system, not the ad platform's.",
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
    description: "Nine programs for reaching people who do not know you yet.",
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
    description: "Prospecting campaigns measured past the platform's own report.",
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
    description: "Non-brand paid search judged on booked outcomes.",
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
    description: "Creative built as a set of testable hypotheses.",
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
    description: "Launch plans with measurement built in from day one.",
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
    description: "Non-brand organic visibility measured per location.",
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
    description: "What AI assistants say when someone asks about you.",
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
    description: "Structuring content to be the direct answer, not the tenth result.",
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
    description: "Display, CTV, and audio bought with the view-through window closed.",
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
    description: "Creator partnerships with tracked attribution, not screenshots.",
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
    description: "Four programs for people who know you and have not decided yet.",
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
    description: "Organic presence and community, reported honestly against paid.",
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
    description: "Editorial measured by the deals it appeared in.",
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
    description: "Program management with last-click inflation removed.",
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
    description: "Defending brand terms, only where it is incremental.",
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
    description: "Seven programs for converting demand that already exists.",
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
    description: "Testing run long enough, on real traffic, to mean something.",
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
    description: "Lifecycle programs measured on incremental revenue.",
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
    description: "Capturing branded and local demand at the moment of decision.",
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
    description: "Re-engagement campaigns with the incrementality question answered.",
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
    description: "Referral and co-marketing programs with attribution agreed up front.",
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
    description: "Producing the volume of assets modern paid media consumes.",
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
    description: "Stack consolidation and the plumbing everything else depends on.",
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
    description: "The four verticals we build for, and how each is measured.",
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
    description: "Multi-location healthcare marketing, measured per site.",
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
    description: "Self-storage portfolio marketing, measured per facility.",
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
    description: "Marketing for professional services firms that sell on trust.",
  },
  {
    path: "/industries/agency-partners",
    label: "Agency Partners",
    shortLabel: "Agency partners",
    parent: "/industries",
    funnelStage: null,
    pageType: "page",
    anchorVariants: ["agency partners", "partnering with agencies", "agency partnerships"],
    description: "A measurement layer agencies can put behind their own name.",
  },
  {
    path: "/industries/finance-banking",
    label: "Finance & Banking",
    shortLabel: "Finance & banking",
    parent: "/industries",
    funnelStage: null,
    pageType: "page",
    anchorVariants: [
      "financial services marketing",
      "marketing measured to the funded account",
      "finance and banking",
    ],
    description: "Bank and credit union marketing, measured to the funded account.",
  },
  {
    path: "/industries/manufacturing",
    label: "Manufacturing",
    shortLabel: "Manufacturing",
    parent: "/industries",
    funnelStage: null,
    pageType: "page",
    anchorVariants: [
      "manufacturing marketing",
      "attribution across a distributor channel",
      "manufacturing",
    ],
    description: "Industrial B2B marketing, measured through a distributor channel.",
  },
  {
    path: "/industries/transportation-logistics",
    label: "Transportation & Logistics",
    shortLabel: "Transportation & logistics",
    parent: "/industries",
    funnelStage: null,
    pageType: "page",
    anchorVariants: [
      "logistics marketing",
      "marketing measured to the booked load",
      "transportation and logistics",
    ],
    description: "Freight and logistics marketing, measured to the booked load.",
  },
  {
    path: "/industries/energy-utilities",
    label: "Energy & Utilities",
    shortLabel: "Energy & utilities",
    parent: "/industries",
    funnelStage: null,
    pageType: "page",
    anchorVariants: [
      "energy marketing",
      "measurement for a permit-bound sales cycle",
      "energy and utilities",
    ],
    description: "Energy and utilities marketing, measured through a permit-bound cycle.",
  },
  {
    path: "/industries/education",
    label: "Education",
    shortLabel: "Education",
    parent: "/industries",
    funnelStage: null,
    pageType: "page",
    anchorVariants: [
      "education marketing",
      "marketing measured to enrolled, not inquired",
      "education",
    ],
    description: "Enrollment marketing, measured to enrolled, not inquired.",
  },
  {
    path: "/industries/legal",
    label: "Legal",
    shortLabel: "Legal",
    parent: "/industries",
    funnelStage: null,
    pageType: "page",
    anchorVariants: ["law firm marketing", "measurement to the signed case", "legal"],
    description: "Law firm marketing, measured to the signed case.",
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
    description: "Client results, sourced and approved before they are published.",
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
    description: "Where we argue a position on measurement, not just publish updates.",
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
  partnerships: ["affiliate-marketing"],
  "affiliate-marketing": ["partnerships"],
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
  "finance-banking": [
    "marketing-attribution",
    "paid-search-ppc",
    "content-marketing",
    "branded-search-ppc",
    "marketing-operations",
    "conversion-rate-optimization",
  ],
  manufacturing: [
    "marketing-attribution",
    "seo",
    "content-marketing",
    "paid-search-ppc",
    "marketing-operations",
    "email-marketing",
  ],
  "transportation-logistics": [
    "marketing-attribution",
    "paid-search-ppc",
    "seo",
    "organic-capture",
    "marketing-operations",
    "conversion-rate-optimization",
  ],
  "energy-utilities": [
    "marketing-attribution",
    "seo",
    "content-marketing",
    "paid-search-ppc",
    "marketing-operations",
    "organic-capture",
  ],
  education: [
    "marketing-attribution",
    "paid-search-ppc",
    "paid-social-advertising",
    "seo",
    "email-marketing",
    "conversion-rate-optimization",
  ],
  legal: [
    "marketing-attribution",
    "paid-search-ppc",
    "seo",
    "organic-capture",
    "conversion-rate-optimization",
    "branded-search-ppc",
  ],
};

export function industryServices(industrySlug: string): RouteEntry[] {
  const services = INDUSTRY_SERVICES[industrySlug];
  if (!services) {
    throw new Error(`lib/nav: unknown industry slug "${industrySlug}"`);
  }
  return services.map((slug) => getRoute(`/services/${slug}`));
}

/**
 * All individual industry pages, in ROUTES order — every entry whose parent
 * is /industries, which excludes the /industries hub itself. The mega menu
 * and footer both build their Industries list from this rather than a
 * hardcoded set of getRoute() calls, so a new industry only needs adding
 * here, not in every place that lists them.
 */
export function industriesList(): RouteEntry[] {
  return ROUTES.filter((entry) => entry.parent === "/industries");
}
