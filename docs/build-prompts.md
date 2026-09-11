# SiteOptz.com — build prompts (v2)

Supersedes v1. 40 routes, built in waves. Run these in order, one at a time, in Claude
Code. Each produces one commit and one preview deploy you review before moving on.

---

## Apply these edits to CLAUDE.md first

**1. Replace the `app/(marketing)` block in section 2 with:**

```
app/
  (marketing)/
    layout.tsx
    page.tsx                          home
    services/page.tsx                 services hub
    services/[slug]/page.tsx          23 service pages + 3 stage hubs, from MDX
    how-it-works/page.tsx
    industries/page.tsx
    industries/[slug]/page.tsx        4 industry pages from MDX
    proof/page.tsx
    proof/[slug]/page.tsx
    point-of-view/page.tsx
    point-of-view/[slug]/page.tsx
    about/page.tsx
    contact/page.tsx
```

**2. Add to section 2, under conventions:**

> Stage hubs and service pages share one dynamic route. Frontmatter carries
> `pageType: 'hub' | 'service'` and `funnelStage: 'tof' | 'mof' | 'bof' | 'cross'`.
> The route branches on `pageType`. Do not create a second dynamic route for hubs.

**3. Add a new section 3b — Funnel taxonomy:**

> The site is organized by funnel stage: top, middle, bottom. Attribution sits outside
> the funnel because it measures all three. This is a real structure, not a label — the
> mega menu, the internal linking clusters, and the home page all express it. Every
> service page declares its stage in frontmatter, and the stage appears as the kicker in
> its PageHero. A page's stage is never guessed at render time.

**4. Add to section 4, voice rules:**

> Twenty-three service pages share a skeleton. Sameness is the failure mode. Before
> writing any service page, read two already-built pages from the same stage and
> deliberately vary sentence rhythm, opening structure, and example choice. Never reuse a
> sentence across pages. Never describe two channels with the same verb.

---

## Working loop, every prompt

```
paste prompt → review the diff before accepting → npm run build locally →
git commit → git push → open the preview URL → check against the Definition of Done →
next prompt
```

Do not batch. When you review, look for these six things first: a banned word, a number
with no source, a rounded card matching every other card, an eyebrow label, an arrow in a
button, and a sentence you have read on another page.

---

# Phase 0 — foundation

## Prompt 0.1 — scaffold

```
Scaffold the Next.js 15 App Router project in this repo, TypeScript strict, Tailwind CSS
v4, ESLint + Prettier. Set up the directory structure exactly as listed in section 2 of
CLAUDE.md — create the folders with .gitkeep where they are still empty.

Configure next/font/google for Inter Tight (600), Inter (400, 500), and Source Serif 4
(400, 600). Self-host at build, display swap, preload Inter Tight only, and configure a
size-adjust fallback for each so there is no layout shift on load.

Define every color and type token from section 3 of CLAUDE.md in app/globals.css using
Tailwind v4's @theme directive. Set the type scale as named steps, not arbitrary values.

Do not build pages or components yet. Do not add a UI library, animation library, or icon
library.

Commit: chore: scaffold Next.js app with design tokens
```

## Prompt 0.2 — SEO, schema, navigation, content infrastructure

