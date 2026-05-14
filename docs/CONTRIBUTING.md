# Contributing to the BAI Website

This guide is for developers and technical officers looking to maintain or expand the Bruin Alpha Investment (BAI) website.

## Project Structure Overview
The codebase is a modern Next.js 15 application using the App Router and Sanity CMS.

- `app/`: Next.js application routes and components.
- `sanity/`: Sanity CMS schemas, config, and Studio mount point.
- `public/brand/`: Official logos and brand assets.
- `docs/`: Technical documentation and handoff guides.
- `tests/`: Playwright E2E and Lighthouse performance tests.

## Branch Naming Convention
Use descriptive prefixes for your branches:
- `feat/`: New features or sections (e.g., `feat/add-blog`)
- `fix/`: Bug fixes (e.g., `fix/mobile-menu-overflow`)
- `chore/`: Maintenance, dependency updates (e.g., `chore/update-sanity`)
- `docs/`: Documentation updates (e.g., `docs/update-contributing`)

## Commit Conventions
We follow **Conventional Commits** for a clean history:
- `feat(scope): ...`: A new feature for a specific part of the site.
- `fix(scope): ...`: A bug fix.
- `chore: ...`: General maintenance.
- `docs: ...`: Documentation-only changes.

Example: `feat(home): add marquee section for partner logos`

## Development Workflow
1. **Branch:** Create a new branch from `main`.
2. **Work:** Implement changes using `bun run dev` to preview.
3. **Pre-commit Checklist:**
   - Run `bunx tsc --noEmit` to check for type errors.
   - Run `bunx eslint .` to check for linting issues.
   - Run `bun run build` to ensure the project compiles successfully.
4. **PR:** Open a Pull Request on GitHub.
5. **CI:** GitHub Actions will run tests and build checks.
6. **Review:** Get approval from Mack or the current tech lead.
7. **Merge:** Once approved and CI passes, merge to `main`.
8. **Deploy:** Merges to `main` auto-deploy to Vercel production.

## Rules & Conventions

### Animation Rules
All animations must follow the established performance and easing standards. Refer to [ANIMATION-CONVENTIONS.md](ANIMATION-CONVENTIONS.md) for details on GSAP, Lenis, and Framer Motion usage.

### No Design Tokens in Sanity
Sanity is for **content only** (text, images, URLs, member rosters). Visual design (colors, spacing, fonts, button styles) must be managed in the codebase using Tailwind CSS to maintain brand consistency.

### Naming Compliance
Always use the compliant club name: **Bruin Alpha Investment** or **BAI**.
**NEVER** use the non-compliant form "UCLA Bruin Alpha Investment".

### Forbidden Language
Avoid corporate jargon and AI-sounding filler. Keep copy punchy, professional, and prestige-focused. See the notepad reference in `.sisyphus/notepads/bai-website/learnings.md` for specific forbidden phrases.

## Getting Help
If you're stuck or need account access, refer to [HANDOFF.md](HANDOFF.md) for current officer contacts and administrative procedures.
