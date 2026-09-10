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
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { ROUTES } from "../lib/nav.ts";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const COLLECTIONS = ["services", "industries", "proof", "point-of-view"] as const;
const WORD_COUNT_FLOOR = 1100;
const MIN_INTERNAL_LINKS = 6;

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

function countInternalLinks(body: string): number {
  const knownPaths = new Set(ROUTES.map((route) => route.path));
  let count = 0;
  for (const match of body.matchAll(/\]\(([^)]+)\)/g)) {
    const href = match[1]?.split("#")[0]?.trim();
    if (href && knownPaths.has(href)) {
      count += 1;
    }
  }
  return count;
}

function checkServicePageDepth(
  file: string,
  body: string,
  frontmatter: Record<string, unknown>,
  violations: Violation[]
): void {
  if (frontmatter.pageType !== "service") return;

  const words = countWords(body);
  if (words < WORD_COUNT_FLOOR) {
    violations.push({
      file,
      line: 1,
      reason: `service page body is ${words} words, below the ${WORD_COUNT_FLOOR}-word floor`,
    });
  }

  const links = countInternalLinks(body);
  if (links < MIN_INTERNAL_LINKS) {
    violations.push({
      file,
      line: 1,
      reason: `service page has ${links} internal link(s) to routes in lib/nav.ts, below the ${MIN_INTERNAL_LINKS}-link minimum`,
    });
  }
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

  for (const collection of COLLECTIONS) {
    for (const filePath of walkCollection(collection)) {
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content: body } = matter(raw);
      const lines = raw.split("\n");
      const relativePath = path.relative(process.cwd(), filePath);

      checkMetricPlaceholder(relativePath, lines, violations);
      checkBannedWords(relativePath, lines, violations);

      if (collection === "services") {
        checkServicePageDepth(relativePath, body, data, violations);
      }
    }
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
