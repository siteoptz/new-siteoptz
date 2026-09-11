/**
 * Prebuild content gate. Walks content/** /*.mdx and reports violations; when
 * VERCEL_ENV is 'production', any violation fails the build (non-zero exit).
 * Outside production the same violations are reported as warnings so content
 * can keep moving on preview branches.
 *
 * Run with `node --experimental-strip-types` (wired as "prebuild" in
 * package.json) — no TS runner dependency is installed for this repo.
 *
 * Covers MDX content only. Pages built as .tsx are checked separately at the
 * pre-launch audit (docs/build-prompts.md, Prompt 6.3).
 *
 * As of Instruction 2.1, the word-count floor counts prose that lives in
 * frontmatter (boundary, lead, faq answers, cta.body) alongside the MDX
 * body, since the service page template renders all of it as words on the
 * page — only the MDX body word count would understate a real page. The
 * internal-link minimum was extended the same way: crossLinks and
 * counterpartSlugs render as real links via the template (CrossLinks,
 * BoundaryStatement) but never appear as body markdown, so they are counted
 * alongside inline body links rather than only the latter.
 *
 * As of Instruction 3.2, link checking also verifies composition, not just
 * count: a service page can clear the count floor while missing an entire
 * required category (this is exactly how marketing-operations shipped two
 * links short in Wave 1 and only a manual audit caught it). The composition
 * check reports which category is missing, by name.
 *
 * As of the link-exemptions instruction, a page can declare
 * `linkExemptions: [{ category, reason }]` in frontmatter to record a
 * deliberate, reported gap instead of either manufacturing a link or
 * tolerating a silent gate failure. An exempted category is treated as
 * satisfied, and its reason is printed on every run — regardless of whether
 * the category would otherwise pass or fail — so the exemption stays
 * visible on every build rather than living in someone's memory.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { counterpartsOf, getRoute, ROUTES, type RouteEntry } from "../lib/nav.ts";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const COLLECTIONS = ["services", "industries", "proof", "point-of-view"] as const;
const WORD_COUNT_FLOOR = 1100;
const MIN_INTERNAL_LINKS = 6;
const MIN_SIBLINGS = 2;

const STAGE_HUB_PATH: Record<string, string> = {
  tof: "/services/top-of-funnel",
  mof: "/services/middle-of-funnel",
  bof: "/services/bottom-of-funnel",
};

// Literal single/compound words from CLAUDE.md section 4. Two entries in that
// list — "success-rate percentages" and "x ROI delivered" — describe a
// pattern of claim rather than a literal string and are judged at editorial
// review / the pre-launch audit instead of here.
const BANNED_WORDS = [
  "Fortune 500",
  "proven",
  "seamless",
  "unlock",
  "transform",
  "game-changing",
  "leverage",
  "best-in-class",
  "end-to-end",
  "cutting-edge",
  "world-class",
  "synergy",
  "empower",
];

interface Violation {
  file: string;
  line: number;
  reason: string;
}

/**
 * Must stay in sync with lib/content.ts's LINK_EXEMPTION_CATEGORIES — this
 * script is deliberately decoupled from that schema (it does not import the
 * MDX compiler), so the category list is duplicated rather than shared.
 */
type LinkExemptionCategory = "pillar" | "stageHub" | "siblings" | "counterpart" | "industry" | "proof";

interface ExemptionNotice {
  file: string;
  category: LinkExemptionCategory;
  reason: string;
}

function parseLinkExemptions(frontmatter: Record<string, unknown>): Map<LinkExemptionCategory, string> {
  const exemptions = new Map<LinkExemptionCategory, string>();
  if (!Array.isArray(frontmatter.linkExemptions)) return exemptions;

  for (const entry of frontmatter.linkExemptions) {
    const category = (entry as { category?: unknown } | null)?.category;
    const reason = (entry as { reason?: unknown } | null)?.reason;
    if (typeof category === "string" && typeof reason === "string") {
      exemptions.set(category as LinkExemptionCategory, reason);
    }
  }

  return exemptions;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Blanks out fenced code block lines (keeping line numbers stable). */
function stripFencedCodeBlocks(lines: string[]): string[] {
  const result: string[] = [];
  let inFence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      result.push("");
      continue;
    }
    result.push(inFence ? "" : line);
  }
  return result;
}

