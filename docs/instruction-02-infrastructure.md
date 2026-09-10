# Instruction 0.2 — SEO, schema, navigation, and content infrastructure

The load-bearing commit. Five later phases assume these five modules exist and behave
exactly as specified. Nothing here is visible on the site; all of it is machinery.

Self-contained again, deliberately. `lib/nav.ts` encodes the entire route table and the
cannibalization boundaries, and if it is wrong the errors surface twenty pages later as
broken internal links.

---

## Before you paste

1. Confirm `docs/sitemap-seo-plan.md` is in the repo and readable. This prompt tells
   Claude to read it for the route table — with the file missing, it will invent 40
   plausible-looking routes and keep going without erroring.
2. Confirm `NEXT_PUBLIC_SITE_URL` is set in `.env.local` and in Vercel.
3. `git status` clean, on `staging`, at 25122a3.

---

## The prompt — paste this exactly

```
Build the shared infrastructure. No visual components, no pages, no styling in this
commit. Read docs/sitemap-seo-plan.md first — sections 1, 3, 5, and 6 are the source data
for lib/nav.ts.

Install exactly these dependencies and nothing else: zod, gray-matter, next-mdx-remote.
If you think another is needed, stop and ask.

## 1. lib/seo.ts

Export buildMetadata({ title, description, path, ogImage? }) returning a Next.js Metadata
object with:
- title and description as given
- alternates.canonical as an absolute URL built from NEXT_PUBLIC_SITE_URL
- openGraph and twitter (summary_large_image) blocks
- metadataBase set from NEXT_PUBLIC_SITE_URL

It must throw at module evaluation time if NEXT_PUBLIC_SITE_URL is unset, if title exceeds
60 characters, or if description exceeds 155. Throw with the offending value and its
length in the message — these fire during builds and need to be diagnosable without
opening the file.

## 2. lib/schema.ts and components/seo/JsonLd.tsx

JsonLd is a server component rendering <script type="application/ld+json"> with the object
passed to it, serialized safely. It is not a client component and takes no hooks.

In lib/schema.ts, export typed builders returning plain objects for: Organization, WebSite,
Service, FAQPage, HowTo, Article, BreadcrumbList, CollectionPage, AboutPage, ContactPage.
Each takes a narrow typed argument — not a loose Record. buildBreadcrumbList takes an array
of { name, path } and resolves absolute URLs itself. buildFaqPage takes the same
question/answer array shape the FAQ component will later render from, so the two can never
diverge.

## 3. lib/nav.ts — single source of truth

Every route from docs/sitemap-seo-plan.md, including ones not yet built. 40 entries.

Each entry: path, label, shortLabel (for the mega menu), parent, funnelStage ('tof' |
'mof' | 'bof' | 'cross' | null), pageType ('page' | 'hub' | 'service' | 'index'), and
anchorVariants — an array of 2-4 approved anchor text strings for internal links to that
page, drawn from that page's H1 vocabulary in the SEO plan.

Export helpers:
- getRoute(path) — throws on unknown path rather than returning undefined
- servicesByStage(stage) — returns service entries in that stage, in the order listed in
  the SEO plan
- counterpartsOf(slug) — returns the counterpart pages from the boundary table in section
  3 of the SEO plan. Returns an array, not a single value: SEO has two counterparts
  (organic-capture and generative-engine-optimization)
- industryServices(industrySlug) — returns exactly the six services mapped to that industry
  in section 5
- Each helper throws on an unknown input. Silent empty arrays hide broken links.

Type the path field as a union of literal strings, so a typo anywhere in the codebase is a
compile error rather than a 404 discovered in the audit.

## 4. lib/content.ts

Loading and validation for content/services, content/industries, content/proof,
content/point-of-view. Read from disk with fs, parse frontmatter with gray-matter, compile
MDX with next-mdx-remote/rsc.

Zod schemas per collection. The services schema requires: title (max 60), description (max
155), primaryKeyword, secondaryKeywords (array), pageType ('hub' | 'service'), funnelStage,
summary (60-80 words, validated by word count), counterpartSlugs (array, may be empty for
hubs), publishedAt, updatedAt.

Validation failures fail the build with the file path and the failing field. Additionally
fail if a counterpartSlug does not resolve to a route in lib/nav.ts.

Do not create any MDX files in this commit — the schemas exist before the content does.

## 5. app/sitemap.ts and app/robots.ts

sitemap.ts generates from lib/nav.ts, filtered to routes whose content exists on disk, with
lastModified from MDX updatedAt where available and file mtime otherwise. Exclude
/kitchen-sink.

robots.ts returns disallow all unless process.env.VERCEL_ENV === 'production'. Write it so
that an unset VERCEL_ENV — which is the case locally — also disallows. Fail closed.

## 6. scripts/content-check.ts, run as a prebuild step

A node script that walks content/**/*.mdx and fails the build when VERCEL_ENV is
'production' if any file:
- contains the string "[[metric:"
- contains any word from the banned list in CLAUDE.md section 4, matched case-insensitively
  on word boundaries in prose only — skip fenced code blocks, since "transform" is a
  legitimate CSS property
- is a service page under 1,100 words of body copy, excluding frontmatter
- is a service page with fewer than six internal links to other routes in lib/nav.ts

Report every violation with file, line, and reason before exiting non-zero. Do not stop at
the first one.

Wire it as "prebuild" in package.json so it runs on every build without a separate step.
Note in the script's header comment that it covers MDX only — pages built as .tsx are
checked at the pre-launch audit instead.

## 7. Before you finish

Run npm run build and npm run typecheck. Both must pass with no content files present.
Then temporarily add a throwaway MDX file that violates three rules at once, confirm the
prebuild check catches all three and reports all three, and delete it. Show me that output.

Commit: feat: SEO, schema, navigation, and content infrastructure
```

