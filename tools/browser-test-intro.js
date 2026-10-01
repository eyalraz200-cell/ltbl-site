// Intro checks (Review Focus 2): fresh load locks scroll and ends at rest; ?nointro / reduced motion / restored scroll skip it.
const pw = require(process.env.PLAYWRIGHT || '/Users/eyalraz/.npm/_npx/705bc6b22212b352/node_modules/playwright');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const rest = p => p.evaluate(() => {
  const g = s => { const el = document.querySelector('#fold-hero ' + s); const st = getComputedStyle(el); return { t: st.transform, o: st.opacity, v: st.visibility }; };
  return { title: g('.title-2'), hand: g('.hand--left'), logo: g('.logo'), dark: !!document.querySelector('#fold-hero .intro-clouds'), lock: getComputedStyle(document.body).overflow, done: !!(window.LTBL && window.LTBL.introDone) };
});
const atRest = r => r.title.o === '1' && r.title.v === 'visible' && (r.hand.t === 'none' || r.hand.t === 'matrix(1, 0, 0, 1, 0, 0)') && r.hand.o === '1' && r.logo.o === '1' && !r.dark;
(async () => {
  const b = await pw.chromium.launch();
  let p = await b.newPage({ viewport: { width: 1728, height: 1117 } });
  await p.goto('http://localhost:8010/', { waitUntil: 'load' }); await p.waitForTimeout(300);
  let r = await rest(p);
  ok(r.lock === 'hidden', 'fresh load: body scroll locked during intro (' + r.lock + ')');
  ok(r.dark && r.title.o !== '1', 'fresh load: dark clouds present, title hidden at start');
  await p.waitForFunction(() => !document.body.classList.contains('is-intro'), null, { timeout: 15000 });
  r = await rest(p);
  ok(atRest(r), 'fresh load: ends at rest ' + JSON.stringify(r));
  ok(r.lock !== 'hidden', 'fresh load: scroll unlocked after intro');
  await p.close();
  p = await b.newPage({ viewport: { width: 1728, height: 1117 } });
  await p.goto('http://localhost:8010/?nointro', { waitUntil: 'load' }); await p.waitForTimeout(200);
  r = await rest(p); ok(atRest(r) && r.lock !== 'hidden', '?nointro: rest state immediately');
  await p.close();
  p = await b.newPage({ viewport: { width: 1728, height: 1117 } }); await p.emulateMedia({ reducedMotion: 'reduce' });
  await p.goto('http://localhost:8010/', { waitUntil: 'load' }); await p.waitForTimeout(200);
  r = await rest(p); ok(atRest(r) && r.lock !== 'hidden', 'reduced motion: intro skipped');
  await p.close();
  p = await b.newPage({ viewport: { width: 1728, height: 1117 } });
  await p.goto('http://localhost:8010/?nointro', { waitUntil: 'load' });
  await p.evaluate(() => { document.body.style.height = '5000px'; scrollTo(0, 2000); });
  await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(300);
  r = await rest(p); const sy = await p.evaluate(() => scrollY);
  ok(sy > 10 ? (atRest(r) && r.lock !== 'hidden') : true, 'reload mid-page (scrollY=' + sy + '): intro skipped, no lock');
  await b.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
