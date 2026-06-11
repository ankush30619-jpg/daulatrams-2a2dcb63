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
        ${p.sizes ? `<div class="pc-sizes">${p.sizes}</div>` : ""}
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
      { name: "Veer Ved Max Shakti+ (60 Caps)", sizes: "60 Caps", img: IMG.shaktiAll, price: 5270, orig: 6200, rating: 4.8, reviews: 17719, best: true },
      { name: "Veer Ved Max Shakti+ (30 Caps)", sizes: "30 Caps", img: IMG.shaktiBowl, price: 2495, orig: 3199, rating: 4.7, reviews: 12480, best: true },
      { name: "Van Tulsi Honey", sizes: "315 gm", img: IMG.vanTulsi, price: 360, rating: 4.6, reviews: 842, tag: "new" },
      { name: "Multiflora Honey", sizes: "500 gm / 1 kg", img: IMG.multiflora, price: 499, rating: 4.7, reviews: 1190, tag: "new" },
      { name: "Amla Bhringraj Hair Oil", sizes: "100 ml", img: IMG.amla, price: 350, rating: 4.5, reviews: 660 },
      { name: "Natural Aloe Vera Gel", sizes: "250 gm / 500 gm / 1 kg", img: IMG.aloe, price: 499, orig: 540, rating: 4.6, reviews: 980 },
      { name: "Real Herbs Hair Oil", sizes: "100 ml", img: IMG.realHerbs, price: 420, orig: 480, rating: 4.6, reviews: 540, tag: "new" },
      { name: "Slim Tea", sizes: "110 gm", img: IMG.slimTea, price: 399, orig: 499, rating: 4.4, reviews: 510, tag: "new" }
    ],
    bestsellers: [
      { name: "Veer Ved Max Shakti+ (60 Caps)", sizes: "60 Caps", img: IMG.shaktiAll, price: 5270, orig: 6200, rating: 4.8, reviews: 17719, best: true },
      { name: "Veer Ved Max Shakti+ (30 Caps)", sizes: "30 Caps", img: IMG.shaktiBowl, price: 2495, orig: 3199, rating: 4.7, reviews: 12480, best: true },
      { name: "Desi Cow Ghee", sizes: "500 ml", img: IMG.ghee, price: 849, orig: 999, rating: 4.9, reviews: 3120, best: true },
      { name: "Nari Kalp", sizes: "250 ml / 60 Caps", img: IMG.nariKalp, price: 1499, orig: 1799, rating: 4.7, reviews: 2210, best: true },
      { name: "Van Tulsi Honey", sizes: "315 gm", img: IMG.vanTulsi, price: 360, rating: 4.6, reviews: 842, best: true },
      { name: "Multiflora Honey", sizes: "500 gm / 1 kg", img: IMG.multiflora, price: 499, rating: 4.7, reviews: 1190, best: true }
    ],
    trendingNow: [
      { name: "Cold Pressed Coconut Oil", sizes: "250ml / 450ml / 750ml / 1ltr", img: U + "2025/12/coconut-oil.png", price: 449, orig: 499, rating: 4.7, reviews: 1240, tag: "new" },
      { name: "Cold Pressed Badam Rogan", sizes: "100ml / 250ml / 500ml / 1ltr", img: U + "2025/12/badam-rogan.png", price: 699, orig: 799, rating: 4.8, reviews: 980 },
      { name: "Cold Pressed Sesame Oil", sizes: "100ml / 250ml / 500ml / 1ltr", img: U + "2025/12/sesame-oil.png", price: 399, rating: 4.6, reviews: 540 },
      { name: "Cold Pressed Flax Seed Oil", sizes: "100ml / 250ml / 500ml / 1ltr", img: U + "2025/12/flax-seed-oil.png", price: 499, rating: 4.7, reviews: 320, tag: "new" },
      { name: "Van Tulsi Honey", sizes: "315 gm", img: IMG.vanTulsi, price: 360, rating: 4.6, reviews: 842 },
      { name: "Wild Forest Honey", sizes: "315 gm", img: U + "2026/03/wild-forest-honey.png", price: 540, rating: 4.7, reviews: 410, tag: "new" },
      { name: "Multiflora Honey", sizes: "500 gm / 1 kg", img: IMG.multiflora, price: 499, rating: 4.7, reviews: 1190 }
    ],
    wellnessEssentials: [
      { name: "Shaktiplus Capsules", sizes: "30 Caps", img: IMG.shaktiBowl, price: 2495, orig: 3199, rating: 4.7, reviews: 12480, best: true },
      { name: "Shilajit Drop", sizes: "30 ml", img: IMG.shilajit, price: 899, orig: 1100, rating: 4.7, reviews: 1330 },
      { name: "Ashwagandha Shilajit Capsule", sizes: "60 Caps", img: U + "2026/03/ashwagandha-shilajit.png", price: 749, orig: 899, rating: 4.6, reviews: 620, tag: "new" },
      { name: "Moringa Capsules", sizes: "60 Caps", img: U + "2026/03/moringa-capsules.png", price: 549, rating: 4.5, reviews: 480 },
      { name: "Nari Kalp", sizes: "250 ml / 60 Caps", img: IMG.nariKalp, price: 1499, orig: 1799, rating: 4.7, reviews: 2210, best: true },
      { name: "Spirulina Capsules", sizes: "60 Caps", img: U + "2026/03/spirulina-capsules.png", price: 599, rating: 4.5, reviews: 380 },
      { name: "Amla Aloevera Juice", sizes: "250 ml", img: U + "2026/03/amla-aloevera-juice.png", price: 299, rating: 4.5, reviews: 410, tag: "new" }
    ]
  };

  window.__CONCERN_DATA = {
    "hair-care": [
      { name: "Amla Bhringraj Hair Oil", sizes: "100 ml", img: IMG.amla, price: 350, rating: 4.5, reviews: 660 },
      { name: "Real Herbs Hair Oil", sizes: "100 ml", img: IMG.realHerbs, price: 420, orig: 480, rating: 4.6, reviews: 540 },
      { name: "Recure Hair Oil", sizes: "100 ml", img: IMG.recure, price: 299, rating: 4.4, reviews: 410, tag: "new" },
      { name: "Castor Oil", sizes: "100 ml", img: IMG.castor, price: 199, rating: 4.5, reviews: 720 }
    ],
    "skin-care": [
      { name: "Natural Aloe Vera Gel", sizes: "250 gm / 500 gm / 1 kg", img: IMG.aloe, price: 499, orig: 540, rating: 4.6, reviews: 980 },
      { name: "Real Herbs Hair Oil", sizes: "100 ml", img: IMG.realHerbs, price: 420, rating: 4.6, reviews: 540 },
      { name: "Castor Oil", sizes: "100 ml", img: IMG.castor, price: 199, rating: 4.5, reviews: 720 },
      { name: "Multiflora Honey", sizes: "500 gm / 1 kg", img: IMG.multiflora, price: 499, rating: 4.7, reviews: 1190 }
    ],
    "mens-wellness": [
      { name: "Veer Ved Max Shakti+ (60 Caps)", sizes: "60 Caps", img: IMG.shaktiAll, price: 5270, orig: 6200, rating: 4.8, reviews: 17719, best: true },
      { name: "Veer Ved Max Shakti+ (30 Caps)", sizes: "30 Caps", img: IMG.shaktiBowl, price: 2495, orig: 3199, rating: 4.7, reviews: 12480, best: true },
      { name: "Shilajit Drop", sizes: "30 ml", img: IMG.shilajit, price: 899, orig: 1100, rating: 4.7, reviews: 1330 },
      { name: "Van Tulsi Honey", sizes: "315 gm", img: IMG.vanTulsi, price: 360, rating: 4.6, reviews: 842 }
    ],
    "womens-wellness": [
      { name: "Nari Kalp", sizes: "250 ml / 60 Caps", img: IMG.nariKalp, price: 1499, orig: 1799, rating: 4.7, reviews: 2210, best: true },
      { name: "Natural Aloe Vera Gel", sizes: "250 gm / 500 gm / 1 kg", img: IMG.aloe, price: 499, orig: 540, rating: 4.6, reviews: 980 },
      { name: "Multiflora Honey", sizes: "500 gm / 1 kg", img: IMG.multiflora, price: 499, rating: 4.7, reviews: 1190 },
      { name: "Amla Bhringraj Hair Oil", sizes: "100 ml", img: IMG.amla, price: 350, rating: 4.5, reviews: 660 }
    ],
    "weight-loss": [
      { name: "Slim Tea", sizes: "110 gm", img: IMG.slimTea, price: 399, orig: 499, rating: 4.4, reviews: 510, tag: "new" },
      { name: "Van Tulsi Honey", sizes: "315 gm", img: IMG.vanTulsi, price: 360, rating: 4.6, reviews: 842 },
      { name: "Multiflora Honey", sizes: "500 gm / 1 kg", img: IMG.multiflora, price: 499, rating: 4.7, reviews: 1190 },
      { name: "Natural Aloe Vera Gel", sizes: "250 gm / 500 gm / 1 kg", img: IMG.aloe, price: 499, orig: 540, rating: 4.6, reviews: 980 }
    ],
    "desi-ghee": [
      { name: "Desi Cow Ghee", sizes: "500 ml", img: IMG.ghee, price: 849, orig: 999, rating: 4.9, reviews: 3120, best: true },
      { name: "Van Tulsi Honey", sizes: "315 gm", img: IMG.vanTulsi, price: 360, rating: 4.6, reviews: 842 },
      { name: "Multiflora Honey", sizes: "500 gm / 1 kg", img: IMG.multiflora, price: 499, rating: 4.7, reviews: 1190 },
      { name: "Shilajit Drop", sizes: "30 ml", img: IMG.shilajit, price: 899, orig: 1100, rating: 4.7, reviews: 1330 }
    ],
    "honey": [
      { name: "Van Tulsi Honey", sizes: "315 gm", img: IMG.vanTulsi, price: 360, rating: 4.6, reviews: 842, best: true },
      { name: "Multiflora Honey", sizes: "500 gm / 1 kg", img: IMG.multiflora, price: 499, rating: 4.7, reviews: 1190, best: true },
      { name: "Desi Cow Ghee", sizes: "500 ml", img: IMG.ghee, price: 849, orig: 999, rating: 4.9, reviews: 3120 },
      { name: "Natural Aloe Vera Gel", sizes: "250 gm / 500 gm / 1 kg", img: IMG.aloe, price: 499, orig: 540, rating: 4.6, reviews: 980 }
    ]
  };

  /* 14 Ancient Herbs — Veer Ved Max Shakti+ formula (bottle label) */
  const H = "/__l5e/assets-v1";
  window.__INGREDIENTS = {
    shilajit:        { name: "Shilajit",       sanskrit: "Asphaltum punjabianum",  dose: "120 mg", image: H + "/1d887068-19fc-4858-aa5d-284a92e7f301/shilajit.jpg",       desc: "A mineral-rich resin from the Himalayas, prized in Ayurveda for restoring energy, stamina and vitality. Packed with fulvic acid and over 80 trace minerals.", tags: ["Energy", "Stamina", "Vitality"], used: "Veer Ved Max Shakti+, Shilajit Drop" },
    "semal-musli":   { name: "Semal Musli",    sanskrit: "Bombax ceiba",           dose: "50 mg",  image: H + "/7c7cfd5e-c789-4b83-872b-fe27c96c9305/semal-musli.jpg",    desc: "A traditional rejuvenating herb known to support male vitality, strength and reproductive wellness.", tags: ["Vitality", "Strength", "Vigour"], used: "Veer Ved Max Shakti+" },
    "safed-musli":   { name: "Safed Musli",    sanskrit: "Chlorophytum borivilianum", dose: "50 mg", image: H + "/32e65b7f-6fa5-481c-b025-bf6959f48447/safed-musli.jpg", desc: "A revered rejuvenating herb traditionally used to support strength, endurance and overall male vitality.", tags: ["Endurance", "Strength", "Vigour"], used: "Veer Ved Max Shakti+" },
    makhana:         { name: "Makhana",        sanskrit: "Euryale ferox",          dose: "25 mg",  image: H + "/e3aac841-02d3-40e3-93ac-a324ab7c96d7/makhana.jpg",        desc: "Lotus seeds packed with protein and antioxidants — an Ayurvedic favourite for vigour, kidney health and balanced energy.", tags: ["Protein", "Vigour", "Calm"], used: "Veer Ved Max Shakti+" },
    gokshura:        { name: "Gokshura",       sanskrit: "Tribulus terrestris",    dose: "25 mg",  image: H + "/f92af796-0e52-449a-ac96-c386b56b042d/gokshura.jpg",       desc: "A classical Ayurvedic herb that supports strength, vitality and healthy urinary function.", tags: ["Vitality", "Strength", "Urinary"], used: "Veer Ved Max Shakti+" },
    "beej-bandh":    { name: "Beej Bandh",     sanskrit: "Pedalium murex",         dose: "25 mg",  image: H + "/7ab0ecb6-a0eb-4332-be15-a485f410314e/beej-bandh.jpg",     desc: "A traditional Ayurvedic seed known for supporting male reproductive health and overall vigour.", tags: ["Vigour", "Reproductive", "Tonic"], used: "Veer Ved Max Shakti+" },
    "bhilawa-shudh": { name: "Bhilawa Shudh",  sanskrit: "Semecarpus anacardium",  dose: "25 mg",  image: H + "/6d7bf43b-eb6d-4e76-b296-49e8d12f64c8/bhilawa-shudh.jpg",  desc: "Purified marking nut — traditionally used in Ayurveda as a rejuvenating tonic and to support digestion and circulation.", tags: ["Rejuvenating", "Digestive", "Circulation"], used: "Veer Ved Max Shakti+" },
    talamakhana:     { name: "Talamakhana",    sanskrit: "Hygrophila auriculata",  dose: "25 mg",  image: H + "/dad51e23-b17c-4c12-a9a3-e5fd75a6bf5b/talamakhana.jpg",    desc: "An Ayurvedic seed traditionally used to support strength, stamina and male vitality.", tags: ["Strength", "Stamina", "Vitality"], used: "Veer Ved Max Shakti+" },
    ashwagandha:     { name: "Ashwagandha",    sanskrit: "Withania somnifera",     dose: "25 mg",  image: H + "/56c875e2-b3be-42c2-b14d-8b4b579e9eab/ashwagandha.jpg",    desc: "The legendary 'Indian ginseng' — an adaptogen that helps the body resist stress, improves strength and supports restful sleep.", tags: ["Anti-stress", "Strength", "Calm"], used: "Veer Ved Max Shakti+, Nari Kalp" },
    vidhara:         { name: "Vidhara",        sanskrit: "Argyreia nervosa",       dose: "25 mg",  image: H + "/b40fb912-26f9-4bd3-8307-128bf04d75d3/vidhara.jpg",        desc: "A potent Ayurvedic herb traditionally used to support strength, vigour and nervous system health.", tags: ["Strength", "Nervine", "Vigour"], used: "Veer Ved Max Shakti+" },
    lojwanti:        { name: "Lojwanti",       sanskrit: "Mimosa pudica",          dose: "25 mg",  image: H + "/55941798-9d2c-4803-98f1-1244196e4247/lojwanti.jpg",       desc: "The 'touch-me-not' herb — used in Ayurveda for its soothing, restorative and rejuvenating properties.", tags: ["Soothing", "Restorative", "Tonic"], used: "Veer Ved Max Shakti+" },
    "kaunch-beej":   { name: "Kaunch Beej",    sanskrit: "Mucuna pruriens",        dose: "50 mg",  image: H + "/3082d3fa-b3c3-48af-840a-05b38aef882a/kaunch-beej.jpg",    desc: "A potent seed rich in natural L-Dopa, traditionally used to support mood, drive and the nervous system.", tags: ["Mood", "Drive", "Nervine"], used: "Veer Ved Max Shakti+" },
    "bang-bhasam":   { name: "Bang Bhasam",    sanskrit: "Calcined Tin Bhasma",    dose: "10 mg",  image: H + "/14a7ddd3-8bb6-448c-a8eb-7af8440f8052/bang-bhasam.jpg",    desc: "A classical Ayurvedic mineral preparation, traditionally used as a rejuvenating tonic for male vitality.", tags: ["Bhasma", "Vitality", "Tonic"], used: "Veer Ved Max Shakti+" },
    "loh-bhasam":    { name: "Loh Bhasam",     sanskrit: "Calcined Iron Bhasma",   dose: "10 mg",  image: H + "/9c0391e2-03e5-479f-92e3-7ebf2842f477/loh-bhasam.jpg",     desc: "Iron bhasma — a classical Ayurvedic mineral preparation used to support strength, stamina and healthy blood.", tags: ["Iron", "Stamina", "Strength"], used: "Veer Ved Max Shakti+" }
  };
})();