---

## What to check before accepting

- [ ] Dependencies added: **zod, gray-matter, next-mdx-remote — and nothing else**
- [ ] `lib/nav.ts` has 40 entries and the `path` field is a literal union type, not `string`
- [ ] Spot-check five routes against `docs/sitemap-seo-plan.md` section 5: slug, stage,
      and counterpart. Check `seo` specifically — it must return **two** counterparts
- [ ] `counterpartsOf('paid-search-ppc')` returns `branded-search-ppc`, and the reverse
      also resolves. Every boundary pair must be symmetric
- [ ] `industryServices('healthcare-marketing')` returns exactly the six from the mapping
      table, not five and not seven
- [ ] `JsonLd` has no `'use client'` directive
- [ ] `buildMetadata` throws on a 61-character title — test it
- [ ] `robots.ts` disallows when `VERCEL_ENV` is unset, not just when it is `preview`
- [ ] The three-violation test output was shown, and reported **all three**, not just the first
- [ ] `npm run build` passes with `content/` empty

---

## Where this one goes wrong

**Helpers that return empty instead of throwing.** If `servicesByStage('tof')` quietly
returns `[]` for a typo'd stage, the top-of-funnel hub renders as an empty page and nobody
notices until the audit. Every lookup in `nav.ts` must be loud.

**A `string` path type.** It compiles, it works, and it removes the single biggest
protection you have across 40 routes and roughly 200 internal links. If Claude typed
`path: string`, send it back.

**The content check stopping at the first violation.** On a 23-page wave you want the full
list in one build, not 23 sequential builds each revealing one problem.

**An over-built MDX pipeline.** The reflex here is contentlayer, velite, or
content-collections. All three are reasonable tools and all three add a config surface, a
build step, and a set of conventions that will fight the Zod schemas. `fs` plus
`gray-matter` plus `next-mdx-remote` is about eighty lines and stays legible.

**`metadataBase` omitted.** Without it, Next.js emits relative OG image URLs, which most
social scrapers reject silently. It is a one-line fix now and an invisible bug later.

---

## Next

Prompt 0.3 — layout primitives. Short and unglamorous: Container, Section, SectionHead,
Prose, Rule, Button. The one thing to hold firm on there is that `Section` owns all
vertical rhythm; the moment a page sets its own padding, the spacing system stops being a
system.
