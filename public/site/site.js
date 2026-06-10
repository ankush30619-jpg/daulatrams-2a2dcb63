/* ============================================================
   DAULATRAM'S — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Hero + header reveal on load ---------- */
  const hero = document.querySelector(".hero");
  const header = document.querySelector(".header");

  window.addEventListener("load", () => {
    requestAnimationFrame(() => hero && hero.classList.add("revealed"));
    setTimeout(() => header && header.classList.add("revealed"), 500);
  });
  // Fallback if load already fired
  setTimeout(() => {
    if (hero) hero.classList.add("revealed");
    if (header) header.classList.add("revealed");
  }, 1200);

  // Banner-only home: header floats transparent at top, becomes solid green after a small scroll.
  if (!hero && header) {
    const banner = document.querySelector(".hero-banner");
    const setSolid = () => {
      const trigger = banner ? banner.offsetHeight * 0.5 : 200;
      header.classList.toggle("scrolled", window.scrollY > trigger);
    };
    setSolid();
    window.addEventListener("scroll", setSolid, { passive: true });
  }

  /* ---------- Header scroll state ---------- */
  const heroHeight = () => (hero ? hero.offsetHeight : window.innerHeight);
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("scrolled", !hero || y > heroHeight() - 120);
    // Fade hero content as you scroll past
    if (hero) {
      const hc = hero.querySelector(".hero-content");
      const cue = hero.querySelector(".scroll-cue");
      const p = Math.min(1, y / (heroHeight() * 0.7));
      if (hc) { hc.style.opacity = String(1 - p); hc.style.transform = `translateY(${p * -30}px)`; }
      if (cue) cue.style.opacity = String(1 - Math.min(1, y / 200));
    }
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Hero slider crossfade ---------- */
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  if (slides.length > 1) {
    let si = 0;
    setInterval(() => {
      slides[si].classList.remove("active");
      si = (si + 1) % slides.length;
      slides[si].classList.add("active");
    }, 5500);
  }

  /* ---------- Scroll reveal ---------- */
  const srObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const el = e.target;
        el.classList.add("in");
        if (el.classList.contains("sr-stagger")) {
          Array.from(el.children).forEach((c, i) => { c.style.transitionDelay = (i * 90) + "ms"; });
        }
        srObserver.unobserve(el);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".sr, .sr-stagger").forEach((el) => srObserver.observe(el));

  /* ---------- Count up ---------- */
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const dur = 1800; const start = performance.now();
      function step(now) {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(target * eased);
        el.textContent = val.toLocaleString("en-IN") + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

  /* ---------- Carousels (prev/next + drag) ---------- */
  document.querySelectorAll("[data-carousel]").forEach((wrap) => {
    const track = wrap.querySelector(".carousel");
    const prev = wrap.querySelector(".car-btn.prev");
    const next = wrap.querySelector(".car-btn.next");
    if (!track) return;
    const amount = () => {
      const card = track.querySelector(".product-card");
      return card ? card.offsetWidth + 24 : 280;
    };
    function update() {
      if (!prev || !next) return;
      prev.disabled = track.scrollLeft < 8;
      next.disabled = track.scrollLeft > track.scrollWidth - track.clientWidth - 8;
    }
    prev && prev.addEventListener("click", () => track.scrollBy({ left: -amount() * 2, behavior: "smooth" }));
    next && next.addEventListener("click", () => track.scrollBy({ left: amount() * 2, behavior: "smooth" }));
    track.addEventListener("scroll", update, { passive: true });
    update();
    // drag
    let down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener("mousedown", (e) => { down = true; moved = false; sx = e.pageX; sl = track.scrollLeft; track.style.cursor = "grabbing"; });
    window.addEventListener("mouseup", () => { down = false; track.style.cursor = ""; setTimeout(() => moved = false, 0); });
    window.addEventListener("mousemove", (e) => {
      if (!down) return;
      const dx = e.pageX - sx;
      if (Math.abs(dx) > 5) moved = true;
      track.scrollLeft = sl - dx;
    });
    track.addEventListener("click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  });

  /* ---------- Filter tabs ---------- */
  const filterData = window.__CONCERN_DATA || {};
  const tabsWrap = document.querySelector(".filter-tabs");
  const concernGrid = document.querySelector("#concern-grid");
  if (tabsWrap && concernGrid) {
    tabsWrap.addEventListener("click", (e) => {
      const tab = e.target.closest(".filter-tab");
      if (!tab) return;
      tabsWrap.querySelectorAll(".filter-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const key = tab.dataset.tab;
      concernGrid.style.opacity = "0";
      setTimeout(() => {
        concernGrid.innerHTML = (filterData[key] || []).map(window.renderProductCard).join("");
        concernGrid.style.opacity = "1";
      }, 220);
    });
  }

  /* ---------- Testimonial carousel ---------- */
  const tTrack = document.querySelector(".testi-track");
  const tDots = document.querySelector(".testi-dots");
  if (tTrack && tDots) {
    const cards = Array.from(tTrack.children);
    const perView = () => (window.innerWidth <= 640 ? 1 : window.innerWidth <= 980 ? 2 : 3);
    let idx = 0;
    function pages() { return Math.max(1, cards.length - perView() + 1); }
    function build() {
      tDots.innerHTML = "";
      for (let i = 0; i < pages(); i++) {
        const b = document.createElement("button");
        if (i === idx) b.classList.add("active");
        b.addEventListener("click", () => { idx = i; go(); });
        tDots.appendChild(b);
      }
    }
    function go() {
      idx = Math.min(idx, pages() - 1);
      const card = cards[0];
      const step = card.offsetWidth + 26;
      tTrack.style.transform = `translateX(${-idx * step}px)`;
      tDots.querySelectorAll("button").forEach((b, i) => b.classList.toggle("active", i === idx));
    }
    build(); go();
    setInterval(() => { idx = (idx + 1) % pages(); go(); }, 5000);
    window.addEventListener("resize", () => { build(); go(); });
  }

  /* ---------- Ingredient showcase ---------- */
  const ingList = document.querySelector(".ing-list");
  const ingDetail = document.querySelector("#ing-detail");
  const ingData = window.__INGREDIENTS || {};
  if (ingList && ingDetail) {
    ingList.addEventListener("click", (e) => {
      const item = e.target.closest(".ing-item");
      if (!item) return;
      ingList.querySelectorAll(".ing-item").forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
      const d = ingData[item.dataset.ing];
      if (!d) return;
      ingDetail.style.opacity = "0";
      setTimeout(() => {
        ingDetail.innerHTML = `
          <div class="ing-vis">${d.emoji}</div>
          <div>
            <h3>${d.name}</h3>
            <div class="sanskrit">${d.sanskrit}</div>
            <p class="ing-desc">${d.desc}</p>
            <div class="ing-tags">${d.tags.map((t) => `<span>${t}</span>`).join("")}</div>
            <div class="ing-used">Used in: <b>${d.used}</b></div>
          </div>`;
        ingDetail.style.opacity = "1";
      }, 220);
    });
  }

  /* ---------- Mobile drawer ---------- */
  const burger = document.querySelector(".hamburger");
  const drawer = document.querySelector(".drawer");
  const overlay = document.querySelector(".drawer-overlay");
  function closeDrawer() { drawer && drawer.classList.remove("open"); overlay && overlay.classList.remove("open"); }
  burger && burger.addEventListener("click", () => { drawer.classList.add("open"); overlay.classList.add("open"); });
  overlay && overlay.addEventListener("click", closeDrawer);
  document.querySelectorAll(".drawer-close, .drawer-links a").forEach((el) => el.addEventListener("click", closeDrawer));

  /* ---------- Newsletter submit ---------- */
  document.querySelectorAll("[data-newsletter]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const wrap = form.closest("[data-newsletter-wrap]") || form.parentElement;
      const msg = form.dataset.success || "🎉 Welcome to the Daulatram's family!";
      form.innerHTML = `<div class="success-msg">${msg}</div>`;
    });
  });

})();

