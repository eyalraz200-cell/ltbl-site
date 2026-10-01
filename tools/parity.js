// Geometry parity: compares rendered element boxes (at 1728x1117, ?nointro) with Figma values. Usage: node tools/parity.js <fold-id> [tolerance=4]
// Expected boxes live in tools/parity-expect.json: { "fold-hero": { "selector": [x, y, w, h], ... } } — x/y/w/h in stage px from the Figma design context.
const pw = require(process.env.PLAYWRIGHT || '/Users/eyalraz/.npm/_npx/705bc6b22212b352/node_modules/playwright');
const fs = require('fs');
const [fold, tolArg] = process.argv.slice(2); const tol = +(tolArg || 4);
const expect = JSON.parse(fs.readFileSync(__dirname + '/parity-expect.json', 'utf8'))[fold];
(async () => {
  const b = await pw.chromium.launch(); const p = await b.newPage({ viewport: { width: 1728, height: 1117 } });
  await p.goto('http://localhost:8010/?nointro&notravel#' + fold, { waitUntil: 'networkidle' });
  const res = await p.evaluate(([fold, expect]) => {
    const stage = document.querySelector('#' + fold + ' .stage'); const s = stage.getBoundingClientRect();
    const out = {};
    for (const sel of Object.keys(expect)) {
      const el = stage.querySelector(sel); if (!el) { out[sel] = null; continue; }
      const r = el.getBoundingClientRect(); out[sel] = [r.left - s.left, r.top - s.top, r.width, r.height].map(v => Math.round(v * 10) / 10);
    }
    return out;
  }, [fold, expect]);
  let drift = 0, missing = 0;
  for (const sel of Object.keys(expect)) {
    const e = expect[sel], g = res[sel];
    if (!g) { console.log('MISSING  ' + sel); missing++; continue; }
    const d = e.map((v, i) => v == null ? 0 : Math.abs(v - g[i]));
    const bad = d.some(v => v > tol);
    if (bad) drift++;
    console.log((bad ? 'DRIFT    ' : 'match    ') + sel.padEnd(28) + ' figma ' + JSON.stringify(e) + ' got ' + JSON.stringify(g));
  }
  await b.close();
  console.log(`${fold}: ${Object.keys(expect).length} elements, ${drift} drift >${tol}px, ${missing} missing`);
  process.exit(drift + missing ? 1 : 0);
})();
