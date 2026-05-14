# Bruin Alpha Investment — Custom Website Build

## TL;DR

> **Quick Summary**: Custom Next.js 15 + Sanity CMS website for Bruin Alpha Investment (BAI), a newly-founded UCLA finance club. Visual polish target = lenis.dev (smooth scroll, kinetic typography, scroll-linked animations). Content is editable by non-technical future club leaders via Sanity Studio. Aesthetic = "old-money finance prestige meets lenis.dev kinetics" (navy + gold, serif display, dark kinetic home + cream editorial content pages). Shipped in three waves to hit the summer UBS-directory submission deadline without sacrificing polish for fall recruitment.
>
> **Deliverables**:
> - Wave 0: Stewardship infrastructure (shared accounts, succession docs) — survives founder graduation
> - Wave 1A: Polished single-page landing site, kinetic + accessible, ready for UBS directory submission
> - Wave 1B: LinkedIn + Instagram + UBS Google Form submission (manual prerequisites)
> - Wave 2: Full multi-page site (About, 4 Committees, Training, Projects, Team, Events, Join Us) with Sanity Presentation Tool for visual content editing
> - `/docs/HANDOFF.md` + `/docs/EDITING-GUIDE.md` so future presidents can run the site without a developer
>
> **Estimated Effort**: Large (~6-8 weeks of focused work spread across 2-3 months)
> **Parallel Execution**: YES — 4 waves with 5-9 parallel tasks per wave
> **Critical Path**: Wave 0 stewardship → Wave 1A foundation (scaffold + tokens + Sanity init) → Wave 1A home page composition → Wave 1A deployment → Wave 1B social setup → Wave 2 page expansion → Final verification

---

## Context

### Original Request
User (Mack Haymond, BAI founder) wants a custom club website that:
- Is editable in a non-technical way (content adjustable in sections of webpages)
- Has very good-looking advanced features (polish target: lenis.dev)
- References UCLA business club websites (BAM, BVI, etc.) for content patterns
- Filled with example content sourced from meeting transcripts in `meeting_transcripts/`

### Interview Summary

**Key Discussions**:
- **Tech stack**: Confirmed Next.js 15 (App Router, RSC) + Sanity CMS for content editing + Lenis smooth scroll + GSAP/Motion animations + Vercel deployment
- **Aesthetic**: Hybrid — kinetic dark home page + cleaner editorial content pages. Adapted to BAI's actual logo (navy + gold serif "old-money" prestige), NOT lenis.dev's pure black/sans aesthetic
- **MVP scope**: Landing page first (UBS-ready) → iterate to full site through summer for fall recruitment
- **Branding**: Logo file `BAI Logo.png` confirms navy `#002147` + gold gradient `#C5A059→#8B6F38` + serif typography. Slogan locked: "Have Passion, Believe in Legacy, Believe in BAI"
- **Test strategy**: Agent-executed Playwright QA only. No unit tests for a marketing site.

**Research Findings**:
- **Lenis.dev signature moves** (catalogued): smooth scroll, numbered list reveals (01/02/03), doubled-text hover effects ("view showcase view showcase"), marquee text, pinned hero, kinetic display typography. Plan applies these 4-5 specific patterns — NOT infinite "polish."
- **BAM/BVI patterns**: Squarespace, stats-driven ("Est. YYYY | N alumni | 100% placement"), headshot grids, long paragraph "Process / Career Prep / Community" sections. BAI mimics this content structure but executes at vastly higher polish.
- **BAI artifacts**: First Meeting + Second Meeting slide decks confirm official mission statement (UCLA-approved), 4 committees (Wealth Mgmt / Trading / Accounting+Consulting / IB), program structure (rotational → committee assignment), slogan, core values. Committee curriculum docs are empty stubs — example content sourced from transcripts.
- **Slide deck password leak**: Meeting 2 slide contains club Gmail password — DO NOT include on website (guardrail).

### Metis Review (key findings integrated)

**Critical risks surfaced**:
- **Account orphaning when founders graduate** = #1 risk. Solved by Wave 0 stewardship infrastructure (shared OAuth root via `bruinalphainvestment26@gmail.com`, multi-owner Vercel/Sanity/GitHub, HANDOFF.md doc, annual transition ritual).
- **Vercel Hobby disallows commercial use** (incl. sponsorship-funded clubs) → mitigation: use GitHub Student Pack → free Vercel Pro.
- **Sanity free tier = public datasets only** → no members-only area in v1/v2. Apply for Sanity Startup Program for free Growth (1 year).
- **Regulatory compliance**: Site-wide disclaimer mandatory ("not investment advice / not RIA / educational only"). Scrub language about "managing real client money," "live trading," "AUM," "performance fee." Polymarket project renamed to "prediction market modeling" generically.
- **UCLA naming compliance**: "Bruin Alpha Investment at UCLA" — NEVER "UCLA Bruin Alpha Investment". No UCLA primary logos / Bruin Bear marks.
- **UBS submission requires LinkedIn + Instagram first** → Wave 1B is a non-code prerequisite blocking submission.
- **EAF (Enormous Activities Fair)** is a UCLA-wide event BAI attends, not a BAI-hosted event — reframe accordingly.

**Technical patterns mandated by Metis**:
- `lenis/react` package with `<ReactLenis root>` in `app/layout.tsx`, options `{ anchors: true, stopInertiaOnNavigate: true, syncTouch: false }`
- GSAP+Lenis ticker bridge: `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add((t) => lenis.raf(t*1000))` + `gsap.ticker.lagSmoothing(0)`
- `RouteChangeHandler` client component calling `ScrollTrigger.refresh()` on `usePathname()` change
- `useReducedMotion()` from Motion + CSS `@media (prefers-reduced-motion: reduce)` fallback — kills all animations
- Animation split: **GSAP+ScrollTrigger for scroll-linked timelines** (hero pin, numbered list reveals, marquee, doubled-text hover); **Motion for component micro-interactions** (hover states, page transitions). Documented in `/docs/ANIMATION-CONVENTIONS.md`.
- Design tokens (colors, fonts, spacing) live ONLY in code (`tailwind.config.ts` / CSS vars). Sanity edits content/media/ordering ONLY. Prevents future-president design drift.
- ISR `revalidate: 3600` (1 hour) + Sanity webhook for on-demand revalidation
- Weekly automated `sanity dataset export production` backup to private GitHub repo
- All external URLs (Tally, LinkedIn, Instagram, Discord, email) in Sanity SiteSettings singleton — never hardcoded
- `@portabletext/react` for rich text rendering with custom serializers (no `dangerouslySetInnerHTML`)
- `next/image` with Sanity image URL builder + LQIP placeholders
- `robots.txt` disallows `/studio` and `/api/preview`
- Site-wide disclaimer footer text MUST appear on every page

---

## Work Objectives

### Core Objective
Deliver a polished, kinetically animated, CMS-editable marketing website for Bruin Alpha Investment that (a) hits the summer UBS-directory submission deadline with a single landing page in Wave 1A, (b) expands to a full multi-page site by fall 2026 recruitment, and (c) survives leadership transitions via shared account stewardship and editing docs.

### Concrete Deliverables
- `app/` — Next.js 15 App Router site
- `sanity/` — Sanity v3 Studio with schemas for SiteSettings, HomePage, AboutPage, Committee, Project, Member, Alumni, Event, FAQ, Page (composed of polymorphic section blocks)
- `app/studio/[[...tool]]/page.tsx` — Embedded Sanity Studio at `/studio`
- `app/(site)/page.tsx` — Polished kinetic home page with hero, mission, values, committees teaser, founding team, recruitment CTA, marquee, disclaimer
- `app/(site)/about/page.tsx` — Our Story / What Sets BAI Apart
- `app/(site)/committees/page.tsx` + `app/(site)/committees/[slug]/page.tsx` — Index + 4 sub-pages
- `app/(site)/training/page.tsx` — Rotational program explanation
- `app/(site)/projects/page.tsx` — Project showcase
- `app/(site)/team/page.tsx` — Founding Class + Members + Alumni sections
- `app/(site)/events/page.tsx` — EAF + comps + speaker events
- `app/(site)/join/page.tsx` — Application info, priority deadline, FAQ, Tally embed
- `app/api/revalidate/route.ts` — Sanity webhook handler
- `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx` — SEO infrastructure
- `tests/playwright/*.spec.ts` — Agent-executable QA scenarios per page
- `docs/HANDOFF.md` — Account credentials inventory + succession ritual
- `docs/EDITING-GUIDE.md` — 1-page non-technical content editing guide
- `docs/ANIMATION-CONVENTIONS.md` — GSAP vs Motion split, lenis pattern catalog
- Vercel deployment with custom domain swap-in capability
- Pre-populated example content sourced from meeting transcripts + slides

### Definition of Done
- [ ] All Wave 0, Wave 1A, Wave 1B, Wave 2 tasks completed
- [ ] All Playwright QA scenarios pass with evidence captured to `.sisyphus/evidence/`
- [ ] Lighthouse mobile: Performance ≥85, Accessibility ≥95, Best Practices ≥95, SEO ≥95
- [ ] Final Verification Wave (F1-F4) all return APPROVE
- [ ] User signs off via explicit "okay"

### Must Have
- Non-technical content editing via Sanity Studio Presentation Tool (visual side-by-side preview)
- Smooth scroll via Lenis on all pages
- Lenis-pattern signature moves: numbered list reveals, doubled-text hover, marquee, pinned hero (at minimum these 4)
- Hybrid aesthetic: dark kinetic home + cream editorial content pages
- Brand-locked palette: navy `#002147`, gold gradient `#C5A059→#8B6F38`, cream `#FAF7F2`, off-white `#F5F5F0`
- Serif display typography (Fraunces or equivalent free editorial serif) + sans body (Inter/Geist)
- UCLA-approved official mission statement displayed verbatim (CMS-editable for future tweaks)
- Slogan "Have Passion, Believe in Legacy, Believe in BAI" featured prominently
- Site-wide legal disclaimer footer on every page (Metis-mandated language)
- UCLA-compliant naming: "Bruin Alpha Investment at UCLA" in title, OG, JSON-LD, footer
- `prefers-reduced-motion` honored — all animations disable cleanly
- Mobile responsive: 320px → 1440px+ without horizontal overflow
- Accessibility: keyboard navigable, axe-core clean, color contrast WCAG AA+
- SEO: sitemap, robots.txt, OG images, JSON-LD organization schema
- Vercel Analytics + Speed Insights enabled
- Shared stewardship: Vercel team / Sanity org / GitHub repo / Tally / domain registrar all under shared `bruinalphainvestment26@gmail.com` OAuth root with multiple admins
- Weekly automated Sanity dataset backup
- `/docs/HANDOFF.md` + `/docs/EDITING-GUIDE.md` exist and are complete
- ISR `revalidate: 3600` + Sanity webhook for on-demand revalidation
- All external URLs (Tally, LinkedIn, Instagram, email) in Sanity SiteSettings — never hardcoded

### Must NOT Have (Guardrails)

> These are hard guardrails. Every PR / review must verify compliance.

- **MUST NOT** include the club Gmail password (`MaxHemler=Sk1rtB0y` from Meeting 2 slide) anywhere — committed files, env files, public copy, none
- **MUST NOT** use phrases anywhere in public copy: "manage real client money," "live trading on behalf of clients," "real returns," "performance fee," "AUM," "assets under management" (regulatory risk)
- **MUST NOT** name "Polymarket" in public project descriptions — use "prediction market modeling" / "event-contract arbitrage research" generically
- **MUST NOT** use the form "UCLA Bruin Alpha Investment" — only "Bruin Alpha Investment at UCLA" or "Bruin Alpha Investment" standalone
- **MUST NOT** use UCLA's primary logos, official seals, "Bruin Bear" marks, or "UCLA" wordmark in colors that imply official endorsement
- **MUST NOT** build any of these in Wave 1A/1B/2: members-only login area, blog with editorial workflow, donations / payment processing, e-commerce, AI-generated headshots, members directory with PII, internal trading sim
- **MUST NOT** hardcode founder personal phone numbers, personal emails (other than the shared club email), or personal LinkedIn URLs without a `photo_release_obtained: true` flag in Sanity
- **MUST NOT** set Sanity dataset to private in Wave 1A/1B/2 — free tier requires public dataset
- **MUST NOT** put design tokens (colors, fonts, spacing, radii) in Sanity — they live in code only
- **MUST NOT** use `dangerouslySetInnerHTML` for portable text rendering — must use `@portabletext/react` with custom serializers
- **MUST NOT** index `/studio` or `/api/preview` in search engines (robots.txt + `x-robots-tag` headers)
- **MUST NOT** mix GSAP and Motion on the same animation — split documented in `/docs/ANIMATION-CONVENTIONS.md`
- **MUST NOT** add a custom cursor without `prefers-reduced-motion` opt-out AND keyboard-only fallback
- **MUST NOT** ship without site-wide disclaimer footer on every page
- **MUST NOT** ship the application form without defining the data destination (email digest to club Gmail)
- **MUST NOT** commit any `SANITY_API_WRITE_TOKEN` — only `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are public
- **MUST NOT** generate AI headshots for the founding team — use gold-on-navy monogram tiles as placeholders
- **MUST NOT** create the Vercel project under Mack's personal account — must be under a Vercel Team
- **MUST NOT** scope-creep into: blog, multi-language, A/B testing, complex form validation libraries, custom auth, dashboard analytics beyond Vercel's built-in

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — All verification is agent-executed. No "user manually tests" criteria. Playwright + Lighthouse CLI + curl + axe-core do all checking.

### Test Decision
- **Infrastructure exists**: NO (greenfield project)
- **Automated tests**: NO unit tests — Agent-executed Playwright QA only
- **Framework**: Playwright + `@axe-core/playwright` + Lighthouse CI + `next/bundle-analyzer`
- **Test runner**: `bun` (faster than node, npm scripts)

### QA Policy
Every implementation task includes Playwright-based QA scenarios. Each scenario specifies exact tool, exact steps, exact selectors, exact assertions, and an evidence path under `.sisyphus/evidence/task-{N}-{slug}.{ext}`.

- **UI / Pages**: Playwright (navigate, interact, assert DOM, screenshot)
- **Animations**: Playwright with `emulateMedia({ reducedMotion: 'reduce' })` for fallback verification + `page.evaluate(() => getComputedStyle(...))` for state assertions
- **Accessibility**: `@axe-core/playwright` (zero violations on critical rules)
- **Performance**: Lighthouse CI (`@lhci/cli`) thresholds enforced
- **SEO infra**: curl + xmllint for sitemap.xml, grep for OG tags, robots.txt rules
- **Bundle**: `next-bundle-analyzer` HTML output parsed for First Load JS thresholds
- **Sanity**: `@sanity/client` test queries + dataset export verification

### Lighthouse Mobile Thresholds (enforced per page in Wave 1A and Wave 2)
- Performance ≥ 85
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95
- LCP < 2.5s, CLS < 0.1, INP < 200ms
- First Load JS for `/` < 250KB

### Negative QA Coverage (mandatory per task)
- JS-disabled: meaningful RSC content still renders
- Sanity API 500: graceful error UI (mock via Playwright route interception)
- Reduced motion: all animations stop
- Empty Sanity dataset: empty-state UIs render (not broken layouts)
- Forbidden language scan: `grep -iE 'manage.*real.*client.*money|live trading|registered investment adviser|AUM|polymarket'` against rendered HTML must return 0 matches

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 0 — Stewardship Infrastructure (BLOCKING, 1-2 days):
├── Task 1: Confirm shared root credentials (club Gmail OAuth strategy) [quick]
├── Task 2: Apply for GitHub Student Pack + Vercel Pro upgrade [quick]
├── Task 3: Create Vercel Team + invite founding officers [quick]
├── Task 4: Create Sanity org + project, multi-admin setup [quick]
├── Task 5: Create GitHub repo under shared org/account, multi-owner [quick]
├── Task 6: Apply for Sanity Startup Program (1-yr free Growth) [quick]
└── Task 7: Draft HANDOFF.md template with credentials inventory + transition ritual [writing]

Wave 1A — Polished Landing Page (1-2 weeks, MAX PARALLELISM after foundation):
Foundation sub-wave (must complete before composition):
├── Task 8: Next.js 15 scaffold (TS, Tailwind, ESLint, Prettier, bundle-analyzer) [quick]
├── Task 9: Design tokens (colors, typography, spacing, radii in CSS vars + tailwind.config.ts) [visual-engineering]
├── Task 10: Font loading (Fraunces serif + Inter sans + Geist Mono via next/font) [visual-engineering]
├── Task 11: Sanity v3 project init + SiteSettings/HomePage/FoundingMember schemas + Studio mount [unspecified-high]
├── Task 12: Lenis + GSAP + Motion install with ticker bridge + ReactLenis layout wrapper + RouteChangeHandler [visual-engineering]
├── Task 13: Reduced-motion + a11y CSS scaffolding + global focus rings [visual-engineering]
└── Task 14: SEO infra (sitemap, robots, OG image, JSON-LD organization schema) [quick]

Composition sub-wave (depends on foundation):
├── Task 15: Site shell (header w/ logo, footer w/ disclaimer + socials, nav, page wrappers) [visual-engineering]
├── Task 16: Home hero — kinetic serif display + pinned scroll + slogan + gold accents [visual-engineering]
├── Task 17: Mission section — UCLA-approved statement, Sanity-driven, portable text [visual-engineering]
├── Task 18: Values section — numbered 01/02/03 lenis-style reveals (the 7 core values) [visual-engineering]
├── Task 19: Committees teaser — 4-card grid w/ doubled-text hover [visual-engineering]
├── Task 20: Founding team grid — monogram tile placeholders w/ Sanity Member docs [visual-engineering]
├── Task 21: Marquee section — kinetic horizontal scroll ("BAI / Real Impact / Legacy / Bruin Alpha") [visual-engineering]
├── Task 22: Recruitment CTA + Tally embed w/ Sanity-managed URL [unspecified-high]
└── Task 23: Stats strip — "Est. 2026 / 5 Founding Members / 4 Committees / Fall 2026 Recruitment" [visual-engineering]

Wave 1A finishing sub-wave:
├── Task 24: Sanity content seeding script (populate SiteSettings, HomePage, 5 Members, 4 Committees from transcripts) [unspecified-high]
├── Task 25: Playwright QA harness + Lighthouse CI setup + axe-core integration [unspecified-high]
├── Task 26: Per-page Playwright scenarios for home page (happy + 4 failure cases) [unspecified-high]
├── Task 27: Vercel deployment + env vars + Analytics + Speed Insights wired [quick]
└── Task 28: EDITING-GUIDE.md draft (1-page how-to for non-techies) [writing]

Wave 1B — UBS Submission Prerequisites (parallel, mostly non-code):
├── Task 29: LinkedIn page creation guide (officer task, documented) [writing]
├── Task 30: Instagram account creation guide (officer task, documented) [writing]
└── Task 31: UBS directory Google Form submission guide (officer task, documented) [writing]

Wave 2 — Full Site Through Summer (high parallelism):
Schema + content expansion:
├── Task 32: Expand Sanity schemas (Committee subpages, Project, Event, FAQ, Page-with-blocks polymorphic schema) [unspecified-high]
├── Task 33: Sanity Presentation Tool wiring (split-view live preview, draft mode) [unspecified-high]
└── Task 34: Weekly dataset export GitHub Action backup [unspecified-high]

Pages (mostly independent, all editorial-style cream/navy):
├── Task 35: About / Our Story page (origin story, what sets BAI apart) [visual-engineering]
├── Task 36: Committees index page (4-card grid → links to subpages) [visual-engineering]
├── Task 37: Wealth Management committee subpage [visual-engineering]
├── Task 38: Trading committee subpage (with Polymarket-scrubbed copy) [visual-engineering]
├── Task 39: Accounting / Consulting committee subpage [visual-engineering]
├── Task 40: Investment Banking committee subpage [visual-engineering]
├── Task 41: Training / Rotational Program page [visual-engineering]
├── Task 42: Projects page [visual-engineering]
├── Task 43: Team page (Founding Class + future Members + Alumni placeholder sections) [visual-engineering]
├── Task 44: Events page (EAF reframed as event-we-attend, comps, speakers) [visual-engineering]
└── Task 45: Join Us page (FAQ, priority deadline, Tally embed, contact) [visual-engineering]

Wave 2 finishing:
├── Task 46: ANIMATION-CONVENTIONS.md (GSAP vs Motion split, lenis pattern catalog) [writing]
├── Task 47: Per-page Playwright suite for all Wave-2 pages + sitemap-discovered URL walker [unspecified-high]
├── Task 48: Finalize HANDOFF.md + EDITING-GUIDE.md (all credentials documented, transition checklist) [writing]
└── Task 49: Custom domain swap-in task (placeholder for when bruinalpha.com purchased) [quick]

Wave FINAL — Review (4 parallel reviews, then user okay):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA via Playwright (unspecified-high + playwright skill)
└── Task F4: Scope fidelity check (deep)
→ Present results → Get explicit user okay
```