/* ============================================================
   PAGE TRANSITION — wipe-fill effect between internal pages
   ============================================================ */
(function () {
  "use strict";
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Inject overlay if not already in DOM
  let panel = document.getElementById("page-transition");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "page-transition";
    panel.setAttribute("aria-hidden", "true");
    panel.innerHTML = '<span class="pt-mark"><img src="/__l5e/assets-v1/8b91c49d-e362-4b9e-8d22-d4250fc957c2/daulatrams-logo.png" alt="Daulatram\u2019s" /></span>';
    document.body.appendChild(panel);
  }

  // Play reveal-in on entry
  if (!reduce) {
    panel.classList.add("pt-in");
    requestAnimationFrame(() => {
      setTimeout(() => panel.classList.remove("pt-in"), 700);
    });
  }

  // Intercept internal navigation
  document.addEventListener("click", (e) => {
    if (reduce) return;
    const a = e.target.closest("a[href]");
    if (!a) return;
    if (a.target === "_blank" || a.hasAttribute("download")) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const href = a.getAttribute("href");
    if (!href) return;
    // Only intercept same-origin .html links
    if (!/\.html(\?|#|$)/.test(href) && !/^\/(?!\/)/.test(href)) return;
    if (/^https?:\/\//i.test(href) && !href.startsWith(location.origin)) return;
    // Skip same-page hash
    if (href.startsWith("#")) return;
    e.preventDefault();
    panel.classList.add("pt-out");
    setTimeout(() => { window.location.href = a.href; }, 520);
  });

  // Reset overlay on bfcache restore
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      panel.classList.remove("pt-out");
      panel.classList.add("pt-in");
      setTimeout(() => panel.classList.remove("pt-in"), 700);
    }
  });
})();
