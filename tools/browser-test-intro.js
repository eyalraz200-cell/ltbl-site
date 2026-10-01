// Intro checks (Review Focus 2): fresh load locks scroll and ends at rest; ?nointro / reduced motion skip it; a refresh restarts at the hero;
// GSAP missing degrades to a plain page; widening a narrow window brings the engine up.
const pw = require(process.env.PLAYWRIGHT || '/Users/eyalraz/.npm/_npx/705bc6b22212b352/node_modules/playwright');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const rest = p => p.evaluate(() => {
  const g = s => { const el = document.querySelector('#world ' + s); const st = getComputedStyle(el); return { t: st.transform, o: st.opacity, v: st.visibility }; };
  return { title: g('.title-2'), hand: g('.hand--left'), logo: g('.logo'), dark: !!document.querySelector('#world .intro-clouds'), done: !!(window.LTBL && window.LTBL.introDone), y: scrollY };
});
const atRest = r => r.title.o === '1' && r.title.v === 'visible' && (r.hand.t === 'none' || r.hand.t === 'matrix(1, 0, 0, 1, 0, 0)') && r.hand.o === '1' && r.logo.o === '1' && !r.dark;
const V = { viewport: { width: 1728, height: 1117 } };
(async () => {
  const b = await pw.chromium.launch();
  // 1. fresh load: locked during, at rest after
  let p = await b.newPage(V);
  await p.goto('http://localhost:8010/', { waitUntil: 'load' }); await p.waitForTimeout(300);
  let r = await rest(p);
  ok(r.dark && r.title.o !== '1', 'fresh load: dark clouds present, title hidden at start');
  await p.mouse.wheel(0, 3000); await p.keyboard.press('End'); await p.waitForTimeout(300);
  r = await rest(p); ok(r.y === 0, 'fresh load: wheel and End during the intro do not scroll (scrollY=' + r.y + ')');
  await p.waitForFunction(() => !document.body.classList.contains('is-intro') && !document.documentElement.classList.contains('is-intro'), null, { timeout: 15000 });
  r = await rest(p); ok(atRest(r), 'fresh load: ends at rest ' + JSON.stringify(r));
  await p.mouse.wheel(0, 500); await p.waitForTimeout(400); r = await rest(p); ok(r.y > 0, 'fresh load: scroll works after the intro (scrollY=' + r.y + ')');
  await p.close();
  // 2. ?nointro and reduced motion
  p = await b.newPage(V); await p.goto('http://localhost:8010/?nointro', { waitUntil: 'load' }); await p.waitForTimeout(200);
  r = await rest(p); ok(atRest(r), '?nointro: rest state immediately'); await p.close();
  p = await b.newPage(V); await p.emulateMedia({ reducedMotion: 'reduce' });
  await p.goto('http://localhost:8010/', { waitUntil: 'load' }); await p.waitForTimeout(200);
  r = await rest(p); ok(atRest(r), 'reduced motion: intro skipped'); await p.close();
  // 3. refresh mid-page: back to the hero, intro plays (only Back/Forward restores the frame)
  p = await b.newPage(V); await p.goto('http://localhost:8010/?nointro', { waitUntil: 'load' });
  await p.waitForFunction(() => window.ScrollTrigger && ScrollTrigger.getById('world'), null, { timeout: 8000 });
  const target = await p.evaluate(() => { history.replaceState(null, '', '/'); const s = ScrollTrigger.getById('world'); const y = Math.round(s.start + (s.end - s.start) * 5 / 8); scrollTo(0, y); return y; });
  await p.waitForTimeout(600);
  await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(300);
  const afterReload = await p.evaluate(() => ({ y: scrollY, dark: !!document.querySelector('#world .intro-clouds') }));
  ok(afterReload.y === 0 && afterReload.dark, 'refresh: back at the hero with the intro playing (' + JSON.stringify(afterReload) + ')');
  await p.close(); p = null;
  // 4. GSAP CDN down: plain page, no dark clouds, no errors
  p = await b.newPage(V); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/cdnjs.cloudflare.com/**', rt => rt.abort());
  await p.goto('http://localhost:8010/', { waitUntil: 'load' }); await p.waitForTimeout(500);
  r = await rest(p); await p.mouse.wheel(0, 800); await p.waitForTimeout(300); const y2 = await p.evaluate(() => scrollY);
  ok(!r.dark && r.title.o === '1' && errs.length === 0, 'no GSAP: hero visible at rest, no intro clouds, no errors (' + errs.join(' | ') + ') — the world cannot move without GSAP');
  await p.close();
  // 5. narrow window widened: engine comes up
  p = await b.newPage({ viewport: { width: 900, height: 800 } });
  await p.goto('http://localhost:8010/?nointro', { waitUntil: 'load' }); await p.waitForTimeout(300);
  await p.setViewportSize({ width: 1728, height: 1117 }); await p.waitForTimeout(2500);
  const wide = await p.evaluate(() => ({ st: window.ScrollTrigger ? ScrollTrigger.getAll().length : 0, plate: getComputedStyle(document.querySelector('.desktop-only-plate')).display }));
  ok(wide.st === 1 && wide.plate === 'none', 'widened from 900px: pin built, plate hidden (' + JSON.stringify(wide) + ')');
  await b.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
