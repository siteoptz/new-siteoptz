import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { z } from "zod";
import { LINK_EXEMPTION_CATEGORIES } from "./link-exemptions";
import { createArticleMdxComponents, servicesMdxComponents } from "./mdx-components";
import { counterpartsOf, getRoute } from "./nav";
import { slugifyHeading } from "./slugify";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

const summaryWordCount = (value: string) => {
  const count = wordCount(value);
  return count >= 60 && count <= 80;
};

/** ~100-word summary rendered on the industries hub — spec calls for "100-word summaries". */
const industrySummaryWordCount = (value: string) => {
  const count = wordCount(value);
  return count >= 85 && count <= 120;
};

const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const ctaSchema = z.object({
  heading: z.string(),
  body: z.string(),
});

const linkExemptionSchema = z.object({
  category: z.enum(LINK_EXEMPTION_CATEGORIES),
  reason: z.string(),
});

const servicesFrontmatterBaseSchema = z.object({
  title: z.string().max(60),
  description: z.string().max(155),
  /**
   * The on-page h1, distinct from `title` (which carries the " | SiteOptz"
   * meta-title suffix). Every page spec in the SEO plan gives these as two
   * different strings — not in Instruction 2.1's field list, but required
   * for PageHero to render the actual spec'd H1 instead of the meta title.
   */
  h1: z.string(),
  primaryKeyword: z.string(),
  secondaryKeywords: z.array(z.string()),
  pageType: z.enum(["hub", "service"]),
  funnelStage: z.enum(["tof", "mof", "bof", "cross"]),
  summary: z.string().refine(summaryWordCount, "summary must be 60-80 words"),
  counterpartSlugs: z.array(z.string()).default([]),
  /** Funnel stage name in sentence case, rendered as PageHero's kicker. */
  heroKicker: z.string(),
  /** PageHero's lead paragraph — capped at 46ch by the component, not here. */
  lead: z.string(),
  /**
   * Boundary statement prose, 60-100 words. Required if and only if the
   * slug appears in lib/nav.ts's boundary table — checked in loadEntry
   * against counterpartsOf(slug), not against funnelStage or pageType. The
   * boundary table has 14 entries against 22 non-pillar service pages;
   * eight legitimately have no counterpart.
   */
  boundary: z.string().optional(),
  /** 4-6 entries. Omitted on hubs. */
  faq: z.array(faqItemSchema).optional(),
  /** Exactly 3 route paths, validated against lib/nav.ts. Omitted on hubs. */
  crossLinks: z.array(z.string()).optional(),
  /**
   * Records a deliberate, reported gap in the link-composition gate rather
   * than tolerating a silent one. content-check.ts treats an exempted
   * category as satisfied and prints the reason on every run, so the
   * exemption stays visible instead of living in someone's memory.
   */
  linkExemptions: z.array(linkExemptionSchema).optional(),
  cta: ctaSchema,
  publishedAt: z.string(),
  updatedAt: z.string(),
});

export const servicesFrontmatterSchema = servicesFrontmatterBaseSchema.superRefine((data, ctx) => {
  if (data.pageType !== "service") return;

  // Boundary/counterpartSlugs requirement is data-driven against
  // lib/nav.ts's boundary table (via the slug), not against funnelStage —
  // checked separately in loadEntry, where the slug is available.

  if (!data.faq || data.faq.length < 4 || data.faq.length > 6) {
    ctx.addIssue({
      code: "custom",
      path: ["faq"],
      message: "service pages require 4-6 faq entries",
    });
  }

  if (!data.crossLinks || data.crossLinks.length !== 3) {
    ctx.addIssue({
      code: "custom",
      path: ["crossLinks"],
      message: "service pages require exactly 3 crossLinks",
    });
  }
});
export type ServiceFrontmatter = z.infer<typeof servicesFrontmatterBaseSchema>;

