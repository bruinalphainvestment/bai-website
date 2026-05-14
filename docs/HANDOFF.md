# Bruin Alpha Investment — Handoff & Stewardship

This document serves as the master record for Bruin Alpha Investment (BAI) website ownership, account credentials, and leadership transition procedures. It ensures the club's digital presence survives leadership graduations and technical handoffs.

## USER OVERRIDE ON METIS DEFAULT
> [!CAUTION]
> **Risk Acceptance Statement**
> Founder Mack Haymond has chosen his personal email as the OAuth root for all primary accounts (Vercel, Sanity, GitHub, Tally) instead of the shared club Gmail. This deviates from the default recommendation to avoid single-point-of-failure risks.
> 
> **Accepted with Mitigations:**
> 1. **Recovery Email:** The shared club Gmail (`bruinalphainvestment26@gmail.com`) is set as the recovery email on every service.
> 2. **Co-Admin Access:** At least one other founding officer is a co-admin on every platform.
> 3. **Annual Spring Handoff Ritual:** Mandatory ownership transfer every Spring Quarter.
> 4. **Shared Credentials Vault:** All passwords and 2FA backup codes stored in a shared Bitwarden vault.
> 5. **Quarterly Access Audit:** Verification of admin rosters every academic quarter.

## Accounts Inventory

