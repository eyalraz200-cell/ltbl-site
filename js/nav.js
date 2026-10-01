// Day nav (סקרולר component 12661:1380): previous label at the left padding, current centred, next at the right padding; 48px heading face, neighbours at 50%.
(function(){
  const folds = [...document.querySelectorAll('.fold[data-day]')];
  const list = document.querySelector('.daynav__list');
  const label = d => d === 'about' ? 'about' : d === 'contact' ? 'contact' : 'day ' + d;
  const items = folds.map(f => {
    const li = document.createElement('li');
    const b = document.createElement('button'); b.type = 'button'; b.className = 'daynav__item'; b.textContent = label(f.dataset.day);
    b.addEventListener('click', () => LTBL.scrollTo && LTBL.scrollTo(f.id));
    li.appendChild(b); list.appendChild(li); return b;
  });
  function setCurrent(i){
    items.forEach((b, k) => {
      b.classList.toggle('is-current', k === i);
      b.classList.toggle('is-near', Math.abs(k - i) === 1);
      b.classList.toggle('is-prev', k === i - 1);
      b.classList.toggle('is-next', k === i + 1);
      b.tabIndex = Math.abs(k - i) === 1 ? 0 : -1;
    });
  }
  setCurrent(0);
  window.LTBL.navSetCurrent = setCurrent;
})();
