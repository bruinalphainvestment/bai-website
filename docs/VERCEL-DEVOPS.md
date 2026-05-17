# Vercel DevOps Best Practices

> **Status**: Research report for handoff. Synthesized from official Vercel docs, OSS production repos, and community gotchas. Tailored to **this repo** (Next.js 16 + Sanity + Vercel Analytics/Speed Insights).
>
> **Audience**: Any agent or engineer about to touch deploys, CI, env vars, or the production workflow.
>
> **Project context at time of writing**:
> - Stack: Next.js 16.2.6, React 19, Sanity CMS, Tailwind v4
> - Already installed: `@vercel/analytics`, `@vercel/speed-insights`, `@playwright/test`, `@axe-core/playwright`, `lhci` (Lighthouse CI)
> - `vercel.json`: **does not exist yet**
> - Git remote: `bruinalphainvestment/bai-website`
> - Scripts available: `dev`, `build`, `lint`, `typecheck`, `test:e2e`, `test:lh`, `analyze`

---

## 1. The Mental Model — How Vercel Is *Supposed* to Be Used

Vercel is built around **Git as the source of truth**. Every branch and PR auto-deploys to a unique URL. The CLI is the escape hatch, not the primary path.

```
┌─────────────────────────────────────────────────────────────┐
│ feature-branch  →  Preview Deployment  (unique URL per push)│
│ main            →  Production Deployment  (auto-aliased)    │
│ vercel CLI      →  Manual / CI-driven deploys (escape hatch)│
└─────────────────────────────────────────────────────────────┘
```

Three environments are first-class:
- **Development** — local (`vercel dev` or `next dev`)
- **Preview** — every non-prod branch, auto on push
- **Production** — main branch, auto-promoted (configurable)

Env vars auto-switch based on which environment is building.

---

## 2. Git vs CLI — When to Use Each

| Workflow | Primary Use | Why |
|---|---|---|
| **Git push** (default) | Preview + staging deploys | Audit trail, PR comments, auto env-switching, zero config |
| **`vercel` (CLI)** | Local ad-hoc preview | Test changes without a commit |
| **`vercel build` + `vercel deploy --prebuilt --prod`** | CI-driven production | **Reproducible builds** — what CI tested is exactly what ships |
| **`vercel dev`** | Rarely (Next.js has `next dev`) | Only for Vercel Functions outside a framework |

**Community consensus** (Kilo-Org, OctoLab, trunk-based guide): **use Git for preview, but gate production behind a CI pipeline that uses the CLI**. Don't trust pure auto-deploy for prod on a client-facing site.

Recommended production deploy sequence:
```bash
vercel pull --yes --environment=production    # fetch env vars + config
vercel build --prod                            # build in CI (testable)
vercel deploy --prebuilt --prod                # ship the exact tested artifact
```

This guarantees the artifact tested in CI is byte-for-byte what hits prod.

---

## 3. How Code Should Be Written

### Project structure (Vercel conventions)

```
/app or /src       ← framework code (Next.js App Router)
/public            ← static assets (CDN-served)
/middleware.ts     ← runs BEFORE cache — auth, redirects, personalization
/app/api           ← Vercel Functions (auto-deployed)
vercel.json        ← only what framework can't express
next.config.ts     ← Next-specific config
```

### Function runtime choice (Next.js)

- **Node.js Functions** (default) — DB queries, Sanity API calls, file I/O, anything heavy. **Fluid Compute is now default and closed the cold-start gap.** Vercel explicitly recommends Node.js over Edge for most cases as of Dec 2025.
- **Edge Functions / Routing Middleware** — auth checks, geolocation routing, redirects, header manipulation. Runs *before* the CDN cache, globally distributed.
- **Don't reach for Edge by reflex** — it's stricter (no Node APIs, 4 MB bundle cap) and rarely faster anymore.

### Code rules that matter

- **Don't read env vars at module load if optional in dev** — they may not exist on Vercel builds. Read inside handlers.
- **Use `NEXT_PUBLIC_*` prefix** for anything client-side. `vercel env pull` does NOT add this prefix automatically; define the variable with the prefix in the dashboard.
- **System env vars** are free intel: `VERCEL_ENV`, `VERCEL_URL`, `VERCEL_GIT_COMMIT_SHA`, `VERCEL_PROJECT_PRODUCTION_URL`. Use them for OG image URLs, Sentry release tagging, environment-aware logic.
- **Mark every secret as "Sensitive"** in the Vercel dashboard. After the April 2026 breach, this is non-negotiable — non-sensitive vars are unencrypted at rest.

### `vercel.json` — when to add one

