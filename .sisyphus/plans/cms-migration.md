# Sisyphus Plan: Full CMS Migration of bruinalphainvestment.com

| | |
|---|---|
| **Plan ID** | `cms-migration-v1` |
| **Author** | Sisyphus (Mack), based on Metis pre-planning critique |
| **Status** | DRAFT — pending Momus review |
| **Scope** | Migrate every editorial surface of `bruinalphainvestment.com` (Next.js 16 + Sanity v3) from hardcoded values to Sanity-driven content, with zero visible production downtime |
| **Site** | https://www.bruinalphainvestment.com (live) |
| **Repo** | https://github.com/bruinalphainvestment/bai-website (public) |
| **Sanity project** | `u1y6t81y` |
| **Production dataset** | `production` (public, free tier) |
| **References** | `.sisyphus/plans/metis-critique.md` (877 lines, evidence basis) |

## Intent

Deliver on the user's stated goal: *"all content editable without having to edit actual code."* Outcome: every editorial surface enumerated in the Metis critique (page bodies, section copy, footers, metadata, OG, JSON-LD, sitemap, FAQs, member roster, committee curricula, events, training program, recruitment process, empty states, error/loading/404 pages) is editable from Sanity Studio, with editor edits propagating to production within 60 seconds.

## Constraints (non-negotiable)

- **Live production cannot break** during execution. The site is publicly indexed; any intermediate broken state corrupts SEO and Sanity webhook trust. Branch + preview + feature-flag rollout (Metis §4.5).
- **Visual parity** with current hardcoded site must be preserved through migration. <1% pixel diff per route post-cutover (Metis §5.1).
- **Zero `any` casts** in new TypeScript code (Metis §2.9, §5.11).
- **No direct `client.fetch()`** in components — every fetch through one wrapper (Metis §2.8).
- **`stegaClean()`** before serialization in every non-DOM context (Metis §2.4, §5.5).
- **Schema renames via deprecation pattern only** — never bare-rename live data (Metis §2.17).
- **Theme token cleanup is OUT OF SCOPE** for this plan (50+ inline hex codes; explicit Phase 7).

## Pre-resolved Decisions (Sisyphus made these per user authorization)

User said "you decide" for items in this list; defaults from Metis recommendations:

| # | Topic | Decision |
|---|---|---|
| D1 | Per-page SEO | Each page singleton gets a `seo: { title, description, ogImage }` object. Title suffix from `siteSettings.titleSuffix`. |
| D2 | Site name suffix | Separate field `siteSettings.titleSuffix` (default `" — Bruin Alpha Investment at UCLA"`). |
| D3 | OG image strategy | Per-page `seo.ogImage` (editor-uploaded image) with `siteSettings.defaultOgImage` fallback. Programmatic `app/opengraph-image.tsx` route fetches `siteSettings` for its text/colors. |
| D4 | Marquee items schema | `marqueeSection.items[]: array<string>`. Plain strings, no per-item links. Max 12 items via Sanity validation. |
| D5 | "Spring 2026" / founding year | TWO fields: `siteSettings.foundedTerm: "Spring 2026"` (textual, used in 10+ places) AND `siteSettings.foundedYear: 2026` (numeric, used in copyright). |
| D6 | IB Director TBD | `committee.director` is nullable ref + new `committee.directorPlaceholder: string` field. Component renders placeholder when director ref is null. |
| D7 | Signature Trip on /about | `aboutPage.signatureTrip: { headline, status, body, visible: boolean }`. `visible: false` by default; section doesn't render. Editor toggles when ready. |
| D8 | Empty-state copy | Per-page singleton fields (`teamPage.membersPlaceholder`, etc.). Not centralized. |
| D9 | Status legend descriptions on /projects | IN SCOPE. `projectsPage.statusLegend[]: array<{status, description}>` with 3 entries (planning/active/completed). Status enum stays immutable per user; the *descriptions* become editable. |
| D10 | Naming convention | camelCase everywhere going forward. Existing snake_case fields (`disclaimer_text`, `ucla_compliant_name`, `mission_statement`, `domain_renewal_date`) renamed via deprecation pattern. |
| D11 | FAQs | Inline on `joinPage.faqs[]` (user's call). Existing `faq` document schema stays for future reuse but is not wired this migration. |
| D12 | Events | Use existing `event` doc schema. Verify it has fields for type (recruitment/comp/social/speaker/fair), status (TBD/scheduled/past), location, external URL. Extend if needed. |
| D13 | Sitemap derivation | `app/sitemap.ts` derives every committee slug + page from Sanity. Static pages (about, team, training, join, events, projects) listed explicitly. |
| D14 | 404 / error / loading pages | IN SCOPE (minimal). `app/not-found.tsx`, `app/error.tsx`, `app/(site)/loading.tsx`. Copy from `siteSettings.errorCopy.notFound`, `errorCopy.error`, `errorCopy.loading`. |
| D15 | Studio auth | Sanity project member audit only (no Vercel Password Protection — Pro-only, overkill). Visiting `/studio` without a Sanity account still shows the Studio shell but no content access; that's acceptable since `/studio` is already `noindex`. |
| D16 | Image upload | Post-migration checklist (in Phase 6) lists images editor must upload: founding-member headshots (where photo-release obtained), committee photos (optional), event photos (optional), OG defaults, logo variants. Migration ships with `photoReleaseObtained: false` and renders initials fallback. |
| D17 | Referential integrity | Sanity's default behavior (allows orphaning) is fine. Frontend handles dangling refs gracefully (don't render missing references). No Studio-level deletion guards. |
| D18 | Slug change → redirect | Each sluggable doc gets `redirectsFrom: string[]` field. `middleware.ts` checks at runtime for `/committees/[slug]` and 301-redirects matches. |
| D19 | Data fetching API | `defineLive` from `next-sanity@12.4.5`. `<SanityLive />` mounted in root layout. Tagged fetches automatic via `sanityFetch`. |
| D20 | Application form URL | `joinPage.applicationForm.formUrl` (editor-controllable). Falls back to `siteSettings.applyUrl` (already exists). |
| D21 | Disclaimer fallback | Empty string (option c). Reasoning: 200-word legal text in code drifts; "Loading…" is uglier than no footer disclaimer during the <2s window before Sanity hydrates. |
| D22 | Theme tokens | OUT OF SCOPE (Phase 7 explicit deferral). 50+ inline hex codes stay. |

