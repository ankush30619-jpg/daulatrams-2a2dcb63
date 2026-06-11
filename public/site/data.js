/* ============================================================
   DAULATRAM'S — product data + renderers
   ============================================================ */
(function () {
  const U = "https://daulatrams.com/wp-content/uploads/";
  const IMG = {
    shaktiAll: U + "2026/05/All-ings.jpg",
    shaktiBowl: U + "2026/05/bowl-ings.jpg",
    ghee: U + "2025/12/Daulatrams-Desi-Cow-Ghee-500ml-1.png",
    nariKalp: U + "2026/01/nari-kalp-2.png",
    aloe: U + "2025/12/aloevera-gel-4.png",
    vanTulsi: U + "2026/03/van-tulsi-honey-2.png",
    multiflora: U + "2026/03/multiflora-honey-3.png",
    amla: U + "2026/03/amla-bhringraj-hair-oil-4.png",
    realHerbs: U + "2026/03/real-herbs-oil-2.png",
    recure: U + "2026/03/recure-oil-5.png",
    castor: U + "2026/03/castor-oil-2.png",
    shilajit: U + "2026/03/shilajit-4.png",
    slimTea: U + "2025/12/Daulatrams-Slim-Tea-1.png"
  };

  const stars = (r) => "★★★★★".slice(0, Math.round(r)) + "☆☆☆☆☆".slice(0, 5 - Math.round(r));

  /* Map display names → catalog product ids (product.html?id=) */
  const ID_MAP = [
    [/shakti\+ \(60/i, "veer-ved-shakti-60"],
    [/shakti\+ \(30/i, "veer-ved-shakti-30"],
    [/van tulsi/i, "van-tulsi-honey"],
    [/multiflora/i, "multiflora-honey"],
    [/amla bhringraj/i, "amla-bhringraj-oil"],
    [/aloe vera/i, "aloe-vera-gel"],
    [/cow ghee/i, "desi-cow-ghee"],
    [/nari kalp/i, "nari-kalp"],
    [/shilajit/i, "shilajit-raisin"],
    [/real herbs/i, "real-herbs-hair-oil"],
    [/recure/i, "real-herbs-hair-oil"],
    [/castor/i, "castor-oil"],
    [/slim tea/i, "slim-tea"],
    [/coconut oil/i, "coconut-oil"],
    [/badam rogan/i, "badam-rogan"],
    [/sesame oil/i, "sesame-oil"],
    [/flax\s*seed/i, "flax-seed-oil"],
    [/wild forest/i, "wild-forest-honey"],
    [/moringa cap/i, "moringa-capsules"],
    [/ashwagandha shilajit/i, "ashwagandha-shilajit"],
    [/spirulina/i, "spirulina-capsules"],
    [/amla aloevera/i, "amla-aloevera-juice"]
  ];
  const prodUrl = (name) => {
    for (const [re, id] of ID_MAP) if (re.test(name)) return "product.html?id=" + id;
    return "shop.html";
  };

  window.renderProductCard = function (p) {
    const off = p.orig ? Math.round((1 - p.price / p.orig) * 100) : 0;
    const badges = [];
    if (off) badges.push(`<span class="pc-badge discount">-${off}%</span>`); else badges.push("<span></span>");
    if (p.best) badges.push(`<span class="pc-badge best">★ BESTSELLER</span>`);
    else if (p.tag === "new") badges.push(`<span class="pc-badge new">NEW</span>`);
    else badges.push("<span></span>");
    const url = prodUrl(p.name);
    return `
    <article class="product-card">
      <div class="pc-img">
        <div class="pc-badges">${badges.join("")}</div>
        <button class="pc-wish" aria-label="Add to wishlist">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <a href="${url}"><img src="${p.img}" alt="${p.name}" loading="lazy"
          onerror="this.style.display='none';this.parentElement.style.background='linear-gradient(135deg,#F0E8D8,#EDE0C8)'"></a>
      </div>
      <div class="pc-body">
        <div class="pc-rating"><span class="stars">${stars(p.rating || 4.7)}</span> ${p.rating || 4.7} (${(p.reviews || 1240).toLocaleString("en-IN")})</div>
        <a href="${url}" class="pc-name-link"><h3 class="pc-name">${p.name}</h3></a>
        <div class="pc-price">
          <span class="sale">₹${p.price.toLocaleString("en-IN")}</span>
          ${p.orig ? `<span class="orig">₹${p.orig.toLocaleString("en-IN")}</span>` : ""}
          ${off ? `<span class="off">${off}% OFF</span>` : ""}
        </div>
        <a href="${url}" class="btn btn-primary btn-block btn-sm">View Product</a>
      </div>
    </article>`;
  };

  window.__PRODUCTS = {
    newArrivals: [
      { name: "Veer Ved Max Shakti+ (60 Caps)", img: IMG.shaktiAll, price: 5270, orig: 6200, rating: 4.8, reviews: 17719, best: true },
      { name: "Veer Ved Max Shakti+ (30 Caps)", img: IMG.shaktiBowl, price: 2495, orig: 3199, rating: 4.7, reviews: 12480, best: true },
      { name: "Van Tulsi Honey 315gm", img: IMG.vanTulsi, price: 360, rating: 4.6, reviews: 842, tag: "new" },
      { name: "Multiflora Honey 500gm", img: IMG.multiflora, price: 499, rating: 4.7, reviews: 1190, tag: "new" },
      { name: "Amla Bhringraj Hair Oil 100ml", img: IMG.amla, price: 350, rating: 4.5, reviews: 660 },
      { name: "Aloe Vera Gel 250gm", img: IMG.aloe, price: 499, orig: 540, rating: 4.6, reviews: 980 }
    ],
    bestsellers: [
      { name: "Veer Ved Max Shakti+ (60 Caps)", img: IMG.shaktiAll, price: 5270, orig: 6200, rating: 4.8, reviews: 17719, best: true },
      { name: "Veer Ved Max Shakti+ (30 Caps)", img: IMG.shaktiBowl, price: 2495, orig: 3199, rating: 4.7, reviews: 12480, best: true },
      { name: "Van Tulsi Honey 315gm", img: IMG.vanTulsi, price: 360, rating: 4.6, reviews: 842, best: true },
      { name: "Multiflora Honey 500gm", img: IMG.multiflora, price: 499, rating: 4.7, reviews: 1190, best: true }
    ]
  };

  window.__CONCERN_DATA = {
    "hair-care": [
      { name: "Amla Bhringraj Hair Oil 100ml", img: IMG.amla, price: 350, rating: 4.5, reviews: 660 },
      { name: "Real Herbs Hair Oil 200ml", img: IMG.realHerbs, price: 420, orig: 480, rating: 4.6, reviews: 540 },
      { name: "Recure Hair Oil 100ml", img: IMG.recure, price: 299, rating: 4.4, reviews: 410, tag: "new" },
      { name: "Castor Oil 100ml", img: IMG.castor, price: 199, rating: 4.5, reviews: 720 }
    ],
    "skin-care": [
      { name: "Aloe Vera Gel 250gm", img: IMG.aloe, price: 499, orig: 540, rating: 4.6, reviews: 980 },
      { name: "Real Herbs Hair Oil 200ml", img: IMG.realHerbs, price: 420, rating: 4.6, reviews: 540 },
      { name: "Castor Oil 100ml", img: IMG.castor, price: 199, rating: 4.5, reviews: 720 },
      { name: "Multiflora Honey 500gm", img: IMG.multiflora, price: 499, rating: 4.7, reviews: 1190 }
    ],
    "mens-wellness": [
      { name: "Veer Ved Max Shakti+ (60 Caps)", img: IMG.shaktiAll, price: 5270, orig: 6200, rating: 4.8, reviews: 17719, best: true },
      { name: "Veer Ved Max Shakti+ (30 Caps)", img: IMG.shaktiBowl, price: 2495, orig: 3199, rating: 4.7, reviews: 12480, best: true },
      { name: "Shilajit Raisin 20gm", img: IMG.shilajit, price: 899, orig: 1100, rating: 4.7, reviews: 1330 },
      { name: "Van Tulsi Honey 315gm", img: IMG.vanTulsi, price: 360, rating: 4.6, reviews: 842 }
    ],
    "womens-wellness": [
      { name: "Nari Kalp 60 Caps", img: IMG.nariKalp, price: 1499, orig: 1799, rating: 4.7, reviews: 2210, best: true },
      { name: "Aloe Vera Gel 250gm", img: IMG.aloe, price: 499, orig: 540, rating: 4.6, reviews: 980 },
      { name: "Multiflora Honey 500gm", img: IMG.multiflora, price: 499, rating: 4.7, reviews: 1190 },
      { name: "Amla Bhringraj Hair Oil 100ml", img: IMG.amla, price: 350, rating: 4.5, reviews: 660 }
    ],
    "weight-loss": [
      { name: "Slim Tea 100gm", img: IMG.slimTea, price: 399, orig: 499, rating: 4.4, reviews: 510, tag: "new" },
      { name: "Van Tulsi Honey 315gm", img: IMG.vanTulsi, price: 360, rating: 4.6, reviews: 842 },
      { name: "Multiflora Honey 500gm", img: IMG.multiflora, price: 499, rating: 4.7, reviews: 1190 },
      { name: "Aloe Vera Gel 250gm", img: IMG.aloe, price: 499, orig: 540, rating: 4.6, reviews: 980 }
    ],
    "desi-ghee": [
      { name: "Desi Cow Ghee 500ml", img: IMG.ghee, price: 849, orig: 999, rating: 4.9, reviews: 3120, best: true },
      { name: "Van Tulsi Honey 315gm", img: IMG.vanTulsi, price: 360, rating: 4.6, reviews: 842 },
      { name: "Multiflora Honey 500gm", img: IMG.multiflora, price: 499, rating: 4.7, reviews: 1190 },
      { name: "Shilajit Raisin 20gm", img: IMG.shilajit, price: 899, orig: 1100, rating: 4.7, reviews: 1330 }
    ],
    "honey": [
      { name: "Van Tulsi Honey 315gm", img: IMG.vanTulsi, price: 360, rating: 4.6, reviews: 842, best: true },
      { name: "Multiflora Honey 500gm", img: IMG.multiflora, price: 499, rating: 4.7, reviews: 1190, best: true },
      { name: "Desi Cow Ghee 500ml", img: IMG.ghee, price: 849, orig: 999, rating: 4.9, reviews: 3120 },
      { name: "Aloe Vera Gel 250gm", img: IMG.aloe, price: 499, orig: 540, rating: 4.6, reviews: 980 }
    ]
  };

  window.__INGREDIENTS = {
    shilajit: { name: "Shilajit", sanskrit: "Asphaltum punjabianum", emoji: "🪨", desc: "A mineral-rich resin from the Himalayas, prized in Ayurveda for restoring energy, stamina and vitality. Packed with fulvic acid and over 80 trace minerals.", tags: ["Energy", "Stamina", "Vitality"], used: "Veer Ved Max Shakti+, Shilajit Raisin" },
    ashwagandha: { name: "Ashwagandha", sanskrit: "Withania somnifera", emoji: "🌿", desc: "The legendary 'Indian ginseng' — an adaptogen that helps the body resist stress, improves strength and supports restful sleep.", tags: ["Anti-stress", "Strength", "Calm"], used: "Veer Ved Max Shakti+, Nari Kalp" },
    "safed-musli": { name: "Safed Musli", sanskrit: "Chlorophytum borivilianum", emoji: "🌱", desc: "A revered rejuvenating herb traditionally used to support strength, endurance and overall male vitality.", tags: ["Endurance", "Strength", "Vigour"], used: "Veer Ved Max Shakti+" },
    "kaunch-beej": { name: "Kaunch Beej", sanskrit: "Mucuna pruriens", emoji: "🫘", desc: "A potent seed rich in natural L-Dopa, traditionally used to support mood, drive and the nervous system.", tags: ["Mood", "Drive", "Nervine"], used: "Veer Ved Max Shakti+" },
    gokshur: { name: "Gokshur", sanskrit: "Tribulus terrestris", emoji: "🌾", desc: "A classical Ayurvedic herb that supports strength, vitality and healthy urinary function.", tags: ["Vitality", "Strength", "Urinary"], used: "Veer Ved Max Shakti+" },
    kesar: { name: "Kesar (Saffron)", sanskrit: "Crocus sativus", emoji: "🌸", desc: "The world's most precious spice — a warming antioxidant that uplifts mood and adds a golden richness to wellness formulas.", tags: ["Mood", "Antioxidant", "Warmth"], used: "Veer Ved Max Shakti+, Honey Gulkand" },
    amla: { name: "Amla", sanskrit: "Phyllanthus emblica", emoji: "🟢", desc: "The Indian gooseberry — one of nature's richest sources of Vitamin C, supporting immunity, hair and radiant skin.", tags: ["Immunity", "Hair", "Skin"], used: "Amla Bhringraj Oil, Veer Ved Max Shakti+" }
  };
})();
