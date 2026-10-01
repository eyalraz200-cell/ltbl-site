(function(){
  const W = 1728, H = 1117;
  const root = document.documentElement;
  function compute(){
    // cover: scale so the stage fills both axes; overflow is clipped by .fold
    const s = Math.max(innerWidth / W, innerHeight / H);
    root.style.setProperty('--stage-scale', s.toFixed(4));
    return s;
  }
  let scale = compute();
  let raf = 0;
  addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      scale = compute();
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });

  // Scroll restoration is ours: the pins change the page height after load, so the browser's own restore lands on the
  // wrong fold. Remember the position; on a reload / back-forward the intro is skipped and scroll.js restores it once
  // the pins exist (Review Focus 2).
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const nav = performance.getEntriesByType('navigation')[0];
  const restoring = !!nav && (nav.type === 'reload' || nav.type === 'back_forward');
  let saved = 0;
  try { saved = restoring ? (+sessionStorage.getItem('ltbl:y') || 0) : 0; } catch (e) {}
  let tick = 0;
  addEventListener('scroll', () => { if (tick) return; tick = requestAnimationFrame(() => { tick = 0; try { sessionStorage.setItem('ltbl:y', String(scrollY)); } catch (e) {} }); }, { passive: true });
  addEventListener('pagehide', () => { try { sessionStorage.setItem('ltbl:y', String(scrollY)); } catch (e) {} });

  const desktop = matchMedia('(min-width:1024px)');
  window.LTBL = {
    stageScale: () => scale,
    isDesktop: () => desktop.matches,
    reducedMotion: () => matchMedia('(prefers-reduced-motion: reduce)').matches,
    restoreY: saved,            // > 0 only on a reload / back-forward with a remembered position
  };
  // a window widened past the breakpoint starts the engine the only clean way: one fresh load (position remembered)
  desktop.addEventListener('change', e => { if (e.matches && !window.LTBL.engineUp) location.reload(); });
})();
