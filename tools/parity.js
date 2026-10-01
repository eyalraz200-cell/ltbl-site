// Geometry parity: at keyframe k (0..8) every [data-k] element's rendered box must equal its Figma box for that frame.
// Boxes come from data-k (written by tools/gen-world.py from docs/figma-geometry.md). Usage: node tools/parity.js <k|all> [tolerance=1]
const pw = require(process.env.PLAYWRIGHT || '/Users/eyalraz/.npm/_npx/705bc6b22212b352/node_modules/playwright');
const [arg, tolArg] = process.argv.slice(2); const tol = +(tolArg || 1);
(async () => {
  const b = await pw.chromium.launch(); const p = await b.newPage({ viewport: { width: 1728, height: 1117 } });
  await p.goto('http://localhost:8010/?nointro', { waitUntil: 'load' });
  await p.waitForFunction(() => window.ScrollTrigger && ScrollTrigger.getById('world'), null, { timeout: 8000 });
  const frames = arg === 'all' ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : [+arg];
  let bad = 0, total = 0;
  for (const k of frames) {
    await p.evaluate(k => { const s = ScrollTrigger.getById('world'); scrollTo(0, s.start + (s.end - s.start) * k / 8); }, k);
    await p.waitForTimeout(1200);
    const res = await p.evaluate(k => {
      const out = [];
      for (const layer of ['backdrop', 'stage']) {
        const root = document.querySelector('#world .' + layer); const sr = root.getBoundingClientRect();
        const sc = sr.width / 1728;
        root.querySelectorAll(':scope > [data-k]').forEach(el => {
          const v = JSON.parse(el.dataset.k)[k]; const r = el.getBoundingClientRect();
          const got = [(r.left - sr.left) / sc, (r.top - sr.top) / sc, r.width / sc, r.height / sc];
          out.push({ name: el.className, exp: v, got: got.map(n => Math.round(n * 10) / 10), rot: v[4] || 0 });
        });
      }
      return out;
    }, k);
    for (const r of res) {
      total++;
      // rotated boxes: compare the centre instead of the corner
      let d;
      if (r.rot) { const cx = r.exp[0] + r.exp[2] / 2, cy = r.exp[1] + r.exp[3] / 2; d = [Math.abs(cx - (r.got[0] + r.got[2] / 2)), Math.abs(cy - (r.got[1] + r.got[3] / 2))]; }
      else { d = [Math.abs(r.exp[0] - r.got[0]), Math.abs(r.exp[1] - r.got[1])]; if (r.exp[2] != null) d.push(Math.abs(r.exp[2] - r.got[2]), Math.abs(r.exp[3] - r.got[3])); }
      if (d.some(v => v > tol)) { bad++; console.log(`DRIFT f${k} ${r.name.padEnd(26)} figma ${JSON.stringify(r.exp)} got ${JSON.stringify(r.got)}`); }
    }
    console.log(`frame ${k}: ${res.length} elements checked`);
  }
  await b.close(); console.log(`${total} boxes, ${bad} drift >${tol}px`); process.exit(bad ? 1 : 0);
})();