```
Build the shared infrastructure. No visual components yet.

1. lib/seo.ts — buildMetadata() taking title, description, path, optional OG image,
   returning a Metadata object with absolute canonical from NEXT_PUBLIC_SITE_URL, OG, and
   Twitter card. Throw at build time if title > 60 chars or description > 155.

2. components/seo/JsonLd.tsx plus typed builders in lib/schema.ts for: Organization,
   WebSite, Service, FAQPage, HowTo, Article, BreadcrumbList, CollectionPage, AboutPage,
   ContactPage.

3. lib/nav.ts — single source of truth for all 40 routes from docs/sitemap-seo-plan.md,
   including ones not yet built. Each entry: path, label, mega-menu short label, parent,
   funnelStage, and the approved anchor-text variants for internal links to that page.
   Export helpers: servicesByStage(stage), counterpartOf(slug) using the boundary table in
   section 3 of the SEO plan, and industryServices(industry) using the mapping in section 5.

4. lib/content.ts — MDX loading for content/services, content/industries, content/proof,
   content/point-of-view, with Zod frontmatter schemas. The services schema requires:
   title, description, primaryKeyword, secondaryKeywords, pageType, funnelStage, summary
   (60-80 words), counterpartSlug, publishedAt, updatedAt. Fail the build on invalid
   frontmatter, and fail if a service declares a counterpartSlug that does not resolve.

5. app/sitemap.ts from lib/nav.ts plus MDX frontmatter with lastModified. app/robots.ts
   returning disallow all unless VERCEL_ENV === 'production'.

6. A build-time content check failing production builds on: the string "[[metric:", any
   banned word from CLAUDE.md section 4, a service page under 1,100 words, or a service
   page with fewer than six outbound internal links.

Commit: feat: SEO, schema, navigation, and content infrastructure
```

## Prompt 0.3 — layout primitives

```
Build components/ui: Container, Section, SectionHead, Prose, Rule, Button.

Section takes surface: 'paper' | 'paper-2' | 'navy' and applies the vertical rhythm from
CLAUDE.md section 3. It is the only place section padding is defined — no page sets its own.

SectionHead takes a heading and optional lead, on the two-column asymmetric grid in
section 3. No eyebrow prop. Do not add one later.

Button variants: primary, ghost (navy surfaces), line (paper). 3px radius, no shadow, no
transform on hover, no arrow. Renders as a link with href, a button otherwise. Visible
focus ring in all variants.

Prose sets measure caps and heading rhythm, with a serif variant at 38rem for articles only.

Commit: feat: layout and UI primitives
```

## Prompt 0.4 — header, three-column mega menu, footer

```
Build components/layout: Header, MegaMenu, Footer, Breadcrumbs. Drive everything from
lib/nav.ts — no hardcoded links anywhere.

Header: navy-900, sticky, 76px, hairline bottom border. Wordmark left with the descriptor
"Marketing intelligence" beside it. Nav right: Services, How it works, Industries, Point
of view, Proof, plus a primary Button to /contact.

MegaMenu is the hard part — it holds 23 services. Opening "Services" reveals a full-width
navy-800 panel with four columns: Top of funnel (10), Middle of funnel (6), Bottom of
funnel (8), and a fourth column holding the attribution pillar treated as a distinct item
with a one-line description, plus a link to the most recent proof entry. Each column
header is a link to that stage hub, not a dead label. Items are short labels from
lib/nav.ts, one line each, no descriptions — at this count, descriptions make the panel
unreadable.

Opens on click and keyboard, not hover-only. Escape closes, focus trapped while open,
aria-expanded on the trigger. Panel height opens in 140ms; nothing else moves. Industries
opens a simpler single-column panel.

Under 900px: full-height drawer, services nested one level under collapsible stage
headings. No hamburger icon — use the word "Menu".

Footer: navy-900. Five columns: three funnel stages listing their services, industries,
and company. This footer is large by design — it is the secondary navigation for a
40-route site and a real internal linking surface. Bottom bar: copyright, privacy, terms.

Breadcrumbs: hairline-separated text links below the page hero on every page except home,
always with BreadcrumbList schema.

Commit: feat: header with mega menu, footer, breadcrumbs
```

## Prompt 0.5 — content blocks

