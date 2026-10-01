(function(){
  const W = 1728, H = 1117;
  const root = document.documentElement;
  function compute(){
    // contain (Eyal's pick, 2026-10-01, over cover / fit-height): the whole 1728x1117 frame is always visible;
    // the --ground colour of .fold shows as bars where the window is a different shape
    const s = Math.min(innerWidth / W, innerHeight / H);
    // backdrop (.backdrop, scenery + darkener) covers instead: no bars, scenery edges crop, content never does
    root.style.setProperty('--bleed-scale', Math.max(innerWidth / W, innerHeight / H).toFixed(4));
    root.style.setProperty('--stage-scale', s.toFixed(4));
    // big hands: scale about the fingertip just enough that the cut ends of the arms clear the window's side margins.
    // Shabbat frame (the widest reach): god tip x 895, image right edge 1766; Adam tip x 811, image left edge -52.
    const m = Math.max(0, (innerWidth / s - W) / 2) + 20;
    root.style.setProperty('--bh-scale', Math.max(1, (W + m - 895) / 871, (811 + m) / 863).toFixed(3));
    root.style.setProperty('--stage-top', ((innerHeight - H * s) / 2).toFixed(2) + 'px');   // where the frame's top edge sits (the nav hangs there)
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
  const restoring = !!nav && nav.type === 'back_forward';   // a refresh always restarts at the hero with the intro (Eyal, 2026-10-01); only Back/Forward returns to the frame
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
