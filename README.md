# Let There Be Light — festival site

Desktop-only single-page festival site built from the Figma page הגשה 5.
Run: `python3 server.py` → http://localhost:8010
Check: `./tools/check-assets.sh` (missing/empty assets, leftover Figma URLs)

**Heading font pending:** RFC Vintage Apothecary (paid, Etsy/RFC) is not yet supplied — IM Fell DW Pica (OFL) stands in: glyphs at 62.5% of the Figma sizes inside Figma-sized line boxes, 0.07em tracking, padded .306lh so baselines match Figma (Eyal's compare/ pick, 2026-10-01); when the RFC file arrives, restore line-height .8 / 100% sizes and drop the tracking and padding; Tanach is in place (assets/fonts/Tanach.ttf, licence beside it); `@font-face` rules are in place and the files are listed in `tools/pending-assets.txt`. Drop the woff2 files into `assets/fonts/` and remove them from that list.

Transfer (2026-10-01, cache disabled, full scroll, 1728×1117): 3.75 MB over 96 requests (3.7 MB WebP).
Scroll frame budget (2026-10-01, headless Chromium, 24px/frame scroll top→bottom): p95 9.3 ms, 0 frames over 32 ms. Re-measure: `node tools/measure.js`.
Run everything: `./tools/test-all.sh` (fails on any red check). Debug flags the tools rely on: `?nointro` (skip the intro), `?notravel` (rest geometry, no scroll travel).
Browser checks: `node tools/browser-test.js` (stage/plate), `browser-test-intro.js`, `browser-test-world.js` (pin, keyframes, nav, anchors), `node tools/parity.js all` (every element's box at every keyframe vs its Figma box). They need a Playwright install; set `PLAYWRIGHT=/path/to/node_modules/playwright`.
Figma geometry (resolved coordinates per frame): `docs/figma-geometry.md`. The page is ONE pinned stage with nine keyframes (the nine Figma frames); every element carries `data-k` = its box in each frame, and `js/scroll.js` scrubs between them. Markup generator: `python3 tools/gen-world.py` (paste its output into `<main>`).
