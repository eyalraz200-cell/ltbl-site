// Scroll engine checks (Review Focus 3): one pinned ScrollTrigger per fold, travellers reversible after a fast wheel to the bottom and back, animated scrollTo.
const pw = require(process.env.PLAYWRIGHT || '/Users/eyalraz/.npm/_npx/705bc6b22212b352/node_modules/playwright');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const ID = ['none', 'matrix(1, 0, 0, 1, 0, 0)'];
(async () => {
  const b = await pw.chromium.launch(); const p = await b.newPage({ viewport: { width: 1728, height: 1117 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8010/?nointro', { waitUntil: 'load' });
  const n = await p.evaluate(() => document.querySelectorAll('.fold').length);
  try { await p.waitForFunction(n => window.ScrollTrigger && ScrollTrigger.getAll().length === n, n, { timeout: 5000 }); } catch (e) {}
  const sts = await p.evaluate(() => window.ScrollTrigger ? ScrollTrigger.getAll().map(s => ({ id: s.vars.id, pin: !!s.pin, start: s.start, end: s.end })) : []);
  ok(sts.length === n && sts.every(s => s.pin), `one pinned ScrollTrigger per fold (${sts.length}/${n}) ${JSON.stringify(sts)}`);
  const hero = sts.find(s => s.id === 'fold-hero') || { start: 0, end: 1117 };
  // mid-pin: hero exits are under way
  await p.evaluate(y => scrollTo(0, y), hero.start + (hero.end - hero.start) * 0.85); await p.waitForTimeout(900);
  let t = await p.evaluate(() => getComputedStyle(document.querySelector('#fold-hero .hand--right')).transform);
  ok(!ID.includes(t), 'hero pin 85%: right hand has left its rest position (' + t + ')');
  // fast wheel to the bottom and back
  for (let i = 0; i < 40; i++) await p.mouse.wheel(0, 1500);
  await p.waitForTimeout(300);
  for (let i = 0; i < 60; i++) await p.mouse.wheel(0, -1500);
  await p.waitForTimeout(1200);
  const back = await p.evaluate(() => ({ y: scrollY, hero: [...document.querySelectorAll('#fold-hero [data-to]')].map(e => getComputedStyle(e).transform), about: getComputedStyle(document.querySelector('#fold-about .about-title')).transform }));
  ok(back.y === 0, 'back at top (scrollY=' + back.y + ')');
  ok(back.hero.every(t => ID.includes(t)), 'hero travellers back at rest: ' + JSON.stringify(back.hero));
  ok(back.about === 'matrix(1, 0, 0, 1, 0, 947)', 'about title parked at its from-position (translate 0,947): ' + back.about);
  // resize mid-fold: no errors, pin recomputed
  await p.evaluate(y => scrollTo(0, y), hero.start + 300); await p.waitForTimeout(300);
  await p.setViewportSize({ width: 1920, height: 1080 }); await p.waitForTimeout(600);
  const st2 = await p.evaluate(() => ScrollTrigger.getById('fold-hero').end);
  ok(Math.abs(st2 - 1080) < 2, 'after resize to 1080 high, hero pin end = ' + st2);
  await p.setViewportSize({ width: 1728, height: 1117 }); await p.waitForTimeout(600);
  // animated scrollTo
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
  const samples = await p.evaluate(() => new Promise(res => { const ys = []; LTBL.scrollTo('fold-about'); const iv = setInterval(() => ys.push(scrollY), 100); setTimeout(() => { clearInterval(iv); res(ys); }, 1500); }));
  const aboutStart = await p.evaluate(() => ScrollTrigger.getById('fold-about').start);
  ok(samples.length > 5 && new Set(samples).size > 3 && Math.abs(samples[samples.length - 1] - aboutStart) < 2, 'scrollTo animates to about start ' + aboutStart + ': ' + samples.join(','));
  ok(errs.length === 0, 'no page errors ' + errs.join(' | '));
  await b.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