export const industriesFrontmatterSchema = z.object({
  title: z.string().max(60),
  description: z.string().max(155),
  /** The on-page h1, distinct from `title` — same reasoning as the services schema. */
  h1: z.string(),
  primaryKeyword: z.string(),
  secondaryKeywords: z.array(z.string()),
  /** Rendered as PageHero's kicker — "Industries" for every entry. */
  heroKicker: z.string(),
  /** PageHero's lead paragraph. */
  lead: z.string(),
  /** ~100-word summary, rendered on the /industries hub — not duplicated into the hub's own copy. */
  summary: z.string().refine(industrySummaryWordCount, "summary must be 85-120 words"),
  /** 4-6 entries, matching the services schema's FAQ shape. */
  faq: z.array(faqItemSchema).min(4).max(6),
  cta: ctaSchema,
  publishedAt: z.string(),
  updatedAt: z.string(),
  /**
   * No serviceSlugs field: the six mapped services come from lib/nav.ts's
   * industryServices(slug), the single source of truth for that mapping,
   * rather than a second copy of it validated here.
   */
});
export type IndustryFrontmatter = z.infer<typeof industriesFrontmatterSchema>;

const metricTableColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  numeric: z.boolean().optional(),
});

/** Mirrors MetricTableProps, minus the JSX — `source` is required here, unlike the component's own optional prop, because a proof entry's numbers are never structural-only. */
const metricTableDataSchema = z.object({
  caption: z.string(),
  columns: z.array(metricTableColumnSchema),
  rows: z.array(z.record(z.string(), z.union([z.string(), z.number()]))),
  source: z.string(),
});

const proofTimelineEntrySchema = z.object({
  label: z.string(),
  description: z.string(),
});

const proofQuoteSchema = z.object({
  quote: z.string(),
  name: z.string(),
  role: z.string(),
  organization: z.string(),
});

/**
 * approvedBy is unconditionally required, not conditioned on the entry
 * having metrics — every proof entry's detail template requires a
 * `whatChanged` MetricTable (also unconditionally required below), so
 * requiring approvedBy at the schema level already fails the build for any
 * entry that would otherwise ship metrics without a recorded approver.
 */
const proofApprovalSchema = z.object({
  name: z.string(),
  date: z.string(),
});

export const proofFrontmatterSchema = z.object({
  title: z.string().max(60),
  description: z.string().max(155),
  industrySlug: z.string(),
  situation: z.string(),
  whatWasUnmeasurable: z.string(),
  whatWeBuilt: z.string(),
  whatChanged: metricTableDataSchema,
  timeline: z.array(proofTimelineEntrySchema).min(1),
  quote: proofQuoteSchema,
  /** Exactly 3 route paths, rendered as CrossLinks and validated against lib/nav.ts — same shape and constraint as the services schema's crossLinks field. */
  servicesUsed: z.array(z.string()).length(3),
  approvedBy: proofApprovalSchema,
  publishedAt: z.string(),
  updatedAt: z.string(),
});
export type ProofFrontmatter = z.infer<typeof proofFrontmatterSchema>;

const articleAuthorSchema = z.object({
  name: z.string(),
  role: z.string(),
});

/**
 * Fixed enum, not free-text — the hub groups articles by this, so adding a
 * sixth theme is a decision about the hub's structure, not a typo an author
 * can introduce by typing a new string.
 */
export const ARTICLE_THEMES = [
  "attribution",
  "healthcare",
  "paid-media",
  "search-visibility",
  "measurement-practice",
] as const;
export type ArticleTheme = (typeof ARTICLE_THEMES)[number];

export const pointOfViewFrontmatterSchema = z.object({
  title: z.string().max(60),
  description: z.string().max(155),
  primaryKeyword: z.string(),
  secondaryKeywords: z.array(z.string()),
  /** One sentence, shown on the hub next to the title. */
  dek: z.string(),
  author: articleAuthorSchema,
  publishedAt: z.string(),
  updatedAt: z.string(),
  /**
   * Other article slugs to surface as "related", in display order. Optional — when
   * absent or empty, the template falls back to the most recent other articles
   * instead of rendering nothing. Set this only for a deliberate pairing that
   * should override the recency-based default.
   */
  relatedSlugs: z.array(z.string()).optional(),
  /** Which of the hub's topic groups this article belongs to. */
  theme: z.enum(ARTICLE_THEMES),
  /**
   * Service route paths this article actually argues for, in display order —
   * not what it would be nice to rank for. 1-3 entries, validated against
   * lib/nav.ts in validateSupportsServices. An article that supports no
   * service page has no reason to exist in this cluster.
   */
  supportsServices: z.array(z.string()).min(1).max(3),
  /**
   * Industry route paths this article supports. 0-2 entries — an article
   * about a mechanism rather than a vertical (attribution, paid-media) may
   * support none at all.
   */
  supportsIndustries: z.array(z.string()).max(2),
});
export type PointOfViewFrontmatter = z.infer<typeof pointOfViewFrontmatterSchema>;

