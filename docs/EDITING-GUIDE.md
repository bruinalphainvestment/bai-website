# Editing the BAI Website — a beginner's guide

This guide is for the **incoming President** (or any officer Mack hands website editing duties to). You do **not** need to be a developer to use it. If you can edit a Google Doc, you can edit this site.

The website you're editing lives at `bruinalpha.com` (or whatever domain we end up using — check [HANDOFF.md](HANDOFF.md) for the current domain).

---

## 1. What is "the Studio"? Where do I find it?

The **Studio** is the editing dashboard for the website. Think of it like the back office of a Squarespace site — you log in, change things, click "Publish," and the live site updates.

- **URL:** `https://bruinalpha.com/studio` (or `http://localhost:3000/studio` if you're running the site locally on your computer for testing).
- **How to log in:**
  1. Open the URL above in any web browser.
  2. Click **"Log in with Google"** (or whichever provider Mack set up).
  3. Use the email Mack added you to. If you don't have access, message Mack — he needs to invite you on [sanity.io/manage](https://www.sanity.io/manage).
- **What it looks like:** a dark sidebar on the left with categories like *Site Settings*, *Home Page*, *Founding Members*, *Committees*. The big area on the right is where you edit fields.

<!-- TODO(Task 48): screenshot of Studio login screen -->
<!-- TODO(Task 48): screenshot of Studio dashboard with sidebar visible -->

---

## 2. Editing the home page sections

The home page is built from **eight stackable sections** (Hero, Mission, Stats, Values, Committees Teaser, Founding Team, Marquee, and Call-to-Action). You can re-order, hide, or update the content inside each section.

**To edit a section:**

1. In the Studio sidebar, click **Home Page**.
2. You'll see a list called **Sections**. Each item in the list is one section of the page.
3. Click any section to open its fields (headline, body text, button label, etc.).
4. Make your changes.
5. Click the **Publish** button (top right) to push it live.

> **Tip:** You can drag-and-drop the sections to re-order them. The order in the Studio matches the order visitors see on the page.

> **Warning:** if a section field looks empty in the Studio, the website will fall back to a hardcoded default. That's intentional — it means the site never looks broken even before you've filled in everything.

<!-- TODO(Task 48): screenshot of Home Page → Sections list -->

---

## 3. Adding / editing a founding member

The **Founding Team** section pulls from a list called *Founding Members* in the Studio.

**To add a member:**

1. In the sidebar, click **Founding Members**.
2. Click the **+** button at the top of the list (or "Create new").
3. Fill in:
   - **First Name** and **Last Name**
   - **Role** (e.g. "Treasurer", "Trading Co-Director")
   - **Committee** — pick from the dropdown (Wealth Management, Trading, etc.)
   - **Graduation Year**
   - **Bio** (optional — a short paragraph)
   - **LinkedIn URL** (optional)
   - **Photo Release Obtained** — ⚠️ **read the next paragraph carefully**
   - **Headshot** (optional)
   - **Monogram Override** (optional) — by default we use the person's initials (e.g. "MH"). You can override if you want different letters.
4. Click **Publish**.

> ⚠️ **Photo Release rule (read this!):** the **Photo Release Obtained** checkbox is a hard gate. The headshot photo **will not appear** on the public website unless this box is checked. This protects the club from privacy / image-rights complaints. **Only check the box if the member has signed (or verbally confirmed in writing — Slack DM is fine) that they're OK with their face on the public site.** If the box is unchecked, we fall back to a gold-on-navy monogram tile, which looks great anyway.

**To edit an existing member:** click their name in the list, change fields, hit Publish.

**To remove a member:** open them, click the three-dot menu (top right), → "Delete." Deletion is permanent — they disappear from the live site within ~1 hour (or instantly if you have webhook revalidation set up).

<!-- TODO(Task 48): screenshot of a Founding Member edit form -->

---

## 4. Changing the application URL

We use [Tally.so](https://tally.so/) for recruitment forms. When you change the application form (new quarter, new questions), you don't need to update every page on the site — you just update **one field** in the Studio.

1. Sidebar → **Site Settings**.
2. Find the field labeled **Application URL (Tally)**.
3. Paste the new Tally form URL (it should start with `https://tally.so/r/...`).
4. Click **Publish**.

Every "Apply Now" / "Join Us" button on the entire site will now point to the new URL within ~1 hour.

---

## 5. What I CANNOT change without a developer

The Studio lets you edit **text, links, images, and the order of sections**. It does **not** let you change:

- **Colors** (navy, gold, cream) — these are baked into the design system. Changing one color in one place would break visual consistency, so we lock them.
- **Fonts** (Fraunces, Inter, Geist Mono) — locked for the same reason.
- **Layout / spacing** — section widths, padding, mobile breakpoints all live in code.
- **Animations** — scroll effects, hover states, etc. are coded; they're not "settings."
- **Adding a whole new section type** (e.g. "Press Mentions") — this requires a new schema + a new React component.
- **The site-wide disclaimer footer** — locked text approved by club leadership for legal/compliance reasons. **Do not edit it.**

If you need any of these, message the current developer (or DM Mack — see [HANDOFF.md](HANDOFF.md) for contacts). They're usually one-day fixes.

---

## 6. What if I publish a typo by accident?

Don't panic. Every change in the Studio is **versioned** — you can roll back to any previous version of any document.

1. Open the document you broke (e.g. a Home Page section).
2. Look for the **clock icon** (history) near the top right of the editor — sometimes labeled "History" or "Revisions."
3. Click it. You'll see a list of every previous version with timestamps.
4. Pick the one you want, click **"Restore"** (or copy the old text and paste it back).
5. Click **Publish** to confirm.

You can also see a side-by-side diff to compare versions.

> The Studio also auto-saves drafts. If you make changes but don't click Publish, the live site shows the previous published version — drafts are private to you.

---

## 7. Who do I ask for help?

| Question | Who to ask |
| :--- | :--- |
| "I can't log in to the Studio." | Current website owner (see [HANDOFF.md](HANDOFF.md)) — they invite you on `sanity.io/manage`. |
| "I deleted something by mistake and the History button doesn't show enough versions." | Same person — they can restore from a backup. |
| "I want to add a new kind of section / page / feature." | Current developer or Mack. |
| "The site is down / showing a weird error." | Current website owner — they check Vercel and Sanity status. |
| "Where's the password for the club Gmail / shared vault?" | [HANDOFF.md](HANDOFF.md), then the Bitwarden shared vault. |

When in doubt, **don't guess — ask first**. Edits in the Studio are versioned and recoverable, but a confused officer publishing something incorrect (e.g. an embarrassing typo on the front page) is annoying to roll back during a recruitment week.

---

## Where this guide lives

This file is `docs/EDITING-GUIDE.md` in the project repository. To update it, edit the markdown directly. (The current developer can show you how, or you can edit it on GitHub through the web UI.)

Related reading:
- [HANDOFF.md](HANDOFF.md) — leadership transition + account stewardship
- [CUSTOM-DOMAIN.md](CUSTOM-DOMAIN.md) — how to set up the official URL
- [SETUP-CHECKLIST.md](SETUP-CHECKLIST.md) — what Mack had to do to bootstrap everything (mostly one-time)
