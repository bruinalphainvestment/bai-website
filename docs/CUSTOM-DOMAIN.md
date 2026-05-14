# Custom Domain — Reference

The club domain `bruinalphainvestment.com` is **live** as of 2026-05-14, registered at Cloudflare Registrar, pointing at Vercel. This doc captures the canonical configuration + the playbook for future renewals/transfers.

## Live Configuration

- **Domain:** `bruinalphainvestment.com` (registered 2026-05-14, expires 2027-05-14)
- **Canonical URL:** `https://www.bruinalphainvestment.com` — apex `bruinalphainvestment.com` 301-redirects to `www`.
- **Registrar:** [Cloudflare Registrar](https://dash.cloudflare.com/) (at-cost, ~$10/yr)
- **Nameservers:** `bradley.ns.cloudflare.com`, `khloe.ns.cloudflare.com` (Cloudflare default)
- **DNS:** Managed at Cloudflare, pointing at Vercel
  - `www` CNAME → `b49552747d4d03fe.vercel-dns-017.com` (Vercel's project-specific dynamic CNAME)
  - apex `@` A records → Vercel anycast IPs
- **SSL:** Automatic, provisioned + renewed by Vercel (Let's Encrypt)

## How It Was Wired Up

### 1. Purchase
Registered `bruinalphainvestment.com` at Cloudflare Registrar (Mack's personal Cloudflare account). The original docs floated `bruinalpha.com` as the preferred name, but `bruinalphainvestment.com` was chosen because it matches the GitHub org (`bruinalphainvestment`) and is unambiguous to anyone Googling the club.

> **Stewardship:** Recovery email set to `bruinalphainvestment26@gmail.com`. Registrar login + 2FA backup codes stored in Bitwarden vault. Recorded in [HANDOFF.md](./HANDOFF.md) Accounts Inventory.

> **Renewal:** Auto-renew on. Cloudflare bills the card on file in May 2027. Calendar reminder in club Gmail set for **April 2027** to verify funding.

### 2. DNS
The previous setup floated either "use Vercel nameservers" or "keep DNS at registrar." We kept DNS at Cloudflare so we can use Cloudflare's other features (analytics, page rules) if needed later. Vercel's dashboard generates **project-specific dynamic CNAMEs** (e.g. `cname.vercel-dns-017.com`) — always copy what Vercel shows for this project rather than hardcoding legacy values (`cname.vercel-dns.com` / `76.76.21.21`).

### 3. Vercel Project Settings
1. Vercel Dashboard → `bai-website` project → **Settings → Domains**.
2. Added both `bruinalphainvestment.com` (apex) and `www.bruinalphainvestment.com`.
3. Vercel configured the apex as redirect target → www; `www` serves the app directly.
4. SSL certificate provisioned automatically on verification.

### 4. Sanity Configuration
- **CORS origins:** Both `https://www.bruinalphainvestment.com` and `https://bruinalphainvestment.com` added with `allowCredentials: true` (Studio Presentation tool previews require this).
- **Site Settings (Studio):** `canonicalUrl` field, if added later to the `siteSettings` schema, should be `https://www.bruinalphainvestment.com`. Currently the canonical comes from the `NEXT_PUBLIC_SITE_URL` env var.

### 5. Vercel Environment Variable
`NEXT_PUBLIC_SITE_URL` set to `https://www.bruinalphainvestment.com` on the **Production** target. Used by Next.js for canonical tags, sitemap URLs, OG card metadata.

### 6. External Directory Updates
- **LinkedIn page Website field:** [LINKEDIN-SETUP.md](./launch/LINKEDIN-SETUP.md) → use `https://www.bruinalphainvestment.com`.
- **Instagram bio link:** [INSTAGRAM-SETUP.md](./launch/INSTAGRAM-SETUP.md).
- **UBS directory:** [UBS-SUBMISSION.md](./launch/UBS-SUBMISSION.md).

## Verification

```bash
# All should return 200 with valid SSL
curl -I https://www.bruinalphainvestment.com/
curl -I https://www.bruinalphainvestment.com/sitemap.xml

# Should return 301 redirect to www
curl -I https://bruinalphainvestment.com/

# OG cards: https://www.opengraph.xyz/url/https%3A%2F%2Fwww.bruinalphainvestment.com
```

## Future Changes

### To migrate the domain to a new registrar
1. Unlock the domain at Cloudflare → request transfer code.
2. Initiate transfer at new registrar with the code.
3. After 5–7 day ICANN window, update HANDOFF.md Domain Registrar row.

### To change the canonical URL (e.g. drop the `www`)
1. In Vercel → Settings → Domains, swap which domain is the redirect target.
2. Update `NEXT_PUBLIC_SITE_URL` env var.
3. Update Sanity CORS origins.
4. Trigger a redeploy so Next.js sitemap/canonical tags rebuild.

### Renewal Lapse Recovery
If Cloudflare auto-renew fails:
1. Cloudflare keeps the domain in grace period for 30 days post-expiry.
2. After grace, ICANN redemption period (~30 more days) with high recovery fee.
3. After ~75 days total, the domain re-enters the public pool and can be claimed by anyone — this would be catastrophic. Ensure the calendar reminder + multiple officers have access to the Cloudflare account.