type Collection = "services" | "industries" | "proof" | "point-of-view";

const SCHEMAS = {
  services: servicesFrontmatterSchema,
  industries: industriesFrontmatterSchema,
  proof: proofFrontmatterSchema,
  "point-of-view": pointOfViewFrontmatterSchema,
} as const;

export interface ContentEntry<TFrontmatter> {
  slug: string;
  frontmatter: TFrontmatter;
  content: React.ReactElement;
}

function listMdxFiles(collection: Collection): string[] {
  const dir = path.join(CONTENT_ROOT, collection);
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir).filter((file) => file.endsWith(".mdx"));
}

function validateCounterpartSlugs(filePath: string, counterpartSlugs: readonly string[]): void {
  for (const slug of counterpartSlugs) {
    try {
      getRoute(`/services/${slug}`);
    } catch {
      throw new Error(
        `lib/content: invalid frontmatter in ${filePath} — field "counterpartSlugs": "${slug}" does not resolve to a route in lib/nav.ts`
      );
    }
  }
}

function validateCrossLinks(filePath: string, crossLinks: readonly string[] | undefined): void {
  for (const routePath of crossLinks ?? []) {
    try {
      getRoute(routePath);
    } catch {
      throw new Error(
        `lib/content: invalid frontmatter in ${filePath} — field "crossLinks": "${routePath}" does not resolve to a route in lib/nav.ts`
      );
    }
  }
}

function validateServicesUsed(filePath: string, servicesUsed: readonly string[]): void {
  for (const routePath of servicesUsed) {
    try {
      getRoute(routePath);
    } catch {
      throw new Error(
        `lib/content: invalid frontmatter in ${filePath} — field "servicesUsed": "${routePath}" does not resolve to a route in lib/nav.ts`
      );
    }
  }
}

function validateSupportsServices(filePath: string, supportsServices: readonly string[]): void {
  for (const routePath of supportsServices) {
    const route = (() => {
      try {
        return getRoute(routePath);
      } catch {
        throw new Error(
          `lib/content: invalid frontmatter in ${filePath} — field "supportsServices": "${routePath}" does not resolve to a route in lib/nav.ts`
        );
      }
    })();
    if (route.pageType !== "service") {
      throw new Error(
        `lib/content: invalid frontmatter in ${filePath} — field "supportsServices": "${routePath}" does not resolve to a service page (pageType "${route.pageType}")`
      );
    }
  }
}

function validateSupportsIndustries(filePath: string, supportsIndustries: readonly string[]): void {
  for (const routePath of supportsIndustries) {
    const route = (() => {
      try {
        return getRoute(routePath);
      } catch {
        throw new Error(
          `lib/content: invalid frontmatter in ${filePath} — field "supportsIndustries": "${routePath}" does not resolve to a route in lib/nav.ts`
        );
      }
    })();
    if (route.parent !== "/industries") {
      throw new Error(
        `lib/content: invalid frontmatter in ${filePath} — field "supportsIndustries": "${routePath}" does not resolve to an industry page`
      );
    }
  }
}

/**
 * A boundary is required if and only if the slug has a counterpart in
 * lib/nav.ts's boundary table — not a function of funnelStage or pageType.
 * The table has 14 entries against 22 non-pillar service pages; eight
 * (including the pillar) legitimately have none.
 */
function validateBoundaryRequirement(
  filePath: string,
  slug: string,
  boundary: string | undefined
): void {
  const hasCounterpart = counterpartsOf(slug).length > 0;
  if (!hasCounterpart) return;

  const words = boundary ? wordCount(boundary) : 0;
  if (!boundary || words < 60 || words > 100) {
    throw new Error(
      `lib/content: invalid frontmatter in ${filePath} — field "boundary": "${slug}" has a counterpart in lib/nav.ts's boundary table and requires a boundary of 60-100 words (found ${words})`
    );
  }
}

