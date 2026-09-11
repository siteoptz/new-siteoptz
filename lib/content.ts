import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { z } from "zod";
import { LINK_EXEMPTION_CATEGORIES } from "./link-exemptions";
import { servicesMdxComponents } from "./mdx-components";
import { counterpartsOf, getRoute } from "./nav";

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

export const proofFrontmatterSchema = z.object({
  title: z.string().max(60),
  description: z.string().max(155),
  industrySlug: z.string(),
  servicesUsed: z.array(z.string()),
  approvedBy: z.string(),
  publishedAt: z.string(),
  updatedAt: z.string(),
});
export type ProofFrontmatter = z.infer<typeof proofFrontmatterSchema>;

export const pointOfViewFrontmatterSchema = z.object({
  title: z.string().max(60),
  description: z.string().max(155),
  primaryKeyword: z.string(),
  authorName: z.string(),
  publishedAt: z.string(),
  updatedAt: z.string(),
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

  const components = collection === "services" ? servicesMdxComponents : undefined;
  // blockJS is off only for services MDX, which is trusted first-party
  // content (not user-generated) and needs JS object/array literals for
  // props like DefinitionList's `items`. blockDangerousJS stays on as a
  // second layer, blocking eval/Function/process even so.
  const options =
    collection === "services" ? { blockJS: false, blockDangerousJS: true } : undefined;
  const { content } = await compileMDX({ source: body, components, options });

  return { slug, frontmatter: result.data as TFrontmatter, content };
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

export function getPointOfViewEntries(): Promise<ContentEntry<PointOfViewFrontmatter>[]> {
  return Promise.all(
    listMdxFiles("point-of-view").map((file) =>
      loadEntry<PointOfViewFrontmatter>("point-of-view", file)
    )
  );
}
