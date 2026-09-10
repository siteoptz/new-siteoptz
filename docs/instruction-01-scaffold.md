# Instruction 0.1 — scaffold and design tokens

The first thing you run. Everything else in `docs/build-prompts.md` assumes this commit
exists and is correct.

**This prompt is self-contained.** It repeats the tokens rather than pointing at
CLAUDE.md, because on the first run there is no code for Claude to check its
interpretation against, and a token misread here propagates into all 40 pages.

---

## Before you paste anything

Do these yourself. Claude cannot do them from inside the repo.

1. **Node 22 LTS.** `node -v` should report v22.x. Next.js 16 requires Node 20.9+.
2. **Create the repo**, empty, then locally:
   ```
   git init && git checkout -b staging
   ```
3. **Place the docs** before starting Claude Code, so it reads them on first load:
   ```
   CLAUDE.md                     (repo root)
   docs/sitemap-seo-plan.md
   docs/build-prompts.md
   ```
4. **Apply the four CLAUDE.md edits** listed at the top of `docs/build-prompts.md`, plus
   one more: change "Next.js 15" to "Next.js 16" in section 2. Next.js 15 reaches
   end-of-life on 21 October 2026.
5. **Connect Vercel.** Production branch `main`, preview branch `staging`. Do not point
   DNS. Do not import the existing WordPress site.
6. **Set env vars in Vercel** for all environments:
   ```
   NEXT_PUBLIC_SITE_URL=https://siteoptz.com
   GHL_WEBHOOK_URL=<your GHL inbound webhook>
   ```
   And locally in `.env.local` with `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
7. **Start Claude Code** from the repo root: `claude`

---

## The prompt — paste this exactly

```
Scaffold this repository. This is commit one of a 40-page marketing site. Build only what
is listed here — no pages, no components, no placeholder content beyond what create-next-app
generates.

## 1. Initialize

Run: npx create-next-app@latest . --typescript --app --tailwind --eslint --no-src-dir
--import-alias "@/*" --turbopack

Confirm the installed Next.js major version is 16 and Tailwind is 4.x. If create-next-app
installs anything else, stop and tell me before continuing.

Set tsconfig strict: true, noUncheckedIndexedAccess: true, noImplicitOverride: true.

Add Prettier with a config: 100 print width, single quotes off, semicolons on, trailing
commas es5. Add prettier-plugin-tailwindcss. Wire an npm script "format".

Install no other dependencies. Specifically: no UI kit, no shadcn, no icon library, no
animation library, no clsx, no CSS-in-JS. If you believe one is needed later, ask before
adding it.

## 2. Directory structure

Create these directories, with a .gitkeep in any that are still empty:

app/(marketing)/
components/layout/
components/ui/
components/blocks/
components/seo/
content/services/
content/industries/
content/proof/
content/point-of-view/
lib/
docs/            (already populated — do not touch)

Delete the create-next-app boilerplate from app/page.tsx and app/globals.css. Leave
app/page.tsx rendering a bare h1 reading "SiteOptz" so the build has an entry point. Move
nothing into app/(marketing) yet.

## 3. Fonts

Create app/fonts.ts using next/font/google:

- Inter Tight, weight 600, variable --font-display, display swap
- Inter, weights 400 and 500, variable --font-sans, display swap
- Source Serif 4, weights 400 and 600, variable --font-serif, display swap

Give each an explicit fallback array. Leave adjustFontFallback at its default — next/font
computes the fallback metrics itself, so do not hand-write size-adjust rules.

Apply all three variables to the html element in app/layout.tsx. Preload only the display
face; set preload false on the other two.

## 4. Design tokens

Replace app/globals.css entirely. Import Tailwind, then define every token below in a
@theme block. Tailwind 4 is CSS-first — do not create a tailwind.config.js.

Colors, exactly these values:
--color-navy-900: #060B16
--color-navy-800: #0D1626
--color-navy-700: #17243D
--color-blue-600: #2563EB
--color-blue-700: #1D4ED8
--color-blue-300: #7FB0FF
--color-paper:    #FFFFFF
--color-paper-2:  #F5F7FA
--color-rule:     #E4E9F2
--color-ink:      #0D1321
--color-muted:    #4E5A72
--color-signal:   #D99A45

