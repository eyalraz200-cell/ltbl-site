# Architecture

Vanilla HTML/CSS/JS, GSAP 3.12.5 (ScrollTrigger, ScrollToPlugin) from cdnjs. No framework, no build step.

## Files

| File | Role |
|---|---|
| `index.html` | One `<section id="world">` plus the day nav and the narrow-window plate. **The `#world` section is generated** — never edit it by hand. |
| `tools/gen-world.py` | Source of truth for every element and its position in each of the nine frames. `python3 tools/gen-world.py --write` regenerates `#world` in place. |
| `css/base.css` | Tokens, fonts, the world/stage/backdrop layers, nav, loading state |
| `css/folds.css` | Per-piece styling: cutouts, tickets and the TICKETS hover, big hands |
| `js/stage.js` | Scales the layers to the window; scroll restoration; desktop breakpoint; big-hand scale |
| `js/intro.js` | Once-on-load intro (the five סרטון frames), waits for its images |
| `js/scroll.js` | The scroll engine — see [Scroll engine](Scroll-engine) |
| `js/nav.js` | The sliding day-label strip at the top |
| `server.py` | Static dev server (threaded) with the harness endpoints |
| `docs/figma-geometry.md` | Every Figma coordinate, resolved, per frame |
| `tools/asset-manifest.md` | Figma node → asset file |

## The world: two layers, one coordinate system

Both layers are a 1728×1117 box — the Figma frame size — and use Figma coordinates verbatim.

- **`.backdrop`** — sky, clouds, sea, ground, night sky. Scaled to **cover** the window (`--bleed-scale`): no bars,
  its edges crop.
- **`.stage`** — all content (titles, text, cutouts, tickets) plus discrete scenery that must stay whole (moon,
  sun, birds, big hands; class `scenery`). Scaled to **contain** (`--stage-scale`): the whole frame always fits.
  The stage does not clip, so in a window of a different shape there is margin around the frame where pieces can
  slide in from the window edge.

## `data-k`: one box per frame

Every moving element carries `data-k`, a JSON list of nine boxes, one per Figma frame:

```
[x, y]                        position only
[x, y, w, h, rotation, opacity]   when size / rotation / opacity also change
```

The generator fills gaps: a frame with no Figma copy of the piece carries the neighbouring frame's box. The inline
`left/top` is frame 0; the engine animates `x/y` deltas from it.

Frame order (`data-frames`): `hero, about, day2, day3, day4, day5, day6, shabbat, footer`.
Nav labels (`data-days`): `1, about, 2, 3, 4, 5, 6, 7, contact`.

## Below 1024px

The site is desktop-only. Under 1024px wide the engine never starts and `.desktop-only-plate` covers the page.
Widening a narrow window past 1024px reloads once so the engine starts clean.
