// Browser checks for the stage scaler and desktop plate. Run: node tools/browser-test.js
// Needs playwright; set PLAYWRIGHT=/path/to/node_modules/playwright if not resolvable.
const pw = require(process.env.PLAYWRIGHT || '/Users/eyalraz/.npm/_npx/705bc6b22212b352/node_modules/playwright');
const URL = process.env.URL || 'http://localhost:8010/?nointro';
let fails = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  const b = await pw.chromium.launch();
  for (const [w, h] of [[1728, 1117], [1920, 1080], [2560, 1440]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(URL, { waitUntil: 'load' });
    const r = await p.evaluate(() => {
      const s = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--stage-scale'));
      const st = document.querySelector('.stage'); const rc = st && st.getBoundingClientRect();
      return { s, api: !!(window.LTBL && window.LTBL.stageScale && window.LTBL.isDesktop()), rect: rc && { l: rc.left, t: rc.top, w: rc.width, h: rc.height } };
    });
    const exp = Math.max(w / 1728, h / 1117);
    ok(Math.abs(r.s - exp) < 0.001, `${w}x${h} --stage-scale=${r.s} (expect ${exp.toFixed(4)})`);
    ok(r.api, `${w}x${h} LTBL api present and isDesktop`);
    if (r.rect) {
      ok(r.rect.l <= 0.5 && r.rect.t <= 0.5 && r.rect.l + r.rect.w >= w - 0.5 && r.rect.t + r.rect.h >= h - 0.5, `${w}x${h} stage covers viewport (${JSON.stringify(r.rect)})`);
      ok(Math.abs(r.rect.l + r.rect.w / 2 - w / 2) < 1 && Math.abs(r.rect.t + r.rect.h / 2 - h / 2) < 1, `${w}x${h} stage centred`);
    } else ok(false, `${w}x${h} a .stage exists`);
    ok(errs.length === 0, `${w}x${h} no page errors ${errs.join(' | ')}`);
    await p.close();
  }
  const p = await b.newPage({ viewport: { width: 900, height: 800 } });
  await p.goto(URL, { waitUntil: 'load' });
  const n = await p.evaluate(() => ({ plate: getComputedStyle(document.querySelector('.desktop-only-plate')).display, desk: window.LTBL && window.LTBL.isDesktop(), st: !!window.ScrollTrigger && ScrollTrigger.getAll().length }));
  ok(n.plate === 'grid', `900 wide: desktop plate shown (display=${n.plate})`);
  ok(n.desk === false, `900 wide: isDesktop() false`);
  ok(!n.st, `900 wide: no ScrollTriggers (${n.st})`);
  await b.close();
  console.log(fails ? `${fails} FAILED` : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
