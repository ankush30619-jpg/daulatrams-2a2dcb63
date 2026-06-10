/* ============================================================
   DAULATRAM'S — Shared page shell
   Injects announcement bar, header, mobile drawer, footer, WA button
   Usage: set window.ACTIVE_NAV = 'shop'|'about'|'contact'|'blog'
   ============================================================ */
(function () {
  const nav = window.ACTIVE_NAV || '';
  const navLinks = [
    { label: 'Shop', href: 'shop.html', key: 'shop' },
    { label: 'About', href: 'about.html', key: 'about' },
    { label: 'Contact', href: 'contact.html', key: 'contact' }
  ];

  /* ---- Announcement bar ---- */
  const ann = document.createElement('div');
  ann.className = 'announcement';
  ann.innerHTML = `<div class="ann-track">
    <span>🌿 FREE SHIPPING ON ALL ORDERS OVER ₹1000</span>
    <span>Use code <b>SHAKTI10</b> for 10% off</span>
    <span>✓ FSSAI Approved</span>
    <span>🌿 FREE SHIPPING ON ALL ORDERS OVER ₹1000</span>
    <span>Use code <b>SHAKTI10</b> for 10% off</span>
    <span>✓ FSSAI Approved</span></div>`;
  document.body.insertBefore(ann, document.body.firstChild);

  /* ---- Header ---- */
  const hdr = document.createElement('header');
  hdr.className = 'header scrolled'; /* inner pages always scrolled style */
  hdr.innerHTML = `<div class="container">
    <a class="brand-logo" href="home.html">
      <img src="/__l5e/assets-v1/d08a9c14-874e-4673-aa4b-d9f9fbf68a0d/daulatrams-logo.jpeg" alt="Daulatram's" onerror="this.src='assets/logo.jpg'">
    </a>
    <nav class="nav-center">
      ${navLinks.map(l => `<a class="nav-link${nav===l.key?' active':''}" href="${l.href}">${l.label}</a>`).join('')}
    </nav>
    <div class="nav-actions">
      <button class="icon-btn icon-search" aria-label="Search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg></button>
      <button class="icon-btn icon-wish" aria-label="Wishlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg><span class="badge-count">2</span></button>
      <button class="icon-btn icon-cart" aria-label="Cart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg><span class="badge-count">3</span></button>
      <button class="icon-btn hamburger" aria-label="Menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
    </div>
  </div>`;
  document.body.insertBefore(hdr, document.body.children[1]);

  /* ---- Mobile drawer ---- */
  const overlay = document.createElement('div');
  overlay.className = 'drawer-overlay';
  const drawer = document.createElement('aside');
  drawer.className = 'drawer';
  drawer.innerHTML = `<div class="drawer-top">
    <img src="/__l5e/assets-v1/d08a9c14-874e-4673-aa4b-d9f9fbf68a0d/daulatrams-logo.jpeg" alt="Daulatram's">
    <button class="drawer-close">×</button></div>
  <nav class="drawer-links">
    ${navLinks.map(l=>`<a href="${l.href}">${l.label}</a>`).join('')}
  </nav>
  <div class="drawer-social">
    <a href="https://wa.me/918860600134" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24z"/></svg></a>
    <a href="https://instagram.com" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/></svg></a>
  </div>`;
  document.body.insertBefore(overlay, document.body.children[2]);
  document.body.insertBefore(drawer, document.body.children[3]);

  /* ---- Footer ---- */
  const foot = document.createElement('footer');
  foot.className = 'footer';
  foot.innerHTML = `
  <div class="footer-top-divider"></div>
  <div class="container footer-main">
    <div class="footer-col footer-brand">
      <img src="/__l5e/assets-v1/d08a9c14-874e-4673-aa4b-d9f9fbf68a0d/daulatrams-logo.jpeg" alt="Daulatram's">
      <p class="tagline">Ayurveda for every home. Purity you can trust.</p>
      <div class="footer-social">
        <a href="https://wa.me/918860600134" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24z"/></svg></a>
        <a href="https://instagram.com" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="19" height="19"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/></svg></a>
        <a href="https://facebook.com" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
        <a href="https://youtube.com" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19"><path d="M23 12s0-3.5-.4-5.2a2.7 2.7 0 0 0-1.9-1.9C18.9 4.5 12 4.5 12 4.5s-6.9 0-8.7.4a2.7 2.7 0 0 0-1.9 1.9C1 8.5 1 12 1 12s0 3.5.4 5.2a2.7 2.7 0 0 0 1.9 1.9c1.8.4 8.7.4 8.7.4s6.9 0 8.7-.4a2.7 2.7 0 0 0 1.9-1.9C23 15.5 23 12 23 12zM9.8 15.3V8.7l5.7 3.3z"/></svg></a>
      </div>
      <div class="footer-badges">
        <span class="footer-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>FSSAI Approved</span>
        <span class="footer-badge"><svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2l2.9 6.3 6.8.7-5 4.6 1.4 6.7L12 17.7 5.9 21l1.4-6.7-5-4.6 6.8-.7z"/></svg>Made in India</span>
      </div>
    </div>
    <div class="footer-col"><h4>Shop</h4><ul>
      <li><a href="shop.html">All Products</a></li>
      <li><a href="shop.html?cat=mens-wellness">Men's Wellness</a></li>
      <li><a href="shop.html?cat=womens-wellness">Women's Wellness</a></li>
      <li><a href="shop.html?cat=hair-care">Hair Care</a></li>
      <li><a href="shop.html?cat=skin-care">Skin Care</a></li>
      <li><a href="shop.html?cat=desi-ghee">Desi Ghee</a></li>
      <li><a href="shop.html?cat=honey">Honey</a></li>
    </ul></div>
    <div class="footer-col"><h4>Company</h4><ul>
      <li><a href="about.html">About Us</a></li>
      <li><a href="contact.html">Contact</a></li>
      <li><a href="#">Blog</a></li>
      <li><a href="#">Careers</a></li>
    </ul></div>
    <div class="footer-col"><h4>Get in Touch</h4>
      <div class="footer-contact">
        <div class="ci"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Sarafa Bazar, Karnal, Haryana – 132001</div>
        <div class="ci"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.4 2.5 1.2 3.4.5 4.3L8.1 9.9a16 16 0 0 0 6 6l1.9-1.5c.9-.7 1.8.1 4.3.5a2 2 0 0 1 1.7 2z"/></svg><a href="tel:+918860600134">+91 88606 00134</a></div>
        <div class="ci"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7 10-7"/></svg><a href="mailto:daulatramsindia@gmail.com">daulatramsindia@gmail.com</a></div>
      </div>
    </div>
  </div>
  <div class="footer-bottom"><div class="container fb-inner">
    <div>© 2026 Daulat Ram Mukund Lal Swadeshi Kendra. All Rights Reserved.</div>
    <div class="footer-pay"><span>UPI</span><span>VISA</span><span>MC</span><span>RAZORPAY</span><span>COD</span></div>
  </div></div>`;
  document.querySelector('main') ? document.querySelector('main').after(foot) : document.body.appendChild(foot);

  /* ---- WhatsApp float ---- */
  const wa = document.createElement('a');
  wa.className = 'wa-float'; wa.href = 'https://wa.me/918860600134'; wa.ariaLabel = 'Chat on WhatsApp';
  wa.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24z"/></svg>`;
  document.body.appendChild(wa);

  /* ---- Social proof toast ---- */
  const toast = document.createElement('div');
  toast.className = 'sp-toast';
  toast.innerHTML = `<div class="sp-ico">🛒</div><div class="sp-txt"></div>`;
  document.body.appendChild(toast);

  /* ---- Header on inner pages: visible immediately, no entrance animation ---- */
  hdr.classList.add('revealed');
  hdr.style.opacity = '1';
  hdr.style.transform = 'none';
})();
