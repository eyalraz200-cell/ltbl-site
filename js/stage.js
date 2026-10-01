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
  window.LTBL = {
    stageScale: () => scale,
    isDesktop: () => matchMedia('(min-width:1024px)').matches,
    reducedMotion: () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
})();
