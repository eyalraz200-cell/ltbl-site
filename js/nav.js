// Day nav (סקרולר 12661:1380) as a sliding strip, as in the reference video: label i sits at stage x = 864 + (i − p)·STEP,
// where p is the continuous frame position (0..8) from the scroll; opacity 1 at the centre, .5 one step away, 0 beyond.
(function(){
  const world = document.getElementById('world');
  const frames = world.dataset.frames.split(','), days = world.dataset.days.split(',');
  const list = document.querySelector('.daynav__list');
  const STEP = 606;                       // Figma: current label centred at 864, next label centred at ~1470
  const label = d => d === 'about' ? 'about' : d === 'contact' ? 'contact' : 'day ' + d;
  const items = frames.map((id, i) => {
    const li = document.createElement('li');
    const b = document.createElement('button'); b.type = 'button'; b.className = 'daynav__item'; b.textContent = label(days[i]);
    b.addEventListener('click', () => LTBL.scrollTo && LTBL.scrollTo(id));
    li.appendChild(b); list.appendChild(li); return b;
  });
  let pos = 0, cur = -1;
  function render(){
    const sc = LTBL.stageScale();
    items.forEach((b, i) => {
      const d = i - pos, a = Math.max(0, 1 - 0.5 * Math.abs(d));
      b.style.left = ((864 + d * STEP) * sc) + 'px';
      b.style.opacity = Math.abs(d) > 1.5 ? 0 : a;
      b.style.pointerEvents = Math.abs(d) <= 1.2 ? 'auto' : 'none';
      b.tabIndex = Math.abs(Math.round(d)) === 1 ? 0 : -1;
    });
  }
  function setPos(p){
    pos = p; render();
    const i = Math.round(p);
    if (i !== cur) { cur = i; items.forEach((b, k) => b.classList.toggle('is-current', k === i)); }
  }
  setPos(0);
  addEventListener('resize', render);
  window.LTBL.navSetPos = setPos;
  window.LTBL.navSetCurrent = i => setPos(i);
})();
