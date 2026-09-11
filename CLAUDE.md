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

The visual reference is siteoptz.ai — deep navy base, #2563EB blue, dense structured
footer. Inherit the palette and the brand feel. Do **not** inherit its copy conventions.

### Color tokens

```css
--color-navy-900: #060B16;   /* base dark surface, hero, footer, CTA bands */
--color-navy-800: #0D1626;   /* raised panel on dark */
--color-navy-700: #17243D;   /* borders and dividers on dark */
--color-blue-600: #2563EB;   /* primary action, links, active state */
--color-blue-700: #1D4ED8;   /* hover */
--color-blue-300: #7FB0FF;   /* accent text on dark surfaces only */
--color-paper:    #FFFFFF;   /* default content surface */
--color-paper-2:  #F5F7FA;   /* alternating section surface */
--color-rule:     #E4E9F2;   /* hairline on light */
--color-ink:      #0D1321;   /* body text on light */
--color-muted:    #4E5A72;   /* secondary text on light */
--color-signal:   #D99A45;   /* ONE semantic use: marking a measurement break */
```

Rules: long-form body copy always sits on `paper` or `paper-2`. Dark surfaces are
reserved for the home hero, page heroes, the stage sequence, CTA bands, and the footer.
Never set body copy longer than three paragraphs on navy. `--color-signal` is not a
decorative accent; it appears only where the page marks a break in attribution.

### Typography

- **Display / headings:** Inter Tight (variable axis, no fixed weight loaded), 600 for
  headings, 700 for the header wordmark only; tracking -0.028em at h2, -0.033em at h1
- **Body / UI:** Inter, 400/500
- **Editorial body:** Source Serif 4, 400 — used only in `/point-of-view` article bodies and in pull quotes. Nowhere else.

Scale (rem): 0.78, 0.85, 0.94, 1.0, 1.06, 1.18, 1.35, 1.6, 2.0, 2.5, 3.2, 4.0.
Body 17px/1.6. Measure capped at 34rem sans, 38rem serif.

### Layout

12-column grid, content max-width 1360px, gutter `clamp(1.25rem, 5vw, 4.5rem)`.
Section rhythm: 96px mobile / 128px desktop vertical padding. Left-aligned throughout;
centered text only inside CTA bands. Alternate `paper` and `paper-2` between sections so
the page reads as sequenced rather than stacked.

### Prohibitions

These are the tells that make a page read as generated. Do not ship them.

- All-caps or tracked-out eyebrow labels above headings
- Accenting a single word in a headline with color, italic, or weight
- Numbered markers (01 / 02 / 03) except on the four-stage process, which is a real sequence
- Identical rounded cards with the same border-radius and soft grey shadow on everything
- Gradient washes as decoration
- Fade-and-slide-up entrance animations on scroll
- Hover lift transitions on cards
- Arrows appended to link and button text
- Stock dashboard illustrations, abstract network graphics, AI-brain imagery
- Emoji or other non-text decoration
- Border-radius above 4px on any surface

**Motion.** One orchestrated moment per page maximum, and only where it shows a change
of state the user caused. Respect `prefers-reduced-motion`.

**Quality floor, unannounced.** Responsive to 360px. Visible keyboard focus. WCAG AA
contrast on every text/background pair. Semantic headings in order. All interactive
elements reachable by keyboard.

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

Twenty-three service pages share a skeleton. Sameness is the failure mode. Before
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
5. Minimum four contextual internal links in body copy, using descriptive anchor text
   drawn from the target page's own vocabulary. Never "click here", never "learn more"
   as the full anchor. Pull link destinations from `lib/nav.ts`.
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
- [ ] ≥4 contextual internal links, all resolving
- [ ] No banned words, no unsourced numbers, no `[[metric:]]` in a production build
- [ ] Renders correctly at 360px, 768px, 1280px, 1600px
- [ ] Keyboard navigable, focus visible, contrast AA
- [ ] Lighthouse on the preview URL: Performance ≥90, Accessibility 100, SEO 100
- [ ] Added to `sitemap.ts` and linked from at least one other page
- [ ] Committed alone, with a message describing the one concern
