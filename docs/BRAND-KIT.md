# BAI Brand Usage Guide

Bruin Alpha Investment brand kit. Canonical source: `~/Desktop/coding/projects/bai_logos/kit/`. Web subset synced into this repo at `public/brand/` (122-file kit pruned to 40 web-essential variants).

> **For Google Drive / vendor handoff**, share the full kit at `~/Desktop/coding/projects/bai_logos/kit/` plus this doc. The repo only carries what the website serves; the Drive copy is the full master archive (includes print masters, mono variants, gold-bg composites, etc.).

## Color Tokens

| Token | Hex | Use |
|---|---|---|
| `--brand-navy` | `#031E42` | Primary brand color, dark backgrounds, text on light bgs |
| `--brand-cream` | `#FAF7F2` | Knockout/inverted, text on dark bgs |
| `--brand-black` | `#000000` | Monochrome print, fax fallback |
| `--brand-gold-light` | `#E8D289` | Top stop of gold A gradient (light champagne) |
| `--brand-gold-mid` | `#B49340` | Mid stop |
| `--brand-gold-deep` | `#926F25` | Bottom stop of gold A (deep bronze) |
| `--brand-gold-flat` | `#B89346` | Flat gold for line/ticks |

```css
:root {
  --brand-navy: #031E42;
  --brand-cream: #FAF7F2;
  --brand-gold-light: #E8D289;
  --brand-gold-deep: #926F25;
}
```

## Variant Selection Matrix

| Background | Use this variant | File |
|---|---|---|
| White / light | `BAI_*` (navy currentColor) | `public/brand/logo/BAI_*.svg` |
| Navy / dark | `BAI_*_cream` knockout | `public/brand/logo/png/cream/` or set `color:#FAF7F2` on SVG |
| Gold accent | `BAI_*` (navy currentColor) | `public/brand/logo/BAI_*.svg` |
| Photo / busy | `BAI_*_cream` or `BAI_*_black` | depending on photo luminance |
| Print B&W | `BAI_*_black` | `public/brand/logo/png/black/` |
| Print foil/embossed | gold gradient preserved | use SVG, gold gradient survives |

## Compositions

| Composition | Aspect | When |
|---|---|---|
| `BAI_full` (vertical) | 1.6:1 wide | Default — homepage hero, deck title slides |
| `BAI_horizontal` | 4.3:1 wide | Email signatures, mobile headers, footers |
| `BAI_mark` (icon only) | 1.47:1 | App icons, social avatars, tight grids |
| `BAI_text` (wordmark only) | 5.3:1 | When mark is shown separately or unnecessary |
| `BAI_favicon` | 1:1 | Browser tab, OS dock, PWA install |

## Sizing

### Minimum sizes
- **Full logo:** 72 px tall
- **Horizontal lockup:** 80 px wide
- **Mark alone:** 48 px tall
- **Favicon (simplified):** 16 px square
- Below 24 px, switch to the favicon variant.

### Clearspace
Padding on every side of the lockup MUST be ≥ **1× the cap-height of the "B"** in the mark.
For the full logo, this is approximately 18% of total logo height. Do not crowd.

```
┌─────────────────────────┐  ← 1X padding
│       ┌─────┐           │
│  1X   │ B A │   1X      │  ← X = height of "B" in mark
│       │  I  │           │
│       └─────┘           │
│  BRUIN ALPHA            │
│  └ INVESTMENT ┘         │
│                         │
└─────────────────────────┘  ← 1X padding
```

## Recoloring SVGs via CSS

All logo SVGs use `fill="currentColor"` for the navy strokes. Recolor via CSS `color:`:

```html
<img src="/public/brand/logo/BAI_full.svg" alt="BAI"> <!-- inline use requires <object> or inline -->

<!-- Inline SVG (preferred): -->
<svg class="logo" ...> ... </svg>

<style>
.logo { color: var(--brand-navy); }
.logo--inverted { color: var(--brand-cream); }
.logo--mono-black { color: #000; }
</style>
```

The **gold gradient is preserved** as a `<linearGradient>` definition — it stays gold across all `color:` values. To recolor the gradient, override the stop colors:

```css
.logo--mono stop { stop-color: currentColor; }
```

## PNG Resolutions

Every color variant ships at three web sizes plus one print master:

