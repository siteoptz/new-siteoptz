/**
 * The link-composition categories a service page can exempt itself from via
 * frontmatter's `linkExemptions`. Split out from lib/content.ts so it stays
 * importable by scripts/content-check.ts, which runs under plain `node`
 * (no bundler) and cannot resolve lib/content.ts's extensionless import of
 * ./mdx-components or that file's `@/` path aliases.
 */
export const LINK_EXEMPTION_CATEGORIES = [
  "pillar",
  "stageHub",
  "siblings",
  "counterpart",
  "industry",
  "proof",
] as const;

export type LinkExemptionCategory = (typeof LINK_EXEMPTION_CATEGORIES)[number];