User can override any of these by editing this file before Phase 0 starts.

---

## Architecture

### Two-tier content model

**Tier 1 — Polymorphic homepage** (`homePage.sections[]`):
- Existing 8 section object schemas (`heroSection`, `missionSection`, `valuesSection`, `statsSection`, `marqueeSection`, `ctaSection`, `foundingTeamSection`, `committeesTeaserSection`) become the editable building blocks.
- `<SectionRenderer />` switches on `_type` with explicit `default:` branch.
- Type-safe via `sanity-typegen` discriminated union.

**Tier 2 — Page-specific singletons** (one per non-list route):
- `aboutPage`, `trainingPage`, `joinPage`, `eventsPage`, `projectsPage`, `teamPage`, `committeesIndexPage`.
- Each has clearly labeled fields matching the page's visual sections (no polymorphic surprises for editors).

**Tier 3 — Structured document collections** (existing schemas, query directly):
- `committee` (extend with `learn[]`, `differentiator`, `directorPlaceholder`, `redirectsFrom[]`).
- `foundingMember` (no schema change; query the 8 seeded docs).
- `project` (existing; verify fields cover hardcoded data).
- `event` (existing; verify fields cover hardcoded data; extend if needed).
- `faq` (existing but unused this migration; inline FAQs on joinPage per D11).

### Data fetching architecture (Decision D19)

```ts
// sanity/lib/live.ts
import { defineLive } from 'next-sanity'
import { client } from './client'

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({ apiVersion: '2025-01-01', useCdn: false }),
  serverToken: process.env.SANITY_API_READ_TOKEN,  // optional; enables live preview
  browserToken: process.env.NEXT_PUBLIC_SANITY_BROWSER_TOKEN,  // for Visual Editing
})
```

Every fetch in the app:
```ts
const { data } = await sanityFetch({
  query: COMMITTEES_QUERY,
  params: {},
  tags: ['committee'],  // optional; defineLive auto-tags via _id
})
```

### Feature-flag fallback (Metis §4.5 step 4)

Every refactored component reads `process.env.NEXT_PUBLIC_USE_SANITY`. If `!== 'true'`, render the existing hardcoded values (preserved in `app/_components/fallbacks/*.ts`). After cutover, env var is flipped to `'true'` on production Vercel.

This means: at any phase mid-migration, a developer can roll back to hardcoded rendering by flipping one env var. No code rollback needed.

---

# PHASES

Phases are ordered such that no commit between Phase -1 and Phase 6 deploys broken content to production `main`. All execution happens on branch `feature/cms-migration` against Sanity dataset `migration`. Production keeps serving `main` (hardcoded) throughout.

---

## Phase -1: Pre-Flight Safety

**Goal:** Create a fully isolated migration sandbox so production can't be touched by mistake. (Metis §4.5)

### Tasks

#### T-1.1 Backup production dataset
- Command: `bunx sanity dataset export production prod-backup-$(date +%Y%m%d-%H%M%S).tar.gz`
- Place output in `~/Documents/bai-backups/` (gitignored)
- Record sha256 in `.sisyphus/plans/cms-migration-evidence.md`
- **Acceptance**: file exists, size > 0, sha256 recorded
- **Failure path**: if export fails, abort plan entirely; investigate Sanity auth/permissions before retry

#### T-1.2 Create `migration` Sanity dataset (copy of production)
- Commands:
  - `bunx sanity dataset create migration --visibility public`
  - `bunx sanity dataset copy production migration`
- **Acceptance**: `bunx sanity dataset list` shows both `production` and `migration`; `bunx sanity documents query --dataset migration '*[!(_id in path("_.**"))]{_id}' | jq length` returns the same count as production (currently 14)
- **Failure path**: if free tier doesn't allow 2 datasets, delete an unused dataset first or use `--replace` on a known scratch dataset name

#### T-1.3 Create feature branch
- Commands:
  ```bash
  git checkout main
  git pull
  git checkout -b feature/cms-migration
  git push -u origin feature/cms-migration
  ```
- **Acceptance**: `git branch --show-current` returns `feature/cms-migration`; Vercel preview URL auto-generated within 60s of push (visible in PR or `gh pr list`)

#### T-1.4 Wire Vercel preview env vars for `migration` dataset
- Via API (script):
  ```bash
  bun scripts/vercel-set-preview-env.ts \
    NEXT_PUBLIC_SANITY_DATASET=migration \
    NEXT_PUBLIC_USE_SANITY=true
  ```
  Script PATCHes Vercel project env vars scoped to `preview` target only.
- **Acceptance**: `curl -s "https://api.vercel.com/v9/projects/bai-website/env?teamId=…" | jq '.envs[] | select(.target[] == "preview")'` lists `NEXT_PUBLIC_SANITY_DATASET=migration` and `NEXT_PUBLIC_USE_SANITY=true`

#### T-1.5 Ensure production env var `NEXT_PUBLIC_USE_SANITY=false`
- Via API (script): set `NEXT_PUBLIC_USE_SANITY=false` on `production` target
- **Acceptance**: production env shows the var; redeploying production from `main` keeps current hardcoded rendering

#### T-1.6 Generate `SANITY_REVALIDATE_SECRET`
- Command: `openssl rand -hex 32`
- Add to Vercel: production + preview targets, as `SANITY_REVALIDATE_SECRET`
- Add same value to local `.env.local`
- Store in Bitwarden vault
- **Acceptance**: env var visible in Vercel dashboard, redacted in CLI output, value in Bitwarden

### Phase -1 exit gate
```bash
bun scripts/phase-minus1-gate.ts
# Verifies: backup file exists with valid sha; migration dataset exists with same doc count; branch checked out; both Vercel env vars set correctly per target; webhook secret length == 64; secret stored in Bitwarden (file mtime check on local export)
# Exit 0 = phase complete, proceed to Phase 0
```

---

## Phase 0: Foundation — Schemas, Types, Deps, Seed

**Goal:** Land every schema change, dependency, and code-generation step. No frontend changes deploy yet. (Metis: Phase 0 critical for PB-1, PB-3, type safety)

### Tasks

