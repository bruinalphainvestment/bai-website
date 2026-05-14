# Editing the BAI Website — a beginner's guide

This guide is for the **incoming President** (or any officer Mack hands website editing duties to). You do **not** need to be a developer to use it. If you can edit a Google Doc, you can edit this site.

The website you're editing lives at `bruinalpha.com` (or whatever domain we end up using — check [HANDOFF.md](HANDOFF.md) for the current domain).

---

## 1. First-Time Login Walkthrough
Before you can edit, you need access to the Sanity project.

1. **Get Invited:** Mack (or the current admin) must invite you at [sanity.io/manage](https://www.sanity.io/manage). You'll receive an email invite.
2. **Navigate to the Studio:** Go to `bruinalpha.com/studio`.
3. **Login:** Click the **Login** button.
4. **Choose Provider:** Sign in with your Google account (if that's the email Mack invited) or use the personal Sanity invite link.
5. **Dashboard:** Once logged in, you'll see the dashboard sidebar on the left.

<!-- TODO: screenshot of the Studio login page with "Login" button highlighted -->

---

## 2. What is "the Studio"? Where do I find it?
The **Studio** is the editing dashboard for the website. Think of it like the back office of a Squarespace site — you log in, change things, click "Publish," and the live site updates.

- **URL:** `https://bruinalpha.com/studio`
- **What it looks like:** A dark sidebar on the left with categories like *Site Settings*, *Home Page*, *Founding Members*, *Committees*. The big area on the right is where you edit fields.

<!-- TODO: screenshot of the main Studio dashboard with the sidebar visible -->

---

## 3. Editing the home page sections
The home page is built from **stackable sections** (Hero, Mission, Stats, Values, Committees Teaser, Founding Team, Marquee, and Call-to-Action). You can re-order, hide, or update the content inside each section.

**To edit a section:**
1. In the Studio sidebar, click **Home Page**.
2. You'll see a list called **Sections**. Each item in the list is one section of the page.
3. Click any section to open its fields (headline, body text, button label, etc.).
4. Make your changes.
5. Click the **Publish** button (bottom right) to push it live.

<!-- TODO: screenshot of the Home Page editor showing the list of Sections -->

> **Tip:** You can drag-and-drop the sections to re-order them. The order in the Studio matches the order visitors see on the page.

---

## 4. Adding / editing a founding member
The **Founding Team** section pulls from a list called *Founding Members* in the Studio.

**To add a member:**
1. In the sidebar, click **Founding Members**.
2. Click the **+** button at the top of the list.
3. Fill in the fields (Name, Role, Committee, Bio, LinkedIn).
4. **Photo Release:** Ensure the "Photo Release Obtained" box is checked if you're uploading a headshot.
5. Click **Publish**.

<!-- TODO: screenshot of the Founding Member creation form -->

---

## 5. Common Edits (Mini-FAQ)

**How do I change the site slogan or mission statement?**
Go to **Site Settings** in the sidebar. You'll find fields for the slogan, mission, and the legal disclaimer.

**How do I update the "Join Us" application URL?**
Go to **Site Settings** and find the **Application URL (Tally)** field. Paste your new link there and hit Publish.

**How do I add a new committee?**
Go to **Committees** in the sidebar and click the **+** button. Fill in the committee name, director, and description.

**How do I update a member's headshot?**
Find the member under **Founding Members**, click their name, and upload a new image in the **Headshot** field. Remember to check the "Photo Release" box.

<!-- TODO: screenshot of the Site Settings panel showing where the Slogan and Application URL are -->

---

## 6. What I CANNOT change without a developer

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
