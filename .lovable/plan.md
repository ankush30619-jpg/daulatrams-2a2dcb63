## Goal

1. Replace the current desktop hero banner with the new wide image you uploaded (ChatGPT_Image_Jun_12_2026_01_28_05_PM.png).
2. On mobile, show the portrait/tall mobile-optimized hero image (ChatGPT_Image_Jun_12_2026_01_21_39_PM.png) instead of the desktop one.
3. Make the whole static site (`public/site/*.html`) **mobile-first** — everything should look polished and tap-friendly at 360–430px width, then scale up.

## What I'll do

### Hero banner swap
- Upload both images to Lovable Assets CDN.
- In `home.html`, replace the single `<img>` inside `.hero-banner` with a `<picture>`:
  - `<source media="(max-width: 768px)" srcset="<mobile-asset>">`
  - default `<img src="<desktop-asset>">`
- Adjust `.hero-banner` CSS so the tall mobile image isn't cropped awkwardly (auto-height on mobile, fixed cinematic ratio on desktop).

### Mobile-first pass across all pages
Edit `public/site/styles.css`, `store.css`, `pages.css` (and small tweaks in `pdp.css`) to:

1. **Header / announcement bar**
   - Smaller logo, compact icon row, reduce gaps. Cart/wishlist badges sized correctly.
   - Announcement marquee: smaller font, less padding on mobile.

2. **Typography scale**
   - Reduce hero/h1/h2 clamp() minimums for phones; tighten line-height.

3. **Section spacing**
   - Reduce vertical padding (`section` ~56px → 36px on mobile), container side padding 16px.

4. **Grids → single column / horizontal scroll**
   - Product grid, category grid, blog grid, footer columns → `1fr` or 2-col where it makes sense.
   - "Featured products" / "Best sellers" rows → snap-scroll carousel on mobile (`overflow-x:auto; scroll-snap`).

5. **Shop / PLP**
   - Filter sidebar becomes a bottom-sheet drawer triggered by a sticky "Filter" button.
   - Sort dropdown + grid count in a compact top bar.

6. **PDP (product.html)**
   - Image gallery stacks above details, thumbs scroll horizontally.
   - Sticky bottom "Add to Cart" bar on mobile.

7. **Cart / Checkout**
   - Stack summary below items; sticky checkout CTA at bottom of viewport.
   - Form fields 16px font (prevents iOS zoom), full-width inputs, larger tap targets (min 44px).

8. **Account dashboard**
   - Sidebar pills already horizontal-scroll; verify hero stats wrap to 2-col grid; make modals full-screen on phone.

9. **Footer**
   - Columns collapse to accordion (tap to expand) on mobile; social + badges centered.

10. **Floating WhatsApp + social-proof toast**
    - Reposition so they don't overlap sticky CTAs on mobile.

11. **General touch polish**
    - All buttons min-height 44px, focus-visible rings, no hover-only affordances.
    - Replace any `100vh` with `100svh` to avoid iOS address-bar jump.
    - `body { -webkit-text-size-adjust: 100%; overflow-x: hidden; }`.

### Files touched
- `public/site/home.html` — hero `<picture>` swap.
- `public/site/styles.css` — global mobile-first refactor (most additions inside one big `@media (max-width: 768px)` block plus base-size tweaks).
- `public/site/pages.css` — page-hero + shop/about/contact/blog mobile tweaks.
- `public/site/store.css` — cart/checkout/account/wishlist mobile tweaks.
- `public/site/pdp.css` — PDP mobile + sticky add-to-cart bar.
- `public/site/page-shell.js` — footer accordion behavior on mobile, drawer polish.

### Out of scope
- React `/profile` route (already redesigned earlier).
- No new pages, no backend changes.
- No copy/content rewrites — only layout, sizing, spacing, and the hero image swap.

Approve and I'll implement in one pass.
