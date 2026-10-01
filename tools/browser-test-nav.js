// Day nav checks: labels, current/neighbour state tracks the pinned fold, clicking animates (no jump).
const pw = require(process.env.PLAYWRIGHT || '/Users/eyalraz/.npm/_npx/705bc6b22212b352/node_modules/playwright');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  const b = await pw.chromium.launch(); const p = await b.newPage({ viewport: { width: 1728, height: 1117 } });
  await p.goto('http://localhost:8010/?nointro', { waitUntil: 'load' });
  const n = await p.evaluate(() => document.querySelectorAll('.fold').length);
  try { await p.waitForFunction(n => window.ScrollTrigger && ScrollTrigger.getAll().length === n, n, { timeout: 5000 }); } catch (e) {}
  const state = () => p.evaluate(() => [...document.querySelectorAll('.daynav__item')].map(b => ({ t: b.textContent, cur: b.classList.contains('is-current'), near: b.classList.contains('is-near'), op: getComputedStyle(b).opacity, x: b.getBoundingClientRect().left, w: b.getBoundingClientRect().width, fs: getComputedStyle(b).fontSize })));
  let s = await state();
  ok(s.length === n, `one nav item per fold (${s.length}/${n})`);
  ok(s[0] && s[0].t === 'day 1' && s[1] && s[1].t === 'about', 'labels: ' + s.map(x => x.t).join(' | '));
  ok(s[0].cur && s[0].op === '1', 'hero at rest: DAY 1 is current, opacity 1');
  ok(s[1].near && s[1].op === '0.5', 'ABOUT is a neighbour at 50%');
  ok(s.slice(2).every(x => x.op === '0'), 'others hidden');
  ok(Math.abs(s[0].x + s[0].w / 2 - 864) < 4, 'current label centred on the stage (centre ' + (s[0].x + s[0].w / 2) + ')');
  ok(Math.abs(s[1].x + s[1].w - (1728 - 199)) < 4, 'next label right edge at 1529 (' + (s[1].x + s[1].w) + ')');
  ok(s[0].fs === '48px', 'label 48px at scale 1 (' + s[0].fs + ')');
  const ys = await p.evaluate(() => new Promise(res => { const ys = []; document.querySelectorAll('.daynav__item')[1].click(); const iv = setInterval(() => ys.push(scrollY), 100); setTimeout(() => { clearInterval(iv); res(ys); }, 1500); }));
  const aboutStart = await p.evaluate(() => ScrollTrigger.getById('fold-about').start);
  ok(new Set(ys).size > 3 && Math.abs(ys[ys.length - 1] - aboutStart) < 2, 'click ABOUT: animated scroll to ' + aboutStart + ' (' + ys.join(',') + ')');
  await p.waitForTimeout(400); s = await state();
  ok(s[1].cur && s[0].near, 'after click: ABOUT current, DAY 1 neighbour');
  await p.setViewportSize({ width: 1920, height: 1080 }); await p.waitForTimeout(300); s = await state();
  ok(Math.abs(parseFloat(s[1].fs) - 48 * Math.min(1920 / 1728, 1080 / 1117)) < 0.5, 'nav scales with the stage at 1920 (' + s[1].fs + ')');
  await b.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
