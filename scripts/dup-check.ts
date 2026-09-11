/**
 * Compares every pair of content/services/*.mdx bodies and reports the
 * longest shared contiguous phrase over SHARED_PHRASE_REPORT_THRESHOLD
 * words, with both file names and the phrase.
 *
 * This is a review tool, not a gate — not wired into the build. Run
 * manually via `npm run dup`, starting after the second service page
 * exists, and before every commit from then on. Anything the run reports
 * over twelve words gets rewritten before the commit; the lower report
 * threshold below just surfaces candidates worth a human look.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_ROOT = path.join(process.cwd(), "content", "services");
const SHARED_PHRASE_REPORT_THRESHOLD = 8;

function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[a-z0-9']+/g) ?? [];
}

/** Longest common contiguous run between two token arrays, via a DP with an O(m) rolling row. */
function longestCommonRun(a: string[], b: string[]): { length: number; phrase: string } {
  let maxLen = 0;
  let endIndexA = 0;
  let prevRow = new Array(b.length + 1).fill(0);

  for (let i = 1; i <= a.length; i++) {
    const currRow = new Array(b.length + 1).fill(0);
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        currRow[j] = (prevRow[j - 1] ?? 0) + 1;
        if (currRow[j] > maxLen) {
          maxLen = currRow[j];
          endIndexA = i;
        }
      }
    }
    prevRow = currRow;
  }

  return { length: maxLen, phrase: a.slice(endIndexA - maxLen, endIndexA).join(" ") };
}

function listMdxFiles(): string[] {
  if (!fs.existsSync(CONTENT_ROOT)) return [];
  return fs.readdirSync(CONTENT_ROOT).filter((file) => file.endsWith(".mdx"));
}

function main(): void {
  const files = listMdxFiles();
  const docs = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_ROOT, file), "utf8");
    const { content: body } = matter(raw);
    return { file, tokens: tokenize(body) };
  });

  let reported = 0;

  for (let i = 0; i < docs.length; i++) {
    for (let j = i + 1; j < docs.length; j++) {
      const a = docs[i];
      const b = docs[j];
      if (!a || !b) continue;

      const { length, phrase } = longestCommonRun(a.tokens, b.tokens);
      if (length > SHARED_PHRASE_REPORT_THRESHOLD) {
        reported += 1;
        console.log(`${a.file} <-> ${b.file}: ${length} shared words — "${phrase}"`);
      }
    }
  }

  if (reported === 0) {
    console.log(
      `dup-check: no shared phrase over ${SHARED_PHRASE_REPORT_THRESHOLD} words across ${docs.length} page(s)`
    );
    return;
  }

  console.log(
    `\ndup-check: ${reported} pair(s) reported. Anything over twelve words should be rewritten before committing.`
  );
}

main();