```
Build components/blocks. These are the only layout patterns the site uses. No page invents
a new one without adding it here first.

- PageHero: navy-900, kicker (funnel stage, sentence case, blue-300), h1 capped 18ch, lead
  capped 46ch, optional Button.
- BoundaryStatement: a bordered-left block for the "what this page covers and does not"
  section. Takes the counterpart page from lib/nav.ts and renders the link automatically —
  the boundary link is never hand-written.
- RuleList: hairline-separated rows, three columns (short label, heading, description +
  link). Not a card grid: no side borders, no radius, no shadow.
- StageGrid: for hub pages. Lists a stage's services as hairline rows with 60-word
  summaries from frontmatter. Never duplicates copy into the hub.
- DefinitionList: two-column dt/dd rows separated by hairlines.
- StageSequence: the four-stage engagement process. The only component permitted numbered
  markers.
- MetricTable: bordered figure with caption, tabular-nums, right-aligned numerics.
  Requires a `source` prop naming the account. source='placeholder' renders em dashes and
  a marker that fails production builds.
- QuoteBlock: Source Serif 4 at 1.35rem, 2px blue left rule, requires name, role, org.
- CrossLinks: three sibling links, 1px grid gaps, no radius.
- CTABand: navy-800, heading left, Button right, stacks at 900px.
- FAQ: accordion with real disclosure semantics, paired with FAQPage schema generated from
  the same data so the two cannot diverge.

Build /kitchen-sink rendering every block with sample content, excluded from sitemap and
noindexed.

Commit: feat: content block components
```

**Review gate.** Look at `/kitchen-sink` before continuing. If the blocks read as a
generic SaaS kit here, they will on all 40 pages. Fix the system now, not later.

---

# Phase 1 — home

## Prompt 1.1

```
Build app/(marketing)/page.tsx per route 1 in docs/sitemap-seo-plan.md. Use only existing
blocks.

The hero has to work hardest. Left: h1 and lead. Right: a component called
AttributionChain — a vertical six-step list showing budget committed, click or impression,
call or form, qualified inquiry, booked outcome, revenue recorded, each with a small source
line. Between steps three and four, a marked break in --color-signal reading that most
agency reporting stops above that line. Pure HTML and CSS. No SVG library, no illustration,
no animation. This is the only place --color-signal appears on the site.

The services section shows the three funnel stages, not 23 links — each with its heading,
a one-sentence description, the count of programs in it, and a link to the stage hub. The
attribution pillar is presented separately, below them, as the thing that measures all
three. Make that relationship structural, not a diagram.

Four-stage engagement section uses StageSequence on navy. Deliverables section pairs a
hairline list with a MetricTable at source='placeholder'. Quote uses QuoteBlock with
placeholder attribution clearly marked.

No client logo wall — that decision is settled.

Commit: feat: home page
```

---

# Phase 2 — pillar and template

## Prompt 2.1

```
Build content/services/marketing-attribution.mdx and app/(marketing)/services/[slug]/page.tsx,
which becomes the template for all 23 service pages and 3 stage hubs. The route branches on
frontmatter pageType: 'hub' renders StageGrid, 'service' renders the standard anatomy from
section 4 of the SEO plan.

Follow the pillar spec in section 5 of the SEO plan exactly: sections in order,
1,600-2,000 words, Service + FAQPage + BreadcrumbList schema, funnelStage 'cross'.

Write this as the most complete explanation of attribution the reader will find while
evaluating vendors. Be specific about the mechanics of call scoring, offline conversion
import, and identity matching against a CRM, EMR, or property management system. Name the
real constraint in each case, including where matching is probabilistic and how we document
its accuracy rather than presenting an estimate as a measurement.

Six FAQ entries answering a skeptical CMO: what if our EMR has no API, how long until the
data is trustworthy, do you replace our current agency, what happens to historical data,
how is this different from GA4 attribution, who owns the tracking setup if we leave.

Links to all three stage hubs plus the rest of the linking map.

Commit: feat: attribution pillar and service page template
```

---

# Phase 3 — service pages, in four waves

Ship each wave, deploy, get it indexed, then start the next. Nine strong pages beat 23
thin ones live at once.

**Wave 1** — highest commercial intent: `paid-search-ppc`, `seo`,
`conversion-rate-optimization`, `paid-social-advertising`,
`generative-engine-optimization`, `marketing-operations`

