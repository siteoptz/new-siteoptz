# SiteOptz.com — build context

This file is standing context. Claude reads it before every task in this repo. Do not
delete sections to save tokens. If an instruction here conflicts with a prompt, the
prompt wins for that task only — flag the conflict in your response.

---

## 1. What this site is

The marketing site for **SiteOptz**, a marketing intelligence consultancy. The product
is a productized analyst function: attribution architecture, marketing campaign
optimization, and AI implementation.

**Audience.** Executives and owners at multi-location healthcare groups, self-storage
portfolio operators, professional services firms, and the agencies that serve them.
Titles: CMO, VP Marketing, COO, owner-operator, agency principal. Deal size assumption:
$8k–$40k/month retainers, 6–18 month engagements, committee decisions.

**They are not marketers.** They read plain language. They are evaluating three vendors
at once and are looking for reasons to disqualify. The site's job is to survive that
scan and produce a booked call with a qualified operator.

**Positioning in one line.** We build the measurement layer that connects what you
spend to what your business books, then run the acquisition programs on top of it.

**Competitive frame.** We are being compared to enterprise agencies (Tinuiti, Wpromote,
Merkle) and to mid-market generalists. Against the first we win on senior attention and
attribution depth; against the second we win on rigor. The site must look and read like
it belongs in the first group.

---

## 2. Stack and conventions

- Next.js 16, App Router, TypeScript strict
- Tailwind CSS v4, tokens defined in `app/globals.css` via `@theme`
- Deployed on Vercel. Branch `staging` → preview. `main` → production.
- Fonts via `next/font/google`, self-hosted at build
- No CMS in phase one. Content lives in MDX under `/content`, typed with Zod frontmatter schemas.
- No component library. Build the primitives in `components/ui`.
- No client-side JS unless a component genuinely needs interactivity — default to server components.

> Stage hubs and service pages share one dynamic route. Frontmatter carries
> `pageType: 'hub' | 'service'` and `funnelStage: 'tof' | 'mof' | 'bof' | 'cross'`.
> The route branches on `pageType`. Do not create a second dynamic route for hubs.

```
app/
  (marketing)/
    layout.tsx
    page.tsx                          home
    services/page.tsx                 services hub
    services/[slug]/page.tsx          21 service pages + 3 stage hubs, from MDX
    how-it-works/page.tsx
    industries/page.tsx
    industries/[slug]/page.tsx        4 industry pages from MDX
    proof/page.tsx
    proof/[slug]/page.tsx
    point-of-view/page.tsx
    point-of-view/[slug]/page.tsx
    about/page.tsx
    contact/page.tsx
  privacy/page.tsx
  terms/page.tsx
  sitemap.ts
  robots.ts
  opengraph-image.tsx
  globals.css
components/
  layout/    Header, MegaMenu, Footer, Breadcrumbs
  ui/        Button, Rule, Section, SectionHead, Prose, Container
  blocks/    HomeHero, PageHero, RuleList, DefinitionList, StageSequence,
             MetricTable, ProofCard, QuoteBlock, CrossLinks, CTABand, FAQ
  seo/       JsonLd, and schema builders
content/
  services/*.mdx
  industries/*.mdx
  proof/*.mdx
  point-of-view/*.mdx
lib/
  content.ts    MDX loading + Zod schemas
  seo.ts        metadata + schema helpers
  nav.ts        single source of truth for navigation and internal links
docs/
  sitemap-seo-plan.md
  build-prompts.md
```

**Commits.** One concern per commit. Conventional prefixes: `feat:`, `fix:`, `content:`,
`chore:`, `seo:`. One page per commit unless a page requires new primitives, in which
case: primitives commit, then page commit.

---

## 3. Design system

The site is dark throughout on a warm base drawn from the logo. The one exception is the
article detail template, which is a light reading surface from below the header to above
the footer.

### Color tokens

```css
--color-base:           #15100C;   /* base dark surface — most sections, header, footer */
--color-raised:         #211913;   /* raised panels, CTA bands, alternating sections */
--color-rule:           rgba(255,236,220,.13);  /* decorative hairlines only */
--color-field-border:   #7A6E60;   /* form field borders — functional, needs 3:1 */
--color-accent:         #F7931D;   /* official brand orange (source PSD) — links, buttons, active state */
--color-accent-lt:      #F9AE56;   /* hover — lighten, never darken, on dark surfaces */
--color-text:           #E9E1D9;   /* body copy on dark */
--color-muted:          #A99A8C;   /* secondary text on dark */
--color-danger:         #F87171;   /* form validation errors */
--color-signal:         #5FC3D6;   /* the attribution break marker — see below */
--color-reading:        #FBF8F5;   /* article body surface only */
--color-reading-ink:    #1A1512;   /* text on the reading surface */
--color-reading-accent: #B34A12;   /* links on the reading surface */
```

