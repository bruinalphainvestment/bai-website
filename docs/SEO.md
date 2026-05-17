# SEO Setup & Launch Checklist

How the site is wired for Google search visibility, plus what you still need to
do manually before / shortly after launch.

---

## Architecture overview

| Layer | What it does | File(s) |
| --- | --- | --- |
| Per-page `<title>`, `<meta description>`, canonical, OG, Twitter | Built from the Sanity `seo` object on each document, with `siteSettings` defaults as fallback | `app/_components/seo.ts` (`buildPageMetadata`) |
| Root `<title>` + site-wide defaults | From `siteSettings.brandName / titleSuffix / defaultMetaDescription / defaultOgImage` | `app/layout.tsx` |
| Organization + WebSite JSON-LD | Emitted on every page. Org is typed as `Organization + EducationalOrganization` with `parentOrganization` pointing to UCLA | `app/layout.tsx` |
| BreadcrumbList JSON-LD | Emitted on `/committees/[slug]` | `app/(site)/committees/[slug]/page.tsx` |
| sitemap.xml | Dynamic, queries Sanity for each singleton page's `_updatedAt` + every committee. Routed via `app/sitemap.ts` | `app/sitemap.ts` + `sanity/lib/queries.ts` (`sitemapPagesQuery`, `sitemapCommitteesQuery`) |
| robots.txt | Allows `/`, blocks `/studio`, `/api/preview`, `/api/revalidate`, links to sitemap | `app/robots.ts` |
| Studio + API noindex | Hard `X-Robots-Tag: noindex, nofollow` header for `/studio/*` and `/api/*` | `middleware.ts` |
| OG image (default) | Dynamic 1200×630 generated from Sanity brand/slogan | `app/opengraph-image.tsx` |
| GSC verification meta | Injected only when `NEXT_PUBLIC_GSC_VERIFICATION` is set | `app/layout.tsx` |
| GA4 | Injected only when `NEXT_PUBLIC_GA_ID` is set (uses `next/script` with `afterInteractive`) | `app/layout.tsx` |

### SEO fields per content type

| Sanity doc type | `seo` field | Used by |
| --- | --- | --- |
| `siteSettings` | n/a (provides defaults: `defaultMetaDescription`, `defaultOgImage`, `organizationDescription`, `sameAs`) | All pages + JSON-LD |
| `homePage`, `aboutPage`, `committeesIndexPage`, `eventsPage`, `joinPage`, `projectsPage`, `teamPage`, `trainingPage` | ✅ `seo.title`, `seo.description`, `seo.ogImage` | The corresponding route |
| `committee` | ✅ `seo.title`, `seo.description`, `seo.ogImage` | `/committees/[slug]` |
| `event`, `project`, `foundingMember` | ❌ (no individual detail pages yet) | n/a |

### Fallback chain (for any page)

1. `pageDoc.seo.title` → `pageDoc.seo.description` → `pageDoc.seo.ogImage`
2. else `siteSettings.defaultMetaDescription` / `siteSettings.defaultOgImage`
3. else hardcoded in `buildPageMetadata` (`brandName`, etc.)

---

## Required env vars (production)

Set these in Vercel → Project → Settings → Environment Variables (Production):

```
NEXT_PUBLIC_SITE_URL=https://bruinalphainvestment.com
NEXT_PUBLIC_USE_SANITY=true
NEXT_PUBLIC_GSC_VERIFICATION=<token-from-google-search-console>  # optional but recommended
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX                                    # optional, GA4 measurement ID
```

`NEXT_PUBLIC_SITE_URL` MUST be the production https URL with no trailing
slash. Every canonical, sitemap entry, OG URL, and JSON-LD `@id` derives
from it. Wrong value → everything Google sees is wrong.

`NEXT_PUBLIC_USE_SANITY=true` is what tells the page loaders to actually
fetch from Sanity instead of using hardcoded fallbacks. Without it, search
engines will index the fallback copy in `app/_components/fallbacks/*.ts`,
not the SEO copy you've written in the CMS.

---

## Launch checklist

### Before going live

- [x] Set `NEXT_PUBLIC_SITE_URL=https://www.bruinalphainvestment.com` in Vercel
- [x] Set `NEXT_PUBLIC_USE_SANITY=true` in Vercel
- [x] Deploy. `https://www.bruinalphainvestment.com/sitemap.xml` lists
      all expected URLs with the production domain.
- [x] `https://www.bruinalphainvestment.com/robots.txt` references the
      production sitemap URL.
- [x] `<title>` on `/` matches Sanity copy (not the fallback).
- [x] `siteSettings.defaultOgImage` uploaded — composited BAI full logo on
      navy 1200×630 canvas (Sanity asset
      `image-28bea2a14774a0e6c2a9ad546388880e937c41bc-1200x630-png`).
- [ ] Open Sanity Studio → Site Settings → Contact & Social — populate
      `instagramUrl`, `linkedinUrl`, and any other social profiles. These
      flow into the Organization JSON-LD `sameAs[]` (Knowledge Graph signal).
- [ ] Replace the `applyUrl` placeholder (`https://tally.so/r/placeholder`)
      with the real Tally form URL.

### Google Search Console (DNS-verified, do these next)

Domain property verified via DNS — that grants access to all subdomains
(www + apex) and protocols at once, which is ideal. Now finish the setup:

