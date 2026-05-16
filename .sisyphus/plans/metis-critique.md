# Metis Pre-Planning Critique: BAI Website CMS Migration

**Audience**: Prometheus (planner) → Sisyphus (executor) → Momus (reviewer)
**Subject**: Full-surface CMS migration of `bruinalphainvestment.com` from hardcoded Next.js to Sanity v3
**Intent classified**: Refactoring (preserve visual + behavioral parity on a live site) with significant Architecture component (hybrid polymorphic + singleton schema model). High-stakes — single-session, full-surface, on production.
**Evidence basis**: Four parallel investigations (SEO/chrome audit, UX-surface audit, Sanity infra audit, Sanity v3 + Next 16 migration-pattern research). Every claim below cites `file:line` or external doc URL.

---

## Three Production-Breakers (Address Before Anything Else)

If any of these three are missing from the Sisyphus plan, Momus rejects it on **safety**, not quality.

### PB-1: `next.config.ts` has no `images.remotePatterns` for `cdn.sanity.io`

- **Evidence**: `next.config.ts` is empty (`const nextConfig: NextConfig = { /* config options here */ };` per Sanity-infra audit).
- **Failure mode**: First component that does `<Image src={urlForImage(asset).url()}>` from Sanity throws `Invalid src prop ... hostname "cdn.sanity.io" is not configured under images`. Every image-bearing page 500s in production.
- **Currently latent** because no Sanity images render yet. Becomes acute the moment Phase 2 begins.
- **Fix in Phase 0**:
  ```ts
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: `/images/${projectId}/**` },
    ],
  }
  ```

### PB-2: `/studio` is fully public, no auth gate

- **Evidence**: `app/studio/[[...tool]]/page.tsx` returns `<NextStudio config={config} />` with zero auth checks. `middleware.ts:5,10` adds `X-Robots-Tag: noindex, nofollow` for `/studio/*` — that is discoverability mitigation, **NOT** access control.
- **Failure mode**: After migration, content has real value. Anyone added to the Sanity project as a member can mutate; preview URLs exposed via the Presentation tool depend on `SANITY_STUDIO_PREVIEW_SECRET` not leaking.
- **Fix**: Lock down via (a) Sanity project member audit + role tightening in `sanity.io/manage`, AND/OR (b) Vercel Password Protection on `/studio/*`.

### PB-3: Repo is on `next@16.2.6`, NOT Next.js 15

- **Evidence**: `package.json` declares `"next": "16.2.6"` (verified). Brief stated Next.js 15.
- **Failure modes**:
  - Next 16 changed cache defaults; fetches without explicit `next: { revalidate, tags }` no longer auto-dedupe the same way.
  - `unstable_cache` is being deprecated.
  - Turbopack on Next 16 has known issues with Sanity bundle size — `next build` may fail; fallback is webpack.
  - Most Sanity-migration tutorials surfaced via Google target Next 14/15 and won't apply cleanly.
- **Fix**: Use `defineLive` from `next-sanity@12.4.5` (your installed version supports it) + `<SanityLive />` — that is the current Next 16 App Router pattern, not the manual `sanityFetch` + `revalidateTag` wrapper described in older blog posts.

---

## Category 1 — Hidden Intentions / Scope Creep

When the user said *"all content editable without editing code,"* the original audit caught 9 page bodies but missed an entire surface area. Concrete inventory the parallel SEO + UX audits surfaced, with `file:line` evidence:

### 1.1 Page-level SEO metadata — 8 hardcoded `export const metadata` blocks

Editor cannot change OG titles/descriptions (what shows in LinkedIn / Twitter previews) without editing code:

- `app/layout.tsx:29-42` — root: title `"Bruin Alpha Investment at UCLA"`, description, openGraph.siteName, openGraph.locale, twitter.card
- `app/(site)/about/page.tsx:3-6` — `"About — Bruin Alpha Investment at UCLA"` + description
- `app/(site)/team/page.tsx:3-6` — `"Team — Bruin Alpha Investment at UCLA"` + description
- `app/(site)/projects/page.tsx:3-6` — `"Projects & Research — …"`
- `app/(site)/events/page.tsx:3-6` — `"Events — …"`
- `app/(site)/training/page.tsx:3-6` — `"Training & Rotational Program — …"`
- `app/(site)/join/page.tsx:3-6` — `"Join — …"`
- `app/(site)/committees/page.tsx:4-7` — `"Committees — …"`
- `app/(site)/committees/[slug]/page.tsx:114-123` — `generateMetadata`: title computed but the literal suffix template `" — Bruin Alpha Investment at UCLA"` is hardcoded
- `app/studio/[[...tool]]/layout.tsx:4-8` — Studio "BAI Studio" + robots noindex (probably stays; flag)

**Drift risk**: Every page title hardcodes `" — Bruin Alpha Investment at UCLA"`. One rebrand = 8 file edits.

### 1.2 JSON-LD Organization schema hardcoded

`app/layout.tsx:44-51` renders structured data with hardcoded `name: "Bruin Alpha Investment"`, `url`, `logo: "${siteUrl}/brand/logo-full.svg"`, `description`. Google's Knowledge Graph identifies the org from this. Editor MUST be able to fix typos here AND add `sameAs: []` social URLs.

### 1.3 OG image rendered programmatically with hardcoded brand text

- `app/opengraph-image.tsx:50` — `"Bruin Alpha Investment"`
- `app/opengraph-image.tsx:69` — `"Have Passion, Believe in Legacy, Believe in BAI"` (the tagline, **duplicating** `_components/sections/hero.tsx:10` — two sources of truth)
- Plus 7 hardcoded brand hex codes (`#0A1428`, `#002147`, `#1A2A4A`, `#F5F5F0`, `#C5A059`, `#8B6F38`, `#FAF7F2`) defining the OG visual.

### 1.4 App icon programmatic text

- `app/icon.tsx:25` — text `"BAI"`
- `app/icon.tsx:14, 18` — colors `#002147`, `#C5A059`

If the org runs a tournament team or rebrands, this is content.

### 1.5 Sitemap covers ONE URL

`app/sitemap.ts:6-13` returns a single entry (`baseUrl`). After migration, sitemap MUST be regenerated from Sanity — every committee slug, every static page. Plan currently doesn't address this and `/sitemap.xml` will be permanently broken from Google's perspective.

### 1.6 Manifest, apple-icon, twitter-image — absent entirely

- No `app/manifest.ts` / `public/manifest.webmanifest`
- No `app/apple-icon.*`
- No `app/twitter-image.*`
- No `public/favicon*` / `public/og*`

Twitter cards will fall back to OG image (probably OK). PWA installability unavailable (probably out of scope; flag).

### 1.7 No `not-found.tsx`, no `error.tsx` / `global-error.tsx`, no `loading.tsx` — anywhere in `app/`

Confirmed by UX audit. Default Next.js 404 / 500 / blank-during-suspense pages will leak to users. Editor cannot brand any of these.

### 1.8 Footer disclaimer 200-word legal fallback hardcoded

`_components/site-footer.tsx:9` — full disclaimer text in code as fallback when Sanity returns null. If lawyer wants to change wording, code edit required.

- `_components/site-footer.tsx:32` — slogan fallback `"Investing in Bruin excellence."`
- `_components/site-footer.tsx:35` — Instagram fallback URL `'https://instagram.com'` (the platform homepage, not the org's account)
- `_components/site-footer.tsx:36` — LinkedIn fallback `'https://linkedin.com'`
- `_components/site-footer.tsx:37` — email fallback `'mailto:contact@bruinalpha.com'` — **disagrees** with the canonical address used elsewhere (see §1.10)
- `_components/site-footer.tsx:80` — copyright `"© 2026 Bruin Alpha Investment. All rights reserved."` — must roll forward annually

### 1.9 IB Director TBD placeholder

`app/(site)/committees/[slug]/page.tsx:82` — `'TBD — announcement coming soon'` is editorial copy stored as the director's name field. When director is appointed, this is the string the editor needs to replace.

### 1.10 Email address with three occurrences, two different values

- `app/(site)/join/page.tsx:122` → `bruinalphainvestment26@gmail.com`
- `app/_components/sections/recruitment-cta.tsx:22` → `bruinalphainvestment26@gmail.com`
- `app/_components/site-footer.tsx:37` → `contact@bruinalpha.com` (fallback — wrong address)

Drift already exists; must consolidate to `siteSettings.clubEmail`.

### 1.11 "Spring 2026" / "Fall 2026" / "2027" hardcoded ≥ 10 places

- `app/(site)/about/page.tsx:5, 15, 23, 41` — "Spring 2026"
- `app/(site)/team/page.tsx:28, 57, 66` — "Spring 2026", "Fall 2026", "2027"
- `app/(site)/events/page.tsx:26, 101` — "Fall 2026", "Spring 2027"
- `app/(site)/join/page.tsx:64, 88` — "Fall 2026"
- `app/(site)/committees/[slug]/page.tsx:212` — "Fall 2026"
- `app/_components/sections/marquee.tsx:2` — "FOUNDED 2026"
- `app/_components/sections/stats.tsx:3, 6` — "2026", "Fall 2026"
- `app/_components/sections/founding-team.tsx:14` — "Spring 2026"
- `app/_components/site-footer.tsx:80` — "2026"

The AI-slop bug-of-the-year waiting to happen: editor updates one, forgets nine, site drifts.

### 1.12 Recruitment 4-step labels and timeline entries

- `app/(site)/join/page.tsx:50` — `["Apply", "Coffee Chat", "Interview", "Decision"]`
- `app/(site)/join/page.tsx:63-78` — timeline with hardcoded dates ("Priority Application Deadline", "Rolling Applications & Coffee Chats", etc.)

If process becomes "Apply → Phone Screen → Final → Offer", editor must control.

### 1.13 6 FAQ Q&A pairs hardcoded

`app/(site)/join/page.tsx:8-33` — full FAQ data structure. Plan acknowledges this, but flag that the user's "inline vs ref" decision is a one-way door once data populates.

### 1.14 Section headings × ~18 hardcoded

Every page has 2–5 section headings hardcoded:

- "Our Story" / "What Sets Us Apart" / "Signature Trip"
- "The Rotational Program" / "How It Works" / "Class Hierarchy" / "Sample Week" / "Assessment" / "Quarterly All-Club Project"
- "Get in Touch" / "FAQ" / "Application Process" / "Recruitment Timeline" / "Application Form"
- "What We Build" / "Status Legend"
- "Connected by Design" / "The BAI Difference" / "What You'll Learn" / "Signature Projects" / "Curriculum (Fall 2026)"

Editor likely expects these editable — they're heading copy, not UI chrome.

### 1.15 7 core values descriptions

`_components/sections/values.tsx:2-10` — 7 titles + descriptions (~14 strings):

- "Active Community" — "Project-driven cohort, not just a newsletter."
- "Strong Dedicated Leadership" — "Accountability rituals from day one."
- "Passion for Legacy and Mission" — "Built to outlive the founders."
- "Real Engagements, Real Companies, Real Alumni"
- "Real Impact Projects"
- "Strong Recruitment"
- "Active Brand Presence"

All editorial.

### 1.16 Empty-state copy × 5+

- `app/(site)/events/page.tsx:45` — "Coming soon — speaker series in development. We are actively coordinating with industry professionals across trading, investment banking, and consulting."
- `app/(site)/team/page.tsx:57` — "Our first cohort joins Fall 2026 — check back after recruitment."
- `app/(site)/team/page.tsx:66` — "Our first alumni graduate in 2027."
- `app/(site)/about/page.tsx:75` — "In Development" (signature trip stub)
- `app/_components/sections/recruitment-cta.tsx:11` — "Priority application closes [date — placeholder TBD]"
- `app/(site)/events/page.tsx:27, 62, 75, 88` — multiple `"Date: TBD"` / `"Location: TBD"`

The entire point of a CMS — user absolutely will want to edit these.

### 1.17 Status legend descriptions in `/projects`

You declared the labels Planning/Active/Completed stay UI. But `app/(site)/projects/page.tsx:78-86` has explanatory descriptions for each ("Scope and deliverables are currently being finalized." etc.) — that copy IS editorial. Plan currently treats this all-or-nothing.

### 1.18 Founding class composite heading

`_components/sections/founding-team.tsx:13` — `"The Founding Class — Built in Spring 2026"` — composite of heading + year + tagline. Needs careful schema decomposition (3 fields or one composite Portable Text?).

### 1.19 Marquee phrase includes editorial content

`_components/sections/marquee.tsx:2` — `"BAI · REAL IMPACT · LEGACY · BRUIN ALPHA · FOUNDED 2026 · "`. Plan converts to array — good. But each item ("REAL IMPACT", "LEGACY", "FOUNDED 2026") IS content.

### 1.20 Application iframe placeholder copy

`app/(site)/join/page.tsx:85-98` — `title="Application Form"` + "Application opens Fall 2026" + "Link to Application". Editorial; needs `joinPage.applicationForm: { headline, formUrl, helpText, openDate }`.

### 1.21 Image alt text on logo × 3, already drifting

- `_components/site-header.tsx:55` — `alt="Bruin Alpha Investment at UCLA"`
- `_components/site-header.tsx:102` — same
- `_components/site-footer.tsx:47` — `alt="Bruin Alpha Investment"` (different)

Derive from `siteSettings.brandName`.

### 1.22 Likely-stays-hardcoded — explicit flag list

- **ARIA labels**: `app/layout.tsx:67` "Skip to main content"; `_components/site-header.tsx:77,111` "Open mobile menu"/"Close mobile menu"; `_components/draft-mode-banner.tsx:11,15` "Draft mode active — click to exit live preview"/"Editing draft — click to exit". Accessibility convention; **recommend stays**. Flag for user opt-in if they disagree.
- **API error strings**: `app/api/draft-mode/enable/route.ts:23,34,44` — ops-facing. Stays.
- **Theme hex codes** (`#002147`, `#C5A059`, `#8B6F38`, `#0A1428`, `#FAF7F2`, `#F5F5F0`, `#1A2A4A`): repeated inline in ≥15 TSX files plus `app/globals.css:11-22`. **Design-token catastrophe** but not content — flag as parallel cleanup or explicit Phase 7.

**Bottom line on Category 1**: Plan currently under-scopes editorial control by ~30–40 surfaces. Either expand schemas (`siteSettings` extensions for clubEmail, foundingTerm, brandName suffix, copyright; per-page `seo` objects; per-page emptyStates fields; richer footer doc) or explicitly defer with a documented Phase 7. "All content editable" without addressing these is a stated promise the migration fails to keep.

---

## Category 2 — AI Failure Points Specific to This Migration

Ordered by blast radius.

### 2.1 ⚠️ PRODUCTION-BREAKER: `next.config.ts` missing `images.remotePatterns` (= PB-1)

See PB-1 above. Failure: every Sanity image 500s.

### 2.2 ⚠️ PRODUCTION-BREAKER: `/studio` unauthenticated (= PB-2)

See PB-2 above. Failure: editorial squatting risk after migration.

### 2.3 ⚠️ PRODUCTION-BREAKER: Next.js version is 16, not 15 (= PB-3)

See PB-3 above. Failure: misapplied tutorials, caching surprises, Turbopack instability.

### 2.4 Stega silently corrupts JSON-LD, metadata, OG/Twitter cards

- **Evidence**: `sanity/lib/client.ts:25-33` `draftClient` has `stega: { studioUrl: studioBasePath, enabled: true }`. `getClient()` returns it when Draft Mode enabled. `app/layout.tsx:44-51` renders JSON-LD via `JSON.stringify`. Stega encodes invisible Unicode codepoints (U+E000–U+F8FF Private Use Area) into string values; these survive `JSON.stringify`. Google's structured-data validator rejects these.
- **Same failure** in `generateMetadata` returns — Next.js renders these as `<title>` and `<meta>` content. Stega chars leak literally into `<head>` and break OG/Twitter parsing.
- **Default Sanity stega filter** skips known patterns (`http://`, `https://`, `mailto:`, ISO dates, `slug.current` paths) — but NOT JSON-LD, NOT metadata strings, NOT generic strings used in URL construction.
- **Fix in plan**: `stegaClean()` MUST be called before any value flows into: `metadata`, `generateMetadata` returns, JSON-LD blocks, `manifest`, `sitemap`, `robots`, URL fields used in `<Link href>`, string comparisons (`if (committee.slug === currentSlug)`), date parsing, length checks, hashing. Failure here silently breaks SEO and editorial preview for months.

### 2.5 Image asset references that don't yet exist in the dataset

- **Evidence**: Sanity-infra audit confirms `sanity/seed/seed.ts` sets `photoReleaseObtained: false` for all 8 founding members and uploads NO image assets. Schema field `headshot` exists but is null.
- **Failure**: Naive GROQ projection `headshot.asset->url` returns `undefined`. If component does `<Image src={member.headshot.asset.url} />` it crashes; if `{member.headshot && <Image ...>}` it silently renders nothing — visual delta vs current.
- **Fix in plan**: Schema-level `validation` + component-level fallback. When `photoReleaseObtained === false`, enforce `readOnly: ({document}) => !document.photoReleaseObtained` on `headshot`. Component renders initials/silhouette deterministically. Playwright test toggles flag and asserts both states.

### 2.6 `generateStaticParams` won't see new editor-added slugs

- **Evidence**: `app/(site)/committees/[slug]/page.tsx:6-103` currently hardcodes a `committees` object. After migration, this becomes a GROQ fetch. `generateStaticParams` runs at BUILD time only; does NOT re-run during ISR.
- **Failure**:
  - `dynamicParams: true` (Next 16 default) — new slug renders on-demand on first request, slow first hit.
  - `dynamicParams: false` — 404 until next deploy.
  - The list page `/committees` doesn't show new committee until its fetch revalidates.
- **Fix in plan**: For each dynamic route:
  ```ts
  export const dynamicParams = true;
  export const revalidate = 3600;
  // fetch with: next: { tags: ['committee', `committee:${slug}`] }
  ```
  And `/api/revalidate` calls BOTH `revalidateTag('committee')` AND `revalidatePath('/committees')` on `_type === 'committee'`.

### 2.7 N+1 GROQ queries on list pages

- **Evidence**: `sanity/lib/queries.ts` `allCommitteesQuery` resolves `director->` per committee. The committee detail page will additionally need projects, the director's headshot, the differentiator. Naive = separate fetches. With `dynamicParams: true`, on-demand renders compound latency.
- **Fix**: ONE GROQ query per page with full projection:
  ```groq
  *[_type=="committee" && slug.current==$slug][0]{
    ...,
    director->{name, headshot},
    "projects": *[_type=="project" && references(^._id)]{title, slug, status, summary},
    "events": *[_type=="event" && references(^._id)]{...}
  }
  ```

### 2.8 Perspective + `useCdn` mismatch (top community failure mode)

- **Evidence**: `_components/site-footer.tsx:13-20` uses `sanityClient.fetch` directly (the published client, `useCdn: true`) with inline GROQ — bypassing `getClient()`. If this pattern extends to other components during the migration, editors won't see drafts even with Draft Mode enabled.
- **Failure**: Editor enables Draft Mode → expects to see drafts → sees published content → calls migration broken.
- **Fix**: Force every fetch through one wrapper (`defineLive`'s `sanityFetch` recommended). Forbid direct `client.fetch()` / `sanityClient.fetch()` in components. Add a grep-based CI check.

### 2.9 `sanity-typegen` not installed → polymorphic sections return `unknown`

- **Evidence**: Sanity-infra audit confirmed no `sanity-typegen.json`, no `sanity.types.ts`, no generate script, no dep in `package.json`. All four exported queries return `unknown`. Polymorphic `homePage.sections[]` will be `Array<unknown>` — SectionRenderer needs `any` casts everywhere.
- **Fix**: Phase 0 install `sanity-typegen`, generate `sanity.types.ts`, add `bun run typegen`. Use `FilterByType<PageSection, 'hero'>` from `@sanity/codegen` for discriminated-union narrowing. Switch with explicit `default:` case that logs unknown `_type` and renders `null`.

### 2.10 Visual editing half-wired

- **Evidence**: `sanity.config.ts:77-89` configures `presentationTool` and `draftClient` has Stega enabled — BUT Sanity-infra audit found:
  - No `<VisualEditing />` component anywhere in `app/layout.tsx`
  - No `defineLive` setup, no `live.ts` wrapper
  - No `<SanityLive />` mounted
  - No `encodeDataAttribute` usage
  - `@sanity/visual-editing` is NOT in `package.json` (only transitively via `next-sanity`)
  - `@sanity/preview-url-secret` also not explicit
- **Failure**: Editor enables draft mode, sees the page, sees no clickable overlays, sees no real-time updates. Stega chars appear invisibly in DOM but aren't clickable.
- **Fix**: Phase 1 add `@sanity/visual-editing` + `@sanity/preview-url-secret` to deps. Mount `<VisualEditing />` in root layout. If using `defineLive`, also mount `<SanityLive />`.

### 2.11 `/api/revalidate` route is missing entirely

- **Evidence**: Sanity-infra audit confirmed `app/api/revalidate/route.ts` does not exist. ISR is 3600s (`sanity/env.ts:49`). Without `/api/revalidate`, editors wait up to 1 hour.
- **Fix**: Phase 5 should move to Phase 1 or 2. Canonical implementation:
  ```ts
  import { parseBody } from 'next-sanity/webhook'
  const { isValidSignature, body } = await parseBody<{_type: string, slug?: {current: string}}>(
    req,
    process.env.SANITY_REVALIDATE_SECRET!,
    true  // ← 3rd param = waitForContentLakeEventualConsistency
  )
  ```
- **Webhook signature footgun**: The `true` third param enables a 1–3s delay so Sanity CDN propagates before `revalidateTag` fires. Without it, revalidated page fetches stale data for 10–60s. Most common Sanity webhook bug.

### 2.12 No cache tags currently — `revalidateTag` won't do anything

- **Evidence**: Sanity-infra audit found zero usage of `next: { tags }`, `revalidateTag`, `unstable_cache`. Only `next: { revalidate: 3600 }` in `sanity/lib/client.ts:41` and `_components/site-footer.tsx:20`.
- **Failure**: Even after `/api/revalidate` is built, `revalidateTag('committee')` has no effect because no fetch is tagged.
- **Fix**: Every fetch includes `next: { tags: [doc._type, `${doc._type}:${slug}`] }`. If using `defineLive`, automatic.

### 2.13 Seed script is `createIfNotExists` only — won't update existing docs

- **Evidence**: `sanity/seed/seed.ts:336-347` checks via `client.getDocument(id)` and only creates if missing. Lines 115-125 + 349-358 delete stale doc IDs (schema-migration helper) but do NOT update existing.
- **Failure**: During migration you tweak seed data 5–10 times. Each tweak silently doesn't apply because the doc exists. You debug 30 min before realizing.
- **Fix**: Two modes via env flag — `SEED_MODE=replace` (uses `createOrReplace`, for migration iteration) and `SEED_MODE=preserve` (uses `createIfNotExists`, post-cutover).

### 2.14 The 4 existing GROQ queries are dead code

- **Evidence**: Sanity-infra audit confirmed `siteSettingsQuery`, `homePageQuery`, `allCommitteesQuery`, `allFoundingMembersQuery` are exported from `sanity/lib/queries.ts` but imported in **zero files**. Site-footer uses inline GROQ directly, bypassing them.
- **Fix**: Replace inline GROQ in `_components/site-footer.tsx:13-20` with the exported `siteSettingsQuery`. Add CI lint rule "no inline GROQ in components" if possible.

### 2.15 Inline-string footer bug compounds with schema rename

- **Evidence**: `_components/site-footer.tsx:13-20` queries `disclaimer` and `socials[]` BUT schema has `disclaimer_text` and individual URL fields (`instagramUrl`, `linkedinUrl`, etc.). Currently the query returns null → footer renders hardcoded fallbacks. Footer "works" only because it's always falling back.
- **Failure**: Fix the footer query to match schema → footer tries to render Sanity data → if seed hasn't run yet on prod dataset, footer renders empty fields. OR rename schema to match footer → seed.ts breaks.
- **Fix**: Atomic sequencing — (a) fix footer query in same commit as seed update; (b) verify `disclaimer_text` and URL fields populated in dataset BEFORE deploying the fix.

### 2.16 Naming convention internally inconsistent

- **Evidence**: Schema mixes snake_case (`disclaimer_text`, `ucla_compliant_name`, `mission_statement`, `domain_renewal_date`) and camelCase (`instagramUrl`, `linkedinUrl`, `slackInviteUrl`, `applyUrl`, `clubEmail`).
- **Risk**: Plan allows renames. This is the one-shot opportunity to converge. Mixed → every future schema addition risks new drift.
- **Recommendation**: Pick camelCase (TypeScript + Sanity ecosystem convention). Rename `disclaimer_text` → `disclaimerText`, etc., during Phase 0. Requires explicit user sign-off (see §3.10).

### 2.17 Schema rename ≠ atomic rename — needs deprecation pattern

- **Evidence**: Plan allows renames. Sanity-migration research confirms the safe pattern is NOT to bare-rename. It's:
  1. Add new field alongside old.
  2. Mark old `readOnly: true, deprecated: { reason: '...' }`.
  3. Update frontend GROQ defensively: `format: format ?? eventType`.
  4. Run migration script (`sanity exec` + `defineMigration` from `sanity/migrate`).
  5. Once data migrated, remove defensive code + remove old field in a follow-up deploy.
- **Fix**: Any rename = ~3 sub-tasks via deprecation pattern. No bare-renames.

### 2.18 Studio preview URLs may not stega-clean incoming pathname

- **Evidence**: `sanity.config.ts:85-86` Presentation tool points to `/api/draft-mode/enable` and `/api/draft-mode/disable`. `app/api/draft-mode/enable/route.ts:47-57` validates redirect path. But the path comes from query params; if a Sanity field used in preview URL is stega-encoded, path becomes `/about<U+EXXXX>`.
- **Fix**: `app/api/draft-mode/enable/route.ts` must `stegaClean()` the incoming `sanity-preview-pathname` query param.

### 2.19 `app/icon.tsx` and `app/opengraph-image.tsx` won't auto-revalidate after Sanity migration

- **Evidence**: These export Server Components that generate images. They reference no Sanity data currently. If brand name / tagline migrates to Sanity (§1.3, §1.4), these need to fetch Sanity AND be tagged.
- **Fix**: Tag them with `siteSettings` so brand-name edits regenerate icon/OG. Without this, editor renames the org in Studio, page header updates, OG card still says the old thing.

### 2.20 `app/sitemap.ts` not connected to Sanity

- **Evidence**: `app/sitemap.ts:6-13` returns one entry. After migration, must return entry per static page + entry per Sanity slug (committees, and projects/events if dynamic).
- **Failure**: After editor adds new committee, Google never crawls it. Migration "succeeds" editorially but degrades SEO permanently.

---

## Category 3 — Ambiguities the User Didn't Address — Flag Before Plan Is Finalized

In rough order of "this changes the schema design":

### 3.1 Per-page SEO strategy
Each page-singleton schema should include `seo: { title, description, ogImage, twitterCard }`. OR derive everything from `${pageTitle} — ${siteSettings.brandName}`. OR one `pageSEO` document keyed by route. Affects 8 schemas. **Pick before Phase 0.**

### 3.2 Site name suffix
`" — Bruin Alpha Investment at UCLA"` — separate `siteSettings.titleSuffix` field? Or derive from `siteSettings.ucla_compliant_name`? Affects every `generateMetadata`.

### 3.3 OG image strategy
Three choices:
- (a) Keep programmatic `app/opengraph-image.tsx`, source text from Sanity (adds Sanity fetch to OG route — latency/error surface).
- (b) Editor-uploaded `siteSettings.ogImage` asset.
- (c) Per-page `seo.ogImage` with siteSettings fallback.

**Pick before Phase 1.**

### 3.4 Marquee items schema
Plan says array. But: max length? Editor can add a link per item? Plain string or rich text? `marqueeSection.items[]: array of string` or `array of { text, link? }`? Affects schema diff in Phase 0.

### 3.5 Founding date / "Spring 2026" — single source vs per-page
Single `siteSettings.foundedTerm: "Spring 2026"` (10+ existing copies must become this) OR per-page editorial text (each of 10+ stays per-page-controllable). Affects schema and refactor scope.

### 3.6 IB Director "TBD" placeholder
Two options:
- (a) `committee.director` reference is optional; when null, component renders `committee.directorPlaceholder` field — fully editable.
- (b) Hardcode the placeholder.

**Recommend (a)** per "all content editable" intent.

### 3.7 `/about` Signature Trip stub
You said you decide. **Recommend**: keep as `aboutPage.signatureTrip: { headline, status, body, visible: boolean }`. Editor decides whether the section renders. Cheaper than schema migration later.

### 3.8 Empty-state copy — per-page vs centralized
`teamPage.emptyMembersCopy` (per-page) vs `siteSettings.emptyStates.team` (centralized). Affects schema count. **Recommend per-page** — editors think in pages.

### 3.9 Status legend descriptions
You said labels stay UI. But descriptions in `app/(site)/projects/page.tsx:78-86` — editorial or also UI? Likely editorial. Pick.

### 3.10 Naming convention going forward
`disclaimer_text` (snake_case) vs `instagramUrl` (camelCase) mixed currently. Pick ONE convention; one-shot migration. **Recommend camelCase** (TypeScript + Sanity ecosystem). Affects every rename.

### 3.11 Inline FAQ vs ref FAQ
You called inline. Counterpoint: if same FAQ wanted on `/about`, refs allow reuse. Inline faster; refs more flexible. Document the trade-off; one-way decision once data populates.

### 3.12 Events refs or inline
Plan says "/events queries existing structured docs" → refs. Verify `event` schema covers all current types ("Enormous Activities Fair", "CME Trading Challenge", "IMC Prosperity", "Case Competitions", "Spring Stock Pitch") with all current fields (date, location, status, type tag). If not, schema extension needed.

### 3.13 Sitemap derivation
Should `app/sitemap.ts` derive from Sanity post-migration? **Yes** per the intent. Plan doesn't address.

### 3.14 404 / error / loading pages
In scope or out? Plan doesn't mention. **Recommend minimum scope**: `app/not-found.tsx`, `app/error.tsx`, `app/(site)/loading.tsx` with copy from `siteSettings.errorMessages.*`. Out of scope = lose editorial control over 404 copy permanently.

### 3.15 Studio authentication
Who can access `/studio` after migration? Currently fully open. Action required from user; cannot proceed without decision.

### 3.16 Image upload responsibilities post-migration
Seed uploads zero images. After migration, who uploads what? Plan needs a "post-migration: editor uploads N images" checklist (committee photos, headshots with releases, event photos, OG image, logo variants). Without it, pages render with missing-image fallbacks indefinitely.

### 3.17 Referential integrity on delete
When editor deletes a committee, projects/events referencing it become orphaned. Sanity by default allows this. Plan needs: Studio-level deletion guards (custom delete action scanning references) OR component-level "deleted" handling. Pick.

### 3.18 Slug change → URL redirect strategy
When editor renames committee slug `trading` → `quant-trading`, old URL 404s, breaking external links. Plan needs: schema-stored `redirectsFrom: string[]` field on each sluggable doc + middleware check, OR `next.config.ts` rewrites generated from Sanity at build time. Pick.

### 3.19 Theme tokens cleanup — in scope or follow-up?
50+ inline hex codes in TSX. Parallel cleanup OR explicit Phase 7. Default: out of scope to preserve session budget. Flag.

### 3.20 `defineLive` vs manual `sanityFetch` + cache tags
Architectural choice you haven't made explicit. `defineLive` (next-sanity 12+) is current best practice for Next 16 App Router; simpler; handles cache tags + real-time automatically. Manual gives finer control. Plan's Phase 5 implies the latter. **Recommend `defineLive`**. Pick before Phase 1; affects every component's data-fetching boilerplate.

### 3.21 Where does the iframe Application Form `formUrl` live?
Currently `app/(site)/join/page.tsx:85-98` has an iframe placeholder. Where does the actual Google Form / Tally URL come from? `joinPage.applicationForm.formUrl` (editor-controllable) or env var?

### 3.22 Disclaimer fallback strategy
Current fallback is the full 200-word legal text (`_components/site-footer.tsx:9`). Three options:
- (a) Keep identical fallback — same text in code + Sanity, drift risk.
- (b) Fallback is generic "Loading…" — safer for fresh builds.
- (c) Empty string — footer is shorter when Sanity unavailable.

Pick.

---

## Category 4 — Sequencing Risks: "One Big Migration" Is Currently Unsafe

The most important section. Plan as written will visibly break the live site during execution.

### 4.1 Phase-by-phase production breakage map

| Phase | Risk | Why |
|---|---|---|
| Phase 0 (schema, seed) | Low **if** non-prod dataset; **HIGH** if seed runs against production dataset | Schemas + seed only; no frontend changes deployed yet. **As long as seed runs against a non-production dataset.** |
| Phase 1.a (footer schema-mismatch fix) | **HIGH** | If footer fix deployed before seed populates `disclaimer_text` + URL fields in prod dataset → footer renders fallbacks (200-word legal text + `https://instagram.com` placeholder URLs that go to platform homepages, not the org's accounts) |
| Phase 2 (list pages) | **HIGH** | `/committees`, `/team`, `/projects`, `/events` rewired. If deployed before seed completes → pages render empty or hardcoded fallbacks |
| Phase 3 (singleton pages) | **HIGH** | Same for `/about`, `/training`, `/join` |
| Phase 4 (homepage `sections[]`) | **CRITICAL** | If `homePage.sections[]` empty in prod dataset → entire homepage renders blank. Most-visited page goes dark |
| Phase 5 (`/api/revalidate`) | Low alone, but means until Phase 5 ships, every content edit during Phases 1-4 won't reflect (no revalidation handler exists) | Hidden review friction during the session itself |
| Phase 6 (verification) | None | Read-only |

### 4.2 The killer: "execute on main" interpretation

Plan says "one big session." If commits are pushed to `main` as you go, every interim commit deploys to production. The window where production is in a broken intermediate state lasts hours.

### 4.3 No rollback strategy

Plan as written has no rollback beyond `git revert`. If a Sanity write goes wrong (e.g., seed wipes a doc, schema rename loses data), `git revert` doesn't undo Sanity dataset mutations. Sanity-migration research confirms: **dataset backup must be exported before any destructive operation.**

### 4.4 Stega-during-execution leakage

If any developer accidentally has Draft Mode enabled in a browser while testing intermediate deploys, deployed pages with stega-encoded data may leak invisible chars into HTML responses cached for other visitors (Vercel ISR caches). Specifically: deployed `_components/site-footer.tsx` fetching with `getClient()` while developer's session has Draft Mode → `draftClient` returns → stega chars in HTML → cached → served to subsequent visitors.

### 4.5 Minimum-viable safe rollout (MANDATE in plan)

Add Phase -1 with these steps:

1. **Export production dataset**:
   ```bash
   bunx sanity dataset export production prod-backup-$(date +%s).tar.gz
   ```
   Store as artifact. This is the rollback.

2. **Branch deployment, not main**: Migration on `feature/cms-migration`. Vercel auto-creates preview URL. Production keeps serving `main` (current hardcoded site) throughout.

3. **Separate Sanity dataset for migration** (RECOMMENDED): Create `migration` (or `staging`) dataset. Run seed against THAT. Set `NEXT_PUBLIC_SANITY_DATASET=migration` on preview deployment only. If something breaks, drop the dataset and start over without touching production.

4. **Feature flag fallback per component** (BELT AND SUSPENDERS): Each refactored component reads `process.env.NEXT_PUBLIC_USE_SANITY === 'true'`. If false → render hardcoded fallback. After merge to `main`, if envvar is false, production still renders hardcoded content. Flip last.

5. **Cutover sequence at session end**:
   - a. Preview against `migration` dataset passes all §5 QA gates.
   - b. Export `migration` → import to `production` dataset:
     ```bash
     bunx sanity dataset export migration migration-final.tar.gz
     bunx sanity dataset import migration-final.tar.gz production --replace
     ```
   - c. Merge `feature/cms-migration` → `main`.
   - d. Set `NEXT_PUBLIC_USE_SANITY=true` on production Vercel envvars.
   - e. Vercel redeploys.
   - f. Smoke-test production URLs.
   - **Total downtime: ~30 seconds during Vercel redeploy.**

6. **Rollback procedure** (if 5.f fails):
   - Set `NEXT_PUBLIC_USE_SANITY=false` → redeploys → hardcoded fallbacks restored.
   - If dataset corrupted:
     ```bash
     bunx sanity dataset import prod-backup-<timestamp>.tar.gz production --replace
     ```

### 4.6 Specific intermediate-broken-state risks even in branch-deployment model

- **`generateStaticParams` empty array**: First build after Phase 2 needs `migration` dataset to already have committees. If Phase 0 seed silently failed (auth error in `SANITY_API_WRITE_TOKEN`, validation error, idempotency hit), `generateStaticParams` returns `[]` and every committee URL 404s in the preview build. Verify seed exit code; verify dataset state via `bunx sanity dataset list` before Phase 2.
- **Footer fix deployed before seed for that branch**: Same as production but in preview. Acceptable to discover here, NOT in production.
- **Inline GROQ in footer hits stale schema**: `_components/site-footer.tsx:13-20` references `disclaimer` and `socials` (not the schema's actual field names). The inline query is going to be ripped out and replaced; sequencing matters — seed must be updated AND deployed AND verified populated BEFORE new footer code reads new field names.

### 4.7 Phase 5 must move earlier

Plan puts `/api/revalidate` at Phase 5. But Phases 1–4 each ship content updates the team will want to see during the session. Without `/api/revalidate`, every Sanity edit waits up to 3600s (`sanity/env.ts:49`) for ISR to roll. **Move `/api/revalidate` to Phase 1** so subsequent phases get live editing feedback.

### 4.8 Seed mode confusion

During migration: use `createOrReplace` so iteration is fast. After cutover: use `createIfNotExists` so editor edits survive. Script as-is only does the latter. Plan must specify the mode switch + add a runtime flag.

---

## Category 5 — Verification Gaps: How You Know "Done"

Your Phase 6 says "draft mode end-to-end verification" with zero acceptance criteria. Replace with the 15 executable gates below. Each is a **command** with exit code 0/non-zero; no human eyeballing.

### 5.1 Visual regression — pixel diff every page before/after

```bash
bunx playwright test e2e/visual-regression.spec.ts
# Baseline: capture screenshots from production prior to cutover; commit to repo
# Post-cutover: capture from prod
# Compare via pixelmatch threshold 0.99
# Per page: < 1% pixel diff
```

### 5.2 Content completeness — every audited string is editable

```bash
bun run scripts/verify-content-coverage.ts
# Inputs: docs/audit-strings.json (the 209+ inventory + §1 deltas)
# For each, asserts a Sanity document has that exact (or transformed) string in the expected field
# Exit 1 if any audited string is still hardcoded anywhere except the allowlist
# (ARIA, API errors, theme tokens if out of scope)
```

### 5.3 Editor RTT — change in Studio reflects on prod within 60s

```bash
bunx playwright test e2e/editor-rtt.spec.ts
# PATCHes siteSettings.slogan via @sanity/client to "RTT-TEST-{timestamp}"
# Polls https://www.bruinalphainvestment.com every 2s until new string appears or 60s timeout
# Asserts elapsed < 60_000ms (should succeed in <5s with revalidateTag wired)
```

### 5.4 Draft mode handshake — full E2E

```bash
bunx playwright test e2e/draft-mode.spec.ts
# curl /api/draft-mode/enable?sanity-preview-secret=$SECRET&sanity-preview-pathname=/
# Assert 200 + Set-Cookie: __prerender_bypass=*
# Navigate to /, assert <DraftModeBanner /> visible
# Edit a doc via Sanity API, verify draft reflected immediately
# Click banner → /api/draft-mode/disable → cookie cleared → banner gone → published shown
```

### 5.5 Stega absence in published HTML

```bash
curl -s https://www.bruinalphainvestment.com | python3 -c "
import sys
html = sys.stdin.read()
bad = [(i, hex(ord(c))) for i, c in enumerate(html) if 0xE000 <= ord(c) <= 0xF8FF]
if bad: print(f'STEGA LEAKED: {bad[:10]}'); sys.exit(1)
"
# Exit 0 = no Private Use Area chars in published HTML
```

### 5.6 JSON-LD validity

```bash
curl -s https://www.bruinalphainvestment.com | python3 scripts/extract-jsonld.py | jq -e '
  ."@context" == "https://schema.org" and
  ."@type" == "Organization" and
  (.name | length) > 0 and
  (.url | length) > 0 and
  (.logo | length) > 0 and
  (.description | length) > 0
'
# Optional: hit Google Rich Results Test API for canonical validation
```

### 5.7 All Sanity-hosted images render

```bash
bunx playwright test e2e/image-coverage.spec.ts
# For each page in route inventory, await all <img> to load
# Assert img.naturalWidth > 0 for every image
# Assert no <img src> returns 404 on HEAD request
```

### 5.8 404 strategy on bad slugs

```bash
test "$(curl -o /dev/null -s -w '%{http_code}' \
  https://www.bruinalphainvestment.com/committees/totally-not-a-real-committee)" = "404"
# Per dynamic route: bad slug returns 404 with branded not-found page (if in scope)
```

### 5.9 Sitemap completeness

```bash
curl -s https://www.bruinalphainvestment.com/sitemap.xml \
  | xmllint --xpath "//*[local-name()='loc']/text()" - \
  | sort > /tmp/sitemap-actual.txt
bunx sanity exec scripts/expected-urls.ts > /tmp/sitemap-expected.txt
diff /tmp/sitemap-actual.txt /tmp/sitemap-expected.txt
# Asserts: every static page + every committee slug from Sanity is present
```

### 5.10 Webhook signature

```bash
# Invalid signature → 401
test "$(curl -X POST https://www.bruinalphainvestment.com/api/revalidate \
  -H "Content-Type: application/json" -d '{"_type":"committee"}' \
  -o /dev/null -s -w '%{http_code}')" = "401"

# Valid signature → 200 AND subsequent fetch shows updated data within 5s
bun scripts/send-test-webhook.ts
# Script signs request with SANITY_REVALIDATE_SECRET, POSTs, then polls page
```

### 5.11 Type safety

```bash
bun tsc --noEmit
# Exit 0
grep -rn ": any\b\|as any\b" sanity/lib app/ \
  | grep -v node_modules | grep -v '\.test\.' \
  && exit 1 || exit 0
# No `any` casts in new code
```

### 5.12 Footer schema mismatch fixed

```bash
# Disclaimer comes from Sanity, not fallback
curl -s https://www.bruinalphainvestment.com | grep -c "registered student organization at UCLA"
# Returns 1 — confirms either fallback OR Sanity render

# Mutate Sanity disclaimer_text via API, wait 5s, refetch
bun scripts/verify-footer-is-sanity-driven.ts
# Asserts that PATCH to siteSettings.disclaimer_text is reflected in HTML within 5s
# (proves not fallback)
```

### 5.13 Photo release gate

```bash
bunx playwright test e2e/photo-release.spec.ts
# Toggle foundingMember.photoReleaseObtained → false
# Fetch /team
# Assert: NO <img> for that member; initials/silhouette fallback rendered
# Toggle → true with real headshot asset
# Assert: <img src*="cdn.sanity.io"> present and loads (naturalWidth > 0)
```

### 5.14 Status legend NOT editable (per user decision)

```bash
bun run scripts/verify-immutable-ui.ts
# Asserts: project.status enum schema has exactly 3 values (planning|active|completed)
# Asserts Studio doesn't expose a "Status Labels" document type
# Asserts the values are still string-equal to their UI labels
```

### 5.15 Build succeeds, no image-domain warnings

```bash
bun run build 2>&1 | tee /tmp/build.log
grep -iE "invalid src|cdn\.sanity\.io|hostname.*not configured" /tmp/build.log \
  && exit 1 || exit 0
# Exit 0 = clean build
```

### Definition-of-done checklist (binary, no opinion)

- [ ] All 15 gates above exit 0 on production URL after cutover.
- [ ] Backup tarball from §4.5 stored, named, hash recorded.
- [ ] `NEXT_PUBLIC_USE_SANITY=true` set on production Vercel env.
- [ ] Studio access list verified locked down.
- [ ] Rollback dry-run executed at least once on preview deployment (flip `NEXT_PUBLIC_USE_SANITY=false` → verify hardcoded render → flip back).
- [ ] One real human (not the developer) has logged into Studio, edited one field, verified change appears on prod within 60s.

Without these gates, "done" is opinion. The plan must state them as Per-Task Acceptance Criteria. Currently the plan has none.

---

## Category 6 — Forgotten Content Categories: Comprehensive Inventory

Each row needs a decision: **in scope** (schema field), **out of scope** (stays hardcoded), or **deferred** (Phase 7).

| # | Category | Evidence | Default recommendation |
|---|---|---|---|
| 6.1 | 8 per-page metadata exports (title + description) | every `page.tsx`, see §1.1 | **In scope**: each page singleton gets `seo: { title, description, ogImage }`. `siteSettings.titleSuffix` |
| 6.2 | JSON-LD Organization schema | `app/layout.tsx:44-51` | **In scope**: derive from siteSettings; `stegaClean()` before serialize |
| 6.3 | OG image (`opengraph-image.tsx`) | hardcoded headline + colors | **Decision needed (§3.3)**; recommend per-page editor-uploaded with siteSettings fallback |
| 6.4 | App icon (`icon.tsx`) | "BAI" text + colors | **Out of scope**; flag |
| 6.5 | Sitemap covers ONE URL | `app/sitemap.ts:6-13` | **In scope**: derive all routes + slugs from Sanity |
| 6.6 | No `manifest.webmanifest` | doesn't exist | **Out of scope** (flag PWA-readiness gap) |
| 6.7 | No `not-found.tsx` | doesn't exist | **In scope (recommend)**: `app/not-found.tsx` with copy from `siteSettings.notFoundCopy` |
| 6.8 | No `error.tsx` / `global-error.tsx` | doesn't exist | **In scope (recommend)**: root `error.tsx` minimum |
| 6.9 | No `loading.tsx` | doesn't exist | **In scope (recommend)**: `app/(site)/loading.tsx` for branded skeleton |
| 6.10 | Footer disclaimer 200-word fallback | `site-footer.tsx:9` | **Decision needed (§3.22)**; recommend "Loading…" or empty |
| 6.11 | Footer slogan fallback | `site-footer.tsx:32` "Investing in Bruin excellence." | **In scope**: footer reads `siteSettings.slogan`; remove fallback string |
| 6.12 | Copyright year hardcoded | `site-footer.tsx:80` `© 2026` | **In scope**: `{siteSettings.foundedYear}–{new Date().getFullYear()}` |
| 6.13 | Email × 3 with disagreement | `bruinalphainvestment26@gmail.com` × 2, `contact@bruinalpha.com` × 1 | **In scope**: consolidate to `siteSettings.clubEmail`; nuke fallback string |
| 6.14 | "Spring 2026" × 10+ | scattered | **Decision needed (§3.5)**; recommend `siteSettings.foundedTerm` single source |
| 6.15 | IB Director placeholder | `committees/[slug]/page.tsx:82` | **In scope**: optional director ref + `committee.directorPlaceholder` field |
| 6.16 | Recruitment 4-step labels | `join/page.tsx:50` | **In scope**: `joinPage.applicationProcess[]: array of {step, label, description}` |
| 6.17 | Recruitment timeline | `join/page.tsx:63-78` | **In scope**: `joinPage.timeline[]: array of {date, label, description}` |
| 6.18 | 6 FAQ Q&A pairs | `join/page.tsx:8-33` | **Decision pending (§3.11)**; user chose inline |
| 6.19 | Empty-state copy × 5+ | see §1.16 | **In scope**: per-page editorial fields |
| 6.20 | Status legend descriptions | `projects/page.tsx:78-86` | **Decision needed (§3.9)**; recommend in scope |
| 6.21 | Section headings × ~18 | every page.tsx | **In scope**: each page-singleton has heading fields per section |
| 6.22 | Image alt text "Bruin Alpha Investment at UCLA" × 3 | `site-header.tsx:55,102`, `site-footer.tsx:47` | **In scope**: derive from `siteSettings.brandName` |
| 6.23 | Marquee "FOUNDED 2026" | `marquee.tsx:2` | **In scope** via §3.4 schema decision |
| 6.24 | API draft-mode error strings × 3 | `api/draft-mode/enable/route.ts:23,34,44` | **Out of scope** (ops-facing) |
| 6.25 | Middleware noindex for `/studio/*`, `/api/*` | `middleware.ts:5,10` | **Out of scope**; verify `/api/revalidate` is INCLUDED in this matcher |
| 6.26 | Theme tokens (50+ hex codes inline in TSX) | scattered + `globals.css:11-22` | **Out of scope (recommend Phase 7)**; not content but flag drift |
| 6.27 | `next.config.ts` missing images config | empty | **In scope** (§2.1, PB-1) — Phase 0 critical |
| 6.28 | Application iframe placeholder | `join/page.tsx:85-98` | **In scope**: `joinPage.applicationForm: { headline, formUrl, helpText, openDate }` |
| 6.29 | Brand colors in `opengraph-image.tsx` | 7 hex codes | **Out of scope** (tied to OG image strategy in §3.3) |
| 6.30 | Footer Instagram/LinkedIn fallback URLs | `site-footer.tsx:35-36` — wrong (platform homepages, not org's accounts) | **In scope**: remove fallback; siteSettings is required |
| 6.31 | Founding members `photoReleaseObtained: false` × 8 | seed.ts | **In scope** schema + component fallback (§2.5) |
| 6.32 | 4 GROQ queries imported nowhere | `sanity/lib/queries.ts` | **In scope**: replace inline GROQ everywhere with these exports (§2.14) |
| 6.33 | Studio metadata "BAI Studio" | `studio/[[...tool]]/layout.tsx:4-8` | **Out of scope** (Studio chrome) |
| 6.34 | Skip-to-content + ARIA labels | `app/layout.tsx:67`; `site-header.tsx`; `draft-mode-banner.tsx` | **Out of scope** (a11y convention) |

**Bottom line on Category 6**: Plan must explicitly classify every row as in-scope / out-of-scope / Phase 7. Currently silent on most. Plan must also add a "next.config.ts images.remotePatterns" task in Phase 0 — not optional (PB-1).

---

## Directives for Prometheus

### Core Directives (MUST appear in Sisyphus plan)

- **MUST**: Add Phase -1 (pre-flight safety): export production dataset (`bunx sanity dataset export production prod-backup-$(date +%s).tar.gz`); create `feature/cms-migration` branch; create `migration` Sanity dataset; set Vercel preview env vars to point at `migration` dataset; set production env var `NEXT_PUBLIC_USE_SANITY=false`.
- **MUST**: Phase 0 first task = add `images.remotePatterns` for `cdn.sanity.io` to `next.config.ts` (PB-1).
- **MUST**: Phase 0 install `sanity-typegen`; add `sanity.types.ts`; add `bun run typegen` to scripts; regenerate after every schema change.
- **MUST**: Phase 0 install `@sanity/visual-editing` and `@sanity/preview-url-secret` as explicit dependencies (currently only transitive).
- **MUST**: Phase 0 add `@sanity/webhook` dependency for `parseBody` (used by `/api/revalidate`).
- **MUST**: Decide `defineLive` vs manual `sanityFetch` + tags BEFORE Phase 1; document the decision. If `defineLive`, mount `<SanityLive />` in `app/layout.tsx`.
- **MUST**: Phase 1 mount `<VisualEditing />` in `app/layout.tsx` regardless of Live API choice.
- **MUST**: Move `/api/revalidate` from Phase 5 to Phase 1. Implementation uses `parseBody(req, secret, true)` — the third param is required (Content Lake propagation).
- **MUST**: Studio access lockdown before public reveal (Sanity project member audit AND/OR Vercel Password Protection on `/studio/*`) (PB-2).
- **MUST**: `stegaClean()` applied before serialization in: every `generateMetadata`, the JSON-LD block in root layout, `app/sitemap.ts`, `app/robots.ts`, `app/api/draft-mode/enable/route.ts` (on incoming `sanity-preview-pathname` param), any URL passed to `<Link href>`, any value used in `if`/`===`/`new Date()`/`.length`.
- **MUST**: Every fetch goes through one wrapper (`defineLive.sanityFetch` OR a single `getClient()` helper). Forbid direct `client.fetch()`/`sanityClient.fetch()` calls in components. Add grep-based CI check.
- **MUST**: Every fetch adds `next: { tags: [_type, `${_type}:${id|slug}`] }` (or use `defineLive` which does this automatically). `/api/revalidate` maps incoming `_type` to `revalidateTag` AND `revalidatePath` for list pages.
- **MUST**: For dynamic routes (`/committees/[slug]` + any added): `export const dynamicParams = true; export const revalidate = 3600`. `generateStaticParams` passes `perspective: 'published'` + `stega: false`.
- **MUST**: ONE GROQ query per page with full projection (no N+1).
- **MUST**: Schema field renames use deprecation pattern (add new, mark old `readOnly + deprecated`, defensive frontend, migration script via `sanity/migrate`, then remove old). Do NOT bare-rename.
- **MUST**: Seed script supports two modes via env flag — `SEED_MODE=replace` (uses `createOrReplace`, for development/migration iteration) and `SEED_MODE=preserve` (uses `createIfNotExists`, for post-cutover). Plan specifies which phase uses which.
- **MUST**: Each refactored component supports `NEXT_PUBLIC_USE_SANITY` feature-flag fallback to hardcoded values OR plan must explicitly justify why not.
- **MUST**: For founding members with `photoReleaseObtained === false`, schema enforces `readOnly: ({document}) => !document.photoReleaseObtained` on `headshot` field; component renders initials/silhouette fallback deterministically.
- **MUST**: Footer schema-mismatch fix sequenced atomically — seed deployed AND verified-populated in dataset BEFORE footer query update lands in component code.
- **MUST**: `app/sitemap.ts` derives from Sanity (every static page + every committee slug). `app/robots.ts` includes `/api/revalidate` in disallow (it already includes other api/preview paths).
- **MUST NOT**: Deploy refactored components to `main` while production dataset is empty/half-seeded. Use branch + preview + dataset isolation (§4.5).
- **MUST NOT**: Use direct `sanityClient.fetch()` / `client.fetch()` in components.
- **MUST NOT**: Hardcode brand strings, emails, founding year, social URLs, copyright year in any new code.
- **MUST NOT**: Bare-rename schema fields (use deprecation pattern instead).
- **MUST NOT**: Refactor theme tokens (hex codes) in this session — explicitly out of scope (or Phase 7).
- **MUST NOT**: Skip the `parseBody` third `true` param in `/api/revalidate` (Content Lake propagation).
- **MUST NOT**: Use `any` casts in `SectionRenderer` (use `FilterByType<PageSection, '_type'>` from `@sanity/codegen`).
- **PATTERN**: Polymorphic sections — discriminated union with `switch(_type)` + explicit `default:` case that warns and renders `null`. Each section component accepts typed props from the union member.
- **PATTERN**: Cache tags — `[doc._type]` for type-level + `[`${doc._type}:${id}`]` for instance-level. Use document `_id` (not slug — slugs change).
- **PATTERN**: List + detail page revalidation — webhook for `_type === 'committee'` fires `revalidateTag('committee')` AND `revalidatePath('/committees')` AND `revalidatePath('/committees/${oldSlug}')` and `…/${newSlug}` if slug changed (parse from webhook payload).
- **TOOL**: `@sanity/webhook`'s `parseBody` for webhook signature verification (not custom HMAC).
- **TOOL**: `next-sanity`'s `defineLive` for App Router data fetching (recommended path).
- **TOOL**: `@sanity/codegen`'s `FilterByType` for discriminated-union narrowing.
- **TOOL**: `sanity/migrate`'s `defineMigration` + `at` + `setIfMissing` + `unset` for any data migration.

### QA / Acceptance Criteria Directives (MANDATORY — agent-executable only)

- **MUST**: Every Sisyphus task has ≥1 executable acceptance criterion: a curl command, a Playwright spec, a `bun tsc` invocation, a `bunx sanity` command, OR a script. Each with concrete expected exit code OR string match.
- **MUST**: The 15 verification gates in §5 are wired as the final-phase QA checklist. Each gate is an executable command with expected exit code 0 (or specific non-zero per assertion). Each gate references a real Playwright spec file in `e2e/*.spec.ts` or a real script in `scripts/*.ts`.
- **MUST**: Pre-migration baseline screenshots captured (`bunx playwright test --update-snapshots` against production prior to cutover); committed to repo as `e2e/__snapshots__/baseline-*.png`. Post-cutover diff <1% per page or task fails.
- **MUST**: ≥1 failure-path scenario per phase. Examples to include verbatim:
  - "Fetch returns empty `homePage.sections[]` → page renders empty `<main>` with no error; Playwright asserts non-throwing render."
  - "Image asset reference is null → component renders initials fallback; Playwright asserts no broken `<img>` (naturalWidth>0 OR no img element)."
  - "Slug not in dataset → /committees/totally-bogus → 404 (curl returns 404, content-type text/html)."
  - "Webhook signature invalid → 401 (curl returns 401)."
  - "Webhook signature valid but body has unknown `_type` → 200 + no-op (no revalidation; subsequent fetch unchanged)."
  - "Editor toggles `photoReleaseObtained` false → page re-fetches → no headshot rendered."
- **MUST**: Use specific test data — real slugs (`/committees/trading`), real field names (`siteSettings.disclaimer_text` or new name), real env var names (`SANITY_REVALIDATE_SECRET`), real exit codes. No `[slug]`, `[field]`, `[expected]` placeholders.
- **MUST**: Use specific selectors — Playwright uses real CSS/role selectors (`page.getByRole('banner').getByAltText('Bruin Alpha Investment at UCLA')`), not "the logo".
- **MUST**: Each phase has a "phase-complete gate" (a single command that asserts the phase's deliverables, exit 0). Example for Phase 0: `bun run typegen && bun tsc --noEmit && bun run seed && bunx sanity dataset list | grep migration`.
- **MUST NOT**: Any acceptance criterion of the form "user manually verifies…" / "developer confirms visually…" / "check the site looks right".
- **MUST NOT**: Vague QA scenarios ("verify revalidation works", "check the page loads", "test the API"). Each scenario specifies: tool, exact step, exact assertion, evidence (HTTP code, file path, string match).
- **MUST**: One "real human round-trip" at the end — non-developer logs into Studio, edits one specific field, verifies live within 60s. The only non-automated check; exists because if no human ever does it, the seam between Sanity Studio UX and the site's render is untested.

---

## Recommended Approach (1 Sentence Per Axis)

- **Architecture**: Hybrid is right (polymorphic `homePage.sections[]` + page singletons + structured doc refs for lists), but add `sanity-typegen` and use `defineLive` from day one — without these the polymorphic + draft-mode story is broken even if every component renders correctly.
- **Sequencing**: Reject "execute on main" — execute on `feature/cms-migration` deployed to a Vercel preview against a separate `migration` Sanity dataset, with `NEXT_PUBLIC_USE_SANITY` feature-flag fallbacks per component; cutover at session end via dataset import + envvar flip + main merge for ~30s downtime and instant rollback.
- **Editing surface**: Expand schemas to cover per-page SEO/metadata, JSON-LD source fields, sitemap derivation, error/loading/404 page copy, empty states, and the founding-year + email + copyright triad — OR explicitly defer them to a documented Phase 7. The current plan's silence on these is the gap Momus will reject.
- **Risk reduction**: Address the three production-breakers (PB-1 `images.remotePatterns`, PB-2 `/studio` auth, PB-3 Next 16 awareness) in Phase 0/1. Address Stega-in-non-DOM contexts (JSON-LD, metadata, URLs) explicitly with `stegaClean()` calls everywhere it serializes. Wire `<VisualEditing>` + `<SanityLive>` + sanity-typegen — otherwise editors can enable preview but won't see overlays or real-time updates.
- **Verification**: Replace "draft mode verification" placeholder with the 15 agent-executable gates in §5. Wire them as the cutover merge gate; nothing ships without them.

---

## Final Priority Ordering — What the Plan Must Address, In Order

### Safety / Correctness Blockers (Momus rejects without these)

1. **PB-1**: Add `images.remotePatterns` for `cdn.sanity.io` to `next.config.ts` in Phase 0.
2. **PB-2**: Lock down `/studio` access (member audit AND/OR Vercel Password Protection).
3. **PB-3**: Treat repo as Next 16; use `defineLive` from `next-sanity@12.4.5`; test `bun run build` early.
4. **Sequencing**: Add Phase -1 — dataset backup, feature branch, separate `migration` Sanity dataset, `NEXT_PUBLIC_USE_SANITY` feature flag, atomic cutover at session end.
5. **Move `/api/revalidate` to Phase 1** with `parseBody(req, secret, true)`.

### Quality / Completeness Blockers (Momus flags as gaps)

6. **`stegaClean()` everywhere** non-DOM serialization happens (metadata, JSON-LD, sitemap, URLs).
7. **Install `sanity-typegen`** in Phase 0; no `any` casts in SectionRenderer.
8. **Install `@sanity/visual-editing` + `@sanity/preview-url-secret`** as explicit deps; mount `<VisualEditing />`.
9. **One GROQ query per page** with full projection (no N+1).
10. **Cache tags on every fetch** (or use `defineLive`).
11. **`generateStaticParams` + `dynamicParams: true` + `revalidate: 3600`** for `/committees/[slug]`; webhook revalidates list page too.
12. **Footer schema-mismatch fix** atomically sequenced with seed.
13. **`photoReleaseObtained` gate**: schema `readOnly` + deterministic component fallback.
14. **15 verification gates** wired as the cutover merge gate (§5).

### Scope-Definition Decisions (Must Be Resolved Before Phase 0)

15. Per-page SEO strategy (§3.1).
16. OG image strategy (§3.3).
17. Naming convention — camelCase recommended (§3.10).
18. `defineLive` vs manual `sanityFetch` (§3.20).
19. 404 / error / loading pages in scope or not (§3.14).
20. Sitemap derivation from Sanity (§3.13).
21. Founding year — single source vs per-page (§3.5).
22. IB Director placeholder strategy (§3.6).
23. Schema rename specifics — which fields rename, deprecation pattern (§3.10, §2.17).
24. Slug-change redirect strategy (§3.18).
25. Studio authentication (§3.15).

### Deferrable to Phase 7 (Document Explicitly)

26. Theme token consolidation (50+ inline hex codes).
27. PWA manifest.
28. Apple touch icon, Twitter image override.

---

## Closing

If Prometheus's plan ignores items 1–5 (the production-breakers + sequencing), Momus rejects it on **safety**. Items 6–14 are correctness/quality. Items 15–25 are decisions the user owes back before Phase 0 can start cleanly. Items 26–28 are explicit deferrals — the plan must say so, not just be silent.

The user wants this plan production-ready. With items 1–14 in the plan, decisions 15–25 collected before kickoff, and deferrals 26–28 documented, it is.

Without them, "all content editable without having to edit actual code" remains a stated promise the migration partially fails to keep — and the cutover risks taking the live site down during execution.
