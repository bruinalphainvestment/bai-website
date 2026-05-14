# Custom Domain Setup Procedure

This guide outlines the steps to purchase and configure a custom domain (e.g., `bruinalpha.com`) for the Bruin Alpha Investment (BAI) website.

## 1. Purchase the Domain

We recommend the following domain names in order of preference:
1. `bruinalpha.com`
2. `bruinalphainvestment.com`
3. `bruinalpha.org`

### Recommended Registrars
*   **Cloudflare Registrar**: Highly recommended. They provide domains at-cost (~$10/year for .com) with excellent security and DNS management.
*   **Porkbun**: A popular alternative with transparent pricing and a clean interface.

**Strategy**: If the budget allows, prepay for **5 years** immediately to avoid annual renewal anxiety and potential price hikes.

---

## 2. Stewardship & Recovery

Per the [HANDOFF.md](./HANDOFF.md) strategy, the domain should be registered using the current President's personal email (Mack Haymond) to leverage existing OAuth setups, but with the following strict mitigations:

1.  **Recovery Email**: Set to `bruinalphainvestment26@gmail.com`.
2.  **Shared Access**: Store the registrar login credentials and 2FA backup codes in the **Bitwarden Shared Vault**.
3.  **Inventory**: Immediately update the "Accounts Inventory" table in [HANDOFF.md](./HANDOFF.md) with the registrar name and renewal date.

---

## 3. DNS Configuration

Once purchased, point the domain to Vercel.

1.  **Vercel Nameservers (Recommended)**: Change the nameservers at your registrar to the ones provided by Vercel. This allows Vercel to handle SSL and DNS records automatically.
2.  **CNAME/A Records**: If you prefer to keep DNS at the registrar (e.g., Cloudflare), add these records:
    *   **A Record**: `@` → `76.76.21.21`
    *   **CNAME Record**: `www` → `cname.vercel-dns.com`

---

## 4. Vercel Project Settings

1.  Go to the [Vercel Dashboard](https://vercel.com).
2.  Select the `bruin-alpha-investment` project.
3.  Navigate to **Settings** → **Domains**.
4.  Click **Add**.
5.  Enter `bruinalpha.com`.
6.  Vercel will check your DNS. Once verified, it will automatically provision an SSL certificate (Let's Encrypt).

---

## 5. Sanity Configuration

The website needs to know its own URL for metadata and canonical links.

1.  Open the **Sanity Studio** (`/studio`).
2.  Navigate to **Site Settings**.
3.  Update the **Canonical URL** field to `https://bruinalpha.com`.
4.  Click **Publish**.

---

## 6. External Directory Updates

After the domain is live, update the links in the following locations:
*   **LinkedIn**: Update the "Website" field on the BAI page.
*   **Instagram**: Update the link in the bio.
*   **UBS Directory**: Ensure the club's entry in the Undergraduate Business Society directory points to the new domain.

---

## 7. Verification & Testing

Run these checks to ensure everything is working:

1.  **Status Check**: Run `curl -I https://bruinalpha.com`. It should return a `200 OK` status.
2.  **Redirects**: Verify that `http://bruinalpha.com` (non-SSL) and `https://www.bruinalpha.com` both redirect to `https://bruinalpha.com`.
3.  **Metadata**: Share the link on Slack or LinkedIn to verify the **Open Graph (OG) cards** display correctly with the new URL.
4.  **Sitemap**: Visit `https://bruinalpha.com/sitemap.xml` to ensure it reflects the new domain.

---

## 8. Financial Prep

*   Add the **Renewal Date** to the club's shared Google Calendar.
*   Ensure the payment method on file at the registrar is either a club-issued card or a reliable personal card with a reminder to reimburse.