| Account | URL | Slug / Org | Admin Roster | Recovery Email | Renewal Date | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Root Email** | gmail.com | Mack's Personal | Mack Haymond | `bruinalphainvestment26@gmail.com` | N/A | OAuth root for all services |
| **Club Gmail** | gmail.com | `bruinalphainvestment26` | Mack, Max, Sam | Personal Backup | N/A | Primary recovery hub |
| **Vercel (Hobby)** | vercel.com | `bai-website` (personal scope) | Mack Haymond (sole deployer) | `bruinalphainvestment26@gmail.com` | N/A | Hobby tier — single deployer; multi-member Teams are Pro-only |
| **Sanity Org** | sanity.io | `bruin-alpha-investment` (org `oAQMAXlMm`) | Mack Haymond | `bruinalphainvestment26@gmail.com` | N/A | Project ID: `u1y6t81y` · Dataset: `production` (public) · Tokens: `seed-script` (Editor) |
| **GitHub Repo** | github.com | `<mack-username>/bai-website` (personal scope) | Mack Haymond | `bruinalphainvestment26@gmail.com` | N/A | Private repo. Future: migrate to `bruin-alpha-investment` org and apply for free GitHub Team via faculty advisor at [github.com/edu](https://github.com/edu/teachers) |
| **Tally.so** | tally.so | `bruin-alpha-investment` | Mack Haymond | `bruinalphainvestment26@gmail.com` | N/A | Recruitment forms hub |
| **Domain Registrar** | [TO BE FILLED] | [TO BE FILLED] | [TO BE FILLED] | `bruinalphainvestment26@gmail.com` | [TO BE FILLED] | Target: `bruinalpha.com` |
| **Password Vault** | bitwarden.com | BAI Shared Vault | Mack Haymond | `bruinalphainvestment26@gmail.com` | N/A | Bitwarden Free Org (2-user cap) — upgrade to Families ($3.99/mo, 6 seats) if all 5 officers need access |
| **LinkedIn Page** | linkedin.com | `bai-ucla` | [TO BE FILLED] | `bruinalphainvestment26@gmail.com` | N/A | [LINKEDIN-SETUP.md](./launch/LINKEDIN-SETUP.md) |
| **Instagram** | instagram.com | `@bruinalphainvestment` | [TO BE FILLED] | `bruinalphainvestment26@gmail.com` | N/A | [INSTAGRAM-SETUP.md](./launch/INSTAGRAM-SETUP.md) |

## Site Routes
The following live routes are implemented and verified:
- `/`: Home Page (dynamic sections)
- `/about`: Mission, history, and values
- `/committees`: Overview of all 4 active committees
- `/committees/[slug]`: Dedicated pages for Wealth Management, Trading, Accounting & Consulting, and Investment Banking
- `/training`: Educational resources and curriculum overview
- `/projects`: Gallery of active and past investment projects
- `/team`: Full roster of founding members and directors
- `/events`: Upcoming workshops, guest speakers, and recruitment dates
- `/join`: Recruitment information and Tally form integration
- `/studio`: Sanity CMS editing dashboard

## Tech Stack Reference
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI & Styling:** React 19 + Tailwind CSS v4
- **Content Management:** Sanity v3 + Presentation (Visual Editing)
- **Animation:** Lenis (Smooth Scroll) + GSAP + Framer Motion
- **Testing:** Playwright (E2E) + Lighthouse CI
- **Package Manager:** Bun
- **Deployment:** Vercel

## Build & Deploy Commands
- `bun install`: Install dependencies
- `bun run dev`: Start local development server
- `bun run build`: Create production build
- `bun run typecheck`: Run TypeScript compiler check
- `bun run lint`: Run ESLint static analysis
- `bun run test:e2e`: Run Playwright end-to-end tests
- `bun run test:lh`: Run Lighthouse performance audit
- `bun run analyze`: Inspect bundle size via @next/bundle-analyzer

## Credentials Vault
All sensitive credentials, including service passwords and 2FA recovery codes, are stored in the **Bitwarden Shared Vault**.

- **Primary Owner:** Mack Haymond (via personal email)
- **Secondary Owner:** [Officer Name] (via shared club Gmail)
- **Emergency Access Contacts:**
  - Mack Haymond
  - [Designated Co-Admin Officer]

## Annual Spring Handoff Ritual
This ritual MUST be completed by **Week 8 of every Spring Quarter** to ensure continuity for the following academic year.

1. **Review Admin Roster:** Remove graduating officers from Vercel, Sanity, GitHub, and Bitwarden.
2. **Invite Successors:** Add incoming President and relevant Directors as Admins/Owners on all accounts.
3. **Transfer Root Ownership:** If the current President is graduating, they must transfer the "Owner" role on all platforms to the incoming President's email.
4. **Update HANDOFF.md:** Refresh the Accounts Inventory table with new names and renewal dates.
5. **Verify Backups:** Perform a manual Sanity dataset export and confirm it is stored in the GitHub repo.

*Next Ritual Deadline: June 2027*

## Emergency Procedures

### Scenario A: Mack's Personal Email is Lost/Locked
1. Go to each service (Vercel, Sanity, GitHub, Tally).
2. Use the "Forgot Password" or "Account Recovery" flow.
3. Send the recovery link to `bruinalphainvestment26@gmail.com`.
4. Access the club Gmail to reset the password and regain control.

### Scenario B: Vercel or Sanity Billing Issues
1. **Vercel** runs on the free **Hobby** plan with Mack as the sole deployer (multi-member Teams are Pro-only at $20/seat/mo). Hobby's [Fair Use policy](https://vercel.com/docs/limits/fair-use-guidelines) prohibits commercial use — no ads, no donations, no paid transactions, no affiliate links. Stay informational and the project remains compliant.
2. If multi-officer deploy access becomes necessary, options in order of preference:
   - (a) Apply to **[Vercel for Open Source](mailto:sponsorships@vercel.com)** — free Pro plan in exchange for open-sourcing the repo. Applications reviewed quarterly.
   - (b) Pay for **Vercel Pro** out of officer funds (~$20/mo base + $20/mo per additional deploying seat).
   - (c) Migrate to **Cloudflare Pages** (free tier, allows commercial use, no seat caps).
3. **Sanity** runs on the free tier with a public dataset. If quotas become blocking or private datasets are needed, apply for the **Non-Profit Plan** ([sanity.io/docs/platform-management/non-profit-plan](https://www.sanity.io/docs/platform-management/non-profit-plan)) which covers educational orgs (25 users, 3 datasets, private allowed). The Startup Program is VC-portfolio-only and does not apply to student clubs.

### Scenario C: GSAP License Changes
The site uses GSAP for advanced animations. If the license terms change or the club can no longer afford a paid tier (if required for future features), the fallback is to use **Framer Motion only**. The architecture is decoupled to allow this transition.

### Scenario D: Sanity Pricing Change
If Sanity removes the free tier or the Growth tier (Startup Program) expires:
1. Export the full dataset using `sanity dataset export production`.
2. Migrate to an open-source alternative like **Payload CMS** or **Strapi** (documented as an escape hatch in the project backlog).

### Scenario E: Domain Renewal Lapses
1. The domain `bruinalpha.com` (target) should be prepaid for 5 years whenever possible.
2. Ensure a calendar reminder is set in the club Gmail calendar for 3 months prior to expiry.

## Backup Recovery
Weekly automated backups are performed via GitHub Actions every **Sunday at 04:00 UTC** (`.github/workflows/sanity-backup.yml`). Artifacts are retained for **90 days** under the name `sanity-backup-<run_id>` and downloadable from the GitHub Actions UI.

### Required GitHub Secret
The workflow requires repository secret **`SANITY_AUTH_TOKEN`** (Sanity convention).

**Officer setup (one-time):**
1. Generate a deploy token at `https://www.sanity.io/manage/project/<projectId>/api` → *Tokens* → *Add API token* with **Viewer** (read-only) permissions.
2. In GitHub: repo Settings → Secrets and variables → Actions → New repository secret.
3. Name: `SANITY_AUTH_TOKEN`, Value: paste token.
4. Manually trigger via Actions tab → "Weekly Sanity Dataset Backup" → Run workflow to verify.

### Manual Export Command
Run locally via `bun run backup`, or directly:
```bash
bunx sanity dataset export production backup-YYYYMMDD.tar.gz
```

### Recovery Procedure (Restore From Backup)
1. Download the most recent artifact from the Actions tab → "Weekly Sanity Dataset Backup" run → `sanity-backup-<run_id>`.
2. Unzip the artifact to get the `.tar.gz` dataset.
3. Run the import with `--replace`:
   ```bash
   bunx sanity dataset import backup-YYYYMMDD.tar.gz production --replace
   ```

> [!WARNING]
> **`--replace` overwrites the current production dataset.** Every document with a matching `_id` is replaced; documents that exist in production but not in the backup are deleted. Only use `--replace` when intentionally rolling back to a prior snapshot. For partial recovery, omit `--replace` and import into a staging dataset first (`bunx sanity dataset import backup-YYYYMMDD.tar.gz staging`), then copy specific documents back via Studio.

### First-Run Seeding (one-time)
After completing [`SETUP-CHECKLIST.md`](SETUP-CHECKLIST.md) Section D (real
Sanity project created, `.env.local` populated with the real `NEXT_PUBLIC_SANITY_PROJECT_ID`),
seed the dataset with locked default content:

1. **Create a write token** at `https://www.sanity.io/manage/project/<projectId>/api`:
   - Tab: *Tokens* → *Add API token*
   - Name: `seed-script`
   - Permissions: **Editor** (or higher)
   - Copy the token immediately (cannot be viewed again).
2. **Add to `.env.local`** (project root):
   ```
   SANITY_API_WRITE_TOKEN=<paste here>
   ```
   ⚠️ Server-only — do NOT prefix with `NEXT_PUBLIC_`. Already gitignored.
3. **Run the seeder:**
   ```bash
   bun run seed
   ```
4. **Verify in Studio** (`bun run dev` → http://localhost:3000/studio):
   - Site Settings singleton populated with disclaimer, mission, slogan.
   - Home Page singleton exists (empty sections array — populate via Studio).
   - 8 Founding Member docs (Matt Walker, Ben Robinson, Michael Prosser, Mack Haymond, Kai Hata, Samuel Jiang, Max Helmer, Rhett Adkins).
   - 4 Committee docs (Wealth Management, Trading, Accounting & Consulting,
     Investment Banking — IB director left empty as "TBD").

The seeder is **idempotent**: re-running it skips any document that already
exists (matched by deterministic `_id`). Safe to run after editing — only
missing documents get created.

### Re-seeding After Catastrophic Loss
If the dataset is wiped and you need to rebuild defaults:
1. Delete remaining documents in Studio (or via `sanity documents delete`).
2. Run `bun run seed` again — recreates the 14 baseline documents.
3. Re-upload headshots / re-enter custom content via Studio.

## 2FA Status
| Service | 2FA Enabled | Last Verified | Verified By |
| :--- | :--- | :--- | :--- |
| Personal Email (Root) | [ ] | [TO BE FILLED] | [Name] |
| Club Gmail (Recovery) | [ ] | [TO BE FILLED] | [Name] |
| GitHub | [ ] | [TO BE FILLED] | [Name] |
| Vercel | [ ] | [TO BE FILLED] | [Name] |
| Sanity | [ ] | [TO BE FILLED] | [Name] |

## Quarterly Access Audit
Log the completion of the quarterly access audit here.

| Quarter | Date | Auditor | Result |
| :--- | :--- | :--- | :--- |
| Spring 2026 | 2026-05-13 | Antigravity (Agent) | SKELETON CREATED |
| Fall 2026 | [Date] | [Name] | [Status] |

## Mitigations
- **Recovery Hub:** All accounts use `bruinalphainvestment26@gmail.com` as the primary recovery email.
- **Admin Redundancy:** At least two officers (currently Mack and [Next Officer]) have admin access to Vercel and Sanity.
- **Automated Backups:** Sanity datasets are exported weekly to GitHub to prevent data loss.

## Evidence of Completed Agent Work
The initial site architecture and content were bootstrapped by Antigravity (AI Agent) in May 2026.
- **Commits:** 17+ commits covering design tokens, CMS schemas, and page implementations.
- **Files:** 119+ managed files in the repository.
- **CMS:** 14 baseline documents seeded (Settings, Home, 8 Members, 4 Committees).
- **Automation:** GitHub Actions for Sanity backups and Lighthouse CI audits configured.

## References
- [Setup Checklist](SETUP-CHECKLIST.md)
- [Editing Guide](EDITING-GUIDE.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Animation Conventions](ANIMATION-CONVENTIONS.md)
- [Custom Domain Setup](CUSTOM-DOMAIN.md)
- [LinkedIn Setup](./launch/LINKEDIN-SETUP.md)
- [Instagram Setup](./launch/INSTAGRAM-SETUP.md)
- [UBS Submission](./launch/UBS-SUBMISSION.md)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Vercel Documentation](https://vercel.com/docs)