Fonts, wired to the next/font variables:
--font-display: var(--font-display-src), "Inter Tight", system-ui, sans-serif
--font-sans:    var(--font-sans-src), "Inter", system-ui, sans-serif
--font-serif:   var(--font-serif-src), "Source Serif 4", Georgia, serif

Type scale as named steps — these are the only text sizes the site may use:
--text-2xs: 0.78rem
--text-xs:  0.85rem
--text-sm:  0.94rem
--text-base: 1rem
--text-md:  1.06rem
--text-lg:  1.18rem
--text-xl:  1.35rem
--text-2xl: 1.6rem
--text-3xl: 2rem
--text-4xl: 2.5rem
--text-5xl: 3.2rem
--text-6xl: 4rem

Layout tokens:
--container-site: 85rem
--spacing-gutter: clamp(1.25rem, 5vw, 4.5rem)
--spacing-section: 6rem
--spacing-section-lg: 8rem
--measure-sans: 34rem
--measure-serif: 38rem
--radius-default: 3px

Then base styles outside the @theme block:
- body: font-sans, 17px, line-height 1.6, color ink, background paper
- h1 through h4: font-display, weight 600, line-height 1.12; tracking -0.033em on h1,
  -0.028em on h2, -0.015em on h3
- :focus-visible: 2px solid blue-600, offset 3px — never remove focus outlines anywhere
- a @media (prefers-reduced-motion: reduce) block disabling transitions and animations
- no other global styles, no CSS reset beyond Tailwind's preflight

## 5. Housekeeping

- .env.example listing NEXT_PUBLIC_SITE_URL and GHL_WEBHOOK_URL with no values
- .gitignore covering .env.local, .next, node_modules, .vercel
- npm scripts: dev, build, start, lint, format, typecheck

## 6. Before you finish

Run npm run build and npm run typecheck. Both must pass clean. Report the installed
Next.js and Tailwind versions in your summary.

Commit: chore: scaffold Next.js app with design tokens
```

---

## What to check before accepting

Run through this yourself. Do not accept the commit until every line passes.

- [ ] `npm run build` completes with zero errors and zero warnings
- [ ] `package.json` shows Next.js 16.x and Tailwind 4.x
- [ ] Dependency list contains **only** next, react, react-dom, typescript, tailwindcss,
      eslint, prettier and their direct tooling. Anything else was added without asking —
      reject the commit
- [ ] **No `tailwind.config.js` or `tailwind.config.ts` exists.** If Claude created one,
      it built for Tailwind 3 and the token system is wrong. Reject and re-run
- [ ] `app/globals.css` contains all 12 color tokens with the exact hex values above
- [ ] The type scale has 12 named steps and no arbitrary values anywhere
- [ ] `app/fonts.ts` has no hand-written `size-adjust` or `ascent-override` rules
- [ ] `.env.local` is gitignored and not committed
- [ ] One commit, message as specified

Then push and confirm the Vercel preview builds.

---

## Two things Claude tends to get wrong here

**It writes a `tailwind.config.js` out of habit.** Tailwind 4 moved configuration into
CSS. A config file means the `@theme` tokens are not driving anything and every later
component will use hardcoded values. This is the single most expensive error to catch
late — check for the file specifically.

**It adds a utility dependency "to be helpful"** — usually clsx, tailwind-merge, or
lucide-react. The prohibition is not stylistic. Every added dependency is a set of design
defaults arriving through the back door, and lucide in particular will produce the icon
decoration the brief bans. Reject and re-run rather than removing it afterward.

---

## Next

`docs/build-prompts.md`, Prompt 0.2 — SEO, schema, navigation, and content
infrastructure. Do not skip ahead to a page. Phase 0 is five prompts and a review gate at
`/kitchen-sink`; the gate is where you find out whether the design system holds, and it is
far cheaper to find out there than on page nineteen.
