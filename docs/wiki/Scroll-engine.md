# Scroll engine (`js/scroll.js`)

## The model

One ScrollTrigger pins `#world`. Its length is `(frames − 1) × MOTION.len %` of the window height, and it scrubs one
GSAP timeline whose time runs 0 → 8. Time `i` is Figma frame `i`. Between `i` and `i+1`, each element tweens from
its box in frame `i` to its box in frame `i+1`.

## `MOTION` — the feel

```js
const MOTION = { ease: 'none', hold: 0.15, scrub: 0.6, snap: false,
                 len: 300, creep: 0, pace: 'mid', edge: false, floor: 0.5 };
```

Picked by Eyal in a `compare/` harness on 2026-10-01. What each knob does:

| Key | Current | Meaning |
|---|---|---|
| `len` | 300 | Scroll distance per day, in % of window height (3 screens per day) |
| `hold` | 0.15 | Share of each segment at both ends where nothing moves (the "rest" on a frame) |
| `ease` | `'none'` | Curve of each piece's move (any GSAP ease) |
| `pace` | `'mid'` | `'time'`: every piece takes the whole move (far trips fly faster). `'start'`/`'end'`/`'mid'`: one shared speed set by the segment's longest trip; shorter trips leave together, arrive together, or sit centred |
| `floor` | 0.5 | With a shared speed, the shortest trip still takes at least this share of the move (stops short hops from snapping) |
| `scrub` | 0.6 | Seconds the pieces lag behind the scrollbar (`true` = locked to it) |
| `creep` | 0 | "Never still": share of each trip done as a slow drift through the rests |
| `snap` | false | Settle on the nearest frame when scrolling stops |
| `edge` | false | Park off-frame pieces just past the window edge instead of at Figma's distance |

The Figma prototype's own transition (one frame per drag, Smart Animate, ease-out 300 ms) was tried and rejected.

`LTBL.rebuildWorld(opts, keep)` kills and rebuilds the timeline with new settings and lands on progress `keep` (default:
the current place). It runs on every resize (debounced 250 ms) because parking depends on the window shape; the place
is read at the first resize event, before ScrollTrigger recomputes its start and end.

## Parking: pieces outside the frame

A piece counts as **in the frame** at a keyframe when at least a fifth of its box is inside the 1728×1117 frame.
Otherwise it is **parked**. In a window of another shape the stage has margins, and a parked piece would show in
them, so it is pushed out by the margin on the side its centre is past. In an exact-fit window the margin is 0 and
Figma's coordinates are untouched. A piece Figma leaves poking a sliver over the edge (god's fingertip on day 5)
pokes the same sliver over the *window* edge.

Links on parked pieces (the hero ticket below the frame, the footer ticket above it) are `inert` until their piece is
in the frame at the nearest keyframe, and `#world` is `overflow: clip`. Otherwise Tab would focus a parked link and the
browser would scroll the world itself to reveal it, tearing the scene apart.

## Day nav (`js/nav.js`)

A strip at the top of the window. Label `i` sits at stage x = `864 + (i − p) · 606`, where `p` is the continuous
frame position from the scroll; full opacity at the centre, half one step away, hidden beyond. Hovering a label that
is not current glows it; clicking animates the scroll there.

## Programmatic scrolling

Never jump. `LTBL.scrollTo(frameId)` animates (1 s, power2.inOut). In-page `#` links are intercepted and routed through
it. The one non-animated scroll is restoring the position on Back/Forward; a refresh always restarts at the hero with
the intro.

## Reduced motion

With `prefers-reduced-motion`, moves take ~0 time and the scroll snaps to frames, so each frame swaps in place. The
intro is skipped.