There is one accent. The orange clears 4.5:1 on both dark surfaces, so it carries inline
body links directly — no second link color. On dark, hover lightens to `--color-accent-lt`;
never darken.

`--color-signal` is cool by design so it can never be mistaken for the brand accent, and
still has exactly one use: the break in the attribution chain, on the home page and the
attribution pillar.

`--color-rule` is a translucent overlay and is for decorative hairlines only. It measures
under 3:1 by design. Anything functional — a form field boundary, a control edge — uses
`--color-field-border` or a token that clears 3:1. Never use `--color-rule` as a text color;
it disappears.

### Surfaces

`Section` takes `surface: 'base' | 'raised' | 'reading'` and is the only place a surface or
vertical rhythm is set. No page or block sets its own.

Pages alternate `base` and `raised`. That contrast is much lower than a light system's
would be, so a section following one of the same surface gets a hairline top border. Never
allow three identical surfaces in a row — the services leaf template derives its sequence
rather than assigning fixed surfaces, so this holds when optional sections are absent.

`reading` is used by the article detail template only, across its whole span: hero, byline,
table of contents, body, and related articles. Header and footer stay on `base` everywhere,
including there. The point-of-view hub stays dark — the transition into a light reading room
happens on click.

The reading surface needs its own focus ring: the global ring uses `--color-accent`, which
drops to 2.33:1 on cream. `.surface-reading :focus-visible` overrides to
`--color-reading-accent`.

### Typography

- **Display / headings:** Inter Tight, variable — 600 for headings, 700 for the wordmark
- **Body / UI:** Inter, 400/500
- **Editorial body:** Source Serif 4, 400 — the article reading surface and pull quotes only

Scale (rem): 0.78, 0.85, 0.94, 1.0, 1.06, 1.18, 1.35, 1.6, 2.0, 2.5, 3.2, 4.0.
Body 17px. Line-height 1.7 on dark, measure capped at 36rem — dark long-form needs both, and
this site has 21 pages of it. The serif reading variant runs 1.7 at a 38rem measure.

### Layout

12-column grid, content max-width 1180px, gutter `clamp(1.25rem, 5vw, 4.5rem)`. Section
rhythm 96px mobile / 128px desktop. Left-aligned throughout; centered text only inside CTA
bands.

### Prohibitions

- All-caps or tracked-out eyebrow labels above headings
- Accenting a single word in a headline with color, italic, or weight
- Numbered markers except on the four-stage process, which is a real sequence
- Identical rounded cards with the same radius and shadow applied to everything
- Gradient washes as decoration
- Fade-and-slide-up entrance animations on scroll
- Hover lift transitions on cards
- Arrows appended to link and button text
- Stock dashboard illustrations, abstract network graphics, AI-brain imagery
- Emoji or other non-text decoration
- Border-radius above 4px on any surface
- Tailwind's built-in color utilities (`bg-blue-600`, `text-gray-400`, and so on). They
  resolve against Tailwind's own palette rather than failing, so a component using one looks
  correct and is wrong. Only project tokens.

**Motion.** One orchestrated moment per page maximum. Respect `prefers-reduced-motion`.

**Quality floor, unannounced.** Responsive to 360px. Visible keyboard focus on every surface.
WCAG AA on every text pair — 4.5:1 body, 3:1 large text and functional non-text elements.
Semantic headings in order.

---

## 3b. Funnel taxonomy

> The site is organized by funnel stage: top, middle, bottom. Attribution sits outside
> the funnel because it measures all three. This is a real structure, not a label — the
> mega menu, the internal linking clusters, and the home page all express it. Every
> service page declares its stage in frontmatter, and the stage appears as the kicker in
> its PageHero. A page's stage is never guessed at render time.

---

## 4. Voice and copy rules

Plain, declarative, specific. Active voice. Sentence case. Short sentences. Assume the
reader is smart, busy, and skeptical.

