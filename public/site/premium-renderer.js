document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'veer-ved-shakti-60';

  if (!productId || !window.__PREMIUM_DATA) {
    return;
  }

  // Support variant IDs (e.g. desi-cow-ghee-1kg) by finding the longest matching base ID
  const keys = Object.keys(window.__PREMIUM_DATA).sort((a, b) => b.length - a.length);
  const baseId = keys.find(key => productId.startsWith(key));
  
  if (!baseId) {
    return;
  }

  const data = window.__PREMIUM_DATA[baseId];
  const container = document.getElementById('premium-sections-container');
  if (!container) return;

  if (data.theme) {
    document.body.classList.add(`theme-${data.theme}`);
  }

  let html = '';

  if (data.darkband) {
    const d = data.darkband;
    const pillarsHtml = d.pillars ? d.pillars.map(p => `
      <div class="premium-pillar">
        <div class="vp-num">${p.num}</div>
        <strong class="vp-t">${p.t}</strong>
        <span class="vp-d">${p.d}</span>
      </div>`).join('') : '';

    html += `
    <section class="premium-darkband">
      <div class="container">
        <div class="premium-darkband-copy" style="max-width:700px;margin:0 auto;text-align:center;">
          <span class="premium-eyebrow">${d.eyebrow}</span>
          <h2 class="premium-h2">${d.h2}</h2>
          <p class="premium-lead">${d.lead}</p>
          <div class="premium-pillars">${pillarsHtml}</div>
        </div>
      </div>
    </section>`;
  }

  if (data.problems) {
    const p = data.problems;
    const cardsHtml = p.cards ? p.cards.map(c => `
      <article class="premium-problem">
        <div class="vp-img"><img src="${c.img}" alt="${c.title}" loading="lazy"></div>
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
      </article>`).join('') : '';

    html += `
    <section class="premium-problems">
      <div class="container">
        <div class="premium-sec-head">
          <span class="premium-eyebrow dark">${p.eyebrow}</span>
          <h2 class="premium-h2 dark">${p.h2}</h2>
          <p class="premium-lead dark" style="max-width:600px; margin:0 auto">${p.lead}</p>
        </div>
        <div class="premium-problems-grid">${cardsHtml}</div>
      </div>
    </section>`;
  }

  if (data.differ) {
    const d = data.differ;
    const listHtml = d.list ? d.list.map(l => `
      <li><span class="vd-check">✓</span><div><strong>${l.strong}</strong> ${l.text}</div></li>`).join('') : '';

    html += `
    <section class="premium-differ">
      <div class="container">
        <div class="premium-differ-copy" style="max-width:700px;margin:0 auto;">
          <span class="premium-eyebrow">${d.eyebrow}</span>
          <h2 class="premium-h2">${d.h2}</h2>
          <ul class="premium-differ-list">${listHtml}</ul>
        </div>
      </div>
    </section>`;
  }

  // megastat section removed

  if (data.compare) {
    const c = data.compare;
    const rowsHtml = c.rows ? c.rows.map(r => `
      <tr>
        <td>${r.label}</td>
        <td class="vc-us">${r.us}</td>
        <td class="vc-them">${r.them}</td>
      </tr>`).join('') : '';

    html += `
    <section class="premium-compare">
      <div class="container">
        <div class="premium-sec-head">
          <span class="premium-eyebrow dark">${c.eyebrow}</span>
          <h2 class="premium-h2 dark">${c.h2}</h2>
        </div>
        <div class="premium-compare-wrap">
          <table class="premium-compare-table">
            <thead>
              <tr><th></th><th class="vc-us">Our Product</th><th class="vc-them">Other Brands</th></tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
      </div>
    </section>`;
  }

  if (data.howto) {
    const h = data.howto;
    const stepsHtml = h.steps ? h.steps.map(s =>
      `
      <div class="premium-htstep">
        <div class="vh-num">${s.num}</div>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
      </div>`).join('') : '';

    let timelineHtml = '';

    html += `
    <section class="premium-howto">
      <div class="container">
        <div class="premium-sec-head">
          <span class="premium-eyebrow dark">${h.eyebrow}</span>
          <h2 class="premium-h2 dark">${h.h2}</h2>
        </div>
        <div class="premium-howto-steps">${stepsHtml}</div>
        ${timelineHtml}
      </div>
    </section>`;
  }

  // benefitsDark section removed


  container.innerHTML = html;
  if (typeof window.observeSR === 'function') window.observeSR(container);

  // Mobile problems carousel — auto-scroll + dots
  if (window.innerWidth <= 640) {
    const grid = container.querySelector('.premium-problems-grid');
    if (grid) {
      const cards = Array.from(grid.querySelectorAll('.premium-problem'));
      if (cards.length > 1) {
        // Inject dot indicators
        const dotsEl = document.createElement('div');
        dotsEl.className = 'pp-dots';
        dotsEl.innerHTML = cards.map((_,i) => `<div class="pp-dot${i===0?' active':''}"></div>`).join('');
        grid.parentElement.appendChild(dotsEl);
        const dots = Array.from(dotsEl.querySelectorAll('.pp-dot'));

        let current = 0;
        let timer;

        function goTo(idx) {
          current = (idx + cards.length) % cards.length;
          grid.scrollTo({ left: cards[current].offsetLeft, behavior: 'smooth' });
          dots.forEach((d,i) => d.classList.toggle('active', i === current));
        }

        function next() { goTo(current + 1); }

        function startAuto() { timer = setInterval(next, 2000); }
        function stopAuto() { clearInterval(timer); }

        startAuto();

        // Pause on touch, resume after
        grid.addEventListener('touchstart', stopAuto, { passive: true });
        grid.addEventListener('touchend', () => {
          stopAuto();
          // Snap to nearest card after swipe
          setTimeout(() => {
            const scrollLeft = grid.scrollLeft;
            let nearest = 0, minDist = Infinity;
            cards.forEach((c,i) => {
              const dist = Math.abs(c.offsetLeft - scrollLeft);
              if (dist < minDist) { minDist = dist; nearest = i; }
            });
            current = nearest;
            dots.forEach((d,i) => d.classList.toggle('active', i === current));
            startAuto();
          }, 300);
        }, { passive: true });
      }
    }
  }
});
