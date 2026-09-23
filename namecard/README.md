# KerjaCerdas Namecard

Brand-only, single-sided business namecard built with plain HTML/CSS and exported to **PDF, PNG, and HTML** via **Puppeteer** (headless Chrome).

## Specs
- **Trim size:** 91 × 55 mm (Indonesia/Japan standard)
- **Bleed:** 3 mm on all sides → full-bleed canvas **97 × 61 mm**
- **Safe area:** 85 × 49 mm (all text/logo stays 3 mm inside the trim)
- **PNG resolution:** ~1146 × 720 px (300 DPI at full bleed)
- **Style:** KerjaCerdas "Modern Neobrutalism" — paper `#FAF9F5`, ink `#090A0F`, orange `#FF4800`, lime `#B4F51C`; Plus Jakarta Sans + JetBrains Mono; 2.5px borders, hard offset shadows.

## Edit the content
Open `index.html`. Everything is in one file:
- **Contact rows** — the `.contact` block currently uses placeholders: `kerjacerdas.id`, `hello@kerjacerdas.id`, `@kerjacerdas`. Replace with real details.
- **Tagline** — the `.tagline` block.
- **Colors/fonts** — CSS custom properties in `:root`.

## Preview with print guides
Open `index.html` in a browser and add `?guides=1` to the URL (e.g. `index.html?guides=1`). You'll see:
- **Cyan dashed line** = trim edge (91×55)
- **Red dashed line** = safe area (85×49) — keep all content inside it
- Card edge = full-bleed canvas (97×61)

Guides never appear in exports.

## Export
```bash
cd namecard
npm install     # installs puppeteer (downloads Chromium, one time)
npm run export
```
Outputs to `namecard/dist/`:
- `kerjacerdas-namecard.pdf` — vector, 97×61 mm, print-ready (send this to the printer)
- `kerjacerdas-namecard.png` — 300 DPI raster for sharing/preview
- `kerjacerdas-namecard.html` — self-contained copy for web/email

## Send to a printer
Give them the **PDF** and these specs: *91×55 mm trim, 3 mm bleed included, 300 DPI, CMYK conversion at your end.* The design uses flat spot-like brand colors, so ask for a proof if exact orange (`#FF4800`) matching matters.

## Stack
HTML + CSS (hand-written, no UI framework) + [Puppeteer](https://pptr.dev/) for export. Puppeteer's `page.pdf()` produces a true vector PDF (crisp, selectable text); `page.screenshot()` produces the high-DPI PNG. This is the most documented, battle-tested way to turn HTML/CSS into print assets.