| Composition | @1x | @2x | @3x | Print master |
|---|---|---|---|---|
| Full | 400 px | 800 px | 1200 px | 3000 px |
| Horizontal | 400 | 800 | 1600 | 3200 |
| Mark | 200 | 400 | 800 | 2000 |
| Text | 300 | 600 | 900 | 2400 |

PNG file naming: `BAI_{composition}_{color}@{1x|2x|3x}.png` in `public/brand/logo/png/{color}/`.

`_print.png` masters live in `(not in repo — see canonical kit)`.

## Favicon Integration

Drop this in `<head>`:

```html
<link rel="icon" href="/favicon/favicon.ico" sizes="any">
<link rel="icon" href="/favicon/BAI_favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/favicon/png/apple-touch-icon.png">
<link rel="manifest" href="/favicon/manifest.json">
<meta name="theme-color" content="#031E42">
```

Files: `public/brand/favicon/BAI_favicon.svg`, `favicon.ico` (multi-resolution), `png/favicon-{16,32,48,64,96,192,512}.png`, `apple-touch-icon.png` (180), `manifest.json`.

The favicon is a *simplified* mark — a navy rounded square with the "BAI" monogram where the A retains the gold gradient. At 16×16 the full logomark's fine geometry (arrow barb, gold A peak detail) would mud out; the monogram remains legible.

## Animated Variant

`public/brand/animated/BAI_mark_animated.svg` — the mark draws itself in via `stroke-dasharray` + `stroke-dashoffset` over 1.8s on first paint. Respects `prefers-reduced-motion` (renders final state immediately when motion is reduced).

Use only for hero reveals. Do NOT animate in compact layouts.

## Forbidden Uses

Do not:
- Rotate the logo (it has a directional arrow)
- Apply drop shadow or outer glow
- Recolor the gold gradient to non-brand hues (orange, red, green, etc.)
- Place on backgrounds with insufficient contrast (mid-blue, mid-gold)
- Stretch non-proportionally
- Crop into the mark
- Add effects (emboss, bevel, neon, gradient overlays)
- Use the mark and wordmark separately and call it a "logo" (use one of the lockups)
- Replace the typeface in the wordmark — the wordmark is a custom drawing, not type

## File Naming Convention

```
BAI_{composition}[_{color|background}][@{1x|2x|3x|_print}].{ext}
```

- `composition`: `full` | `horizontal` | `mark` | `text` | `favicon`
- `color` (for solid PNGs): `navy` | `cream` | `black`
- `background` (for composited PNGs): `on-navy` | `on-white` | `on-gold`
- `@1x|@2x|@3x`: web density
- `_print`: 3000-px-wide print master

Examples:
- `BAI_mark_cream@2x.png` — mark in cream, 2× density (800 px wide)
- `BAI_full_on-navy@1x.png` — full logo composited on navy at 400 px
- `BAI_horizontal.svg` — horizontal lockup vector
- `BAI_favicon.svg` — favicon vector

## Directory Structure

```
kit/
├── logo/
│   ├── BAI_full.svg          # vertical lockup
│   ├── BAI_mark.svg          # mark only
│   ├── BAI_text.svg          # wordmark only
│   └── png/
│       ├── navy/             # solid navy color
│       ├── cream/            # cream knockout
│       ├── black/            # monochrome black
│       ├── on-navy/          # composited on navy bg
│       ├── on-white/         # composited on white bg
│       └── on-gold/          # composited on gold bg
├── horizontal/
│   ├── BAI_horizontal.svg
│   └── png/                  # @1x @2x @3x for every color
├── favicon/
│   ├── BAI_favicon.svg
│   ├── favicon.ico
│   ├── manifest.json
│   ├── head-snippet.html
│   └── png/                  # favicon-{16,32,48,64,96,192,512}.png
├── animated/
│   └── BAI_mark_animated.svg
└── print/                    # 3000-px-wide masters
```

## Quick Reference

```html
<!-- Default site logo (navy on light bg) -->
<img src="/public/brand/logo/png/navy/BAI_full_navy@2x.png" alt="BAI" width="200">

<!-- Logo on dark bg -->
<img src="/public/brand/logo/png/cream/BAI_full_cream@2x.png" alt="BAI" width="200">

<!-- SVG with dynamic color -->
<style>.logo { color: var(--text-color); }</style>
<svg class="logo" ...><!-- inlined from public/brand/logo/BAI_full.svg --></svg>

<!-- Horizontal header lockup -->
<img src="/public/brand/horizontal/png/BAI_horizontal_navy@2x.png" alt="BAI" height="40">
```