function checkMetricPlaceholder(file: string, lines: string[], violations: Violation[]): void {
  lines.forEach((line, index) => {
    if (line.includes("[[metric:")) {
      violations.push({
        file,
        line: index + 1,
        reason: 'contains an unresolved "[[metric:" placeholder',
      });
    }
  });
}

function checkBannedWords(file: string, lines: string[], violations: Violation[]): void {
  const proseLines = stripFencedCodeBlocks(lines);
  for (const word of BANNED_WORDS) {
    const pattern = new RegExp(`\\b${escapeRegExp(word)}\\b`, "i");
    proseLines.forEach((line, index) => {
      if (pattern.test(line)) {
        violations.push({ file, line: index + 1, reason: `uses banned word "${word}"` });
      }
    });
  }
}

function countWords(body: string): number {
  return body.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Resolves the full set of internal links a service page emits: inline body
 * markdown links, plus the structural links the template renders from
 * frontmatter — crossLinks and the BoundaryStatement counterpart(s) from
 * counterpartSlugs — neither of which appears as body markdown text.
 */
function collectEmittedLinks(body: string, frontmatter: Record<string, unknown>): Set<string> {
  const knownPaths = new Set(ROUTES.map((route) => route.path));
  const links = new Set<string>();

  for (const match of body.matchAll(/\]\(([^)]+)\)/g)) {
    const href = match[1]?.split("#")[0]?.trim();
    if (href && knownPaths.has(href)) {
      links.add(href);
    }
  }

  if (Array.isArray(frontmatter.crossLinks)) {
    for (const link of frontmatter.crossLinks) {
      if (typeof link === "string") links.add(link);
    }
  }

  if (Array.isArray(frontmatter.counterpartSlugs)) {
    for (const slug of frontmatter.counterpartSlugs) {
      if (typeof slug === "string") links.add(`/services/${slug}`);
    }
  }

  return links;
}

/**
 * Asserts the emitted link set contains one of each required category,
 * resolved through lib/nav.ts rather than just counted. Skipped for the
 * pillar itself (marketing-attribution), which has its own distinct linking
 * spec — "links to all three stage hubs" — not this generic one.
 *
 * An exempted category (frontmatter.linkExemptions) is treated as satisfied
 * regardless of whether it would otherwise pass or fail, and its reason is
 * always recorded in exemptionNotices so it prints on every run.
 */
function checkLinkComposition(
  file: string,
  slug: string,
  links: Set<string>,
  frontmatter: Record<string, unknown>,
  violations: Violation[],
  exemptionNotices: ExemptionNotice[]
): void {
  if (slug === "marketing-attribution") return;

  const exemptions = parseLinkExemptions(frontmatter);
  for (const [category, reason] of exemptions) {
    exemptionNotices.push({ file, category, reason });
  }
  const isExempt = (category: LinkExemptionCategory) => exemptions.has(category);

  const funnelStage = typeof frontmatter.funnelStage === "string" ? frontmatter.funnelStage : undefined;
  const selfPath = `/services/${slug}`;
  const missing: string[] = [];

  if (!isExempt("pillar") && !links.has("/services/marketing-attribution")) {
    missing.push("the attribution pillar (/services/marketing-attribution)");
  }

  const stageHub = funnelStage ? STAGE_HUB_PATH[funnelStage] : undefined;
  if (!isExempt("stageHub") && stageHub && !links.has(stageHub)) {
    missing.push(`its own stage hub (${stageHub})`);
  }

  const linkedRoutes: RouteEntry[] = [];
  for (const linkPath of links) {
    try {
      linkedRoutes.push(getRoute(linkPath));
    } catch {
      // Not a known nav.ts route (e.g. a dynamic /proof/<slug> entry) — fine,
      // just not usable for category resolution below.
    }
  }

  const siblingCount = linkedRoutes.filter(
    (route) =>
      route.pageType === "service" && route.funnelStage === funnelStage && route.path !== selfPath
  ).length;
  if (!isExempt("siblings") && siblingCount < MIN_SIBLINGS) {
    missing.push(`at least ${MIN_SIBLINGS} sibling services (found ${siblingCount})`);
  }

  let counterpartPaths: string[] = [];
  try {
    counterpartPaths = counterpartsOf(slug).map((route) => route.path);
  } catch {
    counterpartPaths = [];
  }
  if (!isExempt("counterpart") && counterpartPaths.length > 0 && !counterpartPaths.some((p) => links.has(p))) {
    missing.push(`its counterpart (${counterpartPaths.join(" or ")})`);
  }

  const hasIndustry = Array.from(links).some(
    (p) => p.startsWith("/industries/") && p !== "/industries"
  );
  if (!isExempt("industry") && !hasIndustry) missing.push("at least one industry page");

  if (!isExempt("proof") && !links.has("/proof")) missing.push("at least one proof entry (/proof)");

  if (missing.length > 0) {
    violations.push({
      file,
      line: 1,
      reason: `link composition incomplete — missing: ${missing.join("; ")}`,
    });
  }
}

