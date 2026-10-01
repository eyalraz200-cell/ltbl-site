// Pin + travel. One pinned ScrollTrigger per fold (id = fold id). While a fold pins, its timeline scrubs:
//   first half  — every [data-from="x,y"] element travels from that Figma position (its spot in the previous frame) to rest
//   second half — every [data-to="x,y"] element travels from rest to that position (its spot in the next frame)
//   plain .cutout elements without data-from drift in gently.
// Positions are stage px, read verbatim from the Figma frames; rest = the element's inline left/top.
(async function(){
  if (!LTBL.isDesktop()) return;
  await LTBL.introDone;
  if (!window.gsap || !window.ScrollTrigger || !window.ScrollToPlugin) return;   // CDN down: the folds still scroll as a plain page
  window.LTBL.engineUp = true;
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  const folds = [...document.querySelectorAll('.fold')];
  const reduced = LTBL.reducedMotion() || location.search.includes("notravel");   // notravel: rest geometry for tools/parity.js
  const rest = el => ({ x: parseFloat(el.style.left) || 0, y: parseFloat(el.style.top) || 0 });
  const pt = s => s.split(',').map(Number);

  folds.forEach((fold, i) => {
    const stage = fold.querySelector('.stage');
    const last = i === folds.length - 1;
    const tl = gsap.timeline({
      scrollTrigger: {
        id: fold.id, trigger: fold, start: 'top top', end: last ? '+=50%' : '+=100%',
        pin: true, scrub: reduced ? false : 0.6, anticipatePin: 1,
        onToggle: self => self.isActive && LTBL.navSetCurrent && LTBL.navSetCurrent(i)
      }
    });
    if (reduced) return;
    stage.querySelectorAll('[data-from]').forEach(el => {
      const [x, y] = pt(el.dataset.from), r = rest(el);
      tl.fromTo(el, { x: x - r.x, y: y - r.y }, { x: 0, y: 0, ease: 'none', duration: 0.5 }, 0);
    });
    stage.querySelectorAll('[data-to]').forEach(el => {
      const [x, y] = pt(el.dataset.to), r = rest(el);
      tl.to(el, { x: x - r.x, y: y - r.y, ease: 'none', duration: 0.5 }, 0.5);
    });
    stage.querySelectorAll('.cutout:not([data-from])').forEach((el, k) => {
      tl.from(el, { y: 80, autoAlpha: 0, duration: 0.3, ease: 'power2.out' }, 0.05 * k);
    });
    if (tl.duration() < 1) tl.to({}, { duration: 1 - tl.duration() });   // every fold pins for the full range
  });

  // nav: the current fold is the last one whose pin has started (covers jumps that skip onToggle, e.g. restored scroll)
  function syncNav(){
    if (!LTBL.navSetCurrent) return;
    const y = scrollY; let cur = 0;
    folds.forEach((f, i) => { const st = ScrollTrigger.getById(f.id); if (st && y >= st.start - 1) cur = i; });
    LTBL.navSetCurrent(cur);
  }
  ScrollTrigger.addEventListener('scrollEnd', syncNav);
  ScrollTrigger.addEventListener('refresh', syncNav);

  window.LTBL.scrollTo = id => {
    const st = ScrollTrigger.getById(id); if (!st) return;
    gsap.to(window, { scrollTo: st.start, duration: 1, ease: 'power2.inOut', onComplete: () => ScrollTrigger.refresh() });
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    e.preventDefault();                                   // no instant hash jumps
    const id = a.getAttribute('href').slice(1); if (id) LTBL.scrollTo(id);
  });
  // reload / back-forward: put the remembered position back now that the pins exist (the browser's own restore,
  // done by us because the pinned page is taller than the one it measured) — the one non-animated scroll on the page
  if (LTBL.restoreY > 10) { ScrollTrigger.refresh(); scrollTo(0, LTBL.restoreY); }
  if (document.readyState === 'complete') ScrollTrigger.refresh();
  else addEventListener('load', () => ScrollTrigger.refresh());
})();
