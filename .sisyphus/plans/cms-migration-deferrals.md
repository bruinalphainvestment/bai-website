# cms-migration — Deferrals

Tasks intentionally deferred during execution. Each entry records the plan reference,
the rationale, and the path forward.

---

## T5.3 — `app/icon.tsx` stays hardcoded with "BAI"

**Status:** DEFERRED (per plan §5 — "DEFERRED per D-out-of-scope but flag here")

**Plan reference:** `.sisyphus/plans/cms-migration.md` lines 717-718 (Phase 5)

**Decision rationale:**
- `app/icon.tsx` renders the favicon programmatically with a literal `"BAI"`
  monogram. Phase 5 explicitly carries this out of scope.
- siteSettings does not currently expose a `monogram` or `iconText` field, so
  the change would be a schema extension + studio UI + fallback wiring + edge
  refactor — meaningful surface for an out-of-scope nicety.
- Cutover does not require this: the existing icon ships from main today and
  remains byte-identical post-cutover.

**Path forward (post-Phase 6 or follow-up ticket):**
1. Add `siteSettings.iconText` (`string`, length 1–4, initialValue `'BAI'`).
2. Regenerate types (`bun run typegen`).
3. Update `app/icon.tsx` to fetch siteSettings + read `iconText` (matching the
   T4.1 / T5.1 fetch-with-fallback pattern). Note: `app/icon.tsx` is treated as
   a route by Next, so `sanityFetch` is available the same way the OG image
   route uses it.
4. Verify the favicon byte-diff against current cache-busted version before
   cutover.

---
