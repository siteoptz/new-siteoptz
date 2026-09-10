import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { z } from "zod";
import { getRoute } from "./nav";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

const summaryWordCount = (value: string) => {
  const count = wordCount(value);
  return count >= 60 && count <= 80;
};

export const servicesFrontmatterSchema = z.object({
  title: z.string().max(60),
  description: z.string().max(155),
  primaryKeyword: z.string(),
  secondaryKeywords: z.array(z.string()),
  pageType: z.enum(["hub", "service"]),
  funnelStage: z.enum(["tof", "mof", "bof", "cross"]),
  summary: z.string().refine(summaryWordCount, "summary must be 60-80 words"),
  counterpartSlugs: z.array(z.string()).default([]),
  publishedAt: z.string(),
  updatedAt: z.string(),
});
export type ServiceFrontmatter = z.infer<typeof servicesFrontmatterSchema>;

export const industriesFrontmatterSchema = z.object({
  title: z.string().max(60),
  description: z.string().max(155),
  primaryKeyword: z.string(),
  secondaryKeywords: z.array(z.string()),
  serviceSlugs: z.array(z.string()).length(6),
  publishedAt: z.string(),
  updatedAt: z.string(),
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

async function loadEntry<TFrontmatter>(
  collection: Collection,
  filename: string
): Promise<ContentEntry<TFrontmatter>> {
  const filePath = path.join(CONTENT_ROOT, collection, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content: body } = matter(raw);

  const schema = SCHEMAS[collection];
  const result = schema.safeParse(data);
  if (!result.success) {
    const issue = result.error.issues[0];
    const field = issue?.path.join(".") || "(root)";
    throw new Error(`lib/content: invalid frontmatter in ${filePath} — field "${field}": ${issue?.message}`);
  }

  if (collection === "services") {
    validateCounterpartSlugs(filePath, (result.data as ServiceFrontmatter).counterpartSlugs);
  }

  const { content } = await compileMDX({ source: body });
  const slug = filename.replace(/\.mdx$/, "");

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