async function loadEntry<TFrontmatter>(
  collection: Collection,
  filename: string
): Promise<ContentEntry<TFrontmatter>> {
  const filePath = path.join(CONTENT_ROOT, collection, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content: body } = matter(raw);
  const slug = filename.replace(/\.mdx$/, "");

  const schema = SCHEMAS[collection];
  const result = schema.safeParse(data);
  if (!result.success) {
    const issue = result.error.issues[0];
    const field = issue?.path.join(".") || "(root)";
    throw new Error(`lib/content: invalid frontmatter in ${filePath} — field "${field}": ${issue?.message}`);
  }

  if (collection === "services") {
    const serviceData = result.data as ServiceFrontmatter;
    validateCounterpartSlugs(filePath, serviceData.counterpartSlugs);
    validateCrossLinks(filePath, serviceData.crossLinks);
    if (serviceData.pageType === "service") {
      validateBoundaryRequirement(filePath, slug, serviceData.boundary);
    }
  }

  if (collection === "proof") {
    const proofData = result.data as ProofFrontmatter;
    validateServicesUsed(filePath, proofData.servicesUsed);
  }

  if (collection === "point-of-view") {
    const articleData = result.data as PointOfViewFrontmatter;
    validateSupportsServices(filePath, articleData.supportsServices);
    validateSupportsIndustries(filePath, articleData.supportsIndustries);
  }

  const components =
    collection === "services"
      ? servicesMdxComponents
      : collection === "point-of-view"
        ? createArticleMdxComponents(listMdxFiles("point-of-view").map((file) => file.replace(/\.mdx$/, "")))
        : undefined;
  // blockJS is off for services and point-of-view MDX, both trusted
  // first-party content (not user-generated) that needs JS object/array
  // literals for props like DefinitionList's `items`. blockDangerousJS stays
  // on as a second layer, blocking eval/Function/process even so.
  const options =
    collection === "services" || collection === "point-of-view"
      ? { blockJS: false, blockDangerousJS: true }
      : undefined;
  const { content } = await compileMDX({ source: body, components, options });

  return { slug, frontmatter: result.data as TFrontmatter, content };
}

export interface ArticleHeading {
  text: string;
  id: string;
}

/**
 * Scans raw MDX for h2 headings ("## ...") and returns them with slugified
 * ids, using the exact same slugify function the h2 renderer in
 * lib/mdx-components.tsx applies to the rendered heading text — so the
 * table of contents and the anchors it links to can never drift apart.
 */
function extractH2Headings(body: string): ArticleHeading[] {
  const headings: ArticleHeading[] = [];
  for (const line of body.split("\n")) {
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (match?.[1]) {
      const text = match[1].trim();
      headings.push({ text, id: slugifyHeading(text) });
    }
  }
  return headings;
}

export function getServiceEntries(): Promise<ContentEntry<ServiceFrontmatter>[]> {
  return Promise.all(
    listMdxFiles("services").map((file) => loadEntry<ServiceFrontmatter>("services", file))
  );
}

export function getIndustryEntries(): Promise<ContentEntry<IndustryFrontmatter>[]> {
  return Promise.all(
    listMdxFiles("industries").map((file) => loadEntry<IndustryFrontmatter>("industries", file))
  );
}

export function getProofEntries(): Promise<ContentEntry<ProofFrontmatter>[]> {
  return Promise.all(listMdxFiles("proof").map((file) => loadEntry<ProofFrontmatter>("proof", file)));
}

export interface ArticleEntry extends ContentEntry<PointOfViewFrontmatter> {
  headings: ArticleHeading[];
}

export async function getPointOfViewEntries(): Promise<ArticleEntry[]> {
  const files = listMdxFiles("point-of-view");
  return Promise.all(
    files.map(async (file) => {
      const entry = await loadEntry<PointOfViewFrontmatter>("point-of-view", file);
      const raw = fs.readFileSync(path.join(CONTENT_ROOT, "point-of-view", file), "utf8");
      const { content: body } = matter(raw);
      return { ...entry, headings: extractH2Headings(body) };
    })
  );
}

/**
 * Articles that name `path` in supportsServices or supportsIndustries, most
 * recent first, capped at 4 — the reciprocal half of the topic-cluster
 * link: an article linking to a service or industry page is one signal, the
 * page listing the articles back is what makes it a cluster.
 */
export async function getSupportingArticles(path: string): Promise<ArticleEntry[]> {
  const entries = await getPointOfViewEntries();
  return entries
    .filter(
      (entry) =>
        entry.frontmatter.supportsServices.includes(path) ||
        entry.frontmatter.supportsIndustries.includes(path)
    )
    .sort(
      (a, b) => new Date(b.frontmatter.publishedAt).getTime() - new Date(a.frontmatter.publishedAt).getTime()
    )
    .slice(0, 4);
}
