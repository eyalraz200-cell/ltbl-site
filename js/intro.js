// Once-on-load intro: the five סרטון frames (12649:1136, 1121, 1105, 1073, 1047) then the hero rest state (12649:1019).
// Every offset below is (Figma position in that frame) − (position in the hero rest frame), in stage px.
(function(){
  const hero = document.querySelector('#fold-hero');   // the fold: clouds sit in .backdrop, titles in .stage
  const introClouds = hero.querySelector('.intro-clouds');
  let skip = !LTBL.isDesktop() || LTBL.reducedMotion() || LTBL.restoreY > 10 || location.search.includes('nointro');

  if (skip || !window.gsap) {          // no GSAP (CDN down): plain page, hero at rest
    introClouds.remove();
    window.LTBL.introDone = Promise.resolve();
    return;
  }
  const q = gsap.utils.selector(hero);

  // dark intro clouds: DOM = סרטון 1 positions
  const DARK3 = { 'd-8':[1,-83], 'd-10':[226,213], 'd-9':[-217,137], 'd-7':[-137,51], 'd-6':[92,0], 'd-1':[-69,51], 'd-2':[0,0], 'd-3':[42,-86], 'd-4':[192,18], 'd-5':[-137,-94] };
  const DARK4 = { 'd-8':[-678,-544], 'd-10':[544,861], 'd-9':[-354,1093], 'd-7':[-808,438], 'd-6':[633,-610], 'd-1':[-446,459], 'd-2':[-923,-139], 'd-3':[49,-478], 'd-4':[1150,205], 'd-5':[-1223,44] };
  // light clouds: DOM = hero rest; parked = סרטון 4
  const LIGHT4 = { 'c-front-left':[-406,-588], 'c-bl-back':[-875,46], 'c-br-back':[588,-179], 'c-br-front':[892,494], 'c-bl-front':[-494,443], 'c-tiny':[437,-568], 'c-left-back':[-481,-175], 'c-left-far':[-376,-341], 'c-top-big':[63,-398], 'c-small-right':[1086,-535], 'c-tr-front':[684,-423] };
  const key = (el, map) => Object.keys(map).find(k => el.classList.contains(k));
  const xOf = map => (i, el) => map[key(el, map)][0];
  const yOf = map => (i, el) => map[key(el, map)][1];

  document.documentElement.classList.add('is-intro');
  const T = { t1: 0.8, t2: 2.2, part: 2.2, open: 4.0, clear: 5.8, land: 7.4 };   // keyframe start times (s)
  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
  tl.set(q('.title-1,.title-2,.sub,.logo,.ticket,.hand'), { autoAlpha: 0 })
    .set(q('.cloud'), { x: xOf(LIGHT4), y: yOf(LIGHT4) })
    .set(q('.logo'), { y: -348 })
    .set(q('.ticket'), { y: 269 })
    .set(q('.hand--right'), { x: 748.4, y: -41 })
    .set(q('.hand--left'), { x: -861, y: 16 })
    // סרטון 2: "LET THERE BE"
    .to(q('.title-1'), { autoAlpha: 1, duration: 1.0 }, T.t1)
    // סרטון 3: "LIGHT", dark clouds part
    .to(q('.title-2'), { autoAlpha: 1, duration: 1.0 }, T.t2)
    .to(q('.dark'), { x: xOf(DARK3), y: yOf(DARK3), duration: 1.6 }, T.part)
    // סרטון 4: dark clouds leave the frame, bare sky
    .to(q('.dark'), { x: xOf(DARK4), y: yOf(DARK4), duration: 1.8, ease: 'power2.in' }, T.open)
    // סרטון 5: light clouds arrive, subtitle and ticket
    .to(q('.cloud'), { x: 0, y: 0, duration: 1.8, stagger: 0.03 }, T.clear)
    .to(q('.sub'), { autoAlpha: 1, duration: 0.8 }, T.clear + 0.6)
    .to(q('.ticket'), { autoAlpha: 1, y: 0, duration: 1.0, ease: 'power2.out' }, T.clear + 0.8)
    // hero rest: logo drops in, hands fly in
    .to(q('.logo'), { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' }, T.land)
    .to(q('.hand'), { autoAlpha: 1, x: 0, y: 0, duration: 1.0, ease: 'power2.out' }, T.land);

  window.LTBL.introDone = new Promise(res => tl.eventCallback('onComplete', () => {
    introClouds.remove();
    document.documentElement.classList.remove('is-intro');
    res();
  }));
})();
