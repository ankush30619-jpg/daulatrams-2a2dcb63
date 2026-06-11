/* ============================================================
   DAULATRAM'S — cart + wishlist store, mini-cart, search, profile menu
   Exposes window.dr.store
   ============================================================ */
(function(){
  const CART_KEY = "dr-cart";
  const WISH_KEY = "dr-wishlist";

  /* ---------------- storage ---------------- */
  function load(k){ try { return JSON.parse(localStorage.getItem(k) || "[]"); } catch(e){ return []; } }
  function save(k, v){ localStorage.setItem(k, JSON.stringify(v)); window.dispatchEvent(new CustomEvent(k+":change")); }

  function getCart(){ return load(CART_KEY); }
  function setCart(c){ save(CART_KEY, c); refreshBadges(); renderMini(); }
  function cartCount(){ return getCart().reduce((s,i)=>s+i.qty,0); }
  function cartTotal(){ return getCart().reduce((s,i)=>s+i.price*i.qty,0); }

  function getWish(){ return load(WISH_KEY); }
  function setWish(w){ save(WISH_KEY, w); refreshBadges(); refreshWishHearts(); }

  /* ---------------- product lookup ---------------- */
  function findProduct(id){
    if (window.__CATALOG && window.__CATALOG.find_by_id) return window.__CATALOG.find_by_id(id);
    return null;
  }
  function productFromCard(card){
    const a = card.querySelector("a[href*='product.html?id=']");
    if (!a) return null;
    const id = new URLSearchParams(a.href.split("?")[1] || "").get("id");
    if (!id) return null;
    const p = findProduct(id);
    if (p) return { id, name: p.name, price: p.price, image: (p.images||[])[0]||"", variant: p.variant||"" };
    // fallback from card DOM
    const name = (card.querySelector(".pc-name")||{}).textContent || "";
    const priceTxt = (card.querySelector(".pc-price .sale")||{}).textContent || "0";
    const price = parseInt(priceTxt.replace(/[^\d]/g,""),10)||0;
    const img = (card.querySelector("img")||{}).src || "";
    return { id, name, price, image: img, variant: "" };
  }

  /* ---------------- cart ops ---------------- */
  function addToCart(item, qty){
    qty = qty || 1;
    const c = getCart();
    const ex = c.find(i => i.id === item.id);
    if (ex) ex.qty += qty;
    else c.push({ id: item.id, name: item.name, price: item.price, image: item.image, variant: item.variant||"", qty });
    setCart(c);
    toast(`✓ Added "${item.name}" to cart`);
    openMini();
  }
  function updateQty(id, qty){
    const c = getCart();
    const i = c.find(x=>x.id===id); if (!i) return;
    i.qty = Math.max(1, qty); setCart(c);
  }
  function removeFromCart(id){ setCart(getCart().filter(i=>i.id!==id)); }
  function clearCart(){ setCart([]); }

  /* ---------------- wishlist ops ---------------- */
  function inWish(id){ return getWish().some(i=>i.id===id); }
  function toggleWish(item){
    const w = getWish();
    const ix = w.findIndex(i=>i.id===item.id);
    if (ix>=0){ w.splice(ix,1); toast(`Removed from wishlist`); }
    else { w.push({ id:item.id, name:item.name, price:item.price, image:item.image, variant:item.variant||"" }); toast(`♥ Saved to wishlist`); }
    setWish(w);
    // also push to server if logged in
    pushWishToServer(item, ix<0);
  }
  async function pushWishToServer(item, add){
    const sb = window.dr && window.dr.auth && window.dr.auth.client();
    const user = window.dr && window.dr.auth && window.dr.auth.user;
    if (!sb || !user) return;
    if (add) await sb.from("wishlists").upsert({ user_id: user.id, product_id: item.id }, { onConflict: "user_id,product_id" });
    else await sb.from("wishlists").delete().eq("user_id", user.id).eq("product_id", item.id);
  }
  async function syncWishlistFromServer(){
    const sb = window.dr.auth.client(); const user = window.dr.auth.user;
    if (!sb || !user) return;
    const local = getWish();
    // push local → server (any not yet there)
    if (local.length){
      const rows = local.map(i=>({ user_id:user.id, product_id:i.id }));
      await sb.from("wishlists").upsert(rows, { onConflict: "user_id,product_id" });
    }
    const { data } = await sb.from("wishlists").select("product_id").eq("user_id", user.id);
    if (!data) return;
    const ids = new Set(data.map(r=>r.product_id));
    // hydrate from catalog
    const hydrated = Array.from(ids).map(id => {
      const p = findProduct(id);
      return p ? { id, name:p.name, price:p.price, image:(p.images||[])[0]||"", variant:p.variant||"" } : { id, name:id, price:0, image:"" };
    });
    setWish(hydrated);
  }

  /* ---------------- badges ---------------- */
  function refreshBadges(){
    const cc = cartCount(), wc = getWish().length;
    document.querySelectorAll(".icon-cart .badge-count").forEach(b => { b.textContent = cc; b.style.display = cc?"":"none"; });
    document.querySelectorAll(".icon-wish .badge-count").forEach(b => { b.textContent = wc; b.style.display = wc?"":"none"; });
  }
  function refreshWishHearts(){
    document.querySelectorAll(".product-card").forEach(card => {
      const p = productFromCard(card); if (!p) return;
      const btn = card.querySelector(".pc-wish"); if (!btn) return;
      btn.classList.toggle("active", inWish(p.id));
    });
  }

  /* ---------------- toast ---------------- */
  function toast(msg){
    let t = document.getElementById("dr-toast");
    if (!t){
      t = document.createElement("div");
      t.id = "dr-toast";
      document.body.appendChild(t);
    }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(()=>t.classList.remove("show"), 2200);
  }

  /* ---------------- mini cart drawer ---------------- */
  function ensureMini(){
    if (document.getElementById("dr-mini")) return;
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div id="dr-mini-overlay"></div>
      <aside id="dr-mini" aria-label="Cart">
        <div class="dr-mini-head">
          <h3>Your Cart</h3>
          <button class="dr-mini-close" aria-label="Close">×</button>
        </div>
        <div class="dr-mini-body"></div>
        <div class="dr-mini-foot">
          <div class="dr-mini-sub"><span>Subtotal</span><strong id="dr-mini-total">₹0</strong></div>
          <a href="cart.html" class="btn btn-outline btn-block">View Cart</a>
          <a href="checkout.html" class="btn btn-primary btn-block">Checkout →</a>
        </div>
      </aside>`;
    document.body.appendChild(wrap);
    document.getElementById("dr-mini-overlay").addEventListener("click", closeMini);
    wrap.querySelector(".dr-mini-close").addEventListener("click", closeMini);
    renderMini();
  }
  function renderMini(){
    const el = document.querySelector("#dr-mini .dr-mini-body"); if (!el) return;
    const c = getCart();
    if (!c.length){
      el.innerHTML = `<div class="dr-empty"><div style="font-size:48px">🛒</div><p>Your cart is empty.</p><a href="shop.html" class="btn btn-primary btn-sm">Shop Now</a></div>`;
    } else {
      el.innerHTML = c.map(i => `
        <div class="dr-mini-row" data-id="${i.id}">
          <img src="${i.image}" alt="${i.name}" onerror="this.style.background='#f0e8d8'">
          <div class="dr-mini-info">
            <div class="dr-mini-name">${i.name}</div>
            ${i.variant?`<div class="dr-mini-var">${i.variant}</div>`:""}
            <div class="dr-mini-qrow">
              <div class="dr-qty">
                <button data-act="dec">−</button><span>${i.qty}</span><button data-act="inc">+</button>
              </div>
              <div class="dr-mini-price">₹${(i.price*i.qty).toLocaleString("en-IN")}</div>
            </div>
          </div>
          <button class="dr-mini-rm" data-act="rm" aria-label="Remove">×</button>
        </div>`).join("");
    }
    const tot = document.getElementById("dr-mini-total"); if (tot) tot.textContent = "₹"+cartTotal().toLocaleString("en-IN");
  }
  function openMini(){ ensureMini(); document.getElementById("dr-mini").classList.add("open"); document.getElementById("dr-mini-overlay").classList.add("open"); }
  function closeMini(){ const m=document.getElementById("dr-mini"); if(m){ m.classList.remove("open"); document.getElementById("dr-mini-overlay").classList.remove("open"); } }

  /* ---------------- search overlay ---------------- */
  function ensureSearch(){
    if (document.getElementById("dr-search")) return;
    const el = document.createElement("div");
    el.id = "dr-search";
    el.innerHTML = `
      <div class="dr-search-inner">
        <input type="search" placeholder="Search products… try 'ghee', 'shilajit', 'honey'" autofocus>
        <button class="dr-search-close" aria-label="Close">×</button>
        <div class="dr-search-results"></div>
      </div>`;
    document.body.appendChild(el);
    el.querySelector(".dr-search-close").addEventListener("click", closeSearch);
    el.addEventListener("click", e => { if (e.target === el) closeSearch(); });
    const input = el.querySelector("input");
    const out = el.querySelector(".dr-search-results");
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      if (!q){ out.innerHTML = ""; return; }
      const list = (window.__CATALOG || []).filter(p =>
        p.name.toLowerCase().includes(q) || (p.category||"").toLowerCase().includes(q) ||
        (p.short||"").toLowerCase().includes(q)
      ).slice(0, 8);
      if (!list.length){ out.innerHTML = `<div class="dr-search-empty">No products found for "${q}"</div>`; return; }
      out.innerHTML = list.map(p => `
        <a href="product.html?id=${p.id}" class="dr-search-row">
          <img src="${(p.images||[])[0]||""}" alt="" onerror="this.style.visibility='hidden'">
          <div><div class="srn">${p.name}</div><div class="src">${p.category}</div></div>
          <div class="srp">₹${p.price.toLocaleString("en-IN")}</div>
        </a>`).join("");
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeSearch(); });
  }
  function openSearch(){ ensureSearch(); document.getElementById("dr-search").classList.add("open"); setTimeout(()=>document.querySelector("#dr-search input").focus(),50); }
  function closeSearch(){ const s=document.getElementById("dr-search"); if(s) s.classList.remove("open"); }

  /* ---------------- profile dropdown ---------------- */
  function ensureProfileMenu(btn){
    let m = document.getElementById("dr-profile-menu");
    if (!m){
      m = document.createElement("div"); m.id = "dr-profile-menu";
      document.body.appendChild(m);
      document.addEventListener("click", e => {
        if (!m.contains(e.target) && !e.target.closest(".icon-profile")) m.classList.remove("open");
      });
    }
    const u = window.dr && window.dr.auth && window.dr.auth.user;
    if (u){
      m.innerHTML = `
        <div class="dr-pm-head">
          <div class="dr-pm-av">${(u.email||"U")[0].toUpperCase()}</div>
          <div><div class="dr-pm-name">${u.user_metadata && u.user_metadata.full_name || u.email.split("@")[0]}</div><div class="dr-pm-email">${u.email}</div></div>
        </div>
        <a href="account.html">My Account</a>
        <a href="account.html#orders">My Orders</a>
        <a href="account.html#addresses">Addresses</a>
        <a href="wishlist.html">Wishlist</a>
        <button class="dr-pm-out" id="dr-pm-out">Sign Out</button>`;
      setTimeout(()=>{ const o=document.getElementById("dr-pm-out"); if(o) o.onclick = async ()=>{ await window.dr.auth.signOut(); m.classList.remove("open"); window.location.href="home.html"; }; },0);
    } else {
      m.innerHTML = `
        <div class="dr-pm-empty"><p>Welcome to Daulatram's</p></div>
        <a href="auth.html" class="btn btn-primary btn-block">Sign In</a>
        <a href="auth.html?mode=signup" class="btn btn-outline btn-block">Create Account</a>`;
    }
    const r = btn.getBoundingClientRect();
    m.style.top = (r.bottom + window.scrollY + 8) + "px";
    m.style.right = (window.innerWidth - r.right) + "px";
    m.classList.add("open");
  }

  /* ---------------- global delegation ---------------- */
  function bind(){
    document.addEventListener("click", e => {
      // Profile icon
      const prof = e.target.closest(".icon-profile");
      if (prof){ e.preventDefault(); ensureProfileMenu(prof); return; }
      // Cart icon
      const cart = e.target.closest(".icon-cart");
      if (cart){ e.preventDefault(); openMini(); return; }
      // Wishlist icon (header)
      const wishH = e.target.closest(".icon-wish");
      if (wishH){ e.preventDefault(); window.location.href = "wishlist.html"; return; }
      // Search icon
      const sBtn = e.target.closest(".icon-search");
      if (sBtn){ e.preventDefault(); openSearch(); return; }
      // Wishlist heart on product card
      const heart = e.target.closest(".pc-wish");
      if (heart){
        e.preventDefault();
        const card = heart.closest(".product-card"); if (!card) return;
        const p = productFromCard(card); if (p) toggleWish(p);
        return;
      }
      // Mini cart actions
      const row = e.target.closest(".dr-mini-row");
      if (row){
        const id = row.dataset.id; const c = getCart(); const it = c.find(x=>x.id===id);
        if (!it) return;
        const act = e.target.dataset.act;
        if (act === "inc") updateQty(id, it.qty+1);
        else if (act === "dec") updateQty(id, it.qty-1);
        else if (act === "rm") removeFromCart(id);
      }
    });

    // PDP cart/buy buttons
    const cartBtn = document.getElementById("cart-btn");
    const buyBtn  = document.getElementById("buy-btn");
    function pdpItem(){
      const id = new URLSearchParams(location.search).get("id");
      const p = findProduct(id); if (!p) return null;
      const qty = parseInt((document.getElementById("q-val")||{}).textContent || "1", 10) || 1;
      return { item: { id, name: p.name, price: p.price, image: (p.images||[])[0]||"", variant: p.variant||"" }, qty };
    }
    if (cartBtn) cartBtn.addEventListener("click", e => { const it = pdpItem(); if (!it) return; e.preventDefault(); addToCart(it.item, it.qty); }, true);
    if (buyBtn)  buyBtn.addEventListener("click", e => { const it = pdpItem(); if (!it) return; e.preventDefault(); addToCart(it.item, it.qty); window.location.href = "checkout.html"; }, true);

    // Storage change cross-tab
    window.addEventListener("storage", refreshBadges);

    refreshBadges();
    // delay so cards have rendered
    setTimeout(refreshWishHearts, 300);
    setTimeout(refreshWishHearts, 1500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();

  window.dr = window.dr || {};
  window.dr.store = {
    getCart, setCart, addToCart, updateQty, removeFromCart, clearCart,
    getWish, setWish, inWish, toggleWish, syncWishlistFromServer,
    cartCount, cartTotal, openMini, closeMini, openSearch, refreshBadges,
    findProduct
  };
})();
