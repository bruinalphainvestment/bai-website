# Wave 0 Setup Checklist (Mack)

This checklist covers the manual external actions required to set up the Bruin Alpha Investment (BAI) website infrastructure. Completing these 6 sections (estimated 30–60 minutes of active work) ensures the website has a professional foundation that survives leadership transitions.

## Section A: Personal Email + Vault (10 mins)
This secures the root of all other accounts.

1. [ ] **Enable 2FA on Personal Email:** Ensure your personal email (the OAuth root) has 2FA enabled. Save the backup codes.
2. [ ] **Set Recovery Email:** Go to your personal email security settings and set `bruinalphainvestment26@gmail.com` as the primary recovery email.
3. [ ] **Create Password Vault:**
   - Go to [Bitwarden.com](https://bitwarden.com/) and sign up for a **Free Organization** (or use an existing password manager with sharing).
   - Name the organization: `Bruin Alpha Investment`.
   - Invite at least one other founding officer (e.g., Max or Sam) to the vault.
4. [ ] **Store Root Credentials:** Save the login details for the Club Gmail and all following services into this shared vault.

## Section B: GitHub Student Pack (5 mins + 24h wait)
This unlocks free Vercel Pro ($240/year value) for the club.

1. [ ] **Apply for Pack:** Go to [education.github.com/pack](https://education.github.com/pack).
2. [ ] **UCLA Verification:** Use your `[user]@ucla.edu` email to apply.
3. [ ] **Wait for Approval:** Approvals usually take ~24 hours. Once approved, you will receive an email from GitHub.
4. [ ] **Redeem Vercel Pro:** Once approved, go to [vercel.com/dashboard](https://vercel.com/dashboard), link your GitHub, and follow the prompt to redeem the GitHub Student Pack offer.

## Section C: Vercel Team (5 mins)
Crucial: Do NOT create the project under your personal namespace.

1. [ ] **Create Team:** Go to [vercel.com/teams/new](https://vercel.com/teams/new).
2. [ ] **Name:** Set the name to `Bruin Alpha Investment`.
3. [ ] **Invite Officers:** Invite at least one co-admin officer to the team.
4. [ ] **Verify Pro Tier:** Ensure the team is on the "Pro" plan (covered by your Student Pack).
5. [ ] **Update Handoff:** Copy the team slug (e.g., `bruin-alpha-investment`) into `docs/HANDOFF.md`.

## Section D: Sanity Project (10 mins)
This is the CMS where you will edit the website content.

1. [ ] **Sign Up:** Go to [sanity.io](https://www.sanity.io/) and sign up using your personal email (OAuth) or the club Gmail.
2. [ ] **Create Project:**
   - Name: `Bruin Alpha Investment`.
   - Dataset: `production` (Must be **PUBLIC** for the free tier).
3. [ ] **Invite Admins:** Go to the Project settings -> Members. Invite a co-admin officer with the **Administrator** role.
4. [ ] **Capture IDs:**
   - Copy the **Project ID** (a 10-character string).
   - Paste it into `docs/HANDOFF.md`.
   - Save it for the `.env.local` file later.

## Section E: GitHub Repository (5 mins)
1. [ ] **Create Org or Repo:** 
   - Preferred: Create a GitHub Organization named `bruin-alpha-investment`.
   - Create a **Private** repository named `bai-website`.
2. [ ] **Add Collaborators:** Add a co-admin officer as a Collaborator with **Admin** permissions.
3. [ ] **Update Handoff:** Copy the repo URL into `docs/HANDOFF.md`.

## Section F: Sanity Startup Program (5 mins)
Optional but highly recommended for extra features.

1. [ ] **Apply:** Go to [sanity.io/startups](https://www.sanity.io/startups).
2. [ ] **Details:** Use "Bruin Alpha Investment at UCLA" and mention your student org status.
3. [ ] **Proceed:** You do not need to wait for approval to start work; the free tier is sufficient for the initial build.

---

## Section G: Socials & UBS Directory (15 mins)
These guides unblock official club registration and directory listing.

1. [ ] **LinkedIn Page**: Follow [LINKEDIN-SETUP.md](./launch/LINKEDIN-SETUP.md) to create the official page.
2. [ ] **Instagram Account**: Follow [INSTAGRAM-SETUP.md](./launch/INSTAGRAM-SETUP.md) to set up the profile.
3. [ ] **UBS Directory**: Once the website, LinkedIn, and Instagram are live, follow [UBS-SUBMISSION.md](./launch/UBS-SUBMISSION.md) to submit the club to the official directory.

---

**Next Steps:**
Once these accounts are created and the IDs are recorded in `docs/HANDOFF.md`, the technical implementation (Wave 1A) can proceed with the standard foundation scaffold.
