/* ============================================================
   DAULATRAM'S — populate data-driven sections
   ============================================================ */
(function () {
  const U = "https://daulatrams.com/wp-content/uploads/";
  const rpc = window.renderProductCard;
  const P = window.__PRODUCTS || {};
  const fb = "this.style.visibility='hidden'";

  /* Marquee */
  const marquee = [
    "Proudly Made in India", "100% Ayurvedic Formula", "No Chemical Additives",
    "FSSAI Certified", "Third Generation Heritage", "50,000+ Happy Customers",
    "Free Shipping on ₹1000+", "Zero Side Effects", "Cold-Pressed & Natural", "Trusted Since Decades"
  ];
  const mTrack = document.getElementById("marquee-track");
  if (mTrack) {
    const one = marquee.map((t) => `<span class="m-item"><span class="dot">◆</span> ${t}</span>`).join("");
    mTrack.innerHTML = one + one;
  }

  /* Categories */
  const cats = [
    { name: "Men's Wellness", img: U + "2026/01/Daulatrams-Mens-Wellness.png", url: "shop.html?cat=mens-wellness" },
    { name: "Women's Wellness", img: U + "2026/01/Daulatrams-Womens-Wellness.png", url: "shop.html?cat=womens-wellness" },
    { name: "Desi Ghee", img: U + "2026/01/Daulatrams-Desi-Ghee.png", url: "shop.html?cat=desi-ghee" },
    { name: "Hair Care", img: U + "2026/01/Daulatrams-Hair-Care.png", url: "shop.html?cat=hair-care" },
    { name: "Skin Care", img: U + "2026/01/Daulatrams-Skin-Care-1.png", url: "shop.html?cat=skin-care" },
    { name: "Honey & Ghee", img: U + "2026/03/multiflora-honey-3.png", url: "shop.html?cat=honey" }
  ];
  const catGrid = document.getElementById("cat-grid");
  if (catGrid) catGrid.innerHTML = cats.map((c) => `
    <a class="cat-card" href="${c.url}">
      <img class="cat-img" src="${c.img}" alt="${c.name}" loading="lazy" onerror="${fb}">
      <div class="cat-name">${c.name}</div>
      <div class="cat-arrow">→</div>
    </a>`).join("");

  /* New arrivals + bestsellers */
  const na = document.getElementById("new-arrivals-carousel");
  if (na) na.innerHTML = (P.newArrivals || []).map(rpc).join("");
  const bs = document.getElementById("bestsellers-grid");
  if (bs) bs.innerHTML = (P.bestsellers || []).map(rpc).join("");

  /* Concern default tab */
  const cg = document.getElementById("concern-grid");
  if (cg) cg.innerHTML = (window.__CONCERN_DATA["hair-care"] || []).map(rpc).join("");

  /* Spotlight ingredient pills */
  const pills = ["Shilajit","Ashwagandha","Safed Musli","Kaunch Beej","Gokshur","Kesar","Vidarikand","Akarkara","Shatavari","Jaiphal","Javitri","Amla"];
  const pillWrap = document.getElementById("ingredient-pills");
  if (pillWrap) pillWrap.innerHTML = pills.map((p) => `<span class="pill">${p}</span>`).join("");

  /* UGC */
  const ugcFiles = ["12.png","11.png","10.png","9.png","8.png","7.png","6.png","5-1.png"];
  const ugcGrid = document.getElementById("ugc-grid");
  if (ugcGrid) ugcGrid.innerHTML = ugcFiles.slice(0, 4).map((f) => `
    <div class="ugc-card">
      <img src="${U}2026/01/${f}" alt="Customer story" loading="lazy"
        onerror="this.style.display='none';this.parentElement.style.background='linear-gradient(160deg,#0B5132,#1A6E3E)'">
      <div class="ugc-play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>
      <div class="ugc-overlay"><span class="shop-this">Shop This →</span></div>
    </div>`).join("");

  /* Testimonials */
  const testimonials = [
    { name: "Priya Sharma", city: "Delhi", avatar: U + "2026/01/Priya-Sharma.png", rating: 5, product: "Nari Kalp",
      text: "After my second child, I felt drained all the time. Nari Kalp brought my energy back so gently and naturally. It honestly feels like the Ayurveda my grandmother believed in — but made for today." },
    { name: "Rohit Verma", city: "Lucknow", avatar: U + "2026/01/Rohit-Verma.png", rating: 5, product: "Shakti+ Capsules",
      text: "I was sceptical about Ayurvedic supplements, but Shakti+ proved me wrong. By the third week my stamina at the gym and through the workday improved noticeably. No jitters, no crashes." },
    { name: "Gurpreet Singh", city: "Chandigarh", avatar: U + "2026/01/Gurpreet-Singh.png", rating: 5, product: "Shakti+ Capsules",
      text: "Trusted brand, honest formula. You can feel the purity. My father and I both take it now — that says everything about how much our family trusts Daulatram's." },
    { name: "Megha Patil", city: "Pune", avatar: U + "2026/01/Megha-Patil.png", rating: 5, product: "Desi Cow Ghee",
      text: "The Desi Cow Ghee tastes exactly like the one we got from our village. Pure aroma, golden colour, no shortcuts. It has become a staple in my kitchen for the whole family." },
    { name: "Mahesh Joshi", city: "Jaipur", avatar: U + "2026/01/Mahesh-Joshi.png", rating: 5, product: "Pain Relief Oil",
      text: "At 58, my knee pain used to slow me down every morning. The pain oil gives real, warm relief within minutes. Heritage knowledge that actually works — I'm grateful." }
  ];
  const tStars = (n) => "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
  const tTrack = document.getElementById("testi-track");
  if (tTrack) tTrack.innerHTML = testimonials.map((t) => `
    <div class="testi-card">
      <div class="quote-mark">“</div>
      <p class="review">${t.text}</p>
      <div class="stars">${tStars(t.rating)}</div>
      <div class="testi-foot">
        <img src="${t.avatar}" alt="${t.name}" loading="lazy" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2252%22 height=%2252%22><rect width=%2252%22 height=%2252%22 fill=%22%23EDE0C8%22/></svg>'">
        <div><div class="name">${t.name}</div><div class="city">${t.city}</div></div>
      </div>
      <span class="testi-prod">Used: ${t.product}</span>
    </div>`).join("");

  /* Values */
  const ic = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${d}</svg>`;
  const values = [
    { t: "100% Natural", d: "Pure plant-based ingredients, zero chemicals, zero compromise.", i: '<path d="M11 20A7 7 0 0 1 4 13c0-5 7-11 7-11s7 6 7 11a7 7 0 0 1-7 7z"/><path d="M11 20v-9"/>' },
    { t: "Own Manufacturing", d: "Produced in our own Karnal facility under expert supervision.", i: '<path d="M3 21h18M4 21V9l5-3 5 3M14 21V9l6-3v15"/>' },
    { t: "Science Backed", d: "Ancient wisdom validated by modern research and FSSAI standards.", i: '<path d="M9 2h6M10 2v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V2"/>' },
    { t: "3 Generations", d: "Decades of Ayurvedic expertise passed down through our family.", i: '<circle cx="9" cy="7" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 21c0-3.3 2.7-6 6-6s6 2.7 6 6M15 21c0-2.5 1.8-4.6 4-5"/>' },
    { t: "Pan-India Delivery", d: "Reaching 19,000+ pincodes with fast, trackable shipping.", i: '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="1.8"/><circle cx="18.5" cy="18.5" r="1.8"/>' },
    { t: "Easy Returns", d: "Quality guarantee — full refund if you're not satisfied.", i: '<path d="M3 12a9 9 0 1 1 3 6.7M3 12V7M3 12h5"/>' },
    { t: "Secure Payments", d: "UPI, Card, COD — 128-bit SSL encrypted checkout.", i: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>' },
    { t: "24/7 Support", d: "WhatsApp & phone support — we're always here for you.", i: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.4 2.5 1.2 3.4.5 4.3L8.1 9.9a16 16 0 0 0 6 6l1.9-1.5c.9-.7 1.8.1 4.3.5a2 2 0 0 1 1.7 2z"/>' }
  ];
  const vGrid = document.getElementById("values-grid");
  if (vGrid) vGrid.innerHTML = values.map((v) => `
    <div class="value-card">
      <div class="v-ico">${ic(v.i)}</div>
      <h3>${v.t}</h3>
      <p>${v.d}</p>
    </div>`).join("");

  /* Ingredients list */
  const ingData = window.__INGREDIENTS || {};
  const keys = Object.keys(ingData);
  const ingList = document.getElementById("ing-list");
  if (ingList) {
    ingList.innerHTML = keys.map((k, i) => `
      <button class="ing-item${i === 0 ? " active" : ""}" data-ing="${k}">
        <span class="ing-dot"></span>${ingData[k].name}
      </button>`).join("");
    // render first
    const d = ingData[keys[0]];
    const detail = document.getElementById("ing-detail");
    if (detail) detail.innerHTML = `
      <div class="ing-vis">${d.emoji}</div>
      <div>
        <h3>${d.name}</h3>
        <div class="sanskrit">${d.sanskrit}</div>
        <p class="ing-desc">${d.desc}</p>
        <div class="ing-tags">${d.tags.map((t) => `<span>${t}</span>`).join("")}</div>
        <div class="ing-used">Used in: <b>${d.used}</b></div>
      </div>`;
  }

  /* Media logos */
  const logos = ["FSSAI", "Made in India", "AYUSH Ministry", "GMP Certified", "ISO 9001", "Swadeshi", "Cruelty Free", "Lab Tested"];
  const lTrack = document.getElementById("logos-track");
  if (lTrack) {
    const chip = (l) => `<div class="logo-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>${l}</div>`;
    const one = logos.map(chip).join("");
    lTrack.innerHTML = one + one;
  }
})();