**Wave 2** — `branded-search-ppc`, `organic-capture`, `email-marketing`,
`content-marketing`, `retargeting`, `answer-engine-optimization`

**Wave 3** — `programmatic-advertising`, `creative-ads-strategy`, `creative-production`,
`campaign-launch-strategy`, `social-media`, `affiliate-marketing`

**Wave 4** — `influencer-marketing`, `partnerships`

## Prompt 3.x — run once per page, substituting the slug

```
Build content/services/<slug>.mdx using the existing service template. Follow its spec in
section 5 of docs/sitemap-seo-plan.md exactly — primary and secondary keywords, title,
meta, H1, funnelStage, FAQ count, and any deltas listed for this page.

Use the standard anatomy in section 4 of the SEO plan. All ten sections, in order.

Write section 5 first — how this channel reports into the attribution layer, what its
conversion definition is, and what it cannot claim credit for. That section is what makes
this page ours rather than generic, and everything else should be written to be consistent
with it.

The boundary statement in section 2 is mandatory and must name the counterpart page from
the table in section 3 of the SEO plan, using the BoundaryStatement block so the link is
generated from lib/nav.ts.

Before writing, read two already-built service pages from the same funnel stage. Vary
sentence rhythm, opening structure, and example choice from both. Do not reuse a sentence.
Do not describe this channel with a verb already used to describe another.

1,100-1,600 words. Every internal link required by the linking map for a service page.

Commit: content: <slug> service page
```

## Prompt 3.hub — after each wave's stage is fully populated

```
Build content/services/<stage>.mdx with pageType 'hub', per its spec in section 5 of the
SEO plan. It reads its children via servicesByStage() and renders StageGrid from their
frontmatter summaries. Do not duplicate copy into the hub.

Write the hub's own body: what this stage is, what makes measurement hard at this stage
specifically, and how the programs in it combine. Link to the pillar and one sibling hub.

Commit: feat: <stage> hub
```

Run for `top-of-funnel`, `middle-of-funnel`, `bottom-of-funnel`.

## Prompt 3.final — services hub

```
Build app/(marketing)/services/page.tsx per its spec. It shows the three stage hubs and
the pillar, reading counts from lib/nav.ts so they can never go stale.

State explicitly that attribution sits underneath all three stages rather than beside
them, and show that relationship structurally. 700-900 words.

Commit: feat: services hub
```

---

# Phase 4 — process and industries

## Prompt 4.1

```
Build app/(marketing)/how-it-works/page.tsx per its spec in the SEO plan. HowTo schema.

Give each of the four stages a full section with inputs, outputs, and duration, rather
than reusing the compressed StageSequence from the home page. Include what the measurement
audit deliverable contains, how engagements are priced explained in structure without
numbers, and a short honest section on when we are not the right fit.

Commit: feat: how it works page
```

## Prompts 4.2–4.6 — industries

```
Build content/industries/<slug>.mdx and, on the first one, the template at
app/(marketing)/industries/[slug]/page.tsx. Follow its spec in the SEO plan.

These are the commercial landing pages for each vertical. Lead with the specific
measurement problem in that industry, in the vocabulary the reader uses at work. On
healthcare, be precise and conservative about PHI handling and HIPAA-aware tracking — do
not overstate what we can claim about compliance.

Link to exactly the six services mapped to this industry in section 5 of the SEO plan,
using industryServices(), with anchors drawn from each destination's H1.

Commit: content: <slug> industry page
```

Order: `healthcare-marketing`, `self-storage-marketing`,
`professional-services-marketing`, `agency-partners`, then the hub.

---

# Phase 5 — proof and point of view

## Prompt 5.1

