/**
 * Verifies the 301 redirect map in lib/redirects.ts against a real running
 * server — redirects are server-side routing, not something visible in the
 * static HTML scripts/check-rendered-links.ts already reads, so this needs
 * an actual production server to hit with real requests.
 *
 * Requires a production build to already exist (`npm run build`). This
 * script only spawns `next start` on a fixed local port, runs its
 * assertions, and shuts the server down again.
 *
 * Set REDIRECT_CHECK_URL to check a deployed environment instead (e.g. a
 * Vercel preview or production URL) — no server is spawned in that case,
 * and requests go straight to that URL.
 *
 * Every mapped source below is registered without a trailing slash (see
 * lib/redirects.ts's own comment on why). A real request to the old,
 * trailing-slash form of one of these URLs still resolves correctly, but as
 * two permanent hops: Next's own trailing-slash normalization (308, strips
 * the slash) runs before custom redirects are evaluated at all, then our
 * rule (301) completes the trip. verifyCase below follows exactly that
 * chain and checks both hops rather than asserting a single 301 that a
 * trailing-slash request can never actually produce.
 *
 * Run with `node scripts/check-redirects.ts` after building.
 */
import { spawn, type ChildProcess } from "node:child_process";
import { REDIRECTS } from "../lib/redirects.ts";

const PORT = 3919;
const REMOTE_URL = process.env.REDIRECT_CHECK_URL?.replace(/\/$/, "");
const BASE_URL = REMOTE_URL ?? `http://localhost:${PORT}`;
const SERVER_TIMEOUT_MS = 20_000;

interface RedirectCase {
  /** Request path, as an old visitor would actually type or click it — with or without a trailing slash. */
  path: string;
  /** Final destination pathname the chain must end at. */
  destination: string;
}

/** Every literal (non-pattern) source in the redirect map. */
const MAPPED_CASES: RedirectCase[] = REDIRECTS.filter((rule) => !rule.source.includes(":")).map(
  (rule) => ({ path: rule.source, destination: rule.destination })
);

/** The real-world trailing-slash form of each mapped source — the old site's actual canonical URLs. */
const TRAILING_SLASH_CASES: RedirectCase[] = MAPPED_CASES.map((testCase) => ({
  path: `${testCase.path}/`,
  destination: testCase.destination,
}));

/** Concrete example requests exercising the pattern-based rules, whose sources are param placeholders rather than literal request paths. */
const PATTERN_CASES: RedirectCase[] = [
  { path: "/category/some-old-category", destination: "/point-of-view" },
  { path: "/category/some-old-category/", destination: "/point-of-view" },
  { path: "/tag/some-old-tag", destination: "/point-of-view" },
  { path: "/tag/some-old-tag/", destination: "/point-of-view" },
  { path: "/feed", destination: "/point-of-view" },
  { path: "/feed/", destination: "/point-of-view" },
  { path: "/some-old-post/feed", destination: "/point-of-view" },
  { path: "/some-old-post/feed/", destination: "/point-of-view" },
  { path: "/category/some-old-category/feed", destination: "/point-of-view" },
  { path: "/category/some-old-category/feed/", destination: "/point-of-view" },
];

/** Deliberately left alone — confirms no rule accidentally catches these. */
const LEFT_ALONE_PATHS = ["/wp-admin", "/wp-login.php", "/xmlrpc.php"];

const ALL_REDIRECT_CASES: RedirectCase[] = [...MAPPED_CASES, ...TRAILING_SLASH_CASES, ...PATTERN_CASES];

function waitForServer(url: string, timeoutMs: number): Promise<void> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      fetch(url, { redirect: "manual" })
        .then(() => resolve())
        .catch((err: Error) => {
          if (Date.now() - start > timeoutMs) {
            reject(new Error(`server did not become ready within ${timeoutMs}ms (${err.message})`));
            return;
          }
          setTimeout(attempt, 200);
        });
    };
    attempt();
  });
}

/**
 * Follows the real, expected chain for a case: if the path has a trailing
 * slash, the first hop must be Next's own 308 slash-strip before the second
 * hop's 301 to the true destination; otherwise the single hop must be a
 * direct 301.
 */
async function verifyCase(testCase: RedirectCase): Promise<string | null> {
  const hasTrailingSlash = testCase.path.endsWith("/") && testCase.path !== "/";
  let requestPath = testCase.path;

  if (hasTrailingSlash) {
    const response = await fetch(`${BASE_URL}${requestPath}`, { redirect: "manual" });
    if (response.status !== 308) {
      return `expected first hop 308 (Next's own trailing-slash normalization), got ${response.status}`;
    }
    const strippedPath = requestPath.slice(0, -1);
    const location = response.headers.get("location");
    if (location !== strippedPath) {
      return `expected first-hop Location "${strippedPath}", got "${location ?? "(none)"}"`;
    }
    requestPath = strippedPath;
  }

  const response = await fetch(`${BASE_URL}${requestPath}`, { redirect: "manual" });
  if (response.status !== 301) {
    return `expected ${hasTrailingSlash ? "second-hop" : ""} status 301, got ${response.status}`.trim();
  }
  const location = response.headers.get("location");
  const locationPath = location ? new URL(location, BASE_URL).pathname : null;
  if (locationPath !== testCase.destination) {
    return `expected Location "${testCase.destination}", got "${locationPath ?? "(none)"}"`;
  }
  return null;
}

async function verifyLeftAlone(path: string): Promise<string | null> {
  const response = await fetch(`${BASE_URL}${path}`, { redirect: "manual" });
  if (response.status !== 404) {
    return `expected 404 (left alone, no redirect rule), got ${response.status}`;
  }
  return null;
}

async function main(): Promise<void> {
  const server: ChildProcess | null = REMOTE_URL
    ? null
    : spawn("npx", ["next", "start", "-p", String(PORT)], { stdio: "ignore" });

  if (REMOTE_URL) {
    console.log(`check-redirects: checking ${BASE_URL} (no local server spawned)\n`);
  }

  let failures = 0;
  let passes = 0;

  try {
    await waitForServer(BASE_URL, SERVER_TIMEOUT_MS);

    for (const testCase of ALL_REDIRECT_CASES) {
      const failure = await verifyCase(testCase);
      if (failure) {
        failures++;
        console.error(`FAIL ${testCase.path} — ${failure}`);
      } else {
        passes++;
        console.log(`PASS ${testCase.path} -> ${testCase.destination}`);
      }
    }

    for (const path of LEFT_ALONE_PATHS) {
      const failure = await verifyLeftAlone(path);
      if (failure) {
        failures++;
        console.error(`FAIL ${path} — ${failure}`);
      } else {
        passes++;
        console.log(`PASS ${path} -> 404 (left alone)`);
      }
    }
  } finally {
    server?.kill();
  }

  console.log("");
  if (failures === 0) {
    console.log(`check-redirects: all ${passes} case(s) passed`);
  } else {
    console.error(`check-redirects: ${failures} of ${passes + failures} case(s) failed`);
    process.exitCode = 1;
  }
}

main().catch((error: Error) => {
  console.error(`check-redirects: ${error.message}`);
  process.exitCode = 1;
});
