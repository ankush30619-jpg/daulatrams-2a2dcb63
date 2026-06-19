document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId || !window.__PREMIUM_DATA || !window.__PREMIUM_DATA[productId]) {
    return;
  }

  const data = window.__PREMIUM_DATA[productId];
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
        <strong>${p.t}</strong>
        <span>${p.d}</span>
      </div>`).join('') : '';

    html += `
    <section class="premium-darkband sr">
      <div class="container premium-darkband-inner">
        <div class="premium-darkband-img">
          <img src="${d.image}" alt="${d.h2.replace(/<[^>]*>?/gm, '')}" loading="lazy">
        </div>
        <div class="premium-darkband-copy">
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
    <section class="premium-problems sr">
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
    <section class="premium-differ sr">
      <div class="container premium-differ-inner">
        <div class="premium-differ-img">
          <img src="${d.image}" alt="${d.h2.replace(/<[^>]*>?/gm, '')}" loading="lazy">
        </div>
        <div class="premium-differ-copy">
          <span class="premium-eyebrow">${d.eyebrow}</span>
          <h2 class="premium-h2">${d.h2}</h2>
          <ul class="premium-differ-list">${listHtml}</ul>
        </div>
      </div>
    </section>`;
  }

  if (data.megastat) {
    const m = data.megastat;
    html += `
    <section class="premium-megastat sr">
      <div class="container premium-megastat-inner">
        <div class="premium-mega-num">${m.num}</div>
        <div class="premium-mega-copy">
          <span class="premium-eyebrow">${m.eyebrow}</span>
          <h3>${m.h3}</h3>
          <p>${m.p}</p>
          <button class="premium-btn-cta" onclick="document.getElementById('buy-btn').click()">BUY NOW</button>
        </div>
      </div>
    </section>`;
  }

  if (data.compare) {
    const c = data.compare;
    const rowsHtml = c.rows ? c.rows.map(r => `
      <tr>
        <td>${r.label}</td>
        <td class="vc-us">${r.us}</td>
        <td class="vc-them">${r.them}</td>
      </tr>`).join('') : '';

    html += `
    <section class="premium-compare sr">
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
    const stepsHtml = h.steps ? h.steps.map(s => `
      <div class="premium-htstep">
        <div class="vh-num">${s.num}</div>
        <div class="vh-ico">${s.ico}</div>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
      </div>`).join('') : '';

    let timelineHtml = '';
    if (h.timeline) {
      const tl = h.timeline;
      timelineHtml = `
      <div class="premium-timeline">
        <div class="vt-img">
          <img src="${tl.img}" alt="Timeline" loading="lazy">
        </div>
        <div class="vt-content">
          <h3>The Timeline</h3>
          <div class="vt-grid">
            <div class="vt-point"><strong>${tl.w1.t}</strong><p>${tl.w1.d}</p></div>
            <div class="vt-point"><strong>${tl.w3.t}</strong><p>${tl.w3.d}</p></div>
            <div class="vt-point"><strong>${tl.m2.t}</strong><p>${tl.m2.d}</p></div>
            <div class="vt-point"><strong>${tl.m3.t}</strong><p>${tl.m3.d}</p></div>
          </div>
        </div>
      </div>`;
    }

    html += `
    <section class="premium-howto sr">
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

  if (data.benefitsDark) {
    const b = data.benefitsDark;
    const bensHtml = b.benefits ? b.benefits.map(ben => `
      <div class="premium-benefit">
        <div class="vb-ico">${ben.ico}</div>
        <h3>${ben.title}</h3>
        <p>${ben.desc}</p>
      </div>`).join('') : '';

    html += `
    <section class="premium-benefits-dark sr">
      <div class="container">
        <div class="premium-sec-head light">
          <span class="premium-eyebrow light">${b.eyebrow}</span>
          <h2 class="premium-h2 light">${b.h2}</h2>
        </div>
        <div class="premium-benefits-grid">${bensHtml}</div>
      </div>
    </section>`;
  }

  if (data.lifestyle) {
    const l = data.lifestyle;
    const cardsHtml = l.cards ? l.cards.map(c => `
      <figure class="premium-life-card">
        <img src="${c.img}" alt="${c.title}" loading="lazy">
        <figcaption>
          <span class="vl-tag">${c.tag}</span>
          <h3>${c.title}</h3>
        </figcaption>
      </figure>`).join('') : '';

    html += `
    <section class="premium-lifestyle sr">
      <div class="container">
        <div class="premium-sec-head">
          <span class="premium-eyebrow dark">${l.eyebrow}</span>
          <h2 class="premium-h2 dark">${l.h2}</h2>
        </div>
        <div class="premium-lifestyle-grid">${cardsHtml}</div>
      </div>
    </section>`;
  }

  container.innerHTML = html;
});