```
Build app/(marketing)/proof/page.tsx and proof/[slug]/page.tsx per their spec, plus two
MDX entries.

The detail template requires a MetricTable with a real source value. Extend the proof
frontmatter schema with approvedBy — client approver name and date — and fail the build if
an entry has metrics but no approvedBy. Add servicesUsed as an array of service slugs,
validated against lib/nav.ts, rendered as CrossLinks.

Write the two entries at source='placeholder' throughout, structured so only numbers need
replacing. On the hub, state plainly how figures are sourced and approved, and that we do
not publish composite case studies.

Commit: feat: proof hub and case study template
```

## Prompt 5.2

```
Build app/(marketing)/point-of-view/page.tsx and [slug]/page.tsx per their spec.

The article template is the one place Source Serif 4 body copy appears: 38rem measure,
larger line height, sticky table of contents from h2s on desktop, byline, published and
updated dates, three related articles. Article + Person + BreadcrumbList schema.

Write the first article: why platform-reported conversions overstate paid search
performance. 1,800-2,200 words, argued from mechanics — view-through windows, cross-device
modeling, unfiltered call volume, brand search absorption. Take a position. Link to the
pillar and the paid search page.

Commit: feat: point of view hub, article template, and first article
```

---

# Phase 6 — company pages and launch

## Prompt 6.1

```
Build /about and /contact per their specs.

The contact form is a server action posting to GHL_WEBHOOK_URL, with honeypot, IP rate
limiting, Zod validation, and error states that say what went wrong and how to fix it. No
third-party embed. After submission, replace the form with what happens next in specific
steps and timeframes. Fields per the SEO plan.

On /about, leave typed placeholders for team names, roles, and photos.

Commit: feat: about and contact pages
```

## Prompt 6.2

```
Build /privacy and /terms with real content on analytics and call tracking, form data
handling and retention, client data handling, and cookie use. Both indexable. No generator
boilerplate.

Commit: content: privacy and terms
```

## Prompt 6.3 — pre-launch audit

```
Audit every route against the Definition of Done in CLAUDE.md section 6. Produce a table
of route by criterion, pass or fail. Do not fix anything yet — give me the table first.

Then verify separately: every link in the linking map resolves; no orphan pages; every
service page has its boundary statement and a resolving counterpart; sitemap includes all
indexable routes and nothing else; robots still disallows on preview; every title,
description, and h1 unique across 40 routes; no banned words; no [[metric:]] outside
approved placeholders; all JSON-LD valid.

Also run a duplication check: for every pair of service pages, report the longest shared
phrase over eight words. Anything over twelve words gets rewritten.

Commit nothing until I have reviewed the table.
```

## Prompt 6.4 — launch

```
Add the 301 redirect map from the current siteoptz.com WordPress URLs to the new routes in
next.config.ts — I will provide the URL export. Every old URL resolves to the closest new
page, never to the home page as a catch-all, never to a 404. Old service URLs map to their
closest new service page, not to the services hub.

Then walk me through the DNS cutover step by step, including what to check on production
before and after pointing the record, and how to confirm robots.txt flips to allow.
```

---

# Open decisions

Settle these before the phase that depends on them.

1. **"Organic" scope.** Specced as branded and local capture — Google Business Profile,
   reviews, map pack, branded queries. If you meant organic social, it collides with Social
   Media and needs re-scoping. Blocks Wave 2.
2. **SEO/GEO/AEO split.** Specced as three pages. Three distinct keyword sets, three
   competitor sets. Blocks Wave 1.
3. ~~**Amazon pages.**~~ Resolved: cut from the plan. `amazon-non-brand-search` and
   `amazon-branded-search` implied e-commerce clients, a fifth audience the site does not
   target, which would have failed the link-composition gate (no industry page to link
   to). Removed from `lib/nav.ts`, the boundary table, and this plan. Wave 4 is now just
   `influencer-marketing` and `partnerships`.
4. **Client approval** for named figures and quotes. Blocks Phase 5.1 completion.
5. **Team names, roles, photography** for /about. Blocks Phase 6.1 completion.
6. **Limb named or not** on the agency partners page. Blocks Phase 4.
