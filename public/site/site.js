/* ============================================================
   DAULATRAM'S — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Hero + header reveal on load ---------- */
  const hero = document.querySelector(".hero");
  const heroBanner = document.querySelector(".hero-banner");
  const header = document.querySelector(".header");
  const isHomeFloating = document.body.classList.contains("home-floating-header");

  window.addEventListener("load", () => {
    requestAnimationFrame(() => hero && hero.classList.add("revealed"));
    setTimeout(() => header && header.classList.add("revealed"), 500);
  });
  // Fallback if load already fired
  setTimeout(() => {
    if (hero) hero.classList.add("revealed");
    if (header) header.classList.add("revealed");
  }, 1200);

  /* ---------- Header scroll state ---------- */
  const heroHeight = () => (hero ? hero.offsetHeight : heroBanner ? heroBanner.offsetHeight : window.innerHeight);
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    if (header) {
      const trigger = heroBanner ? heroBanner.offsetHeight * 0.5 : hero ? heroHeight() - 120 : 0;
      header.classList.toggle("scrolled", isHomeFloating ? y > trigger : true);
    }
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

  /* ---------- Hero Banner Carousel ---------- */
  const heroCarousel = document.querySelector(".hero-carousel");
  if (heroCarousel) {
    const slides = Array.from(heroCarousel.querySelectorAll(".hero-slide"));
    const prevBtn = heroCarousel.querySelector(".hero-nav-btn.prev");
    const nextBtn = heroCarousel.querySelector(".hero-nav-btn.next");
    const dots = Array.from(heroCarousel.querySelectorAll(".hero-dot"));
    let currentIndex = 0;
    let autoPlayTimer = null;
    let isTransitioning = false;

    function showSlide(index, direction = "next") {
      if (slides.length <= 1 || isTransitioning) return;
      isTransitioning = true;

      // Handle wrapping
      let nextIndex = (index + slides.length) % slides.length;
      if (nextIndex === currentIndex) {
        isTransitioning = false;
        return;
      }

      const currentSlide = slides[currentIndex];
      const nextSlide = slides[nextIndex];

      // Remove any leftover classes
      slides.forEach(s => s.classList.remove("slide-next-out", "slide-prev-out"));

      // Set the transition direction class on current slide
      if (direction === "next") {
        currentSlide.classList.add("slide-next-out");
      } else {
        currentSlide.classList.add("slide-prev-out");
      }
      
      // Deactivate current slide
      currentSlide.classList.remove("active");

      // Activate next slide
      nextSlide.classList.add("active");

      // Update dots
      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === nextIndex);
      });

      // Update current index
      currentIndex = nextIndex;

      // Allow new transitions after the transition completes
      setTimeout(() => {
        isTransitioning = false;
      }, 1000);
    }

    function nextSlide() {
      showSlide(currentIndex + 1, "next");
    }

    function prevSlide() {
      showSlide(currentIndex - 1, "prev");
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(nextSlide, 5000); // 5 seconds autoplay
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
        startAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        startAutoPlay();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        if (idx === currentIndex) return;
        const direction = idx > currentIndex ? "next" : "prev";
        showSlide(idx, direction);
        startAutoPlay();
      });
    });

    // Touch support for mobile swipe
    let startX = 0;
    heroCarousel.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      stopAutoPlay();
    }, { passive: true });

    heroCarousel.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) { // Swipe threshold
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startAutoPlay();
    }, { passive: true });

    // Start
    startAutoPlay();
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
  window.observeSR = function(root) {
    (root || document).querySelectorAll(".sr, .sr-stagger").forEach(function(el) { srObserver.observe(el); });
  };

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
    function go(dir) {
      const max = track.scrollWidth - track.clientWidth;
      let target = track.scrollLeft + dir * amount();
      if (dir > 0 && track.scrollLeft >= max - 8) target = 0;          // wrap to start
      else if (dir < 0 && track.scrollLeft <= 8) target = max;          // wrap to end
      track.scrollTo({ left: target, behavior: "smooth" });
    }
    prev && prev.addEventListener("click", () => { go(-1); pauseAuto(8000); });
    next && next.addEventListener("click", () => { go(1); pauseAuto(8000); });
    track.addEventListener("scroll", update, { passive: true });
    update();

    /* autoplay — every 4s advance one card; pause on hover / drag / off-screen */
    const auto = wrap.dataset.autoplay !== "off";
    let timer = null, paused = false, pauseUntil = 0;
    function tick() {
      if (paused || document.hidden || Date.now() < pauseUntil) return;
      const rect = wrap.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      go(1);
    }
    function startAuto() { if (auto && !timer) timer = setInterval(tick, 4000); }
    function pauseAuto(ms) { pauseUntil = Date.now() + (ms || 4000); }
    wrap.addEventListener("mouseenter", () => { paused = true; });
    wrap.addEventListener("mouseleave", () => { paused = false; });
    track.addEventListener("touchstart", () => pauseAuto(6000), { passive: true });
    startAuto();

    // drag
    let down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener("mousedown", (e) => { down = true; moved = false; sx = e.pageX; sl = track.scrollLeft; track.style.cursor = "grabbing"; pauseAuto(6000); });
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
  const tabsWrap = document.querySelector(".filter-tabs");
  const concernGrid = document.querySelector("#concern-grid");
  if (tabsWrap && concernGrid) {
    const MAP = {
      "hair-care": "Hair Care",
      "skin-care": "Skin Care",
      "mens-wellness": "Men's Wellness",
      "womens-wellness": "Women's Wellness",
      "weight-loss": "Weight Loss",
      "desi-ghee": "Desi Ghee",
      "honey": "Honey"
    };
    tabsWrap.addEventListener("click", (e) => {
      const tab = e.target.closest(".filter-tab");
      if (!tab) return;
      tabsWrap.querySelectorAll(".filter-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const key = tab.dataset.tab;
      const catName = MAP[key] || key;
      const catalog = window.__CATALOG || [];
      const filtered = catalog.filter(p => (p.category || '').toLowerCase() === catName.toLowerCase());
      concernGrid.style.opacity = "0";
      setTimeout(() => {
        concernGrid.innerHTML = filtered.slice(0, 8).map(window.renderProductCard).join("");
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
        ingDetail.innerHTML = window.renderIngredientDetail(d);
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
    panel.innerHTML = '<span class="pt-mark"><img src="https://daulatrams.lovable.app/__l5e/assets-v1/8b91c49d-e362-4b9e-8d22-d4250fc957c2/daulatrams-logo.png" alt="Daulatram\u2019s" /></span>';
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

/* v2 — delegated Add-to-Cart for product cards rendered via [data-cart-add] */
document.addEventListener('click', function (e) {
  const btn = e.target.closest('[data-cart-add]');
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();
  const id = btn.dataset.id || '';
  if (!id) return;
  const item = {
    id: id,
    name: btn.dataset.name || id,
    price: Number(btn.dataset.price) || 0,
    image: btn.dataset.image || '',
    variant: btn.dataset.variant || ''
  };
  try {
    if (window.dr && window.dr.store && window.dr.store.addToCart) {
      window.dr.store.addToCart(item);
    }
  } catch (err) { console.warn('cart-add failed', err); }
});
