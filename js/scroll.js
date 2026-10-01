// The world: one pinned stage, nine Figma frames as keyframes. Every [data-k] element carries its box in each frame
// ([x,y] or [x,y,w,h,rotation,opacity], already carried across frames by tools/gen-world.py). Scroll progress runs
// 0..8; between frame i and i+1 the element tweens from one box to the other (ease none, scrubbed), with a hold at
// each keyframe so every fold rests. Nothing in the document scrolls — the paper pieces move inside the frame.
(async function(){
  if (!LTBL.isDesktop()) return;
  // Content pieces parked outside the Figma frame must not show in the side margins of a wide window (the stage no
  // longer clips, so pieces can slide to the window edge). A piece is visible at keyframe i only if its box touches the
  // frame there; during a move it is visible if it touches the frame at either end. Hide frame-0 outsiders now, before
  // the intro.
  const W = 1728, H = 1117;
  const stageEls = [...document.querySelectorAll('#world .stage > [data-k]')].map(el => {
    const k = JSON.parse(el.dataset.k), w = el.offsetWidth, h = el.offsetHeight;
    const vis = k.map(v => { const bw = v[2] == null ? w : v[2], bh = v[3] == null ? h : v[3]; return v[0] < W && v[0] + bw > 0 && v[1] < H && v[1] + bh > 0; });
    return { el, vis };
  });
  stageEls.forEach(({ el, vis }) => { el.style.visibility = vis[0] ? '' : 'hidden'; });
  await LTBL.introDone;
  if (!window.gsap || !window.ScrollTrigger || !window.ScrollToPlugin) return;   // CDN down: the page stays on frame 0
  window.LTBL.engineUp = true;
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  const world = document.getElementById('world');
  const FRAMES = world.dataset.frames.split(',');
  const N = FRAMES.length;
  const HOLD = 0.25;                 // fraction of each scroll segment that rests on the keyframe before/after a move
  const reduced = LTBL.reducedMotion() || location.search.includes('notravel');

  const els = [...world.querySelectorAll('[data-k]')].map(el => ({ el, k: JSON.parse(el.dataset.k) }));
  const box = (k, i) => { const v = k[i]; return { x: v[0], y: v[1], w: v[2], h: v[3], r: v[4] || 0, o: v[5] == null ? 1 : v[5] }; };
  const diff = (a, b) => a.x !== b.x || a.y !== b.y || a.w !== b.w || a.h !== b.h || a.r !== b.r || a.o !== b.o;

  const tl = gsap.timeline({
    scrollTrigger: {
      id: 'world', trigger: world, start: 'top top', end: '+=' + (N - 1) * 100 + '%',
      pin: true, scrub: reduced ? false : 0.6, anticipatePin: 1,
      snap: reduced ? { snapTo: 1 / (N - 1), duration: 0 } : false,
      onUpdate: self => syncNav(self.progress)
    }
  });
  els.forEach(({ el, k }) => {
    const b0 = box(k, 0);
    const base = { x: b0.x, y: b0.y };                      // inline left/top = frame 0; tweens are deltas from it
    gsap.set(el, { x: 0, y: 0, rotation: b0.r, opacity: b0.o, ...(b0.w != null ? { width: b0.w, height: b0.h } : {}) });
    for (let i = 0; i < N - 1; i++) {
      const a = box(k, i), b = box(k, i + 1);
      if (!diff(a, b)) continue;
      const to = { x: b.x - base.x, y: b.y - base.y, rotation: b.r, opacity: b.o, ease: 'none', duration: reduced ? 0.001 : 1 - 2 * HOLD };
      if (b.w != null) { to.width = b.w; to.height = b.h; }
      tl.to(el, to, i + HOLD);
    }
  });
  stageEls.forEach(({ el, vis }) => {
    for (let i = 0; i < N - 1; i++) {
      tl.set(el, { visibility: vis[i] ? 'inherit' : 'hidden' }, i);
      tl.set(el, { visibility: vis[i] || vis[i + 1] ? 'inherit' : 'hidden' }, i + HOLD);
      tl.set(el, { visibility: vis[i + 1] ? 'inherit' : 'hidden' }, i + 1 - HOLD);
    }
  });
  tl.to({}, { duration: 0.001 }, N - 1);                  // pin the timeline length to exactly N-1 segments

  // nav + anchors
  function syncNav(p){ if (LTBL.navSetPos) LTBL.navSetPos(p * (N - 1)); }
  window.LTBL.frameIndex = id => FRAMES.indexOf(id);
  window.LTBL.scrollTo = id => {
    const st = ScrollTrigger.getById('world'); const i = FRAMES.indexOf(id); if (!st || i < 0) return;
    gsap.to(window, { scrollTo: st.start + (st.end - st.start) * i / (N - 1), duration: 1, ease: 'power2.inOut', onComplete: () => ScrollTrigger.refresh() });
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    e.preventDefault();                                   // no instant hash jumps
    const id = a.getAttribute('href').slice(1); if (id) LTBL.scrollTo(id);
  });
  if (LTBL.restoreY > 10) { ScrollTrigger.refresh(); scrollTo(0, LTBL.restoreY); }   // reload: the one non-animated scroll
  if (document.readyState === 'complete') ScrollTrigger.refresh();
  else addEventListener('load', () => ScrollTrigger.refresh());
  syncNav(ScrollTrigger.getById('world').progress);
})();