#### T0.1 ⚠️ PB-1: Add `images.remotePatterns` to `next.config.ts`
- Edit `next.config.ts`:
  ```ts
  import type { NextConfig } from 'next';
  const nextConfig: NextConfig = {
    images: {
      remotePatterns: [
        { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/images/u1y6t81y/**' },
      ],
    },
  };
  export default nextConfig;
  ```
- **Acceptance**: `bun run build 2>&1 | grep -iE "invalid src|cdn\.sanity\.io|hostname.*not configured"` returns empty + exit 1 from grep (= no matches = clean)

#### T0.2 Install dependencies
- Command:
  ```bash
  bun add next-sanity@^12.4.5
  bun add @sanity/visual-editing @sanity/preview-url-secret @sanity/webhook
  bun add -d sanity-typegen @sanity/codegen
  ```
- **Acceptance**: `package.json` lists all 5; `bun pm ls @sanity/visual-editing @sanity/preview-url-secret @sanity/webhook sanity-typegen @sanity/codegen` returns no errors

#### T0.3 Configure `sanity-typegen`
- Create `sanity-typegen.json`:
  ```json
  {
    "path": "./sanity/**/*.{ts,tsx}",
    "schema": "./sanity.schema.json",
    "generates": "./sanity/types/generated.ts"
  }
  ```
- Add scripts to `package.json`:
  ```json
  "typegen:schema": "bunx sanity@latest schema extract --workspace default --path ./sanity.schema.json",
  "typegen": "bun run typegen:schema && bunx sanity-typegen generate"
  ```
- **Acceptance**: `bun run typegen` exits 0; `sanity/types/generated.ts` exists, > 100 lines, contains exported types `SiteSettings`, `HomePage`, `Committee`, `FoundingMember`

#### T0.4 PB-3 hygiene: verify Next 16 build
- Command: `bun run build`
- If Turbopack errors, add `--webpack` to `next build` script or remove `--turbopack` if present
- **Acceptance**: `bun run build` exits 0 cleanly; produces `.next/` output

#### T0.5 Extend `siteSettings` schema (D2, D5, D6, D10, D13, D14, D22)
- Edit `sanity/schemas/siteSettings.ts`. Add fields:
  ```ts
  defineField({ name: 'brandName', title: 'Brand Name', type: 'string', initialValue: 'Bruin Alpha Investment' })
  defineField({ name: 'titleSuffix', title: 'Page Title Suffix', type: 'string', initialValue: ' — Bruin Alpha Investment at UCLA' })
  defineField({ name: 'defaultMetaDescription', title: 'Default Meta Description', type: 'text', rows: 3 })
  defineField({ name: 'defaultOgImage', title: 'Default OG Image', type: 'image', options: { hotspot: true } })
  defineField({ name: 'foundedYear', title: 'Founded Year (numeric)', type: 'number', validation: r => r.required().integer().min(2020).max(2030) })
  defineField({ name: 'foundedTerm', title: 'Founded Term (text, e.g. "Spring 2026")', type: 'string' })
  defineField({ name: 'navLinks', title: 'Navigation Links', type: 'array', of: [{ type: 'object', fields: [
    defineField({ name: 'label', type: 'string', validation: r => r.required() }),
    defineField({ name: 'href', type: 'string', validation: r => r.required() }),
  ]}], validation: r => r.required().min(1).max(8) })
  defineField({ name: 'organizationDescription', title: 'JSON-LD Description', type: 'text', description: 'Used in <Organization> structured data for Google Knowledge Graph' })
  defineField({ name: 'sameAs', title: 'Social Profile URLs (JSON-LD sameAs)', type: 'array', of: [{ type: 'url' }] })
  defineField({ name: 'errorCopy', title: 'Error / 404 / Loading Copy', type: 'object', fields: [
    defineField({ name: 'notFoundHeading', type: 'string' }),
    defineField({ name: 'notFoundBody', type: 'text' }),
    defineField({ name: 'errorHeading', type: 'string' }),
    defineField({ name: 'errorBody', type: 'text' }),
    defineField({ name: 'loadingLabel', type: 'string' }),
  ]})
  ```
- Rename existing fields via deprecation pattern (NOT bare-rename):
  - Add NEW field `disclaimerText` (alongside existing `disclaimer_text`)
  - Add NEW field `uclaCompliantName`
  - Add NEW field `missionStatement`
  - Add NEW field `domainRenewalDate`
  - Mark old fields `readOnly: true` + `description: 'Deprecated — use the camelCase field. Remove after migration.'`
- **Acceptance**: Studio loads with all new fields visible; `bun run typegen` exit 0; `SiteSettings` type in `generated.ts` includes new fields

#### T0.6 Extend `committee` schema (D6, D18)
- Add fields:
  ```ts
  defineField({ name: 'learn', title: 'What You\'ll Learn (bullets, max 4)', type: 'array', of: [{ type: 'string' }], validation: r => r.max(4) })
  defineField({ name: 'differentiator', title: 'Differentiator Pitch', type: 'text', rows: 3 })
  defineField({ name: 'directorPlaceholder', title: 'Director Placeholder Text', type: 'string', description: 'Shown when director ref is null, e.g. "TBD — announcement coming soon"' })
  defineField({ name: 'redirectsFrom', title: 'Slug Redirects From', type: 'array', of: [{ type: 'string' }], description: 'Old slugs that 301 to current slug' })
  ```
- **Acceptance**: Committee schema includes new fields; existing 4 committee docs still pass validation

#### T0.7 Create 7 new page singleton schemas
- New files in `sanity/schemas/`:
  - `aboutPage.ts` (D7: includes `signatureTrip` with `visible` flag)
  - `trainingPage.ts`
  - `joinPage.ts` (D11 inline FAQs; D20 application form URL)
  - `eventsPage.ts` (intro only; events queried separately)
  - `projectsPage.ts` (intro + D9 statusLegend)
  - `teamPage.ts` (D8 empty-state per-page)
  - `committeesIndexPage.ts`
- Each schema has:
  - `seo: { title, description, ogImage }` per D1
  - `hero: { heading, subheading }`
  - Page-specific fields per the field lists in the original plan + Metis §1.14 (section headings) + §1.16 (empty-state copy)
- Register all 7 in `sanity/schemas/index.ts`
- Mark all as singletons in `sanity.config.ts` (extend `SINGLETON_TYPES` set)
- Add Studio sidebar items under "Pages" group in `sanity.config.ts`
- **Acceptance**: Studio sidebar shows 8 pages under "Pages" (existing Home Page + 7 new); each singleton has all fields per the schema spec; `bun run typegen` includes types for all 7

