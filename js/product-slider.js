(function () {
  const container = document.getElementById('hero-slider');
  if (!container) return;
  const thumbsWrap = document.getElementById('hero-thumbs');
  const folder = container.dataset.folder;
  const maxProbe = 30;
  const images = [];
  let current = 0;

  function probe(n) {
    if (n > maxProbe) return build();
    const test = new Image();
    test.onload = () => { images.push(n); probe(n + 1); };
    test.onerror = () => build();
    test.src = folder + '/' + n + '.jpg';
  }

  function build() {
    if (images.length === 0) {
      container.innerHTML = '<div class="img-slot-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span>Bilde kommer</span></div>';
      return;
    }
    container.innerHTML = images.map((n, i) =>
      `<img src="${folder}/${n}.jpg" alt="" loading="${i === 0 ? 'eager' : 'lazy'}" class="${i === 0 ? 'active' : ''}">`
    ).join('');
    if (images.length > 1) {
      container.insertAdjacentHTML('beforeend', `
        <button class="slider-arrow prev" aria-label="Forrige bilde">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="slider-arrow next" aria-label="Neste bilde">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <div class="slider-dots">${images.map((_, i) => `<button class="slider-dot ${i === 0 ? 'active' : ''}" aria-label="Bilde ${i + 1}"></button>`).join('')}</div>
      `);
      container.querySelector('.prev').addEventListener('click', () => move(-1));
      container.querySelector('.next').addEventListener('click', () => move(1));
      container.querySelectorAll('.slider-dot').forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

      if (thumbsWrap) {
        thumbsWrap.innerHTML = images.map((n, i) =>
          `<button class="thumb-btn ${i === 0 ? 'active' : ''}" aria-label="Bilde ${i + 1}"><img src="${folder}/${n}.jpg" alt="" loading="lazy"></button>`
        ).join('');
        thumbsWrap.querySelectorAll('.thumb-btn').forEach((btn, i) => btn.addEventListener('click', () => goTo(i)));
        thumbsWrap.style.display = '';
      }
    } else if (thumbsWrap) {
      thumbsWrap.style.display = 'none';
    }
  }

  function goTo(i) {
    current = i;
    container.querySelectorAll('img').forEach((img, idx) => img.classList.toggle('active', idx === current));
    container.querySelectorAll('.slider-dot').forEach((dot, idx) => dot.classList.toggle('active', idx === current));
    if (thumbsWrap) {
      thumbsWrap.querySelectorAll('.thumb-btn').forEach((btn, idx) => btn.classList.toggle('active', idx === current));
    }
  }

  function move(delta) {
    goTo((current + delta + images.length) % images.length);
  }

  probe(1);
})();
