# Deploy Checklist (Mack) — Wire & Ship

The site code is written and ready. This guide takes you from "code on disk" to "live on the public internet" with content editable via Sanity Studio.

**Operating model:** Mack is the sole deployer on Vercel Hobby (free). Other officers get read access via GitHub. Auto-deploys trigger on every push to `main`.

**Time estimate:** ~60 minutes of focused work, plus ~24h–7d wait on the GitHub Student Pack (non-blocking — you can deploy without it).

---

## 0. Prerequisites — accounts you need first

If you haven't already, complete these (one-time, ~20 mins):

- [ ] **Personal email 2FA enabled.** Backup codes saved.
- [ ] **Recovery email:** `bruinalphainvestment26@gmail.com` set as primary recovery on your personal email.
- [ ] **Password vault:** Bitwarden Free Organization (`Bruin Alpha Investment`). ⚠️ **Free org caps at 2 users.** If you need to share with 4 co-officers (Max, Sam, Kai, Helmer), upgrade to **Bitwarden Families** ($3.99/mo, 6 seats) — cheapest team-sharing option. Free org is fine if only one other officer needs vault access.
- [ ] **GitHub account** signed in with personal email.
- [ ] **GitHub Student Pack** application submitted at [education.github.com/pack](https://education.github.com/pack) using your `@ucla.edu` email. Approval is 1–3 business days typical, up to 7 during semester rush. **Not required to deploy** — useful later for the free Namecheap `.me` domain + Copilot Pro. Vercel is NOT in the pack.

---

## 1. Create the Sanity project (10 mins)

This is where website content lives. Sanity's free tier requires the dataset to be **public** (private datasets are Growth-tier $).

1. [ ] **Sign up:** Go to [sanity.io](https://www.sanity.io/) and sign up with your personal email (OAuth via Google).
2. [ ] **Create project from the CLI** (preferred — links Studio + provisions in one shot):
   ```bash
   bunx sanity@latest init --env --create-project "Bruin Alpha Investment" --dataset production --visibility public
   ```
   - Choose **Existing project** if Sanity asks where to place output (don't overwrite the existing `sanity/` folder).
   - When asked about embedding Studio: skip — we already have it embedded at `/studio`.
3. [ ] **Capture the Project ID:** Sanity will print an 8-character alphanumeric ID (e.g., `v6m6t4z6`). Also visible at `https://www.sanity.io/manage`. **Copy it.**
4. [ ] **Update `docs/HANDOFF.md`** Accounts Inventory row → Sanity Org → Project ID.
5. [ ] **Invite co-admin** (optional but recommended): Sanity dashboard → your project → Members → Invite. Add one other officer with **Administrator** role.

### 1b. Apply for the Sanity Non-Profit Plan (parallel, ~5 mins, optional)

The previous guide pointed at the Startup Program — that's VC-portfolio-only. The right program for a UCLA student org is the **Non-Profit Plan**: free, 25 users, 3 datasets (private allowed), mirrors Growth-tier features. Worth applying even if Free works initially.

1. [ ] Read eligibility: [sanity.io/docs/platform-management/non-profit-plan](https://www.sanity.io/docs/platform-management/non-profit-plan).
2. [ ] Submit the application form: [forms.gle/xkQstGLFrujT2me39](https://forms.gle/xkQstGLFrujT2me39).
3. [ ] Identify the club as "Bruin Alpha Investment at UCLA, a student organization in the process of UCLA SOLE registration." Mention non-monetized (no ads/donations/transactions).
4. [ ] Response time: ~14 business days. Continue without waiting.

---

## 2. Wire `.env.local` (3 mins)

The repo ships an `.env.local` with placeholder values so `bun run build` succeeds. Replace with real values now.

1. [ ] Open `.env.local` and update:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=<paste your real 8-char project ID>
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
2. [ ] **Generate a write token** for seeding:
   - Go to `https://www.sanity.io/manage/project/<projectId>/api` → **Tokens** → **Add API token**.
   - Name: `seed-script`
   - Permissions: **Editor**
   - Copy the token IMMEDIATELY (can't be viewed again).
3. [ ] Paste into `.env.local`:
   ```env
   SANITY_API_WRITE_TOKEN=<paste token>
   ```
   ⚠️ Server-only — no `NEXT_PUBLIC_` prefix. Already gitignored.
4. [ ] **Generate a preview secret** (any random string ≥ 32 chars works):
   ```bash
   openssl rand -hex 32
   ```
   Paste into `.env.local`:
   ```env
   SANITY_STUDIO_PREVIEW_SECRET=<paste hex>
   ```
5. [ ] Store the write token and preview secret in the Bitwarden vault.

---

## 3. Seed the dataset (2 mins)

The repo includes an idempotent seeder that populates the 14 baseline documents (Site Settings, Home Page, 8 founding members, 4 committees).

1. [ ] Run:
   ```bash
   bun run seed
   ```
2. [ ] **Verify** by starting the dev server and opening Studio:
   ```bash
   bun run dev
   ```
   - Visit [http://localhost:3000/studio](http://localhost:3000/studio).
   - Sign in with your personal email (same one used at sanity.io).
   - Confirm: **Site Settings** populated, **Home Page** exists (empty sections — populate via Studio later), **4 Committees**, **8 Founding Members** (Matt, Ben, Michael, Mack, Kai, Samuel, Max Helmer, Rhett).
3. [ ] Visit [http://localhost:3000](http://localhost:3000) — site should render without runtime errors.
4. [ ] Re-running `bun run seed` is safe (idempotent, matches by `_id`).

---

## 4. Create the GitHub repo (5 mins)

1. [ ] Go to [github.com/new](https://github.com/new).
2. [ ] **Owner:** Your personal account (we'll create an Org later if needed — Org isn't required for Hobby deploy).
3. [ ] **Repo name:** `bai-website`.
4. [ ] **Visibility:** Private.
5. [ ] **Do NOT initialize** with README/license/.gitignore (the repo already has them).
6. [ ] Push the existing repo:
   ```bash
   git remote add origin git@github.com:<your-username>/bai-website.git
   git push -u origin main
   ```
7. [ ] **Add a co-admin officer** as a Collaborator: repo Settings → Collaborators → Add — pick the role **Admin**.
8. [ ] **Update `docs/HANDOFF.md`** GitHub Org row with the actual repo URL.

> **Later upgrade (free):** A UCLA faculty advisor can apply for **GitHub Team for free** via [github.com/edu](https://github.com/edu/teachers), which unlocks branch protection and required reviewers on private repos. Not blocking deploy.

---

## 5. Deploy to Vercel (10 mins)

**Operating model:** Hobby plan, Mack as sole deployer. Vercel auto-deploys every push to `main`.

> Why not a Vercel Team? Multi-member Teams are a Pro feature ($20/seat/mo). For a non-monetized student club site, Hobby is allowed under Vercel's Fair Use ([docs](https://vercel.com/docs/limits/fair-use-guidelines)) — no ads, no payments, no donations. If the club later wants multiple deployers, options: (a) pay Pro, (b) apply to [Vercel for OSS](mailto:sponsorships@vercel.com) by open-sourcing the repo.

1. [ ] Go to [vercel.com/new](https://vercel.com/new). Sign in with your personal email (OAuth → GitHub).
2. [ ] **Import** the `bai-website` repo. Authorize Vercel to access it if prompted.
3. [ ] **Project name:** `bai-website`. **Framework preset:** Next.js (auto-detected). **Root directory:** `.`.
4. [ ] **Environment Variables** — paste in (copy from `.env.local`, EXCEPT `NEXT_PUBLIC_SITE_URL` which gets the prod URL):

   | Key | Value | Environments |
   | :-- | :-- | :-- |
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your 8-char ID | Production, Preview, Development |
   | `NEXT_PUBLIC_SANITY_DATASET` | `production` | Production, Preview, Development |
   | `NEXT_PUBLIC_SANITY_API_VERSION` | `2025-01-01` | Production, Preview, Development |
   | `NEXT_PUBLIC_SITE_URL` | The actual `*.vercel.app` URL Vercel assigns (e.g. `https://bai-website-nu.vercel.app`) — update after the first deploy when you know the alias. Replace with the custom domain later. | Production |
   | `SANITY_API_WRITE_TOKEN` | The seed-script token | Production, Preview |
   | `SANITY_STUDIO_PREVIEW_SECRET` | The hex secret | Production, Preview |

5. [ ] Click **Deploy**. Wait ~3 minutes for the first build.
6. [ ] **Smoke test:** Open the assigned `*.vercel.app` URL:
   - Home page renders.
   - `/studio` loads and you can edit (auth via your Sanity-linked Google account).
   - `/about`, `/committees`, `/team`, `/join` all return 200.
7. [ ] **Update `docs/HANDOFF.md`** Vercel row → URL + project slug with the actual values.

> **Gotchas we hit on the original deploy (May 2026), check these if smoke test 404s or 401s:**
>
> 1. **GitHub auto-deploy on Hobby requires a PUBLIC repo if the repo is org-owned.** Org-private repos error with `409 — not supported on Hobby plan`. Either keep the repo public, transfer to personal scope, or move to Cloudflare Pages.
> 2. **Framework auto-detection silently fails when you use `vercel link --yes`** — the project is created with `framework: null` and only the middleware deploys, leaving every route as a Vercel platform 404. Fix: set the framework in Project Settings → General to **Next.js** (or via API: `PATCH /v9/projects/bai-website` with `{"framework":"nextjs"}`).
> 3. **New Hobby projects have SSO "Deployment Protection" enabled by default**, returning 401 with a `_vercel_sso_nonce` cookie on every URL. Fix: Project Settings → Deployment Protection → Vercel Authentication → **Standard Protection: Disabled** (or API `PATCH` with `{"ssoProtection":null}`).
> 4. **EADDRNOTAVAIL during `vercel --prod` from laptop** = local ephemeral port exhaustion. Skip CLI uploads entirely — rely on GitHub auto-deploys (push triggers a server-side build at Vercel).

### 5b. Authorize Sanity → Vercel preview origin

The Studio's Presentation tool previews edits against the live site.

1. [ ] In Sanity dashboard → your project → **API** → **CORS Origins** → **Add origin**.
2. [ ] Add your Vercel production URL (e.g., `https://bai-website.vercel.app`). Tick **Allow credentials**.
3. [ ] Also add `http://localhost:3000` if not already present (for local Studio).

---

## 6. Sanity → Vercel webhook for instant content updates (5 mins)

The site uses ISR with a 1-hour revalidate window, but editors will want changes live immediately. Wire a Sanity webhook to ping a Vercel revalidation endpoint.

> ⚠️ **Known gap:** `app/api/revalidate` is referenced in `.env.example` but not yet implemented. If `app/api/revalidate/route.ts` doesn't exist when you do this step, **skip 6 for now** — the 1h ISR window will catch updates. File a follow-up task to implement the webhook route.

1. [ ] In Sanity dashboard → your project → **API** → **Webhooks** → **Create webhook**.
2. [ ] **Name:** `Vercel revalidate (production)`
3. [ ] **URL:** `https://bai-website.vercel.app/api/revalidate` (replace with custom domain when ready).
4. [ ] **Dataset:** `production`. **Trigger on:** Create, Update, Delete.
5. [ ] **HTTP method:** POST. **Secret:** generate a new random hex (`openssl rand -hex 32`), paste it both here AND as a new Vercel env var `SANITY_WEBHOOK_SECRET`.
6. [ ] Save. Test by editing a Site Settings field in Studio and confirming the public page updates within ~5 seconds.

---

## 7. Wire the GitHub Actions backup (3 mins)

Weekly Sanity dataset export to GitHub Actions artifacts. Already configured at `.github/workflows/sanity-backup.yml`.

1. [ ] Generate a **Viewer** (read-only) Sanity token: `https://www.sanity.io/manage/project/<id>/api` → Tokens → Add API token → Name `github-backup`, Permissions: **Viewer**.
2. [ ] In GitHub: repo Settings → **Secrets and variables** → **Actions** → **New repository secret**.
3. [ ] Name: `SANITY_AUTH_TOKEN`. Value: paste token.
4. [ ] Manually trigger to verify: Actions tab → "Weekly Sanity Dataset Backup" → Run workflow.
5. [ ] Confirm the run succeeds and an artifact `sanity-backup-<run_id>` appears.

---

## 8. Socials & directory submissions (defer or parallel)

Not deploy-blockers. Do once the site has a stable URL.

- [ ] **LinkedIn Company Page** — [LINKEDIN-SETUP.md](./launch/LINKEDIN-SETUP.md). Use the live Vercel URL until custom domain is live.
- [ ] **Instagram** — [INSTAGRAM-SETUP.md](./launch/INSTAGRAM-SETUP.md).
- [ ] **UCLA SOLE registration** — Register the org via [sole.ucla.edu](https://sole.ucla.edu/) → MyUCLA RCO at `https://sa.ucla.edu/RCO/`. Required for "Recognized Campus Organization" status, campus resource access, and any future request for a `*.ucla.edu` subdomain (which is discretionary and unlikely to be granted).
- [ ] **UBS directory** — [UBS-SUBMISSION.md](./launch/UBS-SUBMISSION.md). Form at [uclaubs.com/club-directory](https://uclaubs.com/club-directory).

---

## 9. Custom domain (when ready, ~15 mins)

Follow [CUSTOM-DOMAIN.md](./CUSTOM-DOMAIN.md). Summary:

1. [ ] Buy `bruinalpha.com` at Cloudflare Registrar or Porkbun (~$10/yr, prepay 5 years if budget allows).
2. [ ] Add the domain to the Vercel project → Settings → Domains.
3. [ ] **Use the exact DNS records Vercel shows in the dashboard** — they're project-specific now (e.g., `cname.vercel-dns-016.com`). The legacy values (`76.76.21.21` A record, `cname.vercel-dns.com` CNAME) still work but are deprecated.
4. [ ] After DNS propagates, update:
   - `NEXT_PUBLIC_SITE_URL` Vercel env var → `https://bruinalpha.com`.
   - Sanity CORS origins.
   - Sanity webhook URL.
   - Site Settings → Canonical URL in Studio.

---

## Verification checklist (final)

- [ ] [https://bai-website.vercel.app](https://bai-website.vercel.app) (or custom domain) returns 200 on `/`, `/about`, `/committees`, `/committees/wealth-management`, `/team`, `/projects`, `/events`, `/join`, `/training`.
- [ ] `/studio` loads, you can sign in, all 11 seeded documents are visible.
- [ ] Editing Site Settings → Slogan in Studio → public site reflects within ~5s (if step 6 done) or ~1h (without webhook).
- [ ] Open Graph card renders correctly when the URL is shared (test on LinkedIn or via [opengraph.xyz](https://www.opengraph.xyz/)).
- [ ] `bun run build` passes locally without warnings about placeholder project ID.
- [ ] `docs/HANDOFF.md` Accounts Inventory has real values in: Sanity Project ID, GitHub repo URL, Vercel project slug.

---

## Known gaps / follow-ups (not deploy-blockers)

1. **`/api/revalidate` route** not yet implemented — webhook in step 6 will 404 until then. ISR 1h window covers updates.
2. **Faculty advisor → free GitHub Team** — for required reviewers on private repo. Apply via [github.com/edu](https://github.com/edu/teachers) once a faculty sponsor is identified.
3. **Vercel for OSS application** — only if the club ever needs multi-officer deploy access and is willing to open-source the repo.
4. **UCLA SOLE registration** — needed before any official UCLA branding / campus directory listings.
5. **Domain purchase** — defer until launch is imminent; the `*.vercel.app` URL works fine for soft-launch and social media setup.

---

**Next step after this guide:** Update `docs/HANDOFF.md` Accounts Inventory with the real Project ID, repo URL, and Vercel slug. Then move to social setup ([LINKEDIN-SETUP.md](./launch/LINKEDIN-SETUP.md)).