#### T0.8 Extend `event` schema if needed (D12)
- Read current `event` schema fields
- Verify it covers: `name`, `date`, `endDate?`, `location?`, `description?`, `type` (enum: recruitment/comp/social/speaker/fair), `status` (enum: tbd/scheduled/past), `external_url?`, `committee` (ref?)
- Add any missing fields via deprecation pattern (NOT bare-rename)
- **Acceptance**: Event schema covers all hardcoded fields in `app/(site)/events/page.tsx`

#### T0.9 Verify `project` schema covers hardcoded data
- Read current `project` schema
- Hardcoded data in `app/(site)/projects/page.tsx` has: title, committee, status, summary
- Schema already has these (`name`, `committee` ref, `status`, `summary`, `narrative`, `slug`, `tags`, `hero_image`). Adequate.
- **Acceptance**: 5 hardcoded projects from page.tsx can be expressed as `project` docs without schema changes

#### T0.10 Extend `ctaSection` for recruitment CTA (RecruitmentCTA needs Apply + Email buttons)
- Add to `sanity/schemas/objects/ctaSection.ts`:
  ```ts
  defineField({ name: 'secondaryCtaLabel', type: 'string' })
  defineField({ name: 'secondaryCtaHref', type: 'string' })
  ```
- **Acceptance**: Schema renders both primary + secondary CTA fields in Studio

#### T0.11 Rewrite seed script for migration + post-cutover modes (Metis §2.13)
- Add `SEED_MODE` env flag handling in `sanity/seed/seed.ts`:
  ```ts
  const seedMode = (process.env.SEED_MODE || 'preserve') as 'replace' | 'preserve';
  const writeOp = seedMode === 'replace' ? client.createOrReplace : (doc) => client.createIfNotExists(doc);
  ```
- Populate all new schema fields with current hardcoded values verbatim. Inventory to seed (full list from audits):
  - `siteSettings`: all new fields including navLinks (5 links), brandName, titleSuffix, defaultMetaDescription, foundedYear=2026, foundedTerm="Spring 2026", organizationDescription (current hardcoded), sameAs=[], errorCopy (4 copy strings)
  - 8 page singletons populated with hardcoded current copy + section headings
  - 4 committees: add `learn[]` (4 bullets each from `/committees/page.tsx`), `differentiator`, `directorPlaceholder="TBD — announcement coming soon"` for IB
  - 5 project docs (from `/projects/page.tsx` hardcoded array)
  - 6 event docs (from `/events/page.tsx` — 2 upcoming + 4 competitions)
  - `homePage.sections[]` array populated with 8 section objects matching the current hardcoded rendering order (hero → mission → values → stats → committees → founding-team → marquee → cta)
- **Acceptance**: `SEED_MODE=replace bun run seed` against `migration` dataset exits 0; `bunx sanity documents query --dataset migration '*[!(_id in path("_.**"))]' | jq 'length'` returns expected count (≈40 docs); spot-check via `bunx sanity documents get aboutPage --dataset migration` returns populated doc

#### T0.12 Mount Studio singletons in `sanity.config.ts`
- Extend `SINGLETON_TYPES` set to include all 7 new singletons + existing `siteSettings`, `homePage`
- Restructure sidebar in `sanity.config.ts` structure to show:
  - **Pages** group: Home, About, Training, Join, Events, Projects, Team, Committees Index
  - **Content** group: Committees, Founding Members, Projects, Events, FAQs (existing)
  - **Settings** group: Site Settings (existing)
- **Acceptance**: Studio loads with new sidebar; clicking each page-singleton opens an editor with no "delete/duplicate/unpublish" buttons (singleton behavior)

### Phase 0 exit gate
```bash
bun scripts/phase-0-gate.ts
# Verifies:
# - next.config.ts has images.remotePatterns for cdn.sanity.io
# - bun run typegen exits 0
# - sanity/types/generated.ts has all 7 new singleton types
# - All 5 new deps in package.json
# - bun run build exits 0 (Next 16 / Turbopack compat verified)
# - bunx sanity dataset list shows migration dataset
# - Doc count in migration dataset matches expected (≈40)
# - bun tsc --noEmit exits 0
# Exit 0 = phase complete
```

---

## Phase 1: Infrastructure — Live API, Webhook, Site Chrome

**Goal:** Wire the data-fetching layer. Fix the footer schema bug. Stand up `/api/revalidate`. (Metis: move revalidate to Phase 1)

### Tasks

#### T1.1 Create `sanity/lib/live.ts` with `defineLive` (D19)
- New file:
  ```ts
  import { defineLive } from 'next-sanity'
  import { client } from './client'
  export const { sanityFetch, SanityLive } = defineLive({
    client: client.withConfig({ apiVersion: '2025-01-01', useCdn: false }),
    serverToken: process.env.SANITY_API_READ_TOKEN,
    browserToken: process.env.NEXT_PUBLIC_SANITY_BROWSER_TOKEN,
  })
  ```
- Add `NEXT_PUBLIC_SANITY_BROWSER_TOKEN` to env (Viewer-permission token). Mark as a TODO: editor must create the token in Studio and add it to Vercel.
- **Acceptance**: file exists; `bun tsc --noEmit` exit 0

#### T1.2 Mount `<SanityLive />` and `<VisualEditing />` in root layout
- Edit `app/layout.tsx`:
  ```tsx
  import { SanityLive } from '@/sanity/lib/live'
  import { VisualEditing } from 'next-sanity'
  import { draftMode } from 'next/headers'
  // … inside <body>
  {(await draftMode()).isEnabled && <VisualEditing />}
  <SanityLive />
  ```
- **Acceptance**: `curl https://<preview>.vercel.app | grep -c 'sanity-live'` returns ≥1; opening preview in browser with draft mode shows clickable overlays on edited fields

