# Let There Be Light — festival site

Desktop-only single-page festival site built from the Figma page הגשה 5.
Run: `python3 server.py` → http://localhost:8010
Check: `./tools/check-assets.sh` (missing/empty assets, leftover Figma URLs)

**Heading font pending:** RFC Vintage Apothecary (paid, Etsy/RFC) is not yet supplied; Tanach is in place (assets/fonts/Tanach.ttf, licence beside it); `@font-face` rules are in place and the files are listed in `tools/pending-assets.txt`. Drop the woff2 files into `assets/fonts/` and remove them from that list.

Transfer (2026-10-01, cache disabled, full scroll, 1728×1117): 3.75 MB over 96 requests (3.7 MB WebP).
Scroll frame budget (2026-10-01, headless Chromium, 24px/frame scroll top→bottom): p95 9.3 ms, 0 frames over 32 ms. Re-measure: `node tools/measure.js`.
Run everything: `./tools/test-all.sh` (fails on any red check). Debug flags the tools rely on: `?nointro` (skip the intro), `?notravel` (rest geometry, no scroll travel).
Browser checks: `node tools/browser-test.js` (stage/plate), `browser-test-intro.js`, `browser-test-scroll.js`, `browser-test-nav.js`, `browser-test-footer.js`, `node tools/parity.js fold-<id>` (geometry vs Figma). They need a Playwright install; set `PLAYWRIGHT=/path/to/node_modules/playwright`.
Figma geometry used for every fold (resolved coordinates, parked enter/exit positions): `docs/figma-geometry.md`. Fold markup generator: `tools/gen-folds.py`.