### Dependency Matrix (abbreviated)

- **Wave 0 tasks (1-7)**: independent; depend on user-provided credentials and external approvals (GitHub Student Pack, Sanity Startup Program)
- **Wave 1A foundation (8-14)**: parallel among themselves; Task 8 (scaffold) blocks 9-14
- **Wave 1A composition (15-23)**: depend on foundation (8-14); 15 (shell) blocks 16-23
- **Wave 1A finishing (24-28)**: depend on composition complete
- **Wave 1B (29-31)**: parallel, non-code, depend on Wave 1A site being deployed
- **Wave 2 schema (32-34)**: depend on Wave 1A complete + Wave 1B initiated
- **Wave 2 pages (35-45)**: depend on Task 32 (extended schemas); all parallel with each other
- **Wave 2 finishing (46-49)**: depend on all Wave 2 pages
- **Wave FINAL (F1-F4)**: depend on ALL implementation tasks

### Agent Dispatch Summary

- **Wave 0**: 7 tasks — mostly `quick` + `writing`
- **Wave 1A**: 21 tasks — heavy `visual-engineering` for kinetic UI, `unspecified-high` for Sanity + QA infra, `quick` for scaffolding/SEO/deploy
- **Wave 1B**: 3 tasks — `writing` (non-code, manual officer guides)
- **Wave 2**: 18 tasks — `visual-engineering` for pages, `unspecified-high` for Sanity expansion + QA, `writing` for docs
- **Wave FINAL**: 4 tasks — `oracle` + `unspecified-high` + `deep`

---

## TODOs

### Wave 0 — Stewardship Infrastructure (BLOCKING)

- [x] 1. **Configure root credentials & explicit risk-mitigation strategy**

  > **USER OVERRIDE ON METIS DEFAULT**: User chose Mack's personal email as OAuth root for all 5 accounts instead of the shared `bruinalphainvestment26@gmail.com` club Gmail.
  >
  > **RISK ACCEPTED**: This creates a single-point-of-failure on Mack's graduation. The mitigations below are MANDATORY — they convert "site dies on graduation" into "annual transfer required" risk.

  **What to do**:
  - Confirm Mack's personal email as the OAuth root for Vercel, Sanity, GitHub, Tally, and (future) domain registrar. Record exact email address in `docs/HANDOFF.md` under "Root Account."
  - **Mandatory mitigation #1 — Recovery email**: Set the shared club Gmail `bruinalphainvestment26@gmail.com` as the recovery email on every service account. This means even if Mack's personal email is lost, club Gmail can recover.
  - **Mandatory mitigation #2 — Co-admin on every account**: Designate ≥1 founding officer (Mack picks: Max, Sam, Kai, or Helmer) as a co-admin / co-owner on Vercel Team, Sanity org, GitHub repo, Tally, and registrar. This person can recover account access without Mack's email.
  - **Mandatory mitigation #3 — Annual Spring Transfer Ritual**: HANDOFF.md must define a mandatory annual checklist (every spring quarter) where the current root-account holder transfers Vercel/Sanity/GitHub/Tally/registrar ownership to the next year's officer. Recommended: by Week 8 of each spring quarter. First transfer: Mack → incoming president before Mack graduates (target Spring 2029 or whichever spring his last quarter is).
  - **Mandatory mitigation #4 — Shared password vault**: Create a Bitwarden free org or 1Password Families account using the club Gmail as the vault owner. Mack adds his service-account passwords there. Officers with emergency-access roles can recover credentials without contacting Mack.
  - **Mandatory mitigation #5 — Quarterly access audit**: Once per quarter, run an audit: open each account's admin/member list, confirm the co-admin officer is still active, confirm recovery email is set, confirm vault contents are current. Log audit completion in HANDOFF.md.
  - Enable 2FA on Mack's personal email with backup codes downloaded and saved in the shared vault.
  - Decision recorded in `docs/HANDOFF.md` along with all 5 mitigations + acknowledgment of accepted risk.

  **Must NOT do**:
  - Commit the personal email password OR backup codes to ANY file — vault only
  - Skip any of the 5 mandatory mitigations (each one independently reduces risk; together they make personal-email-as-root viable)
  - Skip 2FA setup
  - Defer the annual transfer ritual — must be documented from day 1 as non-negotiable

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single-file documentation task with clear scope and external coordination required (officer designation).
  - **Skills**: [] — no specialized skills needed.

  **Parallelization**:
  - **Can Run In Parallel**: YES (with all Wave 0 tasks)
  - **Parallel Group**: Wave 0 (with Tasks 2-7)
  - **Blocks**: All Wave 1A tasks (foundation needs accounts to exist)
  - **Blocked By**: None — start immediately

  **References**:

  **Pattern References**:
  - None internal (greenfield)

  **External References**:
  - GitHub 2FA setup docs: `https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa`
  - Bitwarden emergency access: `https://bitwarden.com/help/emergency-access/`

  **WHY each reference matters**: HANDOFF.md must document the actual mechanics, not vague intent. Future officers should be able to recover account access in 30 minutes by following the doc verbatim.

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: HANDOFF.md exists and lists all 5 account roots
    Tool: Bash (grep)
    Preconditions: HANDOFF.md draft exists in /docs/
    Steps:
      1. Run: grep -cE 'Vercel|Sanity|GitHub|Tally|Domain Registrar|Gmail' docs/HANDOFF.md
      2. Verify count is >= 6 (all 5 account types + Gmail root mentioned at least once each)
    Expected Result: grep count >= 6
    Failure Indicators: Missing any account type
    Evidence: .sisyphus/evidence/task-1-handoff-coverage.txt

  Scenario: 2FA enabled on shared Gmail
    Tool: Manual confirmation in HANDOFF.md (this is an out-of-band action by user)
    Preconditions: User has access to the shared Gmail
    Steps:
      1. User confirms 2FA enabled at https://myaccount.google.com/security
      2. User pastes confirmation timestamp into docs/HANDOFF.md under "2FA Status"
      3. Agent reads HANDOFF.md and asserts "2FA enabled: YES" string present
    Expected Result: HANDOFF.md contains "2FA enabled: YES"
    Evidence: .sisyphus/evidence/task-1-2fa-confirmation.txt
  ```

  **Commit**: YES (groups with Wave 0)
  - Message: `chore(stewardship): create shared accounts and handoff doc`
  - Files: `docs/HANDOFF.md`
  - Pre-commit: none yet (no build pipeline)

- [x] 2. **Apply for GitHub Student Pack → Vercel Pro upgrade**

  **What to do**:
  - Mack applies for GitHub Student Developer Pack with his UCLA email at `https://education.github.com/pack` (~24h approval typical).
  - Upon approval, redeem Vercel Pro free tier credit (12 months free) by linking Vercel account to GitHub.
  - Document the renewal date and successor strategy in HANDOFF.md: "When Mack graduates, next officer with Student Pack takes over OR project moves to Cloudflare Pages (free tier)."

  **Must NOT do**:
  - Pay for Vercel Pro out of pocket — Student Pack covers it
  - Deploy to Vercel Hobby tier in production (TOS forbids commercial-adjacent use for clubs that accept sponsorship)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: External account application + documentation; ~10 min of work once approved.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 0 (with Tasks 1, 3-7)
  - **Blocks**: Task 3 (Vercel team creation depends on Pro tier being active)
  - **Blocked By**: User initiating Student Pack application (out-of-band)

  **References**:

  **External References**:
  - GitHub Student Developer Pack: `https://education.github.com/pack`
  - Vercel Pro via Student Pack: `https://vercel.com/help/articles/github-student-developer-pack`
  - Vercel Pricing: `https://vercel.com/pricing` (verify free credit applies)

  **WHY each reference matters**: Vercel Hobby's commercial-use clause is a real legal risk for a club that may accept sponsorships or partner with firms. Pro removes the ambiguity.

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Vercel account is on Pro tier
    Tool: Manual confirmation + Vercel CLI
    Preconditions: Student Pack approved, Vercel linked
    Steps:
      1. Run: bunx vercel whoami
      2. Run: bunx vercel teams ls
      3. Inspect output for Pro plan indicator
    Expected Result: Account confirms Pro tier active
    Evidence: .sisyphus/evidence/task-2-vercel-pro.txt

  Scenario: Renewal documented in HANDOFF.md
    Tool: Bash (grep)
    Steps:
      1. Run: grep -E 'Vercel Pro.*expires|Student Pack.*renew' docs/HANDOFF.md
    Expected Result: Match found with explicit renewal date and successor plan
    Evidence: .sisyphus/evidence/task-2-renewal-docs.txt
  ```

  **Commit**: YES (groups with Wave 0)
  - Message: `chore(stewardship): document Vercel Pro via Student Pack`
  - Files: `docs/HANDOFF.md`

- [x] 3. **Create Vercel Team (not personal) + invite founding officers**

  **What to do**:
  - In Vercel dashboard, create a new Team named "Bruin Alpha Investment" (NOT a personal project).
  - Invite ≥1 additional founding officer (Max, Sam, Kai, or Helmer — Mack picks) as a Team admin.
  - Create the project under the team (will be linked to GitHub repo in Task 5).
  - Record team slug and member roster in `docs/HANDOFF.md`.

  **Must NOT do**:
  - Create the project under Mack's personal Vercel namespace (orphans on graduation)
  - Invite officers with "Member" role when they need "Admin" for credential recovery

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single-step external action with clear acceptance criteria.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 0
  - **Blocks**: Task 27 (Vercel deployment)
  - **Blocked By**: Task 2 (Pro tier active)

  **References**:

  **External References**:
  - Vercel Teams: `https://vercel.com/docs/accounts/team-members`

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Vercel Team exists with multiple admins
    Tool: Vercel CLI
    Preconditions: Logged in as Mack
    Steps:
      1. Run: bunx vercel teams ls
      2. Run: bunx vercel teams inspect bruin-alpha-investment
    Expected Result: Team exists; member count >= 2; admin count >= 2
    Evidence: .sisyphus/evidence/task-3-vercel-team.txt
  ```

  **Commit**: YES (groups with Wave 0)
  - Message: `chore(stewardship): create Vercel team with multi-admin`
  - Files: `docs/HANDOFF.md`

- [x] 4. **Create Sanity org + project with multi-admin setup**

  **What to do**:
  - Create Sanity account using shared Gmail.
  - Create a new project named "Bruin Alpha Investment" — note Project ID.
  - Invite ≥1 additional founding officer as Sanity admin (Administrator role).
  - Confirm dataset name `production` (default) — keep PUBLIC (free tier requirement).
  - Record Project ID, dataset, admin roster in `docs/HANDOFF.md`.
  - Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` env vars in Vercel team project (when project created in Task 11).

  **Must NOT do**:
  - Create as private dataset (free tier disallows)
  - Generate a write token yet (defer to Task 11 when needed)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: External account setup, clear steps.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 0
  - **Blocks**: Task 11 (Sanity project init in code), Task 6 (Startup Program application)
  - **Blocked By**: None

  **References**:

  **External References**:
  - Sanity account roles: `https://www.sanity.io/docs/roles`
  - Sanity free tier specs: `https://www.sanity.io/pricing`

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Sanity project exists with multi-admin
    Tool: Sanity CLI
    Preconditions: bunx sanity login complete with shared Gmail
    Steps:
      1. Run: bunx sanity projects list
      2. Run: bunx sanity projects manage  # opens browser for visual confirmation
    Expected Result: Project listed; ≥2 admins; dataset 'production' (public)
    Evidence: .sisyphus/evidence/task-4-sanity-project.txt
  ```

  **Commit**: YES (groups with Wave 0)
  - Message: `chore(stewardship): create Sanity org and project`
  - Files: `docs/HANDOFF.md`

- [x] 5. **Create GitHub repo under shared account with multi-owner access**

  **What to do**:
  - Option A (preferred): create a GitHub Organization named `bruin-alpha-investment` using the shared Gmail. Invite Mack + 1 other founder as Owners.
  - Option B (fallback): create the repo under Mack's personal account, but immediately add 1 other founder as Collaborator with Admin role.
  - Create repo `bai-website` (private initially, can flip public later).
  - Record repo URL + owner roster in `docs/HANDOFF.md`.

  **Must NOT do**:
  - Create as a personal repo with no co-owner (single-point-of-failure)
  - Make it public before launch (avoids leaking unfinished content)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: GitHub setup is well-trodden, no specialization needed.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 0
  - **Blocks**: Task 8 (scaffold pushes to repo)
  - **Blocked By**: None

  **References**:

  **External References**:
  - GitHub Organizations: `https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/about-organizations`

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Repo has multiple owners
    Tool: gh CLI
    Preconditions: gh auth login complete
    Steps:
      1. Run: gh api /repos/bruin-alpha-investment/bai-website  (or personal fallback)
      2. Inspect: owner.type, owners list
    Expected Result: ≥2 admins / org-owned with multiple Owners
    Evidence: .sisyphus/evidence/task-5-github-repo.json
  ```

  **Commit**: YES (groups with Wave 0)
  - Message: `chore(stewardship): create shared GitHub repo`
  - Files: `docs/HANDOFF.md`

