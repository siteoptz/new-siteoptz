# Addendum — supporting page specs

Append this to `docs/sitemap-seo-plan.md` as section 8. It replaces every "unchanged from
v1, full specs in the archived v1 file" reference. After appending, v2 is self-contained
and the archived v1 file can be ignored entirely.

---

## 8. Supporting page specs

### `/` — Home

- Primary: marketing attribution consultancy
- Secondary: marketing measurement consulting, marketing intelligence consultancy
- Title (44): `Marketing Attribution Consultancy | SiteOptz`
- Meta (149): `We build the measurement layer that connects marketing spend to booked revenue, then run the search and AI programs on top of it. See how we work.`
- H1: Know which marketing spend produced revenue.
- Schema: Organization + WebSite, in the root layout only. No page-specific type.

### `/how-it-works`

- Primary: marketing attribution audit
- Secondary: marketing measurement audit, marketing agency onboarding process
- Title (33): `How an Engagement Runs | SiteOptz`
- Meta (144): `Four stages: measurement audit, build the layer, run the programs, standing review. The first two are fixed scope and useful on their own.`
- H1: How an engagement runs.
- Sections: page hero · each of the four stages in full, with inputs, outputs, and duration
  · what the audit deliverable contains · what we need from your team · pricing model
  explained in structure, not numbers · what happens if we are not the right fit · CTA
- Schema: HowTo, BreadcrumbList
- Words: 1,100–1,400

### `/industries`

- Primary: industries we serve marketing
- Title (32): `Industries We Work In | SiteOptz`
- Meta (140): `Multi-location healthcare, self-storage portfolios, professional services, and agency partners — where measurement is the hard part.`
- H1: Where measurement is the hard part.
- Sections: page hero · what the four have in common · four entries with 100-word summaries · CTA
- Schema: CollectionPage, BreadcrumbList
- Words: 500–700

### `/industries/healthcare-marketing`

- Primary: healthcare marketing agency multi-location
- Secondary: medical practice marketing agency, patient acquisition marketing, EMR conversion tracking
- Title (52): `Multi-Location Healthcare Marketing Agency | SiteOptz`
- Meta (152): `Patient acquisition measured to the booked consultation in your EMR, across every location, with HIPAA-aware tracking and call handling review.`
- H1: Patient acquisition measured to the booked consultation.
- Sections: page hero · what makes healthcare attribution hard — EMR isolation, HIPAA
  constraints, call-driven intake, per-location capacity · how we handle PHI and tracking ·
  which of the six mapped services apply and how they combine · what a monthly review looks
  like for a clinic group · FAQ (5) · proof links · CTA
- Schema: Service, FAQPage, BreadcrumbList
- Words: 1,300–1,600

### `/industries/self-storage-marketing`

- Primary: self storage marketing agency
- Secondary: self storage SEO, storage facility PPC, occupancy marketing
- Title (39): `Self-Storage Marketing Agency | SiteOptz`
- Meta (149): `Facility-level marketing for storage portfolios: spend allocated by occupancy and rate, map pack coverage per site, reporting the whole portfolio.`
- H1: Marketing run facility by facility.
- Sections: page hero · why portfolio-wide averages hide everything · occupancy and rate as
  inputs to budget · map pack coverage per facility · what the portfolio report shows ·
  FAQ (4) · CTA
- Schema: Service, FAQPage, BreadcrumbList
- Words: 1,100–1,400

### `/industries/professional-services-marketing`

- Primary: professional services marketing agency
- Secondary: B2B lead attribution, long sales cycle attribution
- Title (48): `Professional Services Marketing Agency | SiteOptz`
- Meta (146): `Long consideration cycles measured properly: inquiry to signed engagement, with the lag accounted for instead of averaged away in monthly reporting.`
- H1: Measurement that survives a nine-month sales cycle.
- Sections: page hero · why monthly reporting misleads on long cycles · cohort-based
  reporting explained · what we track between inquiry and signature · which services apply ·
  FAQ (4) · CTA
- Schema: Service, FAQPage, BreadcrumbList
- Words: 1,000–1,300

### `/industries/agency-partners`