**Banned from all copy:** success-rate percentages, "x ROI delivered", "Fortune 500",
"proven", "seamless", "unlock", "transform", "game-changing", "leverage", "best-in-class",
"end-to-end", "cutting-edge", "world-class", "synergy", "empower".

**No invented numbers.** Every figure on this site must be traceable to a named client
account. If a number is not yet available, ship a marked placeholder — `[[metric: source]]` —
which fails the build in production. Never estimate, never round up an illustration into
a claim, never write "typically" in front of a number you do not have.

**Claims discipline.** We describe method, not outcomes we cannot evidence. "We measure
X" is always shippable. "We increase X by Y%" requires a named source.

**Headlines** state the reader's situation or the thing we do. They do not tease.

Twenty-one service pages share a skeleton. Sameness is the failure mode. Before
writing any service page, read two already-built pages from the same stage and
deliberately vary sentence rhythm, opening structure, and example choice. Never reuse a
sentence across pages. Never describe two channels with the same verb.

Do not define things by negation. "X, not Y" and "not the generic version of X" are banned
as a sentence pattern — at most one per page, and only where the contrast is the point.
Every DefinitionList row names a mechanism or an artifact, never a rationale. Internal
links go where the prose has a real reason to mention the destination; a required link
with no natural home is reported, not manufactured.

---

## 5. SEO requirements — apply to every page

Non-negotiable per page:

1. `generateMetadata` exporting title, description, canonical, OG, Twitter. Title ≤60
   characters, description ≤155, both written for click-through, not keyword stuffing.
2. Exactly one `<h1>`. Heading levels sequential, no skips.
3. Primary keyword in: title, h1, first 100 words, one h2, URL slug. Once each. Do not
   repeat it into the copy beyond natural use — target keyword density is whatever it
   lands at when the writing is good.
4. JSON-LD via `components/seo/JsonLd`. Types per page listed in `docs/sitemap-seo-plan.md`.
   Organization + WebSite on the root layout only.
5. Internal links, by page type. Anchor text is drawn from the destination page's own
   vocabulary, never "click here" or a bare "learn more". Pull destinations from
   `lib/nav.ts` — no hardcoded hrefs anywhere in the codebase.
   - **Service pages:** the six-category composition rule — the attribution pillar, the
     page's own stage hub, at least two sibling services, its counterpart where one exists,
     at least one industry page, and at least one proof entry. Enforced by
     `scripts/content-check.ts`, not by a raw count.
   - **Articles:** at least one link to the attribution pillar and at least one to a service
     page.
   - **Every other .tsx route:** at least four contextual internal links in body copy,
     counted from rendered output by `scripts/check-rendered-links.ts`.
   - **`/_not-found`:** exempt. Its job is one-click recovery, not authority flow.
   A required link that has no natural home in a page's argument is reported, not
   manufactured — record it in the page's `linkExemptions` frontmatter with a reason.
6. Breadcrumbs on every page below the top level, with BreadcrumbList schema.
7. Images: `next/image`, explicit width/height, meaningful `alt`, `priority` only on the
   hero image of the page.
8. Word count targets per page in the SEO plan. These are floors for depth, not padding
   quotas — if a section would only pad, cut it and note the shortfall.

**Staging.** `robots.ts` must return `disallow: /` on any deploy where
`VERCEL_ENV !== 'production'`. No exceptions. Do not point DNS until launch is approved.

---

## 6. Definition of done — a page is not finished until

- [ ] Builds with zero TypeScript errors and zero ESLint warnings
- [ ] Metadata present, title and description within limits
- [ ] JSON-LD validates (paste into Google Rich Results Test)
- [ ] One h1, sequential headings
- [ ] Internal links, by page type, all resolving: service pages clear the six-category
      composition rule (not a raw count); articles carry at least one link to the
      attribution pillar and at least one to a service page; every other `.tsx` route
      carries ≥4 contextual internal links in body copy; `/_not-found` is exempt — its job
      is one-click recovery, not authority flow
- [ ] No banned words, no unsourced numbers, no `[[metric:]]` in a production build
- [ ] Renders correctly at 360px, 768px, 1280px, 1600px
- [ ] Keyboard navigable, focus visible, contrast AA
- [ ] Lighthouse on the preview URL: Performance ≥90, Accessibility 100, SEO 100
- [ ] Added to `sitemap.ts` and linked from at least one other page
- [ ] Committed alone, with a message describing the one concern