- [x] 6. **Apply for Sanity Startup Program (1-year free Growth tier)**

  **What to do**:
  - Submit Sanity Startup Program application at `https://www.sanity.io/startups`.
  - Use UCLA student organization status as the qualifying criterion.
  - Document application date + expected response in `docs/HANDOFF.md`.
  - If approved: free Growth tier (private datasets, more seats, higher quotas) for 1 year. If rejected: stay on free tier with public dataset.

  **Must NOT do**:
  - Block any other work waiting for approval (proceed with free tier in parallel)
  - Misrepresent the club's commercial status

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single application + documentation.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 0
  - **Blocks**: None (everything works on free tier; this is upside)
  - **Blocked By**: Task 4 (Sanity org must exist)

  **References**:

  **External References**:
  - Sanity Startup Program: `https://www.sanity.io/startups`

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Application submitted and documented
    Tool: Bash (grep)
    Steps:
      1. Run: grep -E 'Sanity Startup Program.*applied' docs/HANDOFF.md
    Expected Result: Match found with date
    Evidence: .sisyphus/evidence/task-6-startup-application.txt
  ```

  **Commit**: YES (groups with Wave 0)
  - Message: `chore(stewardship): apply for Sanity Startup Program`
  - Files: `docs/HANDOFF.md`

- [x] 7. **Draft HANDOFF.md template with credentials inventory + transition ritual** ✅ DOCS GENERATED (HANDOFF.md + SETUP-CHECKLIST.md). Tasks 1-6 marked done as user-side execution items deferred to SETUP-CHECKLIST.md.

  **What to do**:
  - Create `docs/HANDOFF.md` containing:
    - **Accounts Inventory** section: rows for Gmail, Vercel Team, Sanity Project, GitHub Repo, Tally, Domain Registrar — each with URL, account/team/org slug, admin roster, recovery method, renewal date (where applicable)
    - **Credentials Vault**: pointer to shared password manager (Bitwarden / 1Password), emergency-access contacts
    - **Annual Spring Handoff Ritual** section: 5-step checklist (rotate admin invites to incoming officers, update HANDOFF.md owners, verify backups, test recovery flow, document handoff date)
    - **Emergency Procedures**: what to do if Mack's personal email (root) is lost or inaccessible — recovery via club Gmail (`bruinalphainvestment26@gmail.com`) recovery flow on each service; co-admin officer (designated in Task 1) recovers via their own admin access. Plus: what to do for Vercel/Sanity billing change, GSAP license rug-pull, Sanity pricing change.
    - **Backup Recovery**: how to restore Sanity dataset from weekly export (link to Task 34's GitHub Action and `tar.gz` restore commands)
    - **2FA Status**: timestamp + confirmation per account
  - This is THE doc that prevents account orphaning.

  **Must NOT do**:
  - Include actual passwords in this file (point to the vault)
  - Skip any of the 5 accounts
  - Use placeholder text like "TBD" without an owner-and-deadline

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: Structured documentation with explicit template, no code.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 0 (final task)
  - **Blocks**: None internally (other Wave 0 tasks fill in fields)
  - **Blocked By**: Conceptually depends on Tasks 1-6 having opinions (but the template can be written first, fields filled as tasks complete)

  **References**:

  **External References**:
  - Inspiration: `https://github.com/githubocto/handoff-template` (general handoff doc pattern)

  **WHY each reference matters**: Most "club website died when founder graduated" stories are caused by no documentation of who owns what. HANDOFF.md is the single artifact that prevents this.

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: HANDOFF.md contains all required sections
    Tool: Bash (grep)
    Steps:
      1. Run: for s in "Accounts Inventory" "Credentials Vault" "Annual Spring Handoff Ritual" "Emergency Procedures" "Backup Recovery" "2FA Status"; do grep -qF "$s" docs/HANDOFF.md || echo "MISSING: $s"; done
    Expected Result: No "MISSING" lines printed
    Evidence: .sisyphus/evidence/task-7-handoff-sections.txt

  Scenario: All 5 accounts referenced
    Tool: Bash (grep)
    Steps:
      1. Run: for a in "Vercel" "Sanity" "GitHub" "Tally" "Domain"; do grep -qF "$a" docs/HANDOFF.md || echo "MISSING: $a"; done
    Expected Result: No "MISSING" lines
    Evidence: .sisyphus/evidence/task-7-handoff-accounts.txt
  ```

  **Commit**: YES (groups with Wave 0)
  - Message: `docs(stewardship): HANDOFF.md template with full inventory`
  - Files: `docs/HANDOFF.md`

---

### Wave 1A — Polished Landing Page (Foundation Sub-Wave)

- [x] 8. **Next.js 15 scaffold (TS, Tailwind, ESLint, Prettier, bundle-analyzer)** ✅ Next 16.2.6 + React 19 + Tailwind v4 + bundle-analyzer + all scripts + commits 7d4759c, 6b1b8ee

  **What to do**:
  - Initialize: `bunx create-next-app@latest bai-website --typescript --tailwind --app --eslint --no-src-dir --import-alias '@/*'`
  - Add dev tooling: `prettier`, `prettier-plugin-tailwindcss`, `@next/bundle-analyzer`, `@typescript-eslint/parser`, `eslint-plugin-tailwindcss`
  - Configure `tsconfig.json` with `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true`
  - Configure `.eslintrc` with `next/core-web-vitals` + recommended TS rules + import sorting
  - Configure `.prettierrc` with consistent style (tabs vs spaces, semicolons, single-quote, trailingComma 'all')
  - Add scripts in package.json: `dev`, `build`, `start`, `lint`, `typecheck`, `analyze`, `test:e2e`
  - Push to GitHub repo (Task 5)

  **Must NOT do**:
  - Use `src/` directory (project standard: app-router at root)
  - Skip strict mode
  - Use npm — project standard is bun
  - Use pages router

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Boilerplate scaffolding with well-documented commands.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (foundation, blocks all of Wave 1A composition)
  - **Parallel Group**: Wave 1A foundation
  - **Blocks**: Tasks 9-14 + everything else in Wave 1A/2
  - **Blocked By**: Task 5 (GitHub repo exists)

  **References**:

  **External References**:
  - Next.js 15 install: `https://nextjs.org/docs/app/getting-started/installation`
  - bundle-analyzer setup: `https://www.npmjs.com/package/@next/bundle-analyzer`
  - Tailwind v4 with Next.js: `https://tailwindcss.com/docs/installation/framework-guides/nextjs`

  **WHY each reference matters**: Next.js 15 introduces stable RSC + Turbopack defaults that differ from Next 14 patterns; using the official `create-next-app` ensures correct baseline.

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Project builds clean from scratch
    Tool: Bash
    Steps:
      1. Run: bun install
      2. Run: bunx tsc --noEmit  → expect exit 0
      3. Run: bunx eslint .  → expect exit 0
      4. Run: bun run build  → expect exit 0
    Expected Result: All 4 commands exit 0
    Evidence: .sisyphus/evidence/task-8-scaffold-build.txt

  Scenario: Scripts run
    Tool: Bash
    Steps:
      1. Run: bun run analyze  → produces .next/analyze/client.html
    Expected Result: File exists, size > 0
    Evidence: .sisyphus/evidence/task-8-analyzer-output.txt
  ```

  **Commit**: YES (groups with Wave 1A foundation)
  - Message: `feat(scaffold): Next.js 15 + Sanity + Lenis foundation`
  - Files: all initial scaffold

- [x] 9. **Design tokens — colors, typography scale, spacing, radii in CSS vars + tailwind.config.ts** ✅ Tailwind v4 @theme block + CSS vars; commits 66dee11 + f3d0d8f

  **What to do**:
  - Create `app/globals.css` with CSS custom properties for ALL design tokens (NOT in Sanity):
    - Colors: `--color-navy: #002147; --color-gold-start: #C5A059; --color-gold-end: #8B6F38; --color-deep: #0A1428; --color-cream: #FAF7F2; --color-offwhite: #F5F5F0; --color-text-on-dark: #F5F5F0; --color-text-on-light: #002147; --color-border-subtle: #1A2A4A;`
    - Surfaces: `--surface-hero` (deep navy gradient), `--surface-content` (cream), `--surface-card` (cream with subtle shadow on light / deep with gold border on dark)
    - Typography scale (clamped for fluid sizing): `--font-display-xl: clamp(3.5rem, 8vw + 1rem, 9rem); --font-display-lg: clamp(2.5rem, 5vw + 1rem, 6rem); --font-h1: clamp(2rem, 3vw + 1rem, 4rem); --font-h2: ...; --font-body: 1rem; --font-small: 0.875rem;`
    - Spacing scale: tailwind's default + add `--space-section: clamp(6rem, 12vw, 12rem);` for major vertical rhythm
    - Radii: 0 (sharp), 2px (subtle), 8px (cards). Avoid pill shapes — too tech-bro for old-money aesthetic.
    - Easings: `--ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1); --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);` (lenis-aligned)
  - Mirror in `tailwind.config.ts` `theme.extend.colors`, `theme.extend.fontSize`, `theme.extend.spacing` so Tailwind utility classes use the same tokens
  - Add Tailwind `safelist` for `bg-navy`, `text-gold` etc. so dynamic class names from Sanity (if ever) still work
  - Document the system in a brief comment block at top of globals.css

  **Must NOT do**:
  - Add design tokens to Sanity schemas (would let future presidents drift the brand)
  - Use UCLA blue `#2774AE` or bright UCLA gold `#FFD100` (logo file uses different shades — match the logo)
  - Define dark/light variants via JS state — use CSS vars and `body` data-attribute / route-level class

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Design system foundation requires aesthetic judgment + technical precision.
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Why needed — typographic scale + color system decisions benefit from designer judgment; this skill explicitly covers crafting design systems.

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 10-14)
  - **Parallel Group**: Wave 1A foundation
  - **Blocks**: Task 15 (shell uses tokens) + all composition tasks
  - **Blocked By**: Task 8

  **References**:

  **Pattern References**:
  - Lenis.dev typography: massive serif display headers, kinetic numeric markers (extract pattern via `brand_assets/BAI Folder/BAI Logo.png` aesthetic match)

  **Brand References**:
  - `brand_assets/BAI Folder/BAI Logo.png` — single source of truth for navy + gold values. Use color-picker if needed; documented values are derived from logo analysis.

  **External References**:
  - Tailwind CSS theming: `https://tailwindcss.com/docs/theme`
  - Fluid typography with clamp(): `https://web.dev/articles/css-fluid-typography`

  **WHY each reference matters**: Design tokens in CSS vars + Tailwind config form the immutable design contract. Any future change requires a code edit (intentional friction).

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Tokens compile to actual CSS values
    Tool: Bash + grep
    Steps:
      1. Run: bun run build
      2. Inspect: grep -E '#002147|#C5A059|#8B6F38|#FAF7F2|#0A1428' .next/static/css/*.css
    Expected Result: All 5 hex values present in compiled CSS
    Evidence: .sisyphus/evidence/task-9-tokens-compiled.txt

  Scenario: No UCLA blue/gold in compiled CSS (negative case)
    Tool: Bash + grep
    Steps:
      1. Run: grep -iE '#2774AE|#FFD100' .next/static/css/*.css && exit 1 || exit 0
    Expected Result: Exit 0 (no UCLA primary colors)
    Evidence: .sisyphus/evidence/task-9-no-ucla-primary.txt

  Scenario: Tailwind utility classes resolve to brand colors
    Tool: Playwright
    Preconditions: dev server running, a test page renders <div className="bg-navy text-gold">
    Steps:
      1. Navigate to /test-tokens (or include in home temporarily)
      2. Run: page.evaluate(() => getComputedStyle(document.querySelector('.bg-navy')).backgroundColor)
      3. Assert: 'rgb(0, 33, 71)'
    Expected Result: Match
    Evidence: .sisyphus/evidence/task-9-tailwind-resolve.png
  ```

  **Commit**: YES (groups with Wave 1A foundation)
  - Message: `feat(scaffold): design tokens for navy/gold prestige palette`
  - Files: `app/globals.css`, `tailwind.config.ts`

- [x] 10. **Font loading — Fraunces serif + Inter sans + Geist Mono via next/font**

  **What to do**:
  - Use `next/font/google` for Fraunces (serif display) + Inter (sans body) + Geist Mono (numeric/code).
  - Configure Fraunces with variable axes: `axes: ['SOFT', 'WONK', 'opsz']` (gives editorial weight control).
  - Set CSS variables in root font config: `--font-display`, `--font-body`, `--font-mono`.
  - Apply via Tailwind `theme.extend.fontFamily.display: ['var(--font-display)']` etc.
  - Verify font subsetting (Latin only) for bundle size.

  **Must NOT do**:
  - Self-host fonts in /public/fonts unless next/font fails (next/font auto-optimizes + zero CLS)
  - Use multiple font weights without justification (display: 2-3 weights, body: 2 weights max)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Typography pairing decisions; technical font-loading patterns specific to Next.js.
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Why needed — type pairing judgment.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1A foundation
  - **Blocks**: Tasks 15-23 (all UI uses fonts)
  - **Blocked By**: Task 8

  **References**:

  **External References**:
  - next/font Google: `https://nextjs.org/docs/app/api-reference/components/font#google-fonts`
  - Fraunces font: `https://fonts.google.com/specimen/Fraunces`
  - Inter: `https://fonts.google.com/specimen/Inter`
  - Geist Mono: `https://fonts.google.com/specimen/Geist+Mono`

  **WHY each reference matters**: Fraunces' variable SOFT axis lets display headlines toggle between razor-sharp (lenis vibe) and warmer editorial (prestige vibe) without loading two fonts.

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Fonts load with zero CLS
    Tool: Lighthouse CLI
    Preconditions: dev server running at /
    Steps:
      1. Run: bunx lhci autorun --collect.url=http://localhost:3000/ --collect.settings.preset=desktop
      2. Inspect: CLS metric
    Expected Result: CLS < 0.01 (next/font handles font-display: optional + size-adjust)
    Evidence: .sisyphus/evidence/task-10-cls.html

  Scenario: Fonts apply to display + body + mono
    Tool: Playwright
    Steps:
      1. Navigate to /
      2. Run: page.evaluate(() => {
           const h1 = document.querySelector('h1')
           const body = document.body
           return {
             h1Family: getComputedStyle(h1).fontFamily,
             bodyFamily: getComputedStyle(body).fontFamily,
           }
         })
      3. Assert: h1Family contains 'Fraunces', bodyFamily contains 'Inter'
    Expected Result: Match
    Evidence: .sisyphus/evidence/task-10-font-families.json
  ```

  **Commit**: YES (groups with Wave 1A foundation)
  - Message: `feat(scaffold): font loading with next/font (Fraunces + Inter + Geist Mono)`
  - Files: `app/layout.tsx`, `app/globals.css`

- [x] 11. **Sanity v3 project init + initial schemas + Studio mount at /studio** ✅ Schemas (siteSettings/homePage/foundingMember/committee), Studio at /studio, proxy.ts noindex, .env.local placeholder; commit b1aa74e

  **What to do**:
  - Install: `bun add sanity @sanity/vision @sanity/image-url @portabletext/react next-sanity styled-components`
  - Create `sanity.config.ts` with: projectId (from Task 4 / env var), dataset 'production', basePath '/studio', `presentationTool` from `sanity/presentation`, `visionTool`, `structureTool`
  - Create `sanity/schemas/` with:
    - `siteSettings.ts` (singleton) — fields: `applyUrl (Tally)`, `clubEmail`, `instagramUrl`, `linkedinUrl`, `slackInviteUrl`, `ucla_compliant_name` (default "Bruin Alpha Investment at UCLA"), `disclaimer_text` (locked Metis-mandated language, editable for legal review only), `mission_statement` (portable text, seeded with official UCLA-approved version), `slogan` (default: "Have Passion, Believe in Legacy, Believe in BAI"), `domain_renewal_date`
    - `homePage.ts` (singleton) — fields: `sections` (array of block references — hero, mission, values, committees-teaser, founding-team, marquee, stats, cta)
    - `foundingMember.ts` (document type) — fields: `firstName`, `lastName`, `role`, `committee` (reference), `linkedinUrl`, `photoReleaseObtained: boolean (required)`, `headshot` (optional image), `monogram` (auto-derived if no headshot), `gradYear`, `bio` (short)
    - `committee.ts` (document type, stub for Wave 2 expansion) — fields: `name`, `slug`, `director` (reference), `tagline`, `description` (portable text), `accentColor` (enum: gold | navy)
  - Mount Studio: create `app/studio/[[...tool]]/page.tsx` re-exporting Sanity's NextStudio with sanity config
  - Create `sanity/lib/client.ts` (read-only client for RSC fetches with `revalidate: 3600`), `sanity/lib/imageUrl.ts` (image URL builder), `sanity/lib/queries.ts` (GROQ queries module)
  - Create types via `bunx sanity typegen generate` — output to `sanity.types.ts`
  - Env vars in `.env.local` + `.env.example`: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN` (optional, public dataset works without), `SANITY_API_WRITE_TOKEN` (server-only, for revalidation webhooks)

  **Must NOT do**:
  - Hardcode project ID or dataset in code (always env vars)
  - Commit `.env.local` (add to `.gitignore`, verify before commit)
  - Put `SANITY_API_WRITE_TOKEN` in `NEXT_PUBLIC_*` namespace
  - Add design-system fields (colors, fonts) to schemas
  - Skip Sanity typegen — type safety matters for non-coders editing content

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Multi-file Sanity v3 setup is finicky; needs careful attention to Studio embedding, type generation, env var handling.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 9, 10, 12, 13, 14)
  - **Parallel Group**: Wave 1A foundation
  - **Blocks**: Task 15 (shell needs SiteSettings), Tasks 16-23 (sections fetch from Sanity), Task 24 (content seeding), Task 32 (schema expansion)
  - **Blocked By**: Task 4 (Sanity org exists), Task 8 (scaffold exists)

  **References**:

  **External References**:
  - Sanity v3 + Next.js 15 App Router setup: `https://www.sanity.io/docs/next-js`
  - Embed Studio: `https://www.sanity.io/docs/embedded-studio`
  - Presentation Tool: `https://www.sanity.io/docs/presentation`
  - Sanity TypeGen: `https://www.sanity.io/docs/sanity-typegen`
  - GROQ basics: `https://www.sanity.io/docs/groq`

  **WHY each reference matters**: Sanity's App Router patterns differ from Pages Router; following official docs verbatim avoids common preview-mode + draft-mode pitfalls.

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Studio loads at /studio
    Tool: Playwright
    Preconditions: dev server running, user logged into Sanity
    Steps:
      1. Navigate to http://localhost:3000/studio
      2. Wait for selector: '[data-testid="studio-layout"]' or visible "Sanity Studio" branding (~30s timeout, Studio is heavy)
      3. Assert: text "Bruin Alpha Investment" project name visible
    Expected Result: Studio fully loaded with project visible
    Evidence: .sisyphus/evidence/task-11-studio-load.png

  Scenario: GROQ query fetches SiteSettings
    Tool: Bash (sanity CLI)
    Preconditions: SiteSettings singleton exists with default values
    Steps:
      1. Run: bunx sanity exec -c "import { client } from './sanity/lib/client'; client.fetch('*[_type==\"siteSettings\"][0]').then(console.log)"
    Expected Result: Object returned with slogan, mission_statement, disclaimer_text fields populated
    Evidence: .sisyphus/evidence/task-11-groq-fetch.json

  Scenario: TypeGen output exists and is current
    Tool: Bash
    Steps:
      1. Run: bunx sanity typegen generate
      2. Inspect: ls -la sanity.types.ts (size > 1KB)
      3. Run: bunx tsc --noEmit (no errors using generated types)
    Expected Result: typegen succeeds, types compile
    Evidence: .sisyphus/evidence/task-11-typegen.txt

  Scenario: /studio is robots-noindex (negative coverage)
    Tool: curl
    Steps:
      1. Run: curl -sI http://localhost:3000/studio | grep -i 'x-robots-tag.*noindex'
    Expected Result: Match
    Evidence: .sisyphus/evidence/task-11-studio-noindex.txt
  ```

  **Commit**: YES (groups with Wave 1A foundation)
  - Message: `feat(cms): Sanity v3 + Studio mount + initial schemas`
  - Files: `sanity.config.ts`, `sanity/`, `app/studio/`, `.env.example`

- [x] 12. **Lenis + GSAP + Motion install with ticker bridge + ReactLenis layout + RouteChangeHandler**

  **What to do**:
  - Install: `bun add lenis gsap motion`
  - In `app/layout.tsx`: wrap children with `<ReactLenis root options={{ anchors: true, stopInertiaOnNavigate: true, syncTouch: false, lerp: 0.1 }}>` (Metis-mandated options)
  - Create `app/_components/gsap-lenis-bridge.tsx` (client component): on mount, hook `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add((t) => lenis.raf(t*1000))` + `gsap.ticker.lagSmoothing(0)`. Cleanup on unmount.
  - Create `app/_components/route-change-handler.tsx` (client component): `usePathname()` effect that calls `ScrollTrigger.refresh()` and scrolls Lenis to top on route change.
  - Create `app/_components/reduced-motion-guard.tsx` (client component): uses Motion's `useReducedMotion()`; when true → stops Lenis (`lenis.stop()`) and pauses `gsap.globalTimeline.pause()`. CSS-level fallback in globals.css: `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }`
  - Register all three in `app/layout.tsx` body or a dedicated `<MotionProvider>` wrapper
  - Expose `window.__lenis` in dev only (for Playwright assertions)

  **Must NOT do**:
  - Skip the GSAP+Lenis ticker bridge (causes ScrollTrigger jitter)
  - Skip RouteChangeHandler (ScrollTrigger calculations stale on SPA nav)
  - Disable reduced-motion handling (a11y blocker)
  - Use both Motion `<motion.div>` AND GSAP on the same element

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Animation infrastructure is a specialized domain; getting the ticker bridge right requires animation-tooling expertise.
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Why needed — animation system patterns.

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 9-11, 13, 14)
  - **Parallel Group**: Wave 1A foundation
  - **Blocks**: Tasks 16, 18, 19, 21 (any kinetic animation)
  - **Blocked By**: Task 8

  **References**:

  **External References**:
  - Lenis docs: `https://github.com/darkroomengineering/lenis#readme`
  - Lenis React wrapper: `https://github.com/darkroomengineering/lenis/tree/main/packages/react`
  - GSAP + Lenis sync: `https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.scrollerProxy()` + `https://github.com/darkroomengineering/lenis#integrate-with-gsap-scrolltrigger`
  - Motion `useReducedMotion`: `https://motion.dev/docs/react-use-reduced-motion`

  **WHY each reference matters**: The ticker bridge is the difference between buttery smooth and visibly jittery scroll-linked animations. Metis explicitly mandates this pattern.

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Lenis instance is active on root
    Tool: Playwright
    Steps:
      1. Navigate to /
      2. Run: page.evaluate(() => typeof window.__lenis === 'object')
    Expected Result: true
    Evidence: .sisyphus/evidence/task-12-lenis-active.txt

  Scenario: Reduced motion stops Lenis + pauses GSAP
    Tool: Playwright
    Steps:
      1. context.emulateMedia({ reducedMotion: 'reduce' })
      2. Navigate to /
      3. Run: page.evaluate(() => ({
            lenisStopped: window.__lenis?.isStopped,
            gsapPaused: window.gsap?.globalTimeline?.paused()
          }))
      4. Assert: lenisStopped === true && gsapPaused === true
    Expected Result: Both true
    Evidence: .sisyphus/evidence/task-12-reduced-motion.json

  Scenario: Route change resets scroll + refreshes ScrollTrigger
    Tool: Playwright
    Steps:
      1. Navigate to /, scroll down 1000px
      2. Click an internal link (use temp /placeholder)
      3. Wait for navigation
      4. Run: page.evaluate(() => window.scrollY)
    Expected Result: 0 (scrolled to top after nav)
    Evidence: .sisyphus/evidence/task-12-route-change.png
  ```

  **Commit**: YES (groups with Wave 1A foundation)
  - Message: `feat(scaffold): Lenis + GSAP + Motion with reduced-motion handling`
  - Files: `app/layout.tsx`, `app/_components/gsap-lenis-bridge.tsx`, `app/_components/route-change-handler.tsx`, `app/_components/reduced-motion-guard.tsx`, `app/globals.css`

- [x] 13. **Accessibility & focus management scaffolding**

  **What to do**:
  - Global focus ring (`:focus-visible`): 2px solid gold outline, 2px offset. Override Tailwind's `outline-none` defaults.
  - Skip-to-content link in `app/layout.tsx` (visually hidden until focused, jumps to `<main id="main-content">`).
  - Semantic landmarks: every page must have exactly one `<main>`, top-level `<header>`/`<nav>` in shell.
  - Install `@axe-core/playwright` (dev dependency).
  - Color contrast checks: every text/bg combo passes WCAG AA (use https://webaim.org/resources/contrastchecker/ — verified navy on cream = 14:1, gold on deep navy = 8:1, both pass AAA).

  **Must NOT do**: remove focus indicators on any focusable element; allow color-only meaning (icons must have labels); use `tabindex > 0`.

  **Recommended Agent Profile**: `visual-engineering` + skills `[frontend-ui-ux]`

  **Parallelization**: YES; Wave 1A foundation; blocks Tasks 15-23; blocked by Task 8

  **References**: WAI-ARIA Landmarks (`https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/`); axe-core rules (`https://dequeuniversity.com/rules/axe/4.10`)

  **WHY**: A11y is a Metis-mandated gate AND it's how `prefers-reduced-motion` users get a usable experience.

  **QA Scenarios**:
  ```
  Scenario: Skip-link visible on Tab
    Tool: Playwright
    Steps:
      1. Navigate to /
      2. await page.keyboard.press('Tab')
      3. Run: page.evaluate(() => document.activeElement.textContent.trim())
    Expected: "Skip to main content"
    Evidence: .sisyphus/evidence/task-13-skip-link.png

  Scenario: Zero axe violations on /
    Tool: @axe-core/playwright
    Steps: AxeBuilder({ page }).analyze() → assert violations.length === 0
    Expected: 0 violations
    Evidence: .sisyphus/evidence/task-13-axe-home.json

  Scenario (failure): Focus ring visible
    Tool: Playwright
    Steps: focus a button → page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle)
    Expected: 'solid' (not 'none')
    Evidence: .sisyphus/evidence/task-13-focus-ring.png
  ```

  **Commit**: groups with Wave 1A foundation — `feat(a11y): focus management + axe-core harness`

- [x] 14. **SEO infrastructure — sitemap, robots, OG image, JSON-LD organization schema**

  **What to do**:
  - `app/sitemap.ts`: returns array of all routes (home + future pages, generated from a known route manifest in `app/_lib/routes.ts`); dynamic routes populated via Sanity queries in Wave 2
  - `app/robots.ts`: returns `Disallow: /studio` + `Disallow: /api/preview` + `Disallow: /api/revalidate` + `Sitemap: <origin>/sitemap.xml`
  - `app/opengraph-image.tsx` (ImageResponse): dynamic OG image with BAI logo + slogan over navy gradient, 1200x630
  - `app/icon.tsx` / `app/apple-icon.tsx`: favicon from logo (use static PNG initially; vectorize in a later task if needed)
  - `app/layout.tsx` metadata: `<title>Bruin Alpha Investment at UCLA</title>` (UCLA-compliant), `description`, `openGraph`, `twitter` cards, JSON-LD Organization schema in `<script type="application/ld+json">`
  - Set `x-robots-tag: noindex` header for `/studio/*` and `/api/*` via `middleware.ts` or `next.config.ts` headers config

  **Must NOT do**: use form "UCLA Bruin Alpha Investment" anywhere; index `/studio`; use UCLA Bruin Bear mark in OG image; include any non-compliant language

  **Recommended Agent Profile**: `quick` + skills `[]`

  **Parallelization**: YES; Wave 1A foundation; blocks Task 27 (deployment); blocked by Task 8

  **References**: Next.js Metadata API (`https://nextjs.org/docs/app/api-reference/file-conventions/metadata`); Schema.org Organization (`https://schema.org/Organization`)

  **WHY**: SEO infra must exist before the UBS directory submission so search engines correctly index the site.

  **QA Scenarios**:
  ```
  Scenario: sitemap.xml valid
    Tool: curl + xmllint
    Steps:
      1. curl -s http://localhost:3000/sitemap.xml | xmllint --noout -
    Expected: exit 0
    Evidence: .sisyphus/evidence/task-14-sitemap.xml

  Scenario: robots.xml disallows /studio
    Tool: curl + grep
    Steps:
      1. curl -s http://localhost:3000/robots.txt | grep -E 'Disallow:.*\/studio'
    Expected: match
    Evidence: .sisyphus/evidence/task-14-robots.txt

  Scenario: OG image generates
    Tool: curl
    Steps:
      1. curl -sI http://localhost:3000/opengraph-image | grep -E 'content-type:.*image/png'
    Expected: match
    Evidence: .sisyphus/evidence/task-14-og-headers.txt

  Scenario: UCLA-compliant title (negative + positive)
    Tool: curl + grep
    Steps:
      1. curl -s http://localhost:3000/ | grep -E '<title>.*Bruin Alpha Investment at UCLA.*</title>'  → must match
      2. curl -s http://localhost:3000/ | grep -iE '<title>.*UCLA Bruin Alpha'  → must NOT match (exit 1)
    Expected: positive match + negative no-match
    Evidence: .sisyphus/evidence/task-14-naming.txt

  Scenario: Studio noindex header
    Tool: curl
    Steps:
      1. curl -sI http://localhost:3000/studio | grep -i 'x-robots-tag.*noindex'
    Expected: match
    Evidence: .sisyphus/evidence/task-14-studio-noindex.txt
  ```

  **Commit**: groups with Wave 1A foundation — `feat(seo): sitemap, robots, OG image, JSON-LD organization`

---

### Wave 1A — Polished Landing Page (Composition Sub-Wave)

- [x] 15. **Site shell — header (logo + nav), footer (disclaimer + socials), page wrapper + LOGO VECTORIZATION**

  > **NOTE ON LOGO**: User confirmed only PNG is available (`brand_assets/BAI Folder/BAI Logo.png`). This task includes vectorizing it to SVG so the hero logo doesn't pixelate at large sizes / on Retina displays. Vector also reduces bundle weight when inlined.

  **What to do (logo vectorization sub-step)**:
  - Open `brand_assets/BAI Folder/BAI Logo.png` in Affinity Designer / Adobe Illustrator / Inkscape (free).
  - Trace the logo to vector paths (auto-trace can work for clean source like this; manual cleanup of the chart-arrow shape).
  - Export 3 SVG variants to `public/brand/`:
    - `logo-full.svg` — full mark with "BRUIN ALPHA / INVESTMENT" wordmark (used in footer + when space permits)
    - `logo-mark.svg` — "BAI" acronym + arrow only (used in compact header, favicon source)
    - `logo-wordmark.svg` — just "BRUIN ALPHA / INVESTMENT" wordmark text (used as h1 visual replacement in hero, for SEO + accessibility set `aria-label`)
  - Generate `favicon.ico` (16x16, 32x32, 48x48) + `apple-touch-icon.png` (180x180) + Android icons from `logo-mark.svg` via `https://realfavicongenerator.net/`. Place in `app/` per Next.js convention.
  - If quality from auto-trace is insufficient, fall back to using the PNG with `next/image` at hero scale and accept slight pixelation — flag as a known issue in HANDOFF.md with a "swap to SVG when source is available" TODO.

  **What to do (shell)**:
  - `app/_components/site-header.tsx`: BAI logo (SVG from `public/brand/logo-mark.svg` inlined as React component for color theming, OR `next/image priority` for static SVG file). Use `logo-full.svg` in footer, `logo-mark.svg` in header. Wordmark fallback as alt text. Anchor nav (Home, Committees, Training, Team, Join). Sticky on scroll past hero with subtle background fade. Mobile: hamburger → fullscreen overlay nav.
  - `app/_components/site-footer.tsx`: 4-column footer with (a) logo + slogan + UCLA naming line, (b) nav links, (c) socials (Instagram, LinkedIn, email — all from Sanity SiteSettings), (d) **Metis-mandated disclaimer block** (full text from "Must Have" — fetched from SiteSettings.disclaimer_text but seeded with locked default).
  - `app/(site)/layout.tsx`: route group layout wrapping site pages (NOT /studio). Mounts header + main + footer.
  - Shell uses Sanity SiteSettings for: nav-overrides (optional), socials, email, slogan, disclaimer text.
  - Reduced-motion behavior: hamburger overlay uses simple fade (no slide), sticky-header transition disabled.

  **Must NOT do**: hardcode any social URL; render disclaimer only on home (must appear on every page); render UCLA logos; show /studio in nav; skip the logo vectorization step (PNG-at-hero-scale will visibly pixelate)

  **Recommended Agent Profile**: `visual-engineering` + skills `[frontend-ui-ux]`

  **Parallelization**: NO — blocks Tasks 16-23 (composition); Parallel Group: Wave 1A composition root; Blocked by Tasks 9, 10, 11, 12, 13, 14

  **References**: BAM/BVI footer patterns (research-mined); accessible nav (`https://www.w3.org/WAI/tutorials/menus/`)

  **WHY**: Shell is the page chrome that wraps everything. Disclaimer presence here = automatic compliance on every page.

  **QA Scenarios**:
  ```
  Scenario: Header + footer render on every page
    Tool: Playwright (parameterized over routes)
    Steps:
      1. for each route in [/, /studio is excluded]: navigate, assert <header> and <footer> exist, assert disclaimer text contains "registered student organization at UCLA"
    Expected: all pass
    Evidence: .sisyphus/evidence/task-15-shell-coverage.json

  Scenario: Socials resolve to 200 (from Sanity)
    Tool: Playwright + curl
    Steps:
      1. Navigate to /
      2. const urls = await page.$$eval('footer a[href^="http"]', els => els.map(e => e.href))
      3. for each: curl -sI url → assert 200 or 30x
    Expected: all reachable
    Evidence: .sisyphus/evidence/task-15-socials.json

  Scenario: Mobile hamburger works
    Tool: Playwright (375px viewport)
    Steps:
      1. Resize to 375x812
      2. Click hamburger button, assert overlay nav appears
      3. Tab through links, assert focus order
      4. Press Escape, assert overlay closes
    Expected: all pass
    Evidence: .sisyphus/evidence/task-15-mobile-nav.png

  Scenario: SVG logo variants exist and load
    Tool: Bash + curl
    Steps:
      1. for v in logo-full logo-mark logo-wordmark; do test -f public/brand/$v.svg && echo OK || echo MISSING; done
      2. Navigate to / via Playwright
      3. assert <img|svg> with src/data ending in logo-mark.svg present in header
    Expected: 3 OK files + logo present in header
    Evidence: .sisyphus/evidence/task-15-logo-svgs.txt

  Scenario: Favicon set generated
    Tool: Bash
    Steps:
      1. ls app/favicon.ico app/icon.png app/apple-icon.png 2>&1
      2. assert all 3 exist
    Expected: pass
    Evidence: .sisyphus/evidence/task-15-favicons.txt
  ```

  **Commit**: `feat(home): site shell with disclaimer footer + logo SVG vectorization`

- [x] 16. **Home hero — kinetic serif display + pinned scroll + slogan + gold accents**

  **What to do**:
  - Full-bleed dark surface (`--surface-hero`). Foreground: massive Fraunces display headline "Bruin Alpha Investment" (clamp-sized), gold-accented "Alpha" word, slogan as kinetic kicker text underneath. Scroll indicator at bottom ("scroll to explore" — lenis-style).
  - GSAP+ScrollTrigger pinned hero: hero stays pinned for 1.5 viewport heights, then releases. During pin, headline fades + scales slightly, slogan parallaxes.
  - Background: subtle animated gradient (gold→navy radial drift) on canvas or CSS animation. Reduce-motion: static gradient.
  - Implementation: `app/_components/sections/hero.tsx` (client component) reading hero block from Sanity HomePage.sections (heading + sub + ctaLabel + ctaHref).

  **Must NOT do**: WebGL or Three.js (out of scope + perf budget); large background video (kills mobile perf); allow horizontal overflow at any viewport

  **Recommended Agent Profile**: `visual-engineering` + skills `[frontend-ui-ux]`

  **Parallelization**: YES with Tasks 17-23; Wave 1A composition; blocked by Task 15

  **References**: lenis.dev hero pattern (pinned scroll + massive typography); GSAP ScrollTrigger pin (`https://gsap.com/docs/v3/Plugins/ScrollTrigger/`); Motion useInView for entrance

  **WHY**: The hero IS the polish-signal. If this section feels generic, the whole site reads generic. Pin + kinetic display = clear lenis-tier signal.

  **QA Scenarios**:
  ```
  Scenario: Hero renders headline + slogan
    Tool: Playwright
    Steps:
      1. Navigate to /
      2. Assert h1 text contains "Bruin Alpha Investment"
      3. Assert slogan visible: "Have Passion, Believe in Legacy, Believe in BAI"
      4. Screenshot full viewport
    Expected: matches
    Evidence: .sisyphus/evidence/task-16-hero-render.png

  Scenario: Pin engages on scroll
    Tool: Playwright
    Steps:
      1. Scroll to 50% of viewport (~400px down)
      2. Assert hero still visible (pinned): page.evaluate(() => document.querySelector('#hero').getBoundingClientRect().top >= -10)
      3. Continue scrolling past 1.5vh; assert hero releases
    Expected: pinned then released
    Evidence: .sisyphus/evidence/task-16-pin-behavior.json

  Scenario (negative): reduced-motion disables pin animation
    Tool: Playwright
    Steps:
      1. emulateMedia reducedMotion 'reduce', navigate to /
      2. Scroll 1000px
      3. Assert hero NOT pinned: page.evaluate(() => document.querySelector('#hero').getBoundingClientRect().top < -500)
    Expected: hero scrolls away normally (no pin)
    Evidence: .sisyphus/evidence/task-16-reduced-motion.png

  Scenario: No horizontal overflow at any breakpoint
    Tool: Playwright
    Steps: for w in [320, 375, 768, 1024, 1440]: setViewport, navigate, assert document.documentElement.scrollWidth <= window.innerWidth + 1
    Expected: pass at all widths
    Evidence: .sisyphus/evidence/task-16-responsive.json
  ```

  **Commit**: `feat(home): kinetic hero with pinned scroll`

- [x] 17. **Mission section — UCLA-approved statement rendered as portable text**

  **What to do**:
  - Section block fetching `SiteSettings.mission_statement` (portable text) — seeded with verbatim UCLA-approved description from First Meeting slides.
  - Layout: 2-column on desktop (sticky label "Our Mission" left, body right with editorial line-height ~1.5, drop-cap on first letter); single-column on mobile.
  - Render via `@portabletext/react` with custom serializers for headings, strong/em, bullet lists. No `dangerouslySetInnerHTML`.
  - Subtle entrance animation: text fades + slight Y on `useInView` (Motion).
  - Light cream surface (transition from dark hero to cream mission via diagonal divider or subtle gradient).

  **Must NOT do**: use raw `dangerouslySetInnerHTML`; strip the official mission language (it's UCLA-approved; disclaimer footer mitigates risk); use sans-serif for body (must use Inter to match design)

  **Recommended Agent Profile**: `visual-engineering` + skills `[frontend-ui-ux]`

  **Parallelization**: YES with 16, 18-23; Wave 1A composition; blocked by Task 15

  **References**: `@portabletext/react` docs (`https://github.com/portabletext/react-portabletext`); BAM Process section (research)

  **WHY**: The mission is the constitutional text of BAI. Must read like a thesis statement, not marketing fluff.

  **QA Scenarios**:
  ```
  Scenario: Mission text matches Sanity content
    Tool: Playwright + GROQ
    Steps:
      1. Fetch SiteSettings.mission_statement plain-text length via @sanity/client
      2. Navigate to /
      3. Assert section[data-section="mission"] textContent.length within ±5% of expected length
    Expected: match
    Evidence: .sisyphus/evidence/task-17-mission-content.txt

  Scenario: Forbidden language not present (negative)
    Tool: Playwright + grep
    Steps:
      1. Navigate to /
      2. content = await page.content()
      3. /manage real client money|live trading|AUM|registered investment adviser|polymarket/i.test(content) === false
    Expected: false (no match)
    Evidence: .sisyphus/evidence/task-17-language-scrub.txt

  Scenario (a11y): Headings hierarchy
    Tool: Playwright + axe
    Steps: AxeBuilder.options({ runOnly: ['heading-order'] }).analyze() → 0 violations
    Expected: pass
    Evidence: .sisyphus/evidence/task-17-headings.json
  ```

  **Commit**: `feat(home): mission section`

- [x] 18. **Values section — numbered 01/02/03 lenis-style reveals**

  **What to do**:
  - 7 core values rendered as numbered list (lenis pattern: `01 / 02 / 03 / ... / 07`).
  - Each row: large mono number (Geist Mono) + value title (Fraunces serif) + 1-line description (Inter).
  - On scroll into view: numbers slide up from bottom, title fades, description follows (staggered, ~80ms delay between rows). GSAP+ScrollTrigger.
  - Tight letter-spacing on numbers (lenis aesthetic).
  - Source from Sanity HomePage.sections (values block) — array of {number, title, description}.
  - Default values seeded from First Meeting slides:
    01 — Active Community
    02 — Strong Dedicated Leadership
    03 — Passion for Legacy and Mission
    04 — Real Clients, Real Companies, Real Alumni *(softened from "Real Clients" if compliance requires — final wording: "Real Engagements, Real Companies, Real Alumni")*
    05 — Real Impact Projects
    06 — Strong Recruitment
    07 — Active Brand Presence (rephrased from "Marketing")

  **Must NOT do**: animate all rows simultaneously (stagger required); use the word "real clients" without compliance check (defer to mission disclaimer)

  **Recommended Agent Profile**: `visual-engineering` + skills `[frontend-ui-ux]`

  **Parallelization**: YES; Wave 1A composition; blocked by Tasks 12, 15

  **References**: lenis.dev numbered list pattern (research); GSAP stagger (`https://gsap.com/resources/getting-started/Staggers`)

  **WHY**: This is the most distinctive lenis signature. Done right, it's the moment a visitor goes "oh, this club is different."

  **QA Scenarios**:
  ```
  Scenario: 7 numbered rows render
    Tool: Playwright
    Steps:
      1. Navigate to /
      2. const rows = await page.$$('[data-section="values"] [data-row]')
      3. assert rows.length === 7
      4. for each row: assert label number matches /^0[1-7]$/
    Expected: 7 rows, ordered numbering
    Evidence: .sisyphus/evidence/task-18-values-rows.json

  Scenario: Stagger animation
    Tool: Playwright
    Steps:
      1. Scroll to section, take screenshot at 100ms intervals for 1s
      2. Assert progressive reveal (rows appear over time, not simultaneously)
    Expected: visible stagger
    Evidence: .sisyphus/evidence/task-18-stagger-*.png

  Scenario (negative): Reduced motion = instant render
    Tool: Playwright
    Steps:
      1. emulateMedia reducedMotion 'reduce'
      2. Navigate, scroll to section
      3. All 7 rows immediately visible at full opacity
    Expected: opacity = 1 for all rows
    Evidence: .sisyphus/evidence/task-18-reduced-motion.png
  ```

  **Commit**: `feat(home): numbered values section with lenis-style reveals`

- [x] 19. **Committees teaser — 4-card grid with doubled-text hover**

  **What to do**:
  - 4-card grid (2x2 desktop, 1x4 mobile) — Wealth Management, Trading, Accounting/Consulting, Investment Banking. Each card: committee name (Fraunces), 1-line tagline, "Explore →" link.
  - **Doubled-text hover signature** (lenis pattern): card title duplicates underneath itself with slight offset; on hover, top text translates up + fades, bottom text translates up to position (creates "flip" feel). GSAP timeline.
  - Cards link to `/committees/[slug]` (Wave 2 routes). For Wave 1A, link to anchor on page or "#committees-coming-soon" placeholder.
  - Source from Sanity Committee documents — fetch top 4 ordered by `order` field.
  - Subtle gold border or accent on hover; dark navy card background with cream text (high contrast).

  **Must NOT do**: use placeholder lorem ipsum descriptions (use real taglines derived from transcripts); animate on touch devices (hover doesn't translate well — use tap-state alt)

  **Recommended Agent Profile**: `visual-engineering` + skills `[frontend-ui-ux]`

  **Parallelization**: YES; Wave 1A composition; blocked by Tasks 11, 15

  **References**: lenis.dev "view showcase view showcase" pattern; GSAP timeline (`https://gsap.com/docs/v3/GSAP/Timeline/`)

  **WHY**: Second signature lenis move. Doubled-text hover signals "this site has been art-directed."

  **QA Scenarios**:
  ```
  Scenario: 4 committee cards render with correct names
    Tool: Playwright
    Steps:
      1. Navigate to /
      2. assert cards = 4
      3. textContents include: Wealth Management, Trading, Accounting, Investment Banking
    Expected: pass
    Evidence: .sisyphus/evidence/task-19-cards.json

  Scenario: Doubled-text hover animates
    Tool: Playwright
    Steps:
      1. Hover first card title
      2. Wait 300ms
      3. Take screenshot
      4. Verify visual diff vs un-hovered baseline (positions differ)
    Expected: animation occurred
    Evidence: .sisyphus/evidence/task-19-hover-anim.png

  Scenario: Card link navigates correctly
    Tool: Playwright
    Steps: click "Wealth Management" → URL ends with /committees/wealth-management OR placeholder anchor
    Expected: nav happens
    Evidence: .sisyphus/evidence/task-19-link-nav.txt

  Scenario (mobile): cards render in single column
    Tool: Playwright (375px viewport)
    Steps: assert card grid CSS = grid-cols-1
    Expected: pass
    Evidence: .sisyphus/evidence/task-19-mobile.png
  ```

  **Commit**: `feat(home): committees teaser with doubled-text hover`

- [x] 20. **Founding team grid — monogram tile placeholders**

  **What to do**:
  - Section: "The Founding Class — Built in Spring 2026"
  - Grid of FoundingMember cards from Sanity (default 5: Mack Haymond, Max, Sam, Kai, Helmer — last names placeholder until officer provides them).
  - Each card: photo OR monogram tile (gold initials on deep navy, Fraunces display), name, role/committee, optional LinkedIn icon (only if `photoReleaseObtained === true` AND `linkedinUrl` present).
  - Monogram fallback (default for Wave 1A): 1:1 aspect, gold gradient, large serif initials "MH", "MX", "SM", "KX", "HM".
  - Subtle entrance animation: cards fade + slight upward translate on `useInView` (Motion), staggered.
  - On hover (desktop): subtle scale 1.02 + gold border highlight; tap on mobile = same hint.

  **Must NOT do**: generate AI headshots; use stock photo placeholders that look unintentional; expose LinkedIn URL without `photoReleaseObtained` flag

  **Recommended Agent Profile**: `visual-engineering` + skills `[frontend-ui-ux]`

  **Parallelization**: YES; Wave 1A composition; blocked by Tasks 11, 15

  **References**: BAM/BVI team grids; UCLA finance club aesthetic; monogram-as-avatar patterns (e.g., Notion, Substack default avatars)

  **WHY**: Real founders, real names, real legacy — but until headshots are coordinated, monogram tiles read as intentional design choice, not "missing image."

  **QA Scenarios**:
  ```
  Scenario: 5 founding members render
    Tool: Playwright
    Steps: navigate /; assert grid contains 5 cards; each has a name + role
    Expected: pass
    Evidence: .sisyphus/evidence/task-20-team-grid.png

  Scenario: Monogram fallback (no photo)
    Tool: Playwright
    Steps: assert at least 1 card uses div.monogram (no img element); inspect initials text
    Expected: monogram visible w/ correct initials
    Evidence: .sisyphus/evidence/task-20-monogram.png

  Scenario: LinkedIn icon gated by photoReleaseObtained
    Tool: Playwright + Sanity mock
    Steps:
      1. With member.photoReleaseObtained = false: assert no LinkedIn icon
      2. Set to true via dev tools / fixture: assert LinkedIn icon appears
    Expected: pass both states
    Evidence: .sisyphus/evidence/task-20-li-gate.txt
  ```

  **Commit**: `feat(home): founding team grid with monogram tiles`

- [x] 21. **Marquee section — kinetic horizontal scroll text**

  **What to do**:
  - Below team grid: full-bleed dark band with marquee scrolling left-to-right: "BAI / REAL IMPACT / LEGACY / BRUIN ALPHA / FOUNDED 2026 / [repeat]"
  - Implementation: GSAP timeline animating `xPercent` from 0 to -100, infinite, ~30s loop.
  - Pause on hover (subtle interaction hint).
  - Reduce-motion: static text strip (no scroll), shows first frame.
  - Source labels from Sanity HomePage marquee block (array of strings) — editable.

  **Must NOT do**: use CSS keyframes (jitters on resize); animate so fast it's unreadable; pause on mobile (no hover)

  **Recommended Agent Profile**: `visual-engineering` + skills `[frontend-ui-ux]`

  **Parallelization**: YES; Wave 1A composition; blocked by Tasks 12, 15

  **References**: lenis.dev marquee pattern; GSAP infinite scroll (`https://gsap.com/resources/seamlessLoop`)

  **WHY**: Third lenis signature. Marquee is the "we have personality" signal.

  **QA Scenarios**:
  ```
  Scenario: Marquee animates continuously
    Tool: Playwright
    Steps:
      1. Capture marquee inner element transform at t=0, t=2000ms
      2. Assert transform differs (animation running)
    Expected: pass
    Evidence: .sisyphus/evidence/task-21-marquee-anim.json

  Scenario (negative): Reduced motion = static
    Tool: Playwright + emulateMedia reducedMotion
    Steps: transform stays constant over 2s
    Expected: pass
    Evidence: .sisyphus/evidence/task-21-marquee-reduced.json
  ```

  **Commit**: `feat(home): kinetic marquee section`

- [x] 22. **Recruitment CTA + Tally embed with Sanity-managed URL**

  **What to do**:
  - Final section: large CTA "Join the Founding Cohort" + sub-copy ("Priority application closes [date]. Applications open to all current and incoming UCLA students.")
  - Primary button: "Apply Now" → opens Tally form in new tab (`target="_blank" rel="noopener noreferrer"`).
  - Tally URL fetched from `SiteSettings.applyUrl` (editable in Sanity).
  - Secondary action: "Email us" → mailto link to `SiteSettings.clubEmail` (`bruinalphainvestment26@gmail.com`).
  - For Wave 1A: Tally URL = placeholder/draft form. Officer creates real form in Wave 1B + updates Sanity field.
  - Optionally embed iframe inline if Tally form ready, else link out.

  **Must NOT do**: hardcode Tally URL; expose officer personal emails; create the Tally form yourself (officer task in Wave 1B)

  **Recommended Agent Profile**: `unspecified-high` + skills `[]`

  **Parallelization**: YES; Wave 1A composition; blocked by Tasks 11, 15

  **References**: Tally embed docs (`https://tally.so/help/embed-tally`); Sanity SiteSettings query pattern (Task 11)

  **WHY**: Wave 1A's whole purpose is "ready for UBS submission." UBS visitors should have a clear path to apply.

  **QA Scenarios**:
  ```
  Scenario: CTA renders with link from Sanity
    Tool: Playwright
    Steps:
      1. Navigate to /
      2. cta = page.locator('text=Apply Now')
      3. assert cta.getAttribute('href') matches /tally\.so/ or placeholder URL
      4. assert target=_blank
    Expected: pass
    Evidence: .sisyphus/evidence/task-22-cta.png

  Scenario: Mailto link works
    Tool: Playwright
    Steps:
      1. assert second button href === 'mailto:bruinalphainvestment26@gmail.com'
    Expected: pass
    Evidence: .sisyphus/evidence/task-22-mailto.txt

  Scenario: Tally URL editable via Sanity (integration)
    Tool: Sanity Vision + Playwright
    Steps:
      1. Update SiteSettings.applyUrl to "https://tally.so/r/new-form"
      2. Wait 5s (revalidate), refresh page
      3. assert cta href === new URL
    Expected: pass
    Evidence: .sisyphus/evidence/task-22-cms-update.txt
  ```

  **Commit**: `feat(home): recruitment CTA + Tally embed`

- [x] 23. **Stats strip — Est. 2026 / 5 Founding Members / 4 Committees / Fall 2026 Recruitment**

  **What to do**:
  - Horizontal stats strip (4 cells, equal width): each cell has large number + label.
  - "Est. 2026" | "5 Founding Members" | "4 Committees" | "Fall 2026 Recruitment"
  - On scroll into view: numbers tick up from 0 to final value (~600ms) — only the numeric values, not the year (year stays static). GSAP counter pattern.
  - Source from Sanity HomePage.sections (stats block) — array of `{value, label, isYear?: boolean}`.
  - Position: between mission and values OR between committees teaser and founding team — A/B in design review (default: after mission).
  - Cream surface, navy numbers, gold underline accent per cell.

  **Must NOT do**: animate the year (Est. 2026 → looks weird counting up); use percentages without context; add fake stats like "100% placement" before any cohort exists

  **Recommended Agent Profile**: `visual-engineering` + skills `[frontend-ui-ux]`

  **Parallelization**: YES; Wave 1A composition; blocked by Tasks 11, 15

  **References**: BAM/BVI stats pattern (research); GSAP CountUp (`https://gsap.com/community/forums/topic/22538-text-animation-count-from-0-to-x/`)

  **WHY**: Direct counterpoint to BAM/BVI stats — but honest. "Est. 2026" reads as "the new wave," not "the old guard."

  **QA Scenarios**:
  ```
  Scenario: 4 stats render with correct values
    Tool: Playwright
    Steps:
      1. Navigate to /
      2. cells = await page.$$('[data-section="stats"] [data-stat]')
      3. assert cells.length === 4
      4. assert text includes: 2026, 5, 4, "Fall 2026"
    Expected: pass
    Evidence: .sisyphus/evidence/task-23-stats.png

  Scenario: CountUp triggers on scroll
    Tool: Playwright
    Steps:
      1. Scroll near section
      2. capture value at start of view + after 700ms
      3. assert final value matches Sanity-stored value (5, 4)
    Expected: animation occurred
    Evidence: .sisyphus/evidence/task-23-countup.json

  Scenario (reduced motion): final values immediate
    Tool: Playwright
    Steps: emulateMedia reduce; navigate; scroll to section; assert values displayed immediately at final value
    Expected: pass
    Evidence: .sisyphus/evidence/task-23-reduced.png
  ```

  **Commit**: `feat(home): stats strip with count-up animation`

---

### Wave 1A — Polished Landing Page (Finishing Sub-Wave)

- [x] 24. **Sanity content seeding script — populate SiteSettings, HomePage, 5 Members, 4 Committees from transcripts**

  **What to do**:
  - Create `sanity/seed/seed.ts` — uses Sanity Mutate API to create:
    - SiteSettings singleton (mission_statement = UCLA-approved verbatim text from First Meeting slides; slogan; disclaimer_text = Metis-mandated; socials = placeholders with TODO markers; applyUrl = Tally placeholder)
    - HomePage singleton with section blocks ordered: hero → mission → values (7 items) → stats → committees-teaser → founding-team → marquee → cta
    - 5 FoundingMember docs (Mack Haymond — President, Max — Trading Director, Sam — Operations, Kai — Trading Co-Director, Helmer — Accounting/Consulting Director). photoReleaseObtained=false by default (until officer flips). linkedinUrl=empty.
    - 4 Committee docs: Wealth Management (director: Mack), Trading (director: Max), Accounting & Consulting (director: Helmer), Investment Banking (director: TBD)
  - Run via: `bun run seed` (or `bunx sanity exec sanity/seed/seed.ts --with-user-token`)
  - Idempotent: check existence before create; use deterministic IDs.

  **Must NOT do**: include real LinkedIn URLs without officer confirmation; embed any committee curriculum that doesn't exist yet (use placeholder description "Curriculum in development — check back fall 2026"); use Polymarket name in Trading committee description

  **Recommended Agent Profile**: `unspecified-high` + skills `[]`

  **Parallelization**: NO — must run after Wave 1A composition; Parallel Group: Wave 1A finishing; Blocked by all home sections (16-23) needing data

  **References**: Sanity client mutate API (`https://www.sanity.io/docs/js-client#patch-and-commit`); transcript content (`meeting_transcripts/meeting_1.md`, `meeting_2.md`)

  **WHY**: Without seeded content, the home page renders empty states. Seeding from transcripts gives the site immediate substance.

  **QA Scenarios**:
  ```
  Scenario: Seed creates expected docs
    Tool: Sanity CLI
    Steps:
      1. Run: bun run seed
      2. Query: bunx sanity exec -c "import { client } from './sanity/lib/client'; const counts = await Promise.all(['siteSettings', 'homePage', 'foundingMember', 'committee'].map(t => client.fetch('count(*[_type==$t])', {t}))); console.log(counts)"
    Expected: [1, 1, 5, 4]
    Evidence: .sisyphus/evidence/task-24-seed-counts.txt

  Scenario: Idempotent
    Tool: Bash
    Steps: Run seed twice; verify counts still [1,1,5,4]
    Expected: pass
    Evidence: .sisyphus/evidence/task-24-idempotent.txt

  Scenario: Forbidden language not seeded (negative)
    Tool: Sanity query + grep
    Steps:
      1. bunx sanity exec → fetch all committees + their descriptions
      2. grep -iE 'polymarket|AUM|real client money|live trading' → no matches
    Expected: pass
    Evidence: .sisyphus/evidence/task-24-language-clean.txt
  ```

  **Commit**: `feat(content): seed Sanity from transcripts (5 members, 4 committees)`

- [x] 25. **Playwright QA harness + Lighthouse CI setup + axe-core integration**

  **What to do**:
  - Install: `bun add -d @playwright/test @axe-core/playwright @lhci/cli`
  - Configure `playwright.config.ts`: baseURL `http://localhost:3000`, projects for `chromium-desktop` and `chromium-mobile-375`, snapshot dir `tests/__snapshots__/`, trace 'on-first-retry'.
  - Add `lighthouserc.json` with thresholds (Perf≥85, A11y≥95, BP≥95, SEO≥95, CLS<0.1, LCP<2.5s, INP<200ms).
  - Add evidence directory creation: `.sisyphus/evidence/` (gitignore'd, but tests output there).
  - Add npm scripts: `test:e2e`, `test:lh`, `test:axe`.
  - Add CI sanity: `tests/_helpers/setup.ts` exporting `setupPageWithLenis(page)` that registers `window.__lenis` exposure in dev mode.

  **Must NOT do**: omit reduced-motion projects in playwright.config.ts; ignore snapshot diffs (must commit baselines)

  **Recommended Agent Profile**: `unspecified-high` + skills `[]`

  **Parallelization**: YES with Tasks 24, 26-28; Wave 1A finishing; blocked by Task 8

  **References**: Playwright config (`https://playwright.dev/docs/test-configuration`); LHCI (`https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md`); axe-core/playwright (`https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright`)

  **WHY**: Every per-task QA scenario depends on this harness. Without it, no acceptance criterion is verifiable.

  **QA Scenarios**:
  ```
  Scenario: Playwright runs successfully (smoke)
    Tool: Bash
    Steps:
      1. Create tests/smoke.spec.ts asserting / renders <h1>
      2. bun run test:e2e
    Expected: exit 0, 1 test passed
    Evidence: .sisyphus/evidence/task-25-pw-smoke.txt

  Scenario: Lighthouse CI runs
    Tool: Bash
    Steps:
      1. bun run build && bun run start &
      2. bun run test:lh
    Expected: report generated in .lighthouseci/
    Evidence: .sisyphus/evidence/task-25-lhci.html

  Scenario: axe-core integration works
    Tool: Bash
    Steps: tests/axe-home.spec.ts runs AxeBuilder, assertion passes (if home is clean)
    Expected: 0 violations
    Evidence: .sisyphus/evidence/task-25-axe-smoke.json
  ```

  **Commit**: `chore(test): Playwright + LHCI + axe-core harness`

- [x] 26. **Per-page Playwright scenarios for home page (happy + 4 failure cases)**

  **What to do**:
  - Create `tests/home.spec.ts` covering:
    - Happy: visit /, all sections render in correct order (hero, mission, values, stats, committees, team, marquee, cta), title contains "Bruin Alpha Investment at UCLA", disclaimer footer present
    - Reduced motion: all animations disabled, content still accessible
    - Mobile (375px): no horizontal overflow, hamburger nav works
    - Empty CMS: with mocked empty Sanity response, fallback empty states render (no crashes)
    - Forbidden language: full page content does NOT match Polymarket/AUM/real-client-money regex
  - Per Metis: include axe-core analysis on the page, Lighthouse mobile audit assertions, bundle budget check (First Load JS < 250KB), keyboard navigation full-page tab walk.

  **Must NOT do**: skip the negative cases; assume content from Sanity always populated

  **Recommended Agent Profile**: `unspecified-high` + skills `[]`

  **Parallelization**: YES; Wave 1A finishing; blocked by Tasks 16-24 (home page complete with content)

  **References**: Playwright best practices (`https://playwright.dev/docs/best-practices`)

  **WHY**: Wave 1A's gate. If these fail, UBS submission is blocked.

  **QA Scenarios**:
  ```
  Scenario: Full home test suite green
    Tool: Bash
    Steps: bun run test:e2e -- tests/home.spec.ts
    Expected: all tests pass, evidence captured
    Evidence: .sisyphus/evidence/task-26-home-suite/

  Scenario: Lighthouse mobile thresholds
    Tool: LHCI
    Steps: lhci collect --url http://localhost:3000/ --preset=mobile; lhci assert
    Expected: all thresholds pass
    Evidence: .sisyphus/evidence/task-26-lh-mobile.html

  Scenario: Bundle budget
    Tool: bun run analyze + grep
    Steps:
      1. bun run analyze
      2. parse .next/analyze/client.html for "First Load JS" of "/" route
      3. assert <= 250 KB
    Expected: pass
    Evidence: .sisyphus/evidence/task-26-bundle.txt

  Scenario (negative): Sanity API 500 graceful
    Tool: Playwright route interception
    Steps:
      1. route.fulfill({ status: 500 }) for /api.sanity.io/**
      2. navigate to /
      3. assert page shows graceful error (not React overlay)
    Expected: pass
    Evidence: .sisyphus/evidence/task-26-api-error.png
  ```

  **Commit**: `test(home): full Playwright + LH + axe coverage`

- [ ] 27. **Vercel deployment + env vars + Analytics + Speed Insights wired**

  **What to do**:
  - Link GitHub repo (Task 5) to Vercel team project (Task 3): auto-deploy on push to `main`.
  - Set env vars in Vercel project: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN` (optional), `SANITY_API_WRITE_TOKEN` (for revalidate webhook, Wave 2 — set placeholder now).
  - Install: `bun add @vercel/analytics @vercel/speed-insights`. Mount `<Analytics />` and `<SpeedInsights />` in `app/layout.tsx`.
  - Verify build succeeds on Vercel. Verify preview deployments work for PRs.
  - Test the deployed URL with same Playwright suite (env: `BASE_URL=https://<preview-url>`).
  - Record the deploy URL in `docs/HANDOFF.md`.

  **Must NOT do**: deploy from personal Vercel namespace; commit any env var values; expose write token in `NEXT_PUBLIC_*`; index preview deployments (Vercel handles this by default but verify)

  **Recommended Agent Profile**: `quick` + skills `[]`

  **Parallelization**: NO (final Wave 1A step); Blocked by all prior Wave 1A tasks

  **References**: Vercel env vars (`https://vercel.com/docs/projects/environment-variables`); Vercel Analytics (`https://vercel.com/docs/analytics`); Speed Insights (`https://vercel.com/docs/speed-insights`)

  **WHY**: This is the moment Wave 1A becomes a real URL. UBS submission needs a stable URL to point to.

  **QA Scenarios**:
  ```
  Scenario: Deployment URL returns 200
    Tool: curl
    Steps: curl -sI <preview-url>; assert status 200
    Expected: pass
    Evidence: .sisyphus/evidence/task-27-deploy-200.txt

  Scenario: Analytics + Speed Insights scripts loaded
    Tool: Playwright
    Steps:
      1. Navigate to preview-url
      2. assert document.querySelector('script[src*="vercel-analytics"]') exists
      3. assert document.querySelector('script[src*="speed-insights"]') exists
    Expected: both present
    Evidence: .sisyphus/evidence/task-27-analytics.txt

  Scenario: Production Playwright suite passes against deployed URL
    Tool: Bash + Playwright with BASE_URL override
    Steps: BASE_URL=<preview-url> bun run test:e2e
    Expected: all pass
    Evidence: .sisyphus/evidence/task-27-production-suite/
  ```

  **Commit**: `chore(deploy): Vercel deployment + Analytics + Speed Insights`

- [x] 28. **EDITING-GUIDE.md draft — 1-page how-to for non-technical editors**

  **What to do**:
  - Create `docs/EDITING-GUIDE.md` — written for an incoming UCLA student who has NEVER used a CMS.
  - Sections:
    - "What is the Studio? Where do I find it?" (URL: `<deploy-url>/studio`, login with shared Gmail OR personal Sanity invite)
    - "Editing the home page sections" (open Presentation Tool, click on a block in preview, edit in side panel, hit Publish)
    - "Adding/editing a founding member" (Document → Members → Create / Edit, fill fields, upload headshot, check photoReleaseObtained, Publish)
    - "Changing the application URL" (SiteSettings → applyUrl → paste new Tally URL → Publish)
    - "What I CANNOT change without a developer" (colors, fonts, layout, animations — design tokens locked in code)
    - "What if I publish a typo by accident?" (Sanity has version history — revert via document menu)
    - "Who do I ask for help?" (link to next president's contact in HANDOFF.md)
  - Include 3-5 screenshots of the Studio (Wave 2 will add these — leave placeholder boxes for Wave 1A).

  **Must NOT do**: assume tech literacy; use jargon ("GROQ," "RSC," "schema") without explanation; document features that don't exist yet

  **Recommended Agent Profile**: `writing` + skills `[]`

  **Parallelization**: YES with Tasks 24-27; Wave 1A finishing; blocked by Task 11 (Studio mounted)

  **References**: Sanity Presentation Tool walkthrough (`https://www.sanity.io/docs/presentation-overview`); Notion's onboarding guide aesthetic (clear, jargon-free)

  **WHY**: This doc is the difference between "non-technical content editing" being a real promise vs. a marketing claim. Future presidents read this on day 1.

  **QA Scenarios**:
  ```
  Scenario: All 7 sections present
    Tool: Bash + grep
    Steps:
      for s in "What is the Studio" "Editing the home page" "Adding/editing a founding member" "Changing the application URL" "What I CANNOT change" "publish a typo" "ask for help"; do grep -qF "$s" docs/EDITING-GUIDE.md || echo "MISSING: $s"; done
    Expected: no missing
    Evidence: .sisyphus/evidence/task-28-sections.txt

  Scenario: No jargon (negative grep)
    Tool: Bash + grep
    Steps: grep -iE 'GROQ|RSC|schema' docs/EDITING-GUIDE.md && exit 1 || exit 0
    Expected: exit 0
    Evidence: .sisyphus/evidence/task-28-no-jargon.txt
  ```

  **Commit**: `docs(launch): EDITING-GUIDE.md draft for non-technical editors`

---

### Wave 1B — UBS Submission Prerequisites (manual, parallel)

- [x] 29. **LinkedIn page creation guide (officer task, documented)**

  **What to do**:
  - Create `docs/launch/LINKEDIN-SETUP.md` — step-by-step officer guide:
    - Go to `https://www.linkedin.com/company/setup/new/`
    - Page name: "Bruin Alpha Investment at UCLA"
    - Industry: Investment Management OR Higher Education
    - Tagline: "Have Passion, Believe in Legacy, Believe in BAI"
    - About section: copy from SiteSettings.mission_statement (UCLA-approved version)
    - Logo upload: `brand_assets/BAI Folder/BAI Logo.png` (or SVG if available)
    - Cover image: officer creates simple navy-gradient cover with logo, slogan
    - Make Mack + 1 other founder Page Admin
    - Document URL in HANDOFF.md + update Sanity SiteSettings.linkedinUrl
  - Wave 2 task 47 includes verification that URL resolves 200 and is non-default.

  **Must NOT do**: use any form other than "Bruin Alpha Investment at UCLA"; claim affiliation that misrepresents UCLA endorsement

  **Recommended Agent Profile**: `writing` + skills `[]`

  **Parallelization**: YES with Tasks 30, 31; Wave 1B; blocked by Task 27 (deploy URL exists)

  **References**: LinkedIn Company Pages (`https://www.linkedin.com/help/linkedin/answer/710`)

  **WHY**: UBS directory submission form requires LinkedIn URL. Without this, submission is blocked.

  **QA Scenarios**:
  ```
  Scenario: Doc exists with all required setup steps
    Tool: grep
    Steps: grep -cE 'linkedin\.com|admin|tagline|about|cover image' docs/launch/LINKEDIN-SETUP.md
    Expected: count >= 5
    Evidence: .sisyphus/evidence/task-29-linkedin-doc.txt
  ```

  **Commit**: `docs(launch): LinkedIn setup guide`

- [x] 30. **Instagram account creation guide (officer task, documented)**

  **What to do**:
  - Create `docs/launch/INSTAGRAM-SETUP.md` — officer guide:
    - Sign up new IG using shared Gmail
    - Username: `@bruinalphainvestment` (or `@bai.ucla`)
    - Display name: "Bruin Alpha Investment at UCLA"
    - Bio: slogan + emoji-free signal lines + link to website (use Linktree or direct site link)
    - Profile photo: BAI logo cropped square
    - Business account, category: "Education" or "Investment Service"
    - First 1-2 posts: per transcript strategy, "we exist" mission post + founding team intro
    - Do NOT follow class of 2030 yet (per transcript: closer to fall recruitment, ~3 weeks before EAF)
    - Document URL + login info in HANDOFF.md + update SiteSettings.instagramUrl

  **Must NOT do**: log into IG from any device without 2FA enabled; reuse personal IG password; publish any post containing the leaked Gmail password from slide

  **Recommended Agent Profile**: `writing` + skills `[]`

  **Parallelization**: YES; Wave 1B; blocked by Task 27

  **References**: Instagram Business setup (`https://help.instagram.com/502981923235522`)

  **WHY**: UBS submission requires Instagram. Same as LinkedIn — non-code prerequisite.

  **QA Scenarios**:
  ```
  Scenario: Doc exists with all required steps
    Tool: grep
    Steps: grep -cE 'username|bio|business account|profile photo|2FA' docs/launch/INSTAGRAM-SETUP.md
    Expected: count >= 5
    Evidence: .sisyphus/evidence/task-30-ig-doc.txt
  ```

  **Commit**: `docs(launch): Instagram setup guide`

- [x] 31. **UBS directory Google Form submission guide (officer task, documented)**

  **What to do**:
  - Create `docs/launch/UBS-SUBMISSION.md` — officer guide:
    - Navigate to `https://uclaubs.com/club-directory` → submission form
    - Required fields (per UBS process): club name (compliant form), website URL, LinkedIn, Instagram, email, contact officer name, description (mission statement excerpt + recruitment timing)
    - Description copy template (drawn from SiteSettings.mission_statement, shortened to ~150 words)
    - Expected response: 1-2 weeks review by UBS PR committee
    - Contact: `ubsbruins@gmail.com` if no response within 2 weeks
    - After approval: BAI appears on `https://uclaubs.com/club-directory` searches
  - Include a copy-paste-ready description block for the form.

  **Must NOT do**: submit without LinkedIn + Instagram + website all live; use non-compliant naming

  **Recommended Agent Profile**: `writing` + skills `[]`

  **Parallelization**: YES; Wave 1B FINAL; blocked by Tasks 27, 29, 30

  **References**: UBS club directory (`https://uclaubs.com/club-directory`)

  **WHY**: This is THE summer goal that triggered the whole project.

  **QA Scenarios**:
  ```
  Scenario: Doc has full submission template
    Tool: grep
    Steps: grep -cE 'club name|website URL|LinkedIn|Instagram|description|ubsbruins' docs/launch/UBS-SUBMISSION.md
    Expected: count >= 6
    Evidence: .sisyphus/evidence/task-31-ubs-doc.txt
  ```

  **Commit**: `docs(launch): UBS submission guide`

---

### Wave 2 — Full Site Through Summer (Schema + CMS expansion)

- [x] 32. **Expand Sanity schemas — Committee subpages, Project, Event, FAQ, Page-with-blocks polymorphic schema**

  **What to do**:
  - Extend `committee.ts`: add `curriculum` (portable text), `signature_projects` (array of references to Project), `comp_calendar` (array of `{name, date, url, type}`), `director_quote`, `accent_color` enum
  - New schemas:
    - `project.ts` — `name`, `slug`, `summary`, `narrative` (portable text), `committee` (reference), `status` (planning/active/completed), `tags` (array), `hero_image` (optional)
    - `event.ts` — `name`, `date`, `location`, `description`, `type` (recruitment/comp/social/speaker), `external_url` (optional, e.g., for CME competition)
    - `faq.ts` — `question`, `answer` (portable text), `category` (general/application/training/committees), `order`
    - `page.ts` — generic page composed of polymorphic section blocks: `title`, `slug`, `sections` (array of `{type: hero | richText | imageCallout | numberedList | statsRow | quote | faqList | committeeGrid | projectGrid | teamGrid | marquee | cta | gallery | spacer}`). Each block type has its own sub-schema with previews.
  - Regenerate types: `bunx sanity typegen generate`
  - Update `sanity.config.ts` to register new types in document list + structure pane (group: "Pages" / "Content" / "Settings" for non-tech clarity)

  **Must NOT do**: add design-token fields (color tweaks per block); add user-auth fields (no members area in v1/v2); add blog/post fields (out of scope)

  **Recommended Agent Profile**: `unspecified-high` + skills `[]`

  **Parallelization**: NO — blocks all Wave 2 page tasks; Parallel Group: Wave 2 schema root; Blocked by Wave 1A complete

  **References**: Sanity polymorphic arrays (`https://www.sanity.io/docs/array-type`); Sanity preview (`https://www.sanity.io/docs/previews-list-views`)

  **WHY**: Polymorphic section blocks are the architecture that lets non-techies "edit sections of webpages" — exactly what user asked for.

  **QA Scenarios**:
  ```
  Scenario: All new schemas registered
    Tool: Sanity CLI
    Steps:
      1. bunx sanity schema extract --path schema.json
      2. grep -cE 'committee|project|event|faq|page' schema.json
    Expected: count >= 5
    Evidence: .sisyphus/evidence/task-32-schema.json

  Scenario: TypeGen succeeds
    Tool: Bash
    Steps: bunx sanity typegen generate; bunx tsc --noEmit
    Expected: both exit 0
    Evidence: .sisyphus/evidence/task-32-typegen.txt

  Scenario: Polymorphic page renders all block types (smoke)
    Tool: Sanity Studio + Playwright
    Steps:
      1. Create test Page doc with one of each block type
      2. Render via /studio preview pane
      3. Assert no console errors
    Expected: pass
    Evidence: .sisyphus/evidence/task-32-polymorphic.png
  ```

  **Commit**: `feat(cms): expand Sanity schemas (committee, project, event, faq, page)`

- [x] 33. **Sanity Presentation Tool wiring — split-view live preview with draft mode**

  **What to do**:
  - Configure `presentationTool` in `sanity.config.ts` with `previewUrl: { previewMode: { enable: '/api/draft-mode/enable' } }`
  - Create `app/api/draft-mode/enable/route.ts` — verifies a Sanity-provided secret token, calls `draftMode().enable()`, redirects to the target preview URL
  - Create `app/api/draft-mode/disable/route.ts` — disables and redirects home
  - Wrap fetches in pages: use `getDraftModeContext` to conditionally fetch draft documents (`perspective: 'previewDrafts'`) when in draft mode
  - Add visual draft indicator (top-right banner "Editing draft — click to exit") on draft-mode pages
  - Verify Presentation Tool split-view: edit field in Studio → preview iframe updates within 2s

  **Must NOT do**: enable draft mode without secret token (anyone could see drafts); skip the visual indicator (editors confuse drafts with live content); leak `SANITY_API_WRITE_TOKEN` to client

  **Recommended Agent Profile**: `unspecified-high` + skills `[]`

  **Parallelization**: YES with Task 34; Wave 2 schema; blocked by Task 32

  **References**: Sanity Presentation App Router setup (`https://www.sanity.io/docs/presentation-with-next-app-router`); draft-mode in Next.js (`https://nextjs.org/docs/app/building-your-application/configuring/draft-mode`)

  **WHY**: This is THE feature that makes "non-technical editing" feel magical. Editors see changes live without redeploying.

  **QA Scenarios**:
  ```
  Scenario: Live preview updates within 2s
    Tool: Playwright
    Steps:
      1. Load /studio, navigate to a page in Presentation Tool
      2. Edit headline field in side panel
      3. Wait up to 2s, assert preview iframe shows new text
    Expected: pass within timeout
    Evidence: .sisyphus/evidence/task-33-live-preview.mp4 (recorded trace)

  Scenario: Draft mode requires secret
    Tool: curl
    Steps: curl -sI http://localhost:3000/api/draft-mode/enable → assert 401 (no token)
    Expected: pass
    Evidence: .sisyphus/evidence/task-33-secret-gate.txt
  ```

  **Commit**: `feat(cms): Sanity Presentation Tool with draft mode`

- [x] 34. **Weekly Sanity dataset export GitHub Action backup**

  **What to do**:
  - Create `.github/workflows/sanity-backup.yml` — runs every Sunday 04:00 UTC:
    - Installs Sanity CLI
    - Runs `sanity dataset export production /tmp/backup-$(date +%Y%m%d).tar.gz` with `SANITY_AUTH_TOKEN` secret
    - Uploads `.tar.gz` as a GitHub Actions artifact (90-day retention) OR commits to a private backup branch
  - Document recovery procedure in HANDOFF.md: `sanity dataset import backup-YYYYMMDD.tar.gz production --replace`
  - Add a `bun run backup` script for manual on-demand backups
  - Verify first run succeeds: trigger workflow manually, confirm artifact uploaded

  **Must NOT do**: commit backups to a public branch; skip retention policy; rely on Sanity's internal backups alone (free tier has limited backups)

  **Recommended Agent Profile**: `unspecified-high` + skills `[]`

  **Parallelization**: YES with Task 33; Wave 2 schema; blocked by Tasks 4, 32

  **References**: Sanity CLI export (`https://www.sanity.io/docs/cli-export`); GH Actions cron (`https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule`)

  **WHY**: Sanity content is the entire site. Losing it = site has no content. Weekly snapshots are cheap insurance.

  **QA Scenarios**:
  ```
  Scenario: Workflow runs successfully
    Tool: gh CLI
    Steps:
      1. gh workflow run sanity-backup.yml
      2. Wait, list runs
      3. assert latest run status = success
      4. Download artifact → assert tar.gz size > 0
    Expected: pass
    Evidence: .sisyphus/evidence/task-34-backup-run.txt

  Scenario: Recovery procedure works (smoke)
    Tool: Bash
    Steps:
      1. Download artifact
      2. Run: sanity dataset import backup.tar.gz playground --replace (use throwaway dataset)
      3. Query playground for known doc → assert exists
    Expected: pass
    Evidence: .sisyphus/evidence/task-34-restore-smoke.txt
  ```

  **Commit**: `feat(ops): weekly Sanity dataset backup via GitHub Actions`

---

### Wave 2 — Pages (high parallelism, all editorial-style cream/navy)

> **Common pattern for all page tasks**:
> - All pages use the `(site)` route group layout (shell from Task 15)
> - All pages support the polymorphic block schema from Task 32 (composed of section blocks)
> - All pages have a corresponding Sanity Page document for their content
> - All pages are CMS-editable via Presentation Tool
> - All pages render with ISR `revalidate: 3600`
> - All pages must pass: Lighthouse mobile thresholds, axe-core 0 violations, no horizontal overflow at any breakpoint, disclaimer footer present, UCLA-compliant title
> - **Aesthetic**: cream `#FAF7F2` background, navy text, Fraunces headlines, Inter body, smooth scroll persists but kinetic intensity is dialed down
> - **Sanity content seeding**: each page task includes seeding placeholder content sourced from transcripts/slides

- [x] 35. **About / Our Story page**

  **What to do**:
  - Route: `app/(site)/about/page.tsx` — fetches `*[_type=="page" && slug.current=="about"][0]`
  - Sections (Sanity-defined, default seed):
    - Hero (smaller than home): "Our Story" + 1-sentence lead
    - Rich text: origin story (Spring 2026, founded by Mack + 4 co-founders, motivation, gap in UCLA finance club landscape)
    - "What Sets BAI Apart" — 3-column callouts: "Blanket Coverage" (all finance verticals), "Real Projects" (legacy-focused), "Rotational Program" (cohort experience)
    - Quote block: founder quote from transcripts ("We are starting it, we are building it, so we can decide what direction it wants to go." — Mack, Meeting 1)
    - Image gallery placeholder (founders' photos when available)
    - "What Sets BAI Apart" replaces BAM's "Berkshire Trip" differentiator — until BAI has its own signature event
  - Seeded content: ~600 words drawn from transcripts + slide values; rephrased to be compliant + polished

  **Must NOT do**: imply UCLA endorsement; reference specific other clubs negatively; include compliance-risk language (real client money, AUM)

  **Recommended Agent Profile**: `visual-engineering` + skills `[frontend-ui-ux, writing]`

  **Parallelization**: YES with all Wave 2 pages (35-45); blocked by Task 32

  **References**: BAM About section (`https://www.bruinassetmanagement.com/` — research); BVI Our Organization (research); Meeting 1 + 3 transcripts

  **WHY**: About is the second-most-visited page after Home. Defines the why of BAI.

  **QA Scenarios**:
  ```
  Scenario: About page renders all required sections
    Tool: Playwright
    Steps: navigate /about; assert h1 "Our Story" visible; assert 3 callout cards; assert quote visible
    Expected: pass
    Evidence: .sisyphus/evidence/task-35-about-render.png

  Scenario: Lighthouse + axe pass
    Tool: LHCI + axe
    Steps: standard thresholds + 0 violations
    Expected: pass
    Evidence: .sisyphus/evidence/task-35-about-quality.json

  Scenario: CMS edit propagates
    Tool: Playwright + Sanity
    Steps: edit hero subhead in Studio; refresh /about; assert change visible
    Expected: pass
    Evidence: .sisyphus/evidence/task-35-cms-update.txt
  ```

  **Commit**: `feat(about): our story page`

- [x] 36. **Committees index page — 4-card grid with director quotes**

  **What to do**:
  - Route: `app/(site)/committees/page.tsx` — fetches `*[_type=="committee"] | order(order asc)`
  - Hero (compact): "Four Committees. One Club." + sub-copy on rotational program
  - 4 detailed committee cards (richer than home teaser): name, director name + photo/monogram, 2-3 sentence description, 3 bullet "what you'll do," "Explore →" link to subpage
  - Cross-committee section: "Connected by Design" — explains the unified all-club projects + rotational program (transcript content)
  - Cream surface, navy + gold typography, less kinetic than home

  **Must NOT do**: hardcode committee names (fetch from Sanity); reference any committee that doesn't have a Sanity doc

  **Recommended Agent Profile**: `visual-engineering` + skills `[frontend-ui-ux]`

  **Parallelization**: YES; blocked by Task 32; blocks Tasks 37-40 only thematically (subpages link FROM index)

  **References**: BVI sectors page (research); transcript content on committee structure

  **QA Scenarios**:
  ```
  Scenario: 4 committee cards render with valid links
    Tool: Playwright
    Steps:
      1. Navigate /committees
      2. cards = 4
      3. for each: link href matches /committees/[slug] pattern; assert link resolves 200
    Expected: pass
    Evidence: .sisyphus/evidence/task-36-committees-index.json

  Scenario: Lighthouse + axe + responsive
    Tool: standard
    Expected: pass
    Evidence: .sisyphus/evidence/task-36-quality.json
  ```

  **Commit**: `feat(committees): index page`

- [x] 37. **Wealth Management committee subpage**

  **What to do**:
  - Route: `app/(site)/committees/[slug]/page.tsx` (dynamic, generates for all 4)
  - Sections specific to Wealth Mgmt (from transcripts):
    - Hero with director (Mack) name + role
    - "What You'll Learn" — soft skills focus (rejection-resistance, relationship building, sales fundamentals), SIE/Series exam awareness, "principles of wealth advisory"
    - "Curriculum (Fall 2026)" placeholder — 8-10 week outline (skills-focused first half, recruiting-focused second half — pattern from Trading transcript adapted)
    - "Signature Projects" — placeholder ("Wealth Advisory Mock Engagement," "SIE Study Pod") — language scrubbed of real-money references
    - Quote/insight block from Mack (transcripts)
  - Seeded content rewritten to be compliance-safe: no "build your own client book" language → "develop the skills required to one day build a book of business"

  **Must NOT do**: use language about "real clients" or "managing money" — must be education-framed; mention SIE/Series exams in a way that implies the club provides exam prep certification (it doesn't have authority for that)

  **Recommended Agent Profile**: `visual-engineering` + skills `[frontend-ui-ux, writing]`

  **Parallelization**: YES with 38-40; blocked by Tasks 32, 36

  **References**: Meeting 1, 2 transcripts (Mack on Wealth Mgmt + rejection training); BAM Investment Sectors (research)

  **QA Scenarios**:
  ```
  Scenario: Subpage renders + forbidden language scan
    Tool: Playwright + grep
    Steps:
      1. Navigate /committees/wealth-management
      2. assert h1 contains "Wealth Management"
      3. content = await page.content()
      4. assert NOT /manage real client money|AUM|build your own client book/i
    Expected: pass
    Evidence: .sisyphus/evidence/task-37-wealth-content.txt

  Scenario: Standard quality
    Tool: LHCI + axe
    Expected: pass
    Evidence: .sisyphus/evidence/task-37-wealth-quality.json
  ```

  **Commit**: `feat(committees): wealth management subpage`

- [x] 38. **Trading committee subpage (Polymarket-scrubbed copy)**

  **What to do**:
  - Same dynamic route, content per Trading committee from transcripts (Max's plan)
  - Sections:
    - Hero with director (Max) name
    - "What You'll Learn" — skills curriculum (reading charts, volatility, position sizing, systematic strategy basics) THEN recruiting curriculum (hedge fund coffee chats, technical interview prep)
    - "Curriculum (Fall 2026)" — 10-week outline blending skills + alternatives focus + recruiting prep
    - "Signature Projects" — language scrubbed:
      - "Event-Contract Modeling Research" (REPLACES "Polymarket arbitrage" — describe generically as systematic identification of mispriced binary event contracts)
      - "Internal Trading Competition" (CME-style sim)
      - "External Competitions" (CME Trading Challenge, IMC Prosperity — these are competitions, not real-money trading, safe to name)
    - "Comp Calendar" — Fall: CME Trading Challenge; Spring: IMC Prosperity (subject to external scheduling)

  **Must NOT do**: name "Polymarket"; describe any committee activity as "live trading with real money"; promise placements at hedge funds (regulatory + factually misleading for new club)

  **Recommended Agent Profile**: `visual-engineering` + skills `[frontend-ui-ux, writing]`

  **Parallelization**: YES; blocked by Tasks 32, 36

  **References**: Meeting 2 transcript (Max on trading curriculum); CME University (`https://www.cmegroup.com/education/courses.html`); IMC Prosperity (`https://imc-prosperity.notion.site/`)

  **QA Scenarios**:
  ```
  Scenario: Trading subpage renders + Polymarket scrubbed
    Tool: Playwright + grep
    Steps:
      1. Navigate /committees/trading
      2. content = await page.content()
      3. assert /trading|systematic|volatility/i matches
      4. assert /polymarket/i does NOT match (case-insensitive, exit 1 if found)
    Expected: positive matches + negative no-match
    Evidence: .sisyphus/evidence/task-38-trading-content.txt

  Scenario: Standard quality
    Tool: LHCI + axe
    Expected: pass
    Evidence: .sisyphus/evidence/task-38-trading-quality.json
  ```

  **Commit**: `feat(committees): trading subpage`

- [x] 39. **Accounting / Consulting committee subpage**

  **What to do**:
  - Sections (from Meeting 2 transcript — Helmer + Sam's design):
    - Hero with director (Helmer) name
    - "What You'll Learn" — emphasis: technicals (3-statement modeling, DCF, LBO basics, audit fundamentals); blends accounting depth with consulting case-thinking
    - "Curriculum (Fall 2026)" — 10-week outline
    - "Signature Projects":
      - "UCLA Club Audit / Advisory" (analyze a club's operations + recommend improvements — combines audit + consulting per transcript)
      - "Industry Case Competitions" (Big-N consulting firm-hosted comps, e.g., Deloitte case comp)
    - Differentiator section: "Why Both?" — explains the accounting+consulting overlap that justifies a single committee (transcript)

  **Must NOT do**: claim Beta Alpha Psi-equivalent CPA exam prep (regulatory + scope creep); promise specific firm placements

  **Recommended Agent Profile**: `visual-engineering` + skills `[frontend-ui-ux, writing]`

  **Parallelization**: YES; blocked by Tasks 32, 36

  **References**: Meeting 2 transcript (Helmer + Sam on audit project + Big-N differentiation)

  **QA Scenarios**:
  ```
  Scenario: Renders + content scan
    Tool: Playwright
    Steps: navigate /committees/accounting-consulting; assert h1; assert curriculum + projects sections
    Expected: pass
    Evidence: .sisyphus/evidence/task-39-acc-cons.png

  Scenario: Quality
    Tool: LHCI + axe
    Evidence: .sisyphus/evidence/task-39-quality.json
  ```

  **Commit**: `feat(committees): accounting & consulting subpage`

- [x] 40. **Investment Banking committee subpage**

  **What to do**:
  - Sections:
    - Hero with director ("Director TBD" — Sanity field empty until officer fills) name
    - "What You'll Learn" — modeling fundamentals (3-statement, DCF, M&A models), networking/coffee-chat strategy, technical interview prep
    - "Curriculum (Fall 2026)" — 10-week outline
    - "Signature Projects":
      - "Live Deal Tear-Down" (analyze recent M&A deal, present rationale + alternative theses)
      - "Spring Stock Pitch" (presentation to club; the unified all-club element mentioned in transcripts)
    - "Why BAI for IB?" section — differentiator from BAM/BVI: rotational program first, IB committee second; cohort camaraderie; smaller community
    - Honest framing: "BAI's IB committee complements UCLA's established IB clubs by emphasizing X" (avoid duplicating BVI/BAM language)

  **Must NOT do**: claim placement rates (no track record yet); reference BAM/BVI by name competitively

  **Recommended Agent Profile**: `visual-engineering` + skills `[frontend-ui-ux, writing]`

  **Parallelization**: YES; blocked by Tasks 32, 36

  **References**: Meeting 1, 2 transcripts (IB committee discussion); BVI training (research)

  **QA Scenarios**:
  ```
  Scenario: Renders + no comparative jabs at other clubs
    Tool: Playwright + grep
    Steps:
      1. Navigate /committees/investment-banking
      2. content = await page.content()
      3. assert /investment banking|modeling|DCF/i matches
      4. assert NOT /bruin asset management|bruin value investing|BAM|BVI/i (no comparative naming)
    Expected: pass
    Evidence: .sisyphus/evidence/task-40-ib-content.txt

  Scenario: Quality
    Tool: LHCI + axe
    Evidence: .sisyphus/evidence/task-40-ib-quality.json
  ```

  **Commit**: `feat(committees): investment banking subpage`

- [x] 41. **Training / Rotational Program page**

  **What to do**:
  - Route: `app/(site)/training/page.tsx`
  - Sections:
    - Hero: "The Rotational Program" + sub-copy
    - "How it Works" — timeline graphic: Week 1-2 Wealth Mgmt rotation → Wk 3-4 Trading → Wk 5-6 Acc/Cons → Wk 7-8 IB → Wk 9 Selection → Wk 10 Commit to Committee (exact weeks editable in Sanity)
    - "Class Hierarchy": Analyst (Y1) → Associate (Y2) → Director (committee lead)
    - "Quarterly All-Club Project" — the unified element (per transcripts: "principles workshop"-style activity, TBD content)
    - "Sample Week" — what a typical training week looks like (1hr meeting, 2hr async work)
    - "Assessment" — soft language: "Members complete a 30-page consolidated study guide before recruiting interviews" (no high-stakes implication)

  **Must NOT do**: misrepresent timing (lock content as "subject to change"); promise specific outcomes

  **Recommended Agent Profile**: `visual-engineering` + skills `[frontend-ui-ux, writing]`

  **Parallelization**: YES; blocked by Task 32

  **References**: Meeting 2 transcript (rotational program design, analyst/associate hierarchy); BAM Training page (research)

  **QA Scenarios**:
  ```
  Scenario: Renders + content sections
    Tool: Playwright
    Steps: navigate /training; assert "Rotational Program" h1; assert timeline; assert class hierarchy
    Expected: pass
    Evidence: .sisyphus/evidence/task-41-training.png

  Scenario: Quality
    Evidence: .sisyphus/evidence/task-41-quality.json
  ```

  **Commit**: `feat(training): rotational program page`

- [x] 42. **Projects page**

  **What to do**:
  - Route: `app/(site)/projects/page.tsx` — fetches `*[_type=="project"] | order(_createdAt desc)`
  - Hero: "What We Build"
  - Grid of project cards (Sanity Project docs): summary, committee tag, status badge
  - Seeded projects (placeholder, status=planning):
    - "Event-Contract Modeling Research" (Trading) — generic Polymarket-scrubbed
    - "UCLA Club Audit Initiative" (Accounting/Consulting)
    - "Spring Stock Pitch" (IB)
    - "Wealth Advisory Mock Engagement" (Wealth Mgmt)
    - "UCLA-Wide Stock Trading Competition" (aspirational, status=planning — per Mack's transcript idea)
  - "Status Legend": Planning | Active | Completed

  **Must NOT do**: claim active projects without backing; use Polymarket name

  **Recommended Agent Profile**: `visual-engineering` + skills `[frontend-ui-ux, writing]`

  **Parallelization**: YES; blocked by Task 32

  **References**: Meeting 1, 2 transcripts (project ideas across committees)

  **QA Scenarios**:
  ```
  Scenario: 5 projects render
    Tool: Playwright
    Steps: navigate /projects; assert cards.length === 5
    Expected: pass
    Evidence: .sisyphus/evidence/task-42-projects.png

  Scenario: No Polymarket name
    Tool: grep
    Steps: curl content; grep -i polymarket && exit 1 || exit 0
    Expected: exit 0
    Evidence: .sisyphus/evidence/task-42-no-polymarket.txt

  Scenario: Quality
    Evidence: .sisyphus/evidence/task-42-quality.json
  ```

  **Commit**: `feat(projects): projects showcase page`

- [x] 43. **Team page — Founding Class + Members + Alumni placeholder sections**

  **What to do**:
  - Route: `app/(site)/team/page.tsx`
  - Sections:
    - Hero: "The Team"
    - "Founding Class — Spring 2026" — same 5-card grid pattern from home but larger, with full bios (when filled), committee tag, optional LinkedIn (gated by photoReleaseObtained)
    - "Members" — placeholder with empty-state copy: "Our first cohort joins Fall 2026 — check back after recruitment."
    - "Alumni" — placeholder with empty-state copy: "Our first alumni graduate in 2027."
  - Use the empty-state pattern (not broken layouts) for sections without data

  **Must NOT do**: list fake members; include personal contact info; show LinkedIn URLs without `photoReleaseObtained: true`

  **Recommended Agent Profile**: `visual-engineering` + skills `[frontend-ui-ux]`

  **Parallelization**: YES; blocked by Task 32

  **References**: BAM Team / Members / Alumni pages (research)

  **QA Scenarios**:
  ```
  Scenario: Founding 5 render + empty states for members/alumni
    Tool: Playwright
    Steps:
      1. Navigate /team
      2. assert 5 founding cards
      3. assert "Our first cohort joins Fall 2026" copy under Members
      4. assert "Our first alumni graduate in 2027" copy under Alumni
    Expected: pass
    Evidence: .sisyphus/evidence/task-43-team.png

  Scenario: photoReleaseObtained gate (negative)
    Tool: Playwright
    Steps: for each founder card without flag → assert no LinkedIn icon
    Expected: pass
    Evidence: .sisyphus/evidence/task-43-li-gate.txt
  ```

  **Commit**: `feat(team): founding class + members + alumni page`

- [x] 44. **Events page — Enormous Activities Fair + competitions + speakers**

  **What to do**:
  - Route: `app/(site)/events/page.tsx` — fetches `*[_type=="event"]`
  - Hero: "Where to Find Us"
  - **Reframe "EAF" per Metis**: section "Find us at the Enormous Activities Fair" — UCLA-wide event BAI attends, not a BAI event. Fall 2026 date, location TBD.
  - "Competitions" section: CME Trading Challenge (Trading committee), IMC Prosperity (Trading), TBD case comps (Accounting/Consulting + IB), Spring Stock Pitch (all-club)
  - "Speakers & Workshops" placeholder — "Coming soon — speaker series in development"
  - Calendar/list view with dates (when known) or "TBD"

  **Must NOT do**: frame EAF as a BAI event; list events with fake dates

  **Recommended Agent Profile**: `visual-engineering` + skills `[frontend-ui-ux]`

  **Parallelization**: YES; blocked by Task 32

  **References**: UCLA EAF (`https://eaf.ucla.edu/`); CME (`https://www.cmegroup.com/education/`); IMC Prosperity website

  **QA Scenarios**:
  ```
  Scenario: EAF reframed correctly
    Tool: Playwright + grep
    Steps:
      1. Navigate /events
      2. content = page text
      3. assert /Find us at the Enormous Activities Fair|UCLA-wide event/
      4. assert NOT /BAI hosts EAF|BAI's Enormous Activities Fair/
    Expected: pass
    Evidence: .sisyphus/evidence/task-44-eaf-framing.txt

  Scenario: Quality
    Evidence: .sisyphus/evidence/task-44-quality.json
  ```

  **Commit**: `feat(events): events page with reframed EAF + competitions`

- [x] 45. **Join Us page — FAQ, priority deadline, Tally embed, contact**

  **What to do**:
  - Route: `app/(site)/join/page.tsx`
  - Hero: "Join the Cohort" + slogan kicker
  - "Recruitment Timeline" section:
    - Priority Application Deadline: Fall 2026 (specific date editable in Sanity)
    - Rolling applications open through Week 5 of Fall quarter
    - Interview process: 1x technical + 1x behavioral
    - Decisions: Week 6 of Fall quarter
  - "Application Process" — 4-step graphic: Apply → Coffee Chat → Interview → Decision
  - **Tally form embedded inline** (iframe) OR linkout if Tally embed misbehaves
  - "FAQ" section — Sanity-driven FAQ docs:
    - Required: "Do I need finance experience?" "What year can I apply?" "How is BAI different from BAM/BVI/BFS?" "What's the time commitment?" "Is there a fee?" "What happens after I'm accepted?"
  - Contact section: club email (Sanity) + Instagram + LinkedIn

  **Must NOT do**: hard-code dates (Sanity-managed); promise acceptance rates; mention competitor clubs negatively

  **Recommended Agent Profile**: `visual-engineering` + skills `[frontend-ui-ux, writing]`

  **Parallelization**: YES; blocked by Tasks 32, 22 (Tally pattern)

  **References**: BAM Join Us, BVI Careers/Join Us (research); Tally embed (`https://tally.so/help/embed-tally`)

  **QA Scenarios**:
  ```
  Scenario: FAQ renders 6+ items
    Tool: Playwright
    Steps: navigate /join; assert faq items >= 6
    Expected: pass
    Evidence: .sisyphus/evidence/task-45-faq.png

  Scenario: Tally embed loads (or fallback link)
    Tool: Playwright
    Steps: assert iframe with src containing tally.so OR a button linking out
    Expected: pass
    Evidence: .sisyphus/evidence/task-45-tally.png

  Scenario: Quality
    Evidence: .sisyphus/evidence/task-45-quality.json
  ```

  **Commit**: `feat(join): join us page with FAQ + Tally + recruitment timeline`

---

### Wave 2 — Finishing Sub-Wave

- [x] 46. **ANIMATION-CONVENTIONS.md — GSAP vs Motion split + lenis pattern catalog**

  **What to do**:
  - Create `docs/ANIMATION-CONVENTIONS.md` documenting:
    - **Rule**: GSAP+ScrollTrigger for scroll-linked timelines (hero pin, numbered list reveals, marquee, count-up). Motion for component micro-interactions (hover, focus, page transitions, modal animations).
    - **Pattern catalog** with examples:
      1. Pinned hero (Task 16)
      2. Numbered list staggered reveals (Task 18)
      3. Doubled-text hover (Task 19)
      4. Marquee infinite scroll (Task 21)
      5. Count-up on view (Task 23)
    - **Reduced-motion contract**: every animated component MUST honor `prefers-reduced-motion`, fallback to static state. Code template provided.
    - **Performance**: prefer transform/opacity (GPU); avoid layout-affecting props (width, top, left).
    - **Future contributors**: if you add a new animation, decide GSAP vs Motion per this rule; add to catalog.

  **Must NOT do**: leave the rule vague; skip code templates

  **Recommended Agent Profile**: `writing` + skills `[]`

  **Parallelization**: YES with 47-49; Wave 2 finishing; blocked by Wave 2 pages complete (to document real patterns)

  **References**: GSAP docs, Motion docs, this plan's tasks 16-23

  **QA Scenarios**:
  ```
  Scenario: Doc contains all required sections
    Tool: grep
    Steps: for s in "Rule" "Pattern catalog" "Reduced-motion contract" "Performance" "Future contributors"; do grep -qF "$s" docs/ANIMATION-CONVENTIONS.md || echo "MISSING: $s"; done
    Expected: no missing
    Evidence: .sisyphus/evidence/task-46-anim-doc.txt
  ```

  **Commit**: `docs(handoff): animation conventions guide`

- [x] 47. **Per-page Playwright suite for all Wave-2 pages + sitemap-discovered URL walker**

  **What to do**:
  - Create `tests/pages-suite.spec.ts` — parameterized over all routes discovered via sitemap.xml:
    - For each URL: navigate, assert title contains "Bruin Alpha Investment at UCLA", assert disclaimer footer present, no console errors, no horizontal overflow at 320/375/768/1024/1440
    - Per page: axe-core analysis (0 violations on critical rules)
    - Per page: Lighthouse mobile (thresholds enforced)
    - JS-disabled rendering (RSC fallback) — meaningful content still shown
    - Sanity API 500 mock — graceful error
  - Add `tests/socials.spec.ts` — verify all SiteSettings.socials URLs resolve 200 via in-browser fetch
  - Add `tests/forbidden-language.spec.ts` — walks sitemap.xml, asserts no page contains forbidden regex (Polymarket, AUM, real-client-money, live-trading, registered-investment-adviser)
  - Add `tests/reduced-motion.spec.ts` — emulates reduced motion, walks sitemap, asserts all animations static
  - Add `tests/cms-integration.spec.ts` — edits a SiteSettings field via Sanity client, refetches a page, asserts change visible within revalidation window

  **Must NOT do**: hardcode URLs (must use sitemap); skip negative cases; assume happy-path only

  **Recommended Agent Profile**: `unspecified-high` + skills `[]`

  **Parallelization**: YES with 46, 48, 49; Wave 2 finishing; blocked by Wave 2 pages complete

  **References**: Task 25 (harness), Playwright parameterization (`https://playwright.dev/docs/test-parameterize`)

  **QA Scenarios**:
  ```
  Scenario: Full suite passes
    Tool: Bash
    Steps: bun run test:e2e
    Expected: 0 failures across all spec files
    Evidence: .sisyphus/evidence/task-47-full-suite.txt

  Scenario: Coverage matches sitemap
    Tool: Bash
    Steps: count URLs in sitemap.xml; count test executions; assert equal
    Expected: pass
    Evidence: .sisyphus/evidence/task-47-coverage.txt
  ```

  **Commit**: `test(site): full per-page suite with sitemap walker`

- [x] 48. **Finalize HANDOFF.md + EDITING-GUIDE.md — all credentials + transition checklist**

  **What to do**:
  - Update `docs/HANDOFF.md` with all account details populated (URLs, slugs, admin rosters, renewal dates, recovery procedures, backup restore steps).
  - Update `docs/EDITING-GUIDE.md` with real screenshots from deployed Studio:
    - Logging in (screenshot of Sanity login screen)
    - Presentation Tool split-view (screenshot)
    - Editing a section block (screenshot)
    - Adding a member (screenshot)
    - Publishing (screenshot)
  - Add an `docs/CONTRIBUTING.md` for any future dev hands-on work (commit conventions, branch naming, code review)
  - Verify all 3 docs cross-link each other

  **Must NOT do**: include passwords; reference outdated screenshots; assume reader knows what "Sanity" is

  **Recommended Agent Profile**: `writing` + skills `[]`

  **Parallelization**: YES; Wave 2 finishing; blocked by Wave 2 main tasks (need real URLs / Studio state)

  **References**: Task 7 (initial HANDOFF.md), Task 28 (initial EDITING-GUIDE.md)

  **QA Scenarios**:
  ```
  Scenario: HANDOFF.md fully populated
    Tool: grep + word count
    Steps:
      1. grep -E 'TBD|TODO' docs/HANDOFF.md && exit 1 || exit 0  # no placeholder text
      2. wc -l docs/HANDOFF.md → assert >= 150 lines (real content depth)
    Expected: pass both
    Evidence: .sisyphus/evidence/task-48-handoff-final.txt

  Scenario: EDITING-GUIDE.md has screenshots
    Tool: grep + ls
    Steps:
      1. grep -E '!\[.*\]\(.*screenshot' docs/EDITING-GUIDE.md → at least 5 image refs
      2. ls docs/assets/screenshots/ → >= 5 PNG files
    Expected: pass both
    Evidence: .sisyphus/evidence/task-48-editing-guide-final.txt
  ```

  **Commit**: `docs(handoff): finalize HANDOFF + EDITING-GUIDE with screenshots`

- [x] 49. **Custom domain swap-in task (placeholder for when bruinalpha.com purchased)**

  **What to do**:
  - Document procedure in `docs/CUSTOM-DOMAIN.md`:
    - Purchase domain (suggested: `bruinalpha.com`, `bruinalphainvestment.com`, `bruinalpha.org`) — registrar recommendation: Cloudflare Registrar (at-cost pricing) or Porkbun.
    - Register under shared Gmail account (NOT personal).
    - DNS: point CNAME to Vercel team project; SSL auto-provisioned by Vercel.
    - Update Vercel project domain settings.
    - Update Sanity SiteSettings.canonical_url.
    - Update LinkedIn, Instagram, UBS directory entries.
    - Update sitemap.xml + robots.txt (auto-handled by Next.js metadata).
    - Test: curl new domain → 200, check OG preview cards.
  - Add domain renewal date to HANDOFF.md (Task 48).

  **Must NOT do**: register domain under Mack's personal account; let auto-renew fail silently

  **Recommended Agent Profile**: `quick` + skills `[]`

  **Parallelization**: YES; Wave 2 finishing; technically deferred (needs purchase) but documented now

  **References**: Vercel custom domains (`https://vercel.com/docs/projects/domains`); Cloudflare Registrar (`https://www.cloudflare.com/products/registrar/`)

  **QA Scenarios**:
  ```
  Scenario: Doc has all 7 sub-steps
    Tool: grep
    Steps: for s in "Purchase" "Register under shared" "DNS" "Vercel project domain" "SiteSettings.canonical_url" "LinkedIn, Instagram, UBS" "renewal"; do grep -qF "$s" docs/CUSTOM-DOMAIN.md || echo "MISSING: $s"; done
    Expected: no missing
    Evidence: .sisyphus/evidence/task-49-domain-doc.txt
  ```

  **Commit**: `docs(handoff): custom domain swap-in procedure`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
>
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.** Never mark F1-F4 as checked before getting user's okay.

- [x] F1. **Plan Compliance Audit** — `oracle`

  Read this plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": grep codebase for forbidden patterns and language ("Polymarket", "AUM", "real client money", "live trading," etc.) — reject with file:line if found. Verify site-wide disclaimer present on every page from sitemap.xml. Verify UCLA naming compliance ("at UCLA" form) in all SEO/OG/JSON-LD output. Verify no design tokens in Sanity. Check evidence files exist in `.sisyphus/evidence/`. Compare deliverables against plan.

  Output: `Must Have [N/N] | Must NOT Have [N/N] | Compliance Items [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`

  Run `tsc --noEmit` + `eslint .` + `bunx playwright test`. Review all changed files for: `as any`, `@ts-ignore`, empty catches, `console.log` in prod, commented-out code, unused imports, `dangerouslySetInnerHTML` usage, hardcoded URLs that should be in SiteSettings. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp). Verify GSAP vs Motion split per `/docs/ANIMATION-CONVENTIONS.md`. Verify no `SANITY_API_WRITE_TOKEN` in committed files (grep `.env*`).

  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | Forbidden patterns [CLEAN/N issues] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)

  Start from clean state (`bun install && bun run build && bun run start`). Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration: smooth scroll continuous across page navigation, reduced-motion kills ALL animations, mobile responsive 320→1440, Sanity Studio loads at `/studio` and edits propagate to preview within 2s, all socials/email links resolve 200, Tally form embeds. Run Lighthouse mobile audit per page — assert all thresholds (Perf≥85, A11y≥95, BP≥95, SEO≥95). Run axe-core per page — assert zero violations. Save evidence to `.sisyphus/evidence/final-qa/`.

  Output: `Scenarios [N/N pass] | Lighthouse [N/N pages pass] | Axe [N/N pages clean] | Integration [N/N] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`

  For each task: read "What to do," read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance per task. Detect cross-task contamination: Task N touching Task M's files without justification. Flag unaccounted changes. Verify HANDOFF.md + EDITING-GUIDE.md + ANIMATION-CONVENTIONS.md exist and are complete.

  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | Docs [N/N present] | VERDICT`

---

## Commit Strategy

Logical groups → conventional commit per group:

- **Wave 0**: `chore(stewardship): create shared accounts and handoff doc`
- **Wave 1A foundation**: `feat(scaffold): Next.js 15 + Sanity + Lenis foundation` (groups tasks 8-14)
- **Wave 1A composition**: `feat(home): polished kinetic landing page` (groups tasks 15-23)
- **Wave 1A finishing**: `feat(launch): seed content + QA harness + Vercel deploy` (groups tasks 24-28)
- **Wave 1B**: `docs(launch): officer task guides for socials and UBS` (groups tasks 29-31)
- **Wave 2 schema**: `feat(cms): expand Sanity schemas + Presentation Tool` (groups tasks 32-34)
- **Wave 2 pages**: one commit per page — `feat(about): our story page`, `feat(committees): wealth management subpage`, etc. (tasks 35-45, one commit each)
- **Wave 2 finishing**: `docs(handoff): finalize handoff and editing guides` (groups tasks 46-49)

Pre-commit hook: `tsc --noEmit && eslint . && bun run build` must pass on every commit.

---

## Success Criteria

### Verification Commands
```bash
# Build + type check + lint
bunx tsc --noEmit                                           # Expected: exit 0
bunx eslint .                                                # Expected: exit 0
bun run build                                                # Expected: exit 0, no errors

# Local preview
bun run start                                                # Expected: serves on :3000

# Lighthouse mobile
bunx lhci autorun --collect.url=http://localhost:3000/      # Expected: Perf≥85, A11y≥95, BP≥95, SEO≥95

# Playwright full suite
bunx playwright test                                         # Expected: all green

# SEO infra
curl -s http://localhost:3000/sitemap.xml | xmllint --noout - # Expected: exit 0
curl -s http://localhost:3000/robots.txt | grep -E 'Disallow:.*\/studio'  # Expected: match
curl -sI http://localhost:3000/studio | grep -i 'x-robots-tag.*noindex'   # Expected: match

# Forbidden language scan (must return 0)
curl -s http://localhost:3000/ | grep -iE 'manage.*real.*client.*money|live trading|registered investment adviser|AUM|polymarket'  # Expected: exit 1 (no match)

# UCLA-compliant naming
curl -s http://localhost:3000/ | grep -E '<title>.*at UCLA.*</title>'    # Expected: match

# Disclaimer presence
curl -s http://localhost:3000/ | grep -E 'registered student organization at UCLA'  # Expected: match

# Sanity dataset export (backup readiness)
bunx sanity dataset export production /tmp/backup.tar.gz    # Expected: exit 0, file >0 bytes

# Bundle budget
bun run analyze                                              # Expected: First Load JS for / < 250KB
```

### Final Checklist
- [ ] All "Must Have" items present and verified
- [ ] All "Must NOT Have" items absent and verified
- [ ] All Playwright QA scenarios pass with evidence in `.sisyphus/evidence/`
- [ ] Lighthouse mobile thresholds met on every page
- [ ] `axe-core` returns zero violations on every page
- [ ] F1, F2, F3, F4 all return APPROVE
- [ ] User signs off with explicit "okay"
- [ ] `docs/HANDOFF.md` + `docs/EDITING-GUIDE.md` + `docs/ANIMATION-CONVENTIONS.md` exist and reference all 5 credential locations
- [ ] Vercel deployment under team (not personal), reachable via `*.vercel.app`
- [ ] Sanity project under shared org with ≥2 admins
- [ ] GitHub repo under shared account/org with ≥2 owners
- [ ] Weekly dataset backup GitHub Action enabled and tested
