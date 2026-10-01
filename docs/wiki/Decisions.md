# Decisions

Calls Eyal made, with the reason. Don't "fix" one of these without asking.

| Date | Decision | Why |
|---|---|---|
| 2026-10-01 | Stage fits by **contain** (whole frame always visible); backdrop **covers** | Picked in a side-by-side comparison; content is never cropped |
| 2026-10-01 | Headings in **IM Fell DW Pica**, 75% size, 0.03em tracking, then matched to Figma's cap height and baseline | RFC Vintage Apothecary is paid and not supplied; Pica was the closest of IM Fell English / DW Pica / Goudy Bookletter |
| 2026-10-01 | The page is **one pinned stage**; every layer, backgrounds included, moves between the nine Figma frames | Eyal's reference video: paper cutouts sliding in and out of the frame |
| 2026-10-01 | A **refresh** returns to the hero with the intro; only Back/Forward restores the position | Eyal asked |
| 2026-10-01 | Images at 1.5× placed size, q78; the intro waits for its images (8 s cap) | The first frame was loading black |
| 2026-10-01 | Day labels slide along the top, stuck to the **window** top | Reference video; thin windows |
| 2026-10-01 | Pieces outside the frame never show in the window margins | Wide and tall windows showed parked pieces |
| 2026-10-01 | TICKETS hover = Figma הובר variant (cream ticket, hands reach in); other day labels glow on hover | Figma component ידיים וכרטיס |
| 2026-10-01 | Big hands scale about their fingertips just enough to clear every window edge; no new artwork | Arms were cropped; no larger image exists |
| 2026-10-01 | **Scroll feel:** linear, short rest, 3 screens per day, one shared speed centred on each move, Figma's parking distances, slight lag | Picked in a `compare/` harness. The Figma prototype's own transition (Smart Animate, Ease out, 300 ms, one frame per drag) was tried and rejected |
| 2026-10-01 | Adam cutouts get a drop shadow Figma doesn't have | Eyal asked |

## Open

- RFC Vintage Apothecary font file (paid).
- Whether to merge `feat/site` into `master` (Pages serves `feat/site` meanwhile).
- The intro's timings vs the Figma סרטון flow (Smart Animate, ease in-and-out 2/2/3/4 s, then ease-out 2 s; delays 1/0.8/0.8/0/0.4 s) haven't been compared.