1. **Submit sitemap** — Sitemaps → enter `sitemap.xml` (just the path) →
   Submit. Status should show "Success" within a minute. This is the
   biggest accelerator for first-time indexing.
2. **Request indexing for key pages** — Use the URL Inspection tool at
   the top: paste each URL → "Request Indexing" pushes it into Google's
   priority crawl queue. Do this for at minimum:
   `https://www.bruinalphainvestment.com/`,
   `https://www.bruinalphainvestment.com/about`,
   `https://www.bruinalphainvestment.com/join`,
   `https://www.bruinalphainvestment.com/committees`. Limit: ~10 requests
   per day per property.
3. **Confirm preferred host** — GSC no longer has a manual "preferred
   domain" setting; it auto-detects via canonical tags. Our canonicals
   all point to `https://www.bruinalphainvestment.com`, so Google will
   index that variant. Verify on day 2-3 by inspecting any URL and
   checking "User-declared canonical" matches what you expect.
4. **Watch for issues** after 2-3 days:
   - **Pages** report → look at "Not indexed" reasons. Common false
     positives early on: "Discovered – currently not indexed" (Google
     just hasn't gotten to it yet, fine to wait), "Crawled – currently
     not indexed" (also fine early on).
   - **Experience → Core Web Vitals** populates from real Chrome user
     data once you have traffic. Will say "Not enough data" until then.
   - **Enhancements** section will eventually show validation reports
     for the BreadcrumbList JSON-LD we emit on `/committees/[slug]`.
5. **Performance report** — shows queries/clicks/impressions. Empty
   until you're indexed and people start finding you. Check weekly.

> The `NEXT_PUBLIC_GSC_VERIFICATION` env var is **not needed** when using
> DNS verification — that meta tag method is only for URL prefix
> verification.

### Google Analytics 4

1. https://analytics.google.com → Admin → Create Property → Web stream
   pointed at `https://www.bruinalphainvestment.com`.
2. Copy the measurement ID (`G-XXXXXXXXXX`).
3. Add the env var to Vercel:
   ```bash
   echo "G-XXXXXXXXXX" | vercel env add NEXT_PUBLIC_GA_ID production
   ```
4. Redeploy (`vercel --prod --yes` or push any commit). The script is
   already wired in `app/layout.tsx` and only loads when this var is set.
5. Open the site in a private window, navigate around, then check GA4
   → Reports → Realtime → users in last 30 min. Should show 1.

### Post-launch verification tools

- **Rich results test** — paste any URL into
  https://search.google.com/test/rich-results to validate the
  Organization, WebSite, and BreadcrumbList JSON-LD.
- **OpenGraph** — paste any URL into the Facebook Sharing Debugger
  (https://developers.facebook.com/tools/debug/) and the LinkedIn Post
  Inspector (https://www.linkedin.com/post-inspector/) to confirm OG
  rendering. First fetch is slow; second fetch shows the cached card.
- **Lighthouse** — already configured at `lighthouserc.json`. Run
  `bun run test:lh` after deploy to get an SEO score per page.

---

## Updating SEO copy

### Quick edit (one or two pages)

Open Sanity Studio → the page you want → SEO group → edit Meta Title and
Meta Description. Save and publish. Vercel auto-revalidates on Sanity
webhook (or run `/api/revalidate` manually).

### Bulk update (changing several at once)

Edit the copy in `sanity/seed/seed-seo.ts` and re-run:

```bash
bun run --bun sanity/seed/seed-seo.ts
```

Requires `SANITY_API_WRITE_TOKEN` (Editor scope) in `.env.local`. The script
is idempotent — running it again just overwrites with the latest copy in
the source file. Safe to re-run any time.

### Adding SEO to a new content type

If you add a new singleton page or routable document:

1. Add `defineField({ name: 'seo', type: 'seo', ... })` to the schema.
2. Add `seo,` to the GROQ query that loads it.
3. Add `_updatedAt,` to the same query (so the sitemap picks up its
   timestamp).
4. Run `bun run typegen` to regenerate types.
5. In the page component, call `buildPageMetadata({ path, seo, settings,
   fallbackTitle })` from `@/app/_components/seo`.
6. If it's a new singleton page, add it to `PAGE_TYPE_TO_PATH` in
   `app/sitemap.ts` and to `sitemapPagesQuery` in
   `sanity/lib/queries.ts`.

---

## What we deliberately did NOT do (yet)

- **Event detail pages (`/events/[slug]`)** — event documents have no slug
  field. Events currently render as cards on `/events` only. If you want
  individual event URLs (with Event schema.org markup for the Knowledge
  Graph), add a `slug` field to the event schema and create the route.
- **Project detail pages (`/projects/[slug]`)** — projects have slugs but
  no detail route. Same situation as events.
- **Founding member detail pages (`/team/[slug]`)** — useful for Person
  schema and getting individual members surfaced in Google searches for
  their name, but no slug field exists yet.
- **Image alt text on `imageCalloutSection` and `foundingMember.headshot`**
  — accessibility + image SEO gap. Add `alt` field to those object types.
- **Extended `seo` object fields** — current object only has title,
  description, ogImage. Could add `noIndex`, `canonicalUrl` override,
  `keywords`, `twitterCardType` for per-page overrides.
- **`SearchAction` in WebSite JSON-LD** — only useful if the site has an
  on-page search box, which it doesn't.
