## Goal

Fix the nav so Shop no longer appears pre-selected on the home page, add a smooth "fill" page transition when navigating, and rebuild `shop.html` into a high-converting shop experience with categories + products + more.

## 1. Fix navbar active state

- In `public/site/home.html`, the Shop link has `class="nav-link active"` — that's why Shop looks "selected" on the home page. Remove `active` so nothing in the nav is highlighted on home (brand logo already handles Home).
- In `public/site/page-shell.js`, ensure the per-page `window.ACTIVE_NAV` logic only adds `.active` on pages that actually match (already correct — just verify home doesn't ship a hardcoded active Shop).
- Apply the same cleanup in the mobile drawer.

## 2. Page transition "fill" effect (site-wide)

Add a subtle, premium page-leave animation that plays when a user clicks any internal `<a href="*.html">` link (Shop, About, Contact, footer links, etc.).

- New element `#page-transition` injected globally in `page-shell.js` and home (a full-screen panel with the brand deep-green color + soft gradient).
- On click of any internal link: prevent default, run a CSS keyframe that wipes the panel from bottom→top (or diagonal sweep) over ~500ms, then `location.href = link.href`.
- On `pageshow` (incoming page), play the reverse wipe so the new page reveals from top→bottom.
- Honor `prefers-reduced-motion` — skip animation in that case.

Styles live in `styles.css` (`.page-transition`, keyframes `wipeOut` / `wipeIn`).
Logic lives in `site.js` (new `initPageTransition()` called on DOMContentLoaded).

## 3. High-converting Shop page rebuild

Rebuild `public/site/shop.html` end-to-end. Existing product grid + filter logic is good — keep it, but wrap it inside a much richer page.

New sections, in order:

1. **Shop hero** — big editorial heading ("Shop Pure Ayurveda"), short benefit line, search bar, trust strip (Free Shipping ₹499+ · COD · 100% Authentic · GMP Certified).
2. **Shop by Category** — visual grid of category cards (Men's Wellness, Women's Wellness, Hair Care, Skin Care, Desi Ghee, Honey, Weight Loss). Each card has an image, name, product count, and links to `shop.html?cat=<slug>` (scrolls to grid + activates filter).
3. **Bestsellers strip** — horizontal scroller of top-rated products with "BESTSELLER" badge and quick "Add to cart".
4. **Sticky filter toolbar** — keep existing pill filters + sort, add a secondary "Price range" + "In stock only" + result count. Becomes sticky under the header on scroll.
5. **Main product grid** — existing renderer, slightly upgraded card (hover quick-view, second image on hover if available, "Add to cart" inline button, savings line).
6. **Why Daulatram's trust section** — 4 icons (3-gen heritage, lab-tested, 100% natural, fast shipping).
7. **Testimonials snippet** — 3 short reviews carousel.
8. **Newsletter / offer banner** — "Get 10% off your first order" with email capture, reusing existing `data-newsletter` form.
9. **Footer** via existing `page-shell.js`.

URL behavior:
- `?cat=<slug>` pre-activates a filter and smooth-scrolls to the grid.
- `?q=<search>` filters by name/keyword.
- Category-card click pushes `history.pushState` so back button works without full reload.

## Technical changes

- `public/site/home.html`
  - Remove `active` from desktop and drawer Shop link.
  - Add `<div id="page-transition" aria-hidden="true"></div>` near body end.
- `public/site/shop.html`
  - Rewrite body: add hero, category grid, bestsellers strip, sticky toolbar wrapper around the existing pills, trust section, testimonials, newsletter banner.
  - Keep current grid renderer; extend it to add quick-add and hover image.
- `public/site/styles.css`
  - `.page-transition` panel + `@keyframes wipeOut / wipeIn`.
  - `.shop-hero`, `.cat-card-grid`, `.cat-card`, `.bestsellers-strip`, `.shop-toolbar.sticky`, upgraded `.product-card:hover` states, `.shop-trust`, `.shop-testimonials`, `.shop-offer-banner`.
- `public/site/site.js`
  - `initPageTransition()` — intercept internal `.html` links, run wipe, then navigate. Reverse wipe on load. Respect reduced motion.
- `public/site/page-shell.js`
  - Inject `#page-transition` element on every page (so non-home pages get the effect too).
  - Keep `ACTIVE_NAV` logic; ensure no hardcoded active state.

## Out of scope

- Real cart/wishlist persistence (existing badge counts stay static).
- Product image upgrades (uses existing catalog images).
- Backend/database changes.
