# Editing content

## Move a piece, change when it appears

1. Find it in `tools/gen-world.py`. Each piece is one line, e.g.
   `S.append(el('h2', 'hd h128 day7-title', K((6, [64, -255]), (7, [64, 229]), (8, [64, -1051])), 1600, None, '…'))`
   — `K((frame, [x, y]), …)` lists its box in the frames where Figma has it; the rest are carried over.
2. Take coordinates from Figma (or `docs/figma-geometry.md`), never by eye.
3. `python3 tools/gen-world.py --write`, then `./tools/test-all.sh`, then commit both files.

Never edit the `#world` section of `index.html` by hand: the next regenerate overwrites it.

## Change text

Text lives in the same generator lines. Regenerate as above.

## Add or replace an image

- Export from Figma (`download_assets`), never edit or substitute.
- Compress to WebP at about 1.5× the size it is placed at, quality 78.
- Shared pieces go in `assets/img/shared/`, one copy only; others in the frame's folder (`day3/` …).
- Add the node → file line to `tools/asset-manifest.md`.
- `./tools/check-assets.sh` flags missing/empty files and leftover Figma URLs.
- Images the first frame needs get `fetchpriority="high"` automatically (`CRIT` list at the end of the generator).

## Fonts

| Use | Font | Status |
|---|---|---|
| Headings | IM Fell DW Pica (stand-in) | RFC Vintage Apothecary is the Figma font; it's paid and not supplied yet |
| Body | Abyssinica SIL | In place |
| Logo wordmark | Tanach | In place, licence beside it |

Pica is set at 62.5% of the Figma sizes inside Figma-sized line boxes, 0.07em tracking, padded `.306lh`, so its cap
height and baseline match Figma. When the RFC file arrives: drop it in `assets/fonts/`, remove it from
`tools/pending-assets.txt`, restore line-height `.8` and 100% sizes, drop the tracking and padding.

## Tuning by eye

Timings and distances are tuned through a `manual/` or `compare/` harness (`~/.claude/templates/harness-panel.js`,
copied in as `_debug-*.js`), then baked as exact values and the harness deleted. `_debug-*` is git-ignored.
