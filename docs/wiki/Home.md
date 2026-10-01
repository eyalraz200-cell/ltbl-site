# Let There Be Light — site wiki

A desktop-only, single-page festival site for **Jehova Events' "Let There Be Light"**, built from the Figma page
**הגשה 5** (file `vFkPM0DGEDXyeG1ijR4Rs2`, page node `12360:2`).

- **Live:** https://eyalraz200-cell.github.io/ltbl-site/ (GitHub Pages, branch `feat/site`)
- **Run locally:** `python3 server.py` → http://localhost:8010
- **Check everything:** `./tools/test-all.sh`

## Pages

| Page | What's in it |
|---|---|
| [Architecture](Architecture) | The one-stage "world", the two layers, `data-k` keyframes, the generator |
| [Scroll engine](Scroll-engine) | How scrolling moves the pieces: motion settings, parking, speed, nav, resize |
| [Editing content](Editing-content) | Moving a piece, changing text, adding an image, fonts |
| [Testing](Testing) | The check suite, debug URL flags, what each test proves |
| [Deploy](Deploy) | Publishing to GitHub Pages |
| [Decisions](Decisions) | Every design call Eyal made and why — read before "fixing" any of them |

## In one paragraph

The page never scrolls as a document. One full-window section is pinned while you scroll, and inside it every
picture and text block slides between its positions in the nine Figma frames (hero, about, day 2 … day 6, shabbat,
footer), like paper cutouts entering and leaving a frame. Scroll position is just a dial from frame 0 to frame 8.
