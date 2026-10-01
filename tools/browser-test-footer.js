// Footer checks: page ends on the footer rest state (no blank space), LEARN MORE animates back to About.
const pw = require(process.env.PLAYWRIGHT || '/Users/eyalraz/.npm/_npx/705bc6b22212b352/node_modules/playwright');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  const b = await pw.chromium.launch(); const p = await b.newPage({ viewport: { width: 1728, height: 1117 } });
  await p.goto('http://localhost:8010/?nointro', { waitUntil: 'load' });
  const n = await p.evaluate(() => document.querySelectorAll('.fold').length);
  await p.waitForFunction(n => window.ScrollTrigger && ScrollTrigger.getAll().length === n, n, { timeout: 5000 });
  ok(n === 9, 'nine folds (' + n + ')');
  await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(1200);
  const r = await p.evaluate(() => { const s = document.querySelector('#fold-footer .stage').getBoundingClientRect(); const t = document.querySelector('#fold-footer .footer-title'); return { top: s.top, bottom: s.bottom, title: getComputedStyle(t).transform, y: scrollY, h: document.documentElement.scrollHeight, cur: document.querySelector('.daynav__item.is-current').textContent }; });
  ok(r.top <= 0.5 && r.bottom >= 1116.5, 'at the bottom the footer stage covers the viewport (' + r.top + '..' + r.bottom + ')');
  ok(['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(r.title), 'footer title at rest at the very bottom (' + r.title + ')');
  ok(r.cur === 'contact', 'nav current = contact (' + r.cur + ')');
  const ys = await p.evaluate(() => new Promise(res => { const ys = []; document.querySelector('.footer-learn a').click(); const iv = setInterval(() => ys.push(scrollY), 100); setTimeout(() => { clearInterval(iv); res(ys); }, 1600); }));
  const aboutStart = await p.evaluate(() => ScrollTrigger.getById('fold-about').start);
  ok(new Set(ys).size > 3 && Math.abs(ys[ys.length - 1] - aboutStart) < 2, 'LEARN MORE animates to about (' + aboutStart + '): ' + ys.slice(0, 6).join(',') + '…' + ys[ys.length - 1]);
  await b.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