- Primary: white label marketing attribution for agencies
- Secondary: agency partnership marketing analytics, outsourced marketing measurement
- Title (46): `Attribution and Analytics for Agencies | SiteOptz`
- Meta (150): `We build and run the measurement layer underneath your creative and campaign work, under your brand or ours. Fixed scope, defined escalation paths.`
- H1: The measurement layer, built underneath your work.
- Sections: page hero · what we take on and what stays yours · white-label vs co-branded
  terms · how reporting is delivered to your clients · commercial structure · FAQ (4) · CTA
- Schema: Service, FAQPage, BreadcrumbList
- Words: 900–1,200

### `/proof` and `/proof/[slug]`

- Primary (hub): marketing attribution case studies
- Title (34): `Client Work and Results | SiteOptz`
- Meta (143): `Engagements described with the numbers we can evidence: what was measured, what changed, and what it cost. No composite case studies.`
- H1 (hub): Client work, with the numbers we can evidence.
- Hub sections: page hero · how figures are sourced and approved · filterable list by
  industry and service · CTA
- Detail sections: situation · what was unmeasurable · what we built · what changed
  (MetricTable, sourced) · timeline · client quote · services used (CrossLinks)
- Schema: CollectionPage on hub; Article + BreadcrumbList on detail
- Words: hub 400–600; each case 800–1,200
- Blocker: written client approval required for every named figure

### `/point-of-view` and `/point-of-view/[slug]`

- Primary (hub): marketing measurement insights
- Title (24): `Point of View | SiteOptz`
- Meta (139): `Written positions on attribution, AI search, and marketing measurement — for operators deciding where to put next quarter's budget.`
- H1 (hub): Positions, argued.
- Detail template: Source Serif 4 body, 38rem measure, sticky table of contents on desktop,
  byline, published and updated dates, related articles
- Schema: CollectionPage on hub; Article + BreadcrumbList + Person on detail
- Words: hub 300–500; articles 1,200–2,500
- First five articles: why platform-reported conversions overstate paid search · what a
  measurement audit actually finds · how to read a map pack scan · what GEO can and cannot
  do today · the case against blended cost per lead

### `/about`

- Primary: marketing attribution consultancy about
- Title (39): `About SiteOptz | Marketing Intelligence`
- Meta (141): `A small senior team doing analyst work for operators. Who does the work, how we are structured, and what we will not take on.`
- H1: A small team doing analyst work.
- Sections: page hero · how the firm is structured and why it stays small · who does the
  work, with real names, roles, photos · how we choose clients · what we decline · CTA
- Schema: AboutPage, Organization, BreadcrumbList
- Words: 700–1,000

### `/contact`

- Primary: marketing attribution consultation
- Title (33): `Book a Working Session | SiteOptz`
- Meta (138): `Tell us what you are trying to measure. We reply within one business day with either a session time or a referral elsewhere.`
- H1: Book a working session.
- Sections: short intro · form · what happens after you submit, in specific steps · direct
  email and phone · office location
- Form fields: name, company, role, number of locations, monthly spend band, current stack,
  what you are trying to measure
- Schema: ContactPage, Organization, BreadcrumbList
- Words: 300–450

### `/privacy` and `/terms`

- Indexable, not noindexed — they are trust signals for enterprise buyers
- Real content covering analytics and call tracking, form data handling and retention,
  client data handling, and cookie use. No generator boilerplate
- Schema: WebPage, BreadcrumbList

---

## Outstanding asset and infrastructure gaps

Tracked here so they do not surface at launch.

1. **Logo file.** Organization schema currently points at `/favicon.ico`. Google's
   structured data guidance expects a real raster logo. Add `/public/logo.png` at 512×512
   minimum, plus an SVG wordmark for the header if the text wordmark is ever replaced.
2. **OG images.** `opengraph-image.tsx` per route segment via `next/og` was in the Phase 0
   technical checklist but was not included in prompt 0.2, so it does not exist. Without it,
   every shared link renders a blank card. Build it as a standalone commit before Phase 4 —
   it is one file using the type tokens, and it covers all 40 routes.
3. **Favicon set.** Real favicon, apple-touch-icon, and `theme-color` matching `--color-navy-900`.