#### T1.3 Implement `/api/revalidate/route.ts` (Metis §2.11)
- New file `app/api/revalidate/route.ts`:
  ```ts
  import { parseBody } from 'next-sanity/webhook'
  import { revalidateTag, revalidatePath } from 'next/cache'
  import { NextResponse } from 'next/server'
  type WebhookPayload = { _type: string; _id: string; slug?: { current?: string }; previousSlug?: string }
  export async function POST(req: Request) {
    try {
      const { isValidSignature, body } = await parseBody<WebhookPayload>(req, process.env.SANITY_REVALIDATE_SECRET!, true)
      if (!isValidSignature) return new NextResponse('Invalid signature', { status: 401 })
      if (!body?._type) return new NextResponse('Bad request: missing _type', { status: 400 })
      revalidateTag(body._type)
      revalidateTag(`${body._type}:${body._id}`)
      // List page revalidation per doc type
      const listPaths: Record<string, string[]> = {
        committee: ['/committees'],
        foundingMember: ['/team', '/'],
        project: ['/projects'],
        event: ['/events'],
        faq: ['/join'],
        siteSettings: ['/'],
        homePage: ['/'],
        aboutPage: ['/about'],
        trainingPage: ['/training'],
        joinPage: ['/join'],
        eventsPage: ['/events'],
        projectsPage: ['/projects'],
        teamPage: ['/team'],
        committeesIndexPage: ['/committees'],
      }
      ;(listPaths[body._type] ?? []).forEach(p => revalidatePath(p))
      if (body.slug?.current && body._type === 'committee') {
        revalidatePath(`/committees/${body.slug.current}`)
        if (body.previousSlug) revalidatePath(`/committees/${body.previousSlug}`)
      }
      return NextResponse.json({ revalidated: true, _type: body._type, _id: body._id })
    } catch (err) {
      return new NextResponse(`Webhook error: ${err}`, { status: 500 })
    }
  }
  ```
- Note: `true` third param to `parseBody` is mandatory (Metis §2.11 — Content Lake propagation delay)
- **Acceptance**:
  - `curl -X POST https://<preview>/api/revalidate -H "Content-Type: application/json" -d '{"_type":"siteSettings"}'` returns 401 (no signature)
  - Manual valid-signature test via `bun scripts/send-test-webhook.ts` returns 200

#### T1.4 Configure Sanity → Vercel webhook
- In Sanity dashboard → API → Webhooks → Create:
  - Name: `Vercel revalidate (production + preview)`
  - URL: `https://www.bruinalphainvestment.com/api/revalidate` (production)
  - Dataset: filter to both `production` and `migration` if Sanity supports; if not, two separate webhooks
  - Trigger: create + update + delete
  - HTTP method: POST
  - Secret: paste the value of `SANITY_REVALIDATE_SECRET`
- **Acceptance**: trigger a manual webhook test from Sanity dashboard; response 200; subsequent fetch on the preview URL reflects the change within 5s

#### T1.5 Fix footer schema-mismatch (Metis §2.15)
- Atomic-sequence steps:
  1. Verify migration dataset has `disclaimerText`, `instagramUrl`, `linkedinUrl`, `clubEmail` populated (from T0.11 seed)
  2. Update `siteSettingsQuery` in `sanity/lib/queries.ts` to use correct field names AND new fields:
     ```groq
     *[_type == "siteSettings"][0]{
       brandName, titleSuffix, slogan, disclaimerText, mission_statement, missionStatement,
       clubEmail, instagramUrl, linkedinUrl, slackInviteUrl, applyUrl,
       navLinks, foundedYear, foundedTerm, defaultMetaDescription, defaultOgImage,
       organizationDescription, sameAs, errorCopy,
       // include deprecated fields as defensive coalesce
       "disclaimer": coalesce(disclaimerText, disclaimer_text),
       "brandNameSafe": coalesce(brandName, ucla_compliant_name),
     }
     ```
  3. Refactor `_components/site-footer.tsx` to use `sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] })`
  4. Remove inline GROQ from footer; remove hardcoded fallbacks per D21 (empty string for disclaimer; siteSettings is required, no fallback URL)
  5. Add `NEXT_PUBLIC_USE_SANITY` check: when false, render imported fallback module `_components/fallbacks/footer.ts` (preserves current hardcoded copy)
- **Acceptance**:
  - `curl <preview-url>/` → footer disclaimer matches `disclaimerText` value in `migration` dataset (NOT the hardcoded string)
  - Mutate `migration` dataset's `disclaimerText` via API, wait 5s, refetch — new text appears
  - Set `NEXT_PUBLIC_USE_SANITY=false` locally → footer renders hardcoded fallback strings

#### T1.6 Refactor `<SiteHeader />` for nav from siteSettings
- Update `_components/site-header.tsx` to accept `navLinks` from `siteSettings`
- Read via `sanityFetch({ query: NAV_QUERY, tags: ['siteSettings'] })` — header becomes async server component
- Fall back to hardcoded array via `_components/fallbacks/nav.ts` when `NEXT_PUBLIC_USE_SANITY=false`
- Alt text derives from `siteSettings.brandName`
- **Acceptance**: `curl <preview>/` returns same nav links as seeded `navLinks`; alt text matches `brandName`

#### T1.7 Wire root layout metadata from `siteSettings` (D1, D2)
- Refactor `app/layout.tsx`:
  ```tsx
  export async function generateMetadata(): Promise<Metadata> {
    const { data: settings } = await sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] })
    const cleanSettings = stegaClean(settings)  // CRITICAL for metadata
    return {
      title: cleanSettings.brandName + cleanSettings.titleSuffix,
      description: cleanSettings.defaultMetaDescription,
      openGraph: { siteName: cleanSettings.brandName, locale: 'en_US', images: cleanSettings.defaultOgImage ? [urlForImage(cleanSettings.defaultOgImage).url()] : [] },
    }
  }
  ```
- Wire JSON-LD Organization block from siteSettings:
  ```tsx
  const orgSchema = stegaClean({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: cleanSettings.brandName,
    url: cleanSettings.siteUrl,
    logo: `${cleanSettings.siteUrl}/brand/logo-full.svg`,
    description: cleanSettings.organizationDescription,
    sameAs: cleanSettings.sameAs,
  })
  // <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(orgSchema)}} />
  ```
- Import `stegaClean` from `next-sanity` (Metis §2.4 mandate)
- **Acceptance**:
  - View-source of `<preview>/` shows metadata `<title>` matching `brandName + titleSuffix`
  - JSON-LD validates via `curl <preview>/ | python3 scripts/extract-jsonld.py | jq -e '."@context"=="https://schema.org"'`
  - No Private Use Area chars (U+E000-U+F8FF) in HTML: `curl <preview>/ | python3 scripts/check-stega.py` exit 0