/** Sums word counts of frontmatter prose fields: boundary, lead, faq answers, cta.body. */
function countFrontmatterProseWords(frontmatter: Record<string, unknown>): number {
  let total = 0;

  if (typeof frontmatter.boundary === "string") {
    total += countWords(frontmatter.boundary);
  }

  if (typeof frontmatter.lead === "string") {
    total += countWords(frontmatter.lead);
  }

  if (Array.isArray(frontmatter.faq)) {
    for (const entry of frontmatter.faq as unknown[]) {
      const answer = (entry as { answer?: unknown } | null)?.answer;
      if (typeof answer === "string") {
        total += countWords(answer);
      }
    }
  }

  const cta = frontmatter.cta as { body?: unknown } | undefined;
  if (typeof cta?.body === "string") {
    total += countWords(cta.body);
  }

  return total;
}

function checkServicePageDepth(
  file: string,
  slug: string,
  body: string,
  frontmatter: Record<string, unknown>,
  violations: Violation[],
  exemptionNotices: ExemptionNotice[]
): void {
  if (frontmatter.pageType !== "service") return;

  const words = countWords(body) + countFrontmatterProseWords(frontmatter);
  if (words < WORD_COUNT_FLOOR) {
    violations.push({
      file,
      line: 1,
      reason: `service page is ${words} words (body plus frontmatter prose), below the ${WORD_COUNT_FLOOR}-word floor`,
    });
  }

  const links = collectEmittedLinks(body, frontmatter);
  if (links.size < MIN_INTERNAL_LINKS) {
    violations.push({
      file,
      line: 1,
      reason: `service page has ${links.size} internal link(s) to routes in lib/nav.ts, below the ${MIN_INTERNAL_LINKS}-link minimum`,
    });
  }

  checkLinkComposition(file, slug, links, frontmatter, violations, exemptionNotices);
}

function walkCollection(collection: (typeof COLLECTIONS)[number]): string[] {
  const dir = path.join(CONTENT_ROOT, collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => path.join(dir, file));
}

function main(): void {
  const violations: Violation[] = [];
  const exemptionNotices: ExemptionNotice[] = [];

  for (const collection of COLLECTIONS) {
    for (const filePath of walkCollection(collection)) {
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content: body } = matter(raw);
      const lines = raw.split("\n");
      const relativePath = path.relative(process.cwd(), filePath);

      checkMetricPlaceholder(relativePath, lines, violations);
      checkBannedWords(relativePath, lines, violations);

      if (collection === "services") {
        const slug = path.basename(filePath, ".mdx");
        checkServicePageDepth(relativePath, slug, body, data, violations, exemptionNotices);
      }
    }
  }

  if (exemptionNotices.length > 0) {
    console.log(`content-check: ${exemptionNotices.length} link exemption(s) recorded\n`);
    for (const notice of exemptionNotices) {
      console.log(`${notice.file} — ${notice.category}: ${notice.reason}`);
    }
    console.log("");
  }

  if (violations.length === 0) {
    console.log("content-check: no violations found");
    return;
  }

  console.error(`content-check: ${violations.length} violation(s) found\n`);
  for (const violation of violations) {
    console.error(`${violation.file}:${violation.line} — ${violation.reason}`);
  }

  if (process.env.VERCEL_ENV === "production") {
    console.error("\ncontent-check: failing the build — VERCEL_ENV is 'production'");
    process.exitCode = 1;
  } else {
    console.error("\ncontent-check: not failing the build — VERCEL_ENV is not 'production'");
  }
}

main();