You don't have one yet. Add it only when you need to express something `next.config.ts` cannot. Suggested starting point for this repo:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "regions": ["sfo1"],
  "functions": {
    "app/api/**/*.ts": { "maxDuration": 30 }
  },
  "headers": [
    {
      "source": "/:path*",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ],
  "crons": [
    { "path": "/api/cron/revalidate", "schedule": "0 * * * *" }
  ]
}
```

**Avoid in `vercel.json`**: redirects/rewrites that belong in `next.config.ts`, anything the framework auto-detects, env vars (use the dashboard).

---

## 4. How Test Builds Should Be Done

Use **all three layers**. Each catches different classes of bug.

### Layer 1 — Local (fast feedback, before push)

```bash
vercel pull --environment=preview     # one-time sync of env vars
vercel build                           # replicates Vercel's build exactly
```

Catches env var mismatches, missing deps, native binary issues (macOS vs Linux x64) **before** you push. Faster iteration than `next build` alone because it uses Vercel's actual build pipeline.

### Layer 2 — GitHub Actions pre-build (lint, types, unit tests)

Run cheap checks before Vercel even starts:

```yaml
on: [pull_request, push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run lint
      - run: bun run typecheck
      # add unit tests when they exist
```

Fail fast on stupid mistakes. Don't pay for a Vercel build that was going to fail typecheck anyway.

### Layer 3 — Deployment Checks (E2E against the preview URL)

**This is the killer pattern most teams miss.** Vercel emits `vercel.deployment.ready` webhooks → GitHub Actions runs Playwright against the preview URL → if it passes, Vercel promotes; if it fails, deployment stays staged (no production release).

This repo already has Playwright + `test:e2e` + `lhci autorun`. Wire them in:

1. **Project Settings → Deployment Checks → Add Check → GitHub**
2. GitHub Action listens for `repository_dispatch: vercel.deployment.ready`
3. Runs `BASE_URL=${{ github.event.client_payload.url }} bun test:e2e`
4. Reports check status back to Vercel
5. Vercel only promotes to production if green

**Crucial setup step:** Enable **Protection Bypass for Automation** (Project Settings → Deployment Protection), and pass the secret via header in Playwright config:

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    extraHTTPHeaders: {
      'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET!,
      'x-vercel-set-bypass-cookie': 'true',
    },
  },
});
```

### Anti-patterns to avoid

- **Don't** stuff tests into `buildCommand` (`next build && jest`). Tests failing kills the deployment artifact — you lose the preview URL you'd want for debugging.
- **Don't** run E2E in GitHub's environment against `next start`. Run them against the actual Vercel preview URL — that's the build that ships.

---

## 5. Production Operations

### Branch strategy (matches the current repo)

- `main` → production (auto-promoted, gated by deployment checks)
- `animations-preview` and other feature branches → preview URLs per commit
- Optional: a `staging` branch with a stable preview alias (`staging.bai.com`) for a persistent staging env

### Rollback — your most important production tool

**Instant Rollback** in the dashboard reassigns the production domain to a previous deployment with **zero rebuild** — usually <1 second.

Gotchas:
- Env vars do **not** revert (they're project-level, not deployment-level)
- Cron jobs revert to the old deployment's state
- Custom aliases not included (only the project's default production domain)
- After rollback, auto-promotion is **disabled** — must manually promote the next fix

### Observability (already partially wired)

This repo has `@vercel/analytics` and `@vercel/speed-insights` installed:
- **Speed Insights** — Core Web Vitals (LCP, INP, CLS) automatic
- **Web Analytics** — pageviews, referrers, custom events, no cookies
- **Observability tab** (free tier) — function latency, error rate, external API timings. Plus tier extends retention.
- **Log Drains** (Pro+) — forward to Datadog/Axiom/etc. for longer retention

### Skew Protection — turn it on

With Next.js 16, this is free protection against version mismatch (user has old JS bundle, hits new server). **Project Settings → Advanced → enable**. Especially matters for SPAs with long-lived sessions.

### Deployment Retention

Set a policy at Settings → Security → Deployment Retention. Defaults to unlimited. Configure preview auto-prune (e.g., 30 days) if storage matters.

---

## 6. Common Gotchas

| Gotcha | Mitigation |
|---|---|
| **Wall-clock function billing** | Fluid Compute is now default — verify it's on. Old projects can bill 4000x actual CPU work. |
| **Env vars unencrypted at rest** | Mark every secret as "Sensitive" in the dashboard. Lesson from April 2026 breach. |
| **Build cache stale after major upgrade** | `vercel --force` or set `VERCEL_FORCE_NO_BUILD_CACHE=1` env var. |
| **Function bundle >250 MB** | Watch out for large libs (Sanity Studio, headless Chrome). Use `VERCEL_ANALYZE_BUILD_OUTPUT=1` to diagnose. |
| **Build timeout (45 min)** | Usually a monorepo problem. If repo grows, switch to Turborepo with `--filter`. |
| **Phantom team seats** | Audit billing monthly. Real reported pattern: removed seats reappear on next invoice. |
| **Image optimization costs from bots** | Configure `images.remotePatterns` tightly. This repo already restricts to `cdn.sanity.io/images/u1y6t81y/**` — good. |
| **`vercel env pull` doesn't add `NEXT_PUBLIC_` prefix** | Define the variable in the dashboard **with** the prefix. |
| **E2E tests blocked by Deployment Protection** | Enable Protection Bypass for Automation, pass `x-vercel-protection-bypass` header. |
| **ISR not revalidating** | Use `revalidatePath`/`revalidateTag` via Sanity webhook → `/api/revalidate` route. Add a cron as safety net. |

---

## 7. Recommended Setup For This Project (Concrete Actions)

Prioritized for handoff to whoever does this work:

1. **Add `vercel.json`** with the security headers, `regions: ["sfo1"]`, function `maxDuration`, and any Sanity webhook cron. Template in Section 3.
2. **Wire Playwright into Deployment Checks** — `test:e2e` exists. Add the `repository_dispatch` listener workflow.
3. **Wire Lighthouse CI (`lhci autorun`) into Deployment Checks** — gate prod on performance budgets.
4. **Enable Skew Protection** in project settings (Next.js 16 supports natively).
5. **Mark all Sanity tokens, webhook secrets, API keys as "Sensitive"** in env var settings.
6. **Production deploy GitHub Action**: typecheck + lint + e2e on `main` push, then `vercel deploy --prebuilt --prod` if green.
7. **Disable auto-assign production domain** (Settings → Environments → Production) so prod requires explicit promotion. Recommended for a client site.
8. **Set up Sanity webhook → revalidation route** at `/api/revalidate` with a `cron` in `vercel.json` as a fallback safety net.

---

## 8. Reference Workflow Templates

### Production deploy GitHub Action (suggested)

```yaml
# .github/workflows/deploy-production.yml
name: Deploy Production
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run lint
      - run: bun run typecheck

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install -g vercel
      - run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### Deployment Check (E2E on preview)

```yaml
# .github/workflows/e2e-on-preview.yml
name: E2E on Preview
on:
  repository_dispatch:
    types: [vercel.deployment.ready]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - name: Report status to Vercel
        uses: vercel/repository-dispatch/actions/status@v1
        with:
          name: 'Vercel - bai-website: e2e'
      - uses: vercel/repository-dispatch/actions/checkout@v1
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bunx playwright install chromium --with-deps
      - run: bun run test:e2e
        env:
          BASE_URL: ${{ github.event.client_payload.url }}
          VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}
```

---

## 9. Authoritative Reference URLs

**Workflow & Deploy**
- https://vercel.com/docs/deployments
- https://vercel.com/docs/git
- https://vercel.com/docs/cli/deploy
- https://vercel.com/docs/deployments/promoting-a-deployment

**Testing & CI/CD**
- https://vercel.com/docs/cli/build
- https://vercel.com/docs/deployment-checks
- https://vercel.com/docs/environment-variables/manage-across-environments

**Project structure**
- https://vercel.com/docs/project-configuration/vercel-json
- https://vercel.com/docs/builds/configure-a-build
- https://vercel.com/docs/functions
- https://vercel.com/docs/routing-middleware

**Production ops**
- https://vercel.com/docs/instant-rollback
- https://vercel.com/docs/skew-protection
- https://vercel.com/docs/deployment-protection
- https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation
- https://vercel.com/docs/observability
- https://vercel.com/docs/rolling-releases
- https://vercel.com/docs/production-checklist
- https://vercel.com/docs/deployment-retention

**Real-world references**
- Trunk-based monorepo guide: https://dev.to/thecodedon/the-ultimate-guide-to-trunk-based-nextjs-monorepo-deployments-on-vercel-4851
- Kilo-Org production workflow: https://github.com/Kilo-Org/cloud/blob/main/.github/workflows/deploy-production.yml
- Billing horror story (cautionary tale): https://joshduffy.dev/how-i-left-vercel/
- April 2026 Vercel security incident: https://news.ycombinator.com/item?id=47824463

---

## 10. Handoff Notes For The Next Agent

If you're picking this up to **implement** any of Section 7:

- This repo has **no `vercel.json`** yet — start there. Use the template in Section 3, not a blank file.
- The repo uses **Bun** (`bunx`, `bun run`) per scripts, but `package.json` does not lock the package manager. Match whatever the user prefers.
- Playwright is installed but you'll need to confirm `playwright.config.ts` exists and add the bypass header block (Section 4) before E2E-on-preview will work against protected deployments.
- The user must create `VERCEL_TOKEN` and `VERCEL_AUTOMATION_BYPASS_SECRET` GitHub repo secrets — don't try to generate these yourself.
- Disabling auto-promotion is a **one-click setting in the Vercel dashboard** — do not try to express it via `vercel.json`.
- Sanity webhook → `/api/revalidate` route does not yet exist in this repo; verify before referencing.
- The current branch `animations-preview` is NOT main — if you push deploy workflow files here, they won't trigger on `main` until merged.