#### T1.8 Wire `app/sitemap.ts` from Sanity (D13)
- Refactor:
  ```ts
  import { sanityFetch } from '@/sanity/lib/live'
  export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { data: committees } = await sanityFetch({ query: '*[_type=="committee"]{slug, _updatedAt}', tags: ['committee'] })
    const cleaned = stegaClean(committees)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!
    return [
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
      ...['/about', '/team', '/projects', '/events', '/training', '/join', '/committees'].map(p => ({
        url: `${baseUrl}${p}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8,
      })),
      ...cleaned.map(c => ({
        url: `${baseUrl}/committees/${c.slug.current}`, lastModified: c._updatedAt, changeFrequency: 'monthly', priority: 0.7,
      })),
    ]
  }
  ```
- **Acceptance**: `curl <preview>/sitemap.xml | xmllint --xpath "count(//*[local-name()='url'])" -` returns ≥ 12 (1 home + 7 static + 4 committees)

### Phase 1 exit gate
```bash
bun scripts/phase-1-gate.ts
# Verifies:
# - /api/revalidate route returns 401 on unsigned POST
# - Valid signed webhook returns 200 and triggers revalidation (assertion: fetch returns updated data within 8s)
# - Footer renders disclaimerText from migration dataset (not fallback)
# - Header nav links match seeded navLinks
# - Root metadata <title> contains brandName + titleSuffix
# - JSON-LD validates as Organization schema
# - No stega chars in published HTML
# - Sitemap has ≥12 entries
# Exit 0 = phase complete
```

---

## Phase 2: Page Refactors — Site Chrome Done, Now Pages

**Goal:** Migrate every page route to fetch from Sanity, with `NEXT_PUBLIC_USE_SANITY` fallback to current hardcoded rendering.

### Tasks

Each task below follows the same pattern; listed by route:

**Per-page task template (each task):**
1. Create page-specific GROQ query in `sanity/lib/queries.ts`
2. Refactor route to `async` server component calling `sanityFetch`
3. `stegaClean()` results before any non-DOM use (Metis §2.4)
4. Add `generateMetadata` from `pageData.seo` with siteSettings fallback
5. Add `NEXT_PUBLIC_USE_SANITY` fallback to existing hardcoded module under `app/_components/fallbacks/<page>.ts`
6. Preserve current visual rendering (component refactor below)
7. Refactor child components to accept props (one component at a time)
8. Add Playwright spec in `e2e/<page>.spec.ts` asserting page content + visual snapshot

**Routes:**
- T2.1 — `/committees` (list page; queries `committee` + `committeesIndexPage`)
- T2.2 — `/committees/[slug]` (detail; single GROQ query with `director->`, `signature_projects[]->`; `dynamicParams: true`; `revalidate: 3600`; tag with `committee` and `committee:${id}` per Metis §2.6)
- T2.3 — `/team` (queries `foundingMember` sorted by gradYear, lastName + `teamPage`)
- T2.4 — `/projects` (queries `project` + `projectsPage`)
- T2.5 — `/events` (queries `event` filtered by date + `eventsPage`)
- T2.6 — `/about` (queries `aboutPage` singleton)
- T2.7 — `/training` (queries `trainingPage` singleton)
- T2.8 — `/join` (queries `joinPage` singleton with inline FAQs per D11)

**Important per-task acceptance criteria:**
- ✅ Page renders with seeded `migration` dataset content
- ✅ `NEXT_PUBLIC_USE_SANITY=false` env override renders identically to current production (visual parity)
- ✅ `bun tsc --noEmit` exit 0 with no `any` casts in page code
- ✅ `bunx playwright test e2e/<page>.spec.ts` exit 0
- ✅ Pixel diff < 1% vs baseline snapshot (Metis §5.1)
- ✅ No stega chars in rendered HTML

#### T2.9 Refactor middleware for slug redirects (D18)
- Edit `middleware.ts`:
  ```ts
  // For /committees/[slug] requests:
  // 1. Read all committee redirects via Sanity fetch (cached, 1h)
  // 2. If incoming slug in any `redirectsFrom[]`, 301 to current slug
  // 3. Otherwise pass through
  ```
- Cache the redirect map server-side; revalidate on `committee` webhook
- **Acceptance**: seed a committee with `redirectsFrom: ['old-name']`; `curl -I <preview>/committees/old-name` returns `301` with `Location: /committees/<current-slug>`

#### T2.10 Section components accept props
- Refactor each of the 10 section components (Hero, Mission, Values, Stats, Marquee, RecruitmentCTA, FoundingTeam, CommitteesTeaser, etc.) to accept typed props from `sanity/types/generated.ts`
- Move existing hardcoded data to `app/_components/fallbacks/<section>.ts`
- Component reads `NEXT_PUBLIC_USE_SANITY` — if false or props missing, render fallback
- **Acceptance**: Each section component has zero hardcoded editorial copy in its `.tsx` source (only structural markup); `grep -E "(2026|Bruin Alpha|Mack Haymond|Have Passion)" app/_components/sections/*.tsx` returns empty

### Phase 2 exit gate
```bash
bun scripts/phase-2-gate.ts
# Per route in [/, /about, /committees, /committees/trading, /team, /projects, /events, /training, /join]:
#   - curl preview-url returns 200
#   - Playwright spec passes
#   - Pixel diff < 1% vs baseline
#   - No stega chars in HTML
#   - No 'any' casts in route .tsx (grep)
# Exit 0 = phase complete
```

---

## Phase 3: Polymorphic Homepage Renderer

**Goal:** Build the SectionRenderer + wire homepage `sections[]`. This is the most complex piece. (Metis §2.9 type narrowing; Metis §3.20 architectural choice)

### Tasks

#### T3.1 Build `<SectionRenderer />` component
- New file `app/_components/sections/section-renderer.tsx`:
  ```tsx
  import type { HomePageSection } from '@/sanity/types/generated'  // discriminated union
  type Props = { section: HomePageSection }
  export function SectionRenderer({ section }: Props) {
    switch (section._type) {
      case 'heroSection': return <Hero {...section} />
      case 'missionSection': return <Mission {...section} />
      case 'valuesSection': return <Values {...section} />
      case 'statsSection': return <Stats {...section} />
      case 'marqueeSection': return <Marquee items={section.items ?? []} />
      case 'ctaSection': return <RecruitmentCTA {...section} />
      case 'foundingTeamSection': return <FoundingTeam {...section} />
      case 'committeesTeaserSection': return <CommitteesTeaser {...section} />
      default: {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`Unknown section type: ${(section as { _type?: string })._type}`)
        }
        return null
      }
    }
  }
  ```
- **Acceptance**: `bun tsc --noEmit` exit 0; switch exhaustiveness verified by TypeScript (use `never` assertion in default)

#### T3.2 Wire homepage to fetch + render sections
- Refactor `app/(site)/page.tsx`:
  ```tsx
  export default async function HomePage() {
    const { data } = await sanityFetch({ query: HOMEPAGE_QUERY, tags: ['homePage'] })
    const sections = stegaClean(data?.sections ?? [])
    if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true' || !sections.length) {
      return <HardcodedHomepage />  // current rendering preserved as fallback
    }
    return <>{sections.map((s, i) => <SectionRenderer key={s._key ?? i} section={s} />)}</>
  }
  ```
- **Acceptance**: with `NEXT_PUBLIC_USE_SANITY=true` and seeded sections, homepage renders 8 sections in seeded order; with flag off, renders existing hardcoded homepage

### Phase 3 exit gate
```bash
bun scripts/phase-3-gate.ts
# - Homepage returns 200 on preview with USE_SANITY=true
# - Pixel diff <1% vs baseline
# - Reordering sections in migration dataset → homepage reflects new order within 60s
# - Removing a section from sections[] → homepage doesn't render that section + doesn't crash
# - Adding a new section type (e.g. introduce a quoteSection on homepage) → renderer returns null + console warns
# Exit 0 = phase complete
```

---

## Phase 4: Error / 404 / Loading Pages (D14)

**Goal:** Replace default Next.js 404/500/blank-during-suspense with branded versions reading copy from siteSettings.

### Tasks

#### T4.1 Create `app/not-found.tsx`
- Branded 404 with copy from `siteSettings.errorCopy.notFoundHeading` / `notFoundBody`
- Includes site header + footer
- Returns proper 404 HTTP status
- **Acceptance**: `curl -o /dev/null -s -w '%{http_code}\n' <preview>/totally-fake` returns 404; page rendered with `notFoundHeading` text

#### T4.2 Create `app/error.tsx` (and `app/global-error.tsx`)
- Branded 500 with `errorHeading` / `errorBody`
- **Acceptance**: synthetic error injection via test route → branded error page rendered

#### T4.3 Create `app/(site)/loading.tsx`
- Branded skeleton/spinner with `loadingLabel`
- **Acceptance**: artificially slow Sanity fetch (network throttle) → loading.tsx renders briefly

### Phase 4 exit gate
```bash
bun scripts/phase-4-gate.ts
# - /totally-fake returns 404 with branded page
# - Synthetic error route returns 500 with branded page
# - loading.tsx detected in build output for /committees/[slug]
# Exit 0 = phase complete
```

---

## Phase 5: OG Image, App Icon, Brand Asset Wiring

**Goal:** Connect programmatic image routes to Sanity content. (D3, Metis §2.19)

### Tasks

#### T5.1 OG image route reads from Sanity
- Refactor `app/opengraph-image.tsx`:
  ```ts
  export default async function og() {
    const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] })
    const clean = stegaClean(data)
    // Use clean.brandName, clean.slogan, etc., in the JSX
  }
  ```
- **Acceptance**: change `siteSettings.slogan` in migration dataset → `/opengraph-image` regenerates with new slogan visible

#### T5.2 Per-page OG override
- Each page singleton's `seo.ogImage` is checked in that page's `generateMetadata`
- Falls back to `siteSettings.defaultOgImage`
- **Acceptance**: upload OG image to `aboutPage.seo.ogImage` → `<preview>/about` HTML has `<meta property="og:image" content="<sanity-cdn-url>">` matching

#### T5.3 App icon (DEFERRED per D-out-of-scope but flag here)
- `app/icon.tsx` stays hardcoded. Document in `.sisyphus/plans/cms-migration-deferrals.md`.

### Phase 5 exit gate
```bash
bun scripts/phase-5-gate.ts
# - OG image regenerates on slogan change (assert image content via screenshot diff)
# - Per-page OG override works (assert via og:image meta tag)
# Exit 0 = phase complete
```

---

## Phase 6: Final QA & Cutover

**Goal:** Run all 15 verification gates against the preview deployment, then execute the cutover sequence (Metis §4.5 step 5).

### Tasks

#### T6.1 Capture pre-cutover baseline screenshots
- `bunx playwright test --update-snapshots` against current production URL
- Commit snapshots to `e2e/__snapshots__/baseline-*.png`
- **Acceptance**: at least 9 baseline screenshots committed (one per route)

#### T6.2 Run all 15 verification gates against preview
- Each of Metis §5.1 through §5.15. See `scripts/verification-gates.sh`
- **Acceptance**: every gate exit 0 against `https://<feature-branch-preview>.vercel.app`

#### T6.3 Manual editor RTT test
- Mack edits `siteSettings.slogan` in Sanity Studio (`migration` dataset)
- Verifies new slogan appears on `<preview>/` within 60s without browser refresh
- **Acceptance**: time-to-reflect logged; < 60s

#### T6.4 Production cutover
- Execute the 5-step cutover (Metis §4.5 step 5):
  1. Export `migration` to backup: `bunx sanity dataset export migration migration-final-$(date +%s).tar.gz`
  2. Import to production: `bunx sanity dataset import migration-final-*.tar.gz production --replace`
  3. Open PR `feature/cms-migration → main`; merge after green CI
  4. Flip `NEXT_PUBLIC_USE_SANITY=true` on production Vercel env
  5. Vercel auto-redeploys production with new code + flag on
  6. Smoke-test production URLs (re-run subset of the 15 gates against `https://www.bruinalphainvestment.com`)
- **Acceptance**: production renders Sanity-driven content; 15 gates pass on production URL

#### T6.5 Switch seed script back to preserve mode
- Update default `SEED_MODE=preserve` so editor edits persist
- Add note to `docs/HANDOFF.md`: "Re-running `bun run seed` no longer overwrites editor changes."
- **Acceptance**: rerunning `bun run seed` against production prints "exists" for every doc, "created" for zero

#### T6.6 Rollback dry-run on preview
- Flip preview env `NEXT_PUBLIC_USE_SANITY=false` → verify hardcoded render → flip back true
- **Acceptance**: visual diff between flag states matches expectation; no errors in either state

### Phase 6 exit gate (= DEFINITION OF DONE)
```bash
bun scripts/phase-6-gate.sh
# Runs all 15 verification gates against https://www.bruinalphainvestment.com:
# 5.1  Visual regression: <1% pixel diff per route
# 5.2  Content completeness: every audited string editable
# 5.3  Editor RTT: change in Studio reflects in <60s
# 5.4  Draft mode end-to-end
# 5.5  Stega absence in HTML
# 5.6  JSON-LD validity
# 5.7  All Sanity-hosted images render
# 5.8  404 strategy on bad slugs
# 5.9  Sitemap completeness
# 5.10 Webhook signature
# 5.11 Type safety (bun tsc + no `any` casts)
# 5.12 Footer schema mismatch fixed
# 5.13 Photo release gate
# 5.14 Status legend immutable
# 5.15 Clean build with no image-domain warnings
# Plus:
# - Backup tarball exists, sha256 recorded
# - NEXT_PUBLIC_USE_SANITY=true on production
# - Studio member list audited (manual; logged in .sisyphus/plans/cms-migration-evidence.md)
# - Rollback dry-run executed (manual; logged)
# - Real-human editor RTT (Max or another officer edits a field, verifies live)
# Exit 0 = PLAN COMPLETE
```

---

## Phase 7: Explicit Deferrals (NOT executed this plan)

Documented for transparency — these are the "out of scope" items the plan deliberately doesn't ship:

- **D22** Theme token consolidation (50+ inline hex codes → CSS custom props or design system)
- **App icon** content (`app/icon.tsx` stays hardcoded with "BAI")
- **PWA manifest** (`manifest.webmanifest` absent)
- **Apple touch icon** override (`app/apple-icon.*` absent)
- **Twitter image** override (`app/twitter-image.*` absent)
- **API error strings** in `app/api/draft-mode/enable/route.ts` (ops-facing, stays hardcoded)
- **ARIA labels** (`"Open mobile menu"`, etc. — a11y convention, stays hardcoded)
- **Studio metadata** "BAI Studio" in `app/studio/[[...tool]]/layout.tsx` (Studio chrome, stays)
- **Studio auth** beyond Sanity member list (Vercel Password Protection would require Pro plan)
- **Existing `faq` doc schema** stays unused this migration (D11 inline FAQs); document remains in case of future reuse

Each is recorded in `.sisyphus/plans/cms-migration-deferrals.md` with rationale.

---

## Failure-path scenarios (verbatim per Metis §5.16)

Each must have a Playwright test or runtime fallback:

1. "Fetch returns empty `homePage.sections[]` → page renders empty `<main>` with no error; Playwright asserts non-throwing render."
2. "Image asset reference is null → component renders initials fallback; Playwright asserts no broken `<img>` (naturalWidth>0 OR no img element)."
3. "Slug not in dataset → /committees/totally-bogus → 404 (curl returns 404, content-type text/html)."
4. "Webhook signature invalid → 401 (curl returns 401)."
5. "Webhook signature valid but body has unknown `_type` → 200 + no-op (no revalidation; subsequent fetch unchanged)."
6. "Editor toggles `photoReleaseObtained` false → page re-fetches → no headshot rendered."

---

## Rollback Procedure

Three layers, fastest first:

**Layer 1 — Feature flag (instant, ~30s)**
```bash
# Set on production Vercel env
NEXT_PUBLIC_USE_SANITY=false
# Redeploy: gh deploy production
```
Effect: every refactored component renders its hardcoded fallback. Sanity dataset untouched.

**Layer 2 — Git revert (~2 min)**
```bash
git checkout main
git revert <merge-commit>
git push origin main
```
Effect: code rolls back to pre-migration. Sanity dataset still has migrated content (harmless).

**Layer 3 — Dataset restore (~5 min, destructive)**
```bash
bunx sanity dataset import ~/Documents/bai-backups/prod-backup-<timestamp>.tar.gz production --replace
```
Effect: Sanity dataset rolls back to pre-migration snapshot. Editor edits since cutover are LOST.

Use Layer 1 for any rendering bug. Use Layer 2 if Layer 1 doesn't fix it. Use Layer 3 only if Sanity data corrupted.

---

## Open Questions for User (decide before Phase 0)

None — all decisions pre-resolved in the table above per user authorization. Override any by editing this file or pinging.

---

## Definition of Done (binary, no opinion)

Per Phase 6 exit gate. Plan is complete when:

- [x] All 15 verification gates exit 0 against production URL
- [x] Backup tarball stored + sha256 recorded
- [x] `NEXT_PUBLIC_USE_SANITY=true` set on production
- [x] Studio member list audit logged in evidence file
- [x] Rollback dry-run executed on preview
- [x] One real human (Max / Sam / Matt / Kai / Ben / Michael / Helmer / Rhett) has edited a field in Studio and verified it appears on prod within 60s

If any box unchecked, the plan is not complete and cannot be marked closed.

---

## Estimated Effort

| Phase | Tasks | Estimated time |
|---|---|---|
| -1 Pre-flight | 6 | 25m |
| 0 Foundation | 12 | 90m |
| 1 Infrastructure | 8 | 75m |
| 2 Page refactors | 10 (9 routes + middleware + sections) | 2.5h |
| 3 Section renderer | 2 | 45m |
| 4 Error pages | 3 | 30m |
| 5 OG / images | 3 | 30m |
| 6 QA + cutover | 6 | 75m |
| **Total** | **50 tasks** | **~7-8 hours** |

User authorized one big migration. Recommend splitting across 2 days: Day 1 = -1, 0, 1, 2 (≈5h); Day 2 = 3, 4, 5, 6 (≈3h). Each day ends in a deployable preview state.

---

## Evidence file

Per-task evidence (commands run, exit codes, file artifacts, sha256 hashes, screenshot diffs) recorded in `.sisyphus/plans/cms-migration-evidence.md` as work progresses. Final evidence file is the audit trail for "we shipped it correctly."
