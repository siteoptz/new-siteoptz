/**
 * In-memory sliding-window rate limiter, keyed by IP. Good enough to blunt a
 * scripted burst from one address; it resets on every cold start and is not
 * shared across serverless instances, so it is a courtesy layer, not the
 * spam defense — the honeypot and timestamp trap do the real work.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string, now: number = Date.now()): boolean {
  const previous = hits.get(key) ?? [];
  const recent = previous.filter((timestamp) => now - timestamp < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}
