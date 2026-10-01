# Testing

`./tools/test-all.sh` runs everything and fails on any red check. Needs Playwright; set
`PLAYWRIGHT=/path/to/node_modules/playwright` if it isn't at the default path. The dev server must be running.

| Check | Proves |
|---|---|
| `tools/check-assets.sh` | Every referenced asset exists and isn't empty; no leftover Figma URLs |
| `tools/browser-test.js` | Stage scaling; under 1024px the plate shows and the engine stays off |
| `tools/browser-test-intro.js` | Intro locks scroll and ends at rest; `?nointro` / reduced motion skip it; refresh restarts at the hero; no-GSAP fallback; widening starts the engine |
| `tools/browser-test-world.js` | One pin of the right length; wheel to the bottom and back restores frame 0; nav state; animated `scrollTo`; resize recomputes |
| `tools/parity.js all` | Every element's box at every keyframe matches its Figma box within 1px (684 boxes; big hands excluded — they scale about the fingertip on purpose) |
| `tools/measure.js` | Scroll frame budget (not in the suite) |

## Debug URL flags

- `?nointro` — skip the intro
- `?notravel` — rest geometry, no scroll travel

## Before committing

Run the suite. For a visual change, also look at several window shapes: 1728×1117 (exact fit), something wide like
2560×1080, and something tall/thin like 1100×1400.
