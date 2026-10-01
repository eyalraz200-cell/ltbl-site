// The world: one pinned stage, nine Figma frames as keyframes. Every [data-k] element carries its box in each frame
// ([x,y] or [x,y,w,h,rotation,opacity], already carried across frames by tools/gen-world.py). Scroll progress runs
// 0..8; between frame i and i+1 the element tweens from one box to the other (scrubbed; feel = MOTION below), with a
// rest at each keyframe. Nothing in the document scrolls — the paper pieces move inside the frame.
(async function(){
  if (!LTBL.isDesktop()) return;
  // Content pieces parked outside the Figma frame must not show in the margins of a window of another shape (the stage
  // doesn't clip). vis[i] = the piece is in the frame at keyframe i; where it isn't, build() pushes it out by the margin.
  // Hide frame-0 outsiders until the engine places them.
  const W = 1728, H = 1117;
  const stageEls = [...document.querySelectorAll('#world .stage > [data-k]')].map(el => {
    const k = JSON.parse(el.dataset.k), w = el.offsetWidth, h = el.offsetHeight;
    // "in the frame" = at least a fifth of the box is inside it; a piece Figma parks just over an edge (the footer title
    // pokes 50px into frame 0, hidden by Figma's clip and its own padding) counts as parked, so it moves out with the margin
    const vis = k.map(v => { const bw = v[2] == null ? w : v[2], bh = v[3] == null ? h : v[3];
      const ix = Math.max(0, Math.min(W, v[0] + bw) - Math.max(0, v[0])), iy = Math.max(0, Math.min(H, v[1] + bh) - Math.max(0, v[1]));
      return ix * iy >= 0.2 * bw * bh; });
    return { el, vis, w, h };
  });
  stageEls.forEach(({ el, vis }) => { el.style.visibility = vis[0] ? '' : 'hidden'; });
  // Links on parked pieces are inert: focusing one (Tab) made the browser scroll #world itself to reveal it, which tore
  // the scene apart. A piece's links are live only while it is in the frame at the nearest keyframe.
  const linked = stageEls.filter(({ el }) => el.matches('a,button') || el.querySelector('a,button'));
  const setInert = f => linked.forEach(({ el, vis }) => { el.inert = !vis[f]; });
  setInert(0);
  await LTBL.introDone;
  if (!window.gsap || !window.ScrollTrigger || !window.ScrollToPlugin) return;   // CDN down: the page stays on frame 0
  window.LTBL.engineUp = true;
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  const world = document.getElementById('world');
  const FRAMES = world.dataset.frames.split(',');
  const N = FRAMES.length;
  const reduced = LTBL.reducedMotion() || location.search.includes('notravel');

  const els = [...world.querySelectorAll('[data-k]')].map(el => ({ el, k: JSON.parse(el.dataset.k) }));
  const box = (k, i) => { const v = k[i]; return { x: v[0], y: v[1], w: v[2], h: v[3], r: v[4] || 0, o: v[5] == null ? 1 : v[5] }; };
  const diff = (a, b) => a.x !== b.x || a.y !== b.y || a.w !== b.w || a.h !== b.h || a.r !== b.r || a.o !== b.o;

  // MOTION is the feel of the scrub (docs/wiki/Scroll-engine.md); a harness may rebuild with other values via
  // LTBL.rebuildWorld(opts). The Figma prototype's own transition (one frame per drag, 300 ms ease-out) was tried and
  // rejected by Eyal on 2026-10-01.
  const MOTION = { ease: 'none', hold: 0.15, scrub: 0.6, snap: false, len: 300, creep: 0, pace: 'mid', edge: false, floor: 0.5 };   // Eyal's pick, 2026-10-01 (compare/ harness)
  let tl;
  function build(m){
    const ease = m.ease, hold = m.hold, dur = 1 - 2 * hold;
    tl = gsap.timeline({
      scrollTrigger: {
        id: 'world', trigger: world, start: 'top top', end: '+=' + (N - 1) * m.len + '%',
        pin: true, anticipatePin: 1,
        scrub: reduced ? true : m.scrub,                     // reduced: still tied to scroll (false would autoplay the timeline)
        snap: reduced ? { snapTo: 1 / (N - 1), duration: 0 } : (m.snap ? { snapTo: 1 / (N - 1), duration: { min: 0.3, max: 0.9 }, delay: 0.08, ease: 'power2.inOut' } : false),
        onUpdate: self => syncNav(self.progress)
      }
    });
    const sc = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--stage-scale')) || 1;
    const vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;   // without a classic scrollbar
    const mx = Math.max(0, (vw / sc - W) / 2), my = Math.max(0, (vh / sc - H) / 2);
    const outer = new Map(stageEls.map(o => [o.el, o]));
    const at = (el, k, i) => {
      const b = box(k, i), o = outer.get(el); if (!o || o.vis[i]) return b;
      const bw = b.w == null ? o.w : b.w, bh = b.h == null ? o.h : b.h;
      if (m.edge) {                                           // park JUST past the window edge, however far Figma parks it
        const pad = 4 + (b.r ? 0.3 * Math.max(bw, bh) : 0);
        if (b.x >= W) b.x = W + mx + pad; else if (b.x + bw <= 0) b.x = -mx - bw - pad;
        if (b.y >= H) b.y = H + my + pad; else if (b.y + bh <= 0) b.y = -my - bh - pad;
      } else {                                                // keep Figma's distance, pushed out by the margin (0 in an exact-fit window),
        const cx = b.x + bw / 2, cy = b.y + bh / 2;           // on the side its centre is past, so a sliver over the edge stays a sliver
        if (cx >= W) b.x += mx; else if (cx <= 0) b.x -= mx;
        if (cy >= H) b.y += my; else if (cy <= 0) b.y -= my;
      }
      return b;
    };
    // pace 'time': every piece takes the whole move (long trips fly faster). Otherwise ONE speed in px for all: the
    // segment's longest actual trip fills the move, shorter trips take proportionally less time and start with the
    // move, end with it, or sit centred.
    const dist = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
    const far = [];
    for (let i = 0; i < N - 1; i++) far[i] = Math.max(1, ...els.filter(({ el }) => outer.has(el)).map(({ el, k }) => dist(at(el, k, i), at(el, k, i + 1))));   // content pieces set the speed; the backdrop keeps its own
    els.forEach(({ el, k }) => {
      const b0 = box(k, 0), p0 = at(el, k, 0);
      const base = { x: b0.x, y: b0.y };                      // inline left/top = frame 0; tweens are deltas from it
      gsap.set(el, { x: p0.x - b0.x, y: p0.y - b0.y, visibility: 'inherit', rotation: b0.r, opacity: b0.o, ...(b0.w != null ? { width: b0.w, height: b0.h } : {}) });
      for (let i = 0; i < N - 1; i++) {
        const a = at(el, k, i), b = at(el, k, i + 1);
        if (!diff(a, b)) continue;
        // never still (creep > 0): a slow linear drift through the rests covers creep of the trip at each end;
        // the eased move covers the rest. Pace: one speed for all, set by the segment's longest trip (shortest trip
        // still takes half the move, so nothing snaps).
        const c = m.creep && hold > 0 && !reduced ? m.creep : 0;
        const lerp = f => { const o = { x: a.x + (b.x - a.x) * f - base.x, y: a.y + (b.y - a.y) * f - base.y, rotation: a.r + (b.r - a.r) * f, opacity: a.o + (b.o - a.o) * f };
          if (b.w != null) { o.width = a.w + (b.w - a.w) * f; o.height = a.h + (b.h - a.h) * f; } return o; };
        let t0 = i + hold, d = reduced ? 0.001 : dur;
        if (m.pace !== 'time' && !reduced && outer.has(el)) {
          d = Math.min(dur, Math.max(m.floor == null ? 0.5 * dur : m.floor * dur, dur * dist(a, b) / far[i]));
          t0 += m.pace === 'end' ? dur - d : m.pace === 'mid' ? (dur - d) / 2 : 0;
        }
        if (c) {
          tl.to(el, { ...lerp(c), ease: 'none', duration: t0 - i }, i);
          tl.to(el, { ...lerp(1 - c), ease, duration: d }, t0);
          tl.to(el, { ...lerp(1), ease: 'none', duration: i + 1 - t0 - d }, t0 + d);
        } else tl.to(el, { ...lerp(1), ease, duration: d }, t0);
      }
    });
    tl.to({}, { duration: 0.001 }, N - 1);                  // pin the timeline length to exactly N-1 segments
  }
  build(MOTION);
  window.LTBL.rebuildWorld = (opts, keep) => {            // keep: the progress to land on (default: where we are now)
    const st = ScrollTrigger.getById('world');
    const p = keep != null ? keep : st ? gsap.utils.clamp(0, 1, (scrollY - st.start) / (st.end - st.start)) : 0;
    tl.scrollTrigger.kill(true); tl.kill();
    Object.assign(MOTION, opts); build(MOTION);
    ScrollTrigger.refresh();
    const s2 = ScrollTrigger.getById('world');
    s2.scroll(s2.start + (s2.end - s2.start) * p); s2.update(); tl.progress(p);   // stay on the same spot; no travel
  };

  // Margins change with the window, so a resize rebuilds. The place is read at the FIRST event of a burst: by the time the
  // debounce fires, ScrollTrigger has already refreshed start/end while scrollY stayed put, so reading it then is wrong.
  let rz, keepP = null;
  addEventListener('resize', () => {
    if (keepP == null) keepP = ScrollTrigger.getById('world').progress;
    clearTimeout(rz); rz = setTimeout(() => { LTBL.rebuildWorld({}, keepP); keepP = null; }, 250);
  });

  // nav + anchors
  function syncNav(p){ setInert(Math.round(p * (N - 1))); if (LTBL.navSetPos) LTBL.navSetPos(p * (N - 1)); }
  window.LTBL.frameIndex = id => FRAMES.indexOf(id);
  window.LTBL.scrollTo = id => {
    const st = ScrollTrigger.getById('world'); const i = FRAMES.indexOf(id); if (!st || i < 0) return;
    gsap.to(window, { scrollTo: st.start + (st.end - st.start) * i / (N - 1), duration: 1, ease: 'power2.inOut', overwrite: true, onComplete: () => ScrollTrigger.refresh() });
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    e.preventDefault();                                   // no instant hash jumps
    const id = a.getAttribute('href').slice(1); if (id) LTBL.scrollTo(id);
  });
  if (LTBL.restoreY > 10) { ScrollTrigger.refresh(); scrollTo(0, LTBL.restoreY); }   // Back/Forward: the one non-animated scroll
  if (document.readyState === 'complete') ScrollTrigger.refresh();
  else addEventListener('load', () => ScrollTrigger.refresh());
  syncNav(ScrollTrigger.getById('world').progress);
})();
