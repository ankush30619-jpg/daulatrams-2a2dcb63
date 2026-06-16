
# Daulatram's website — change set (no design regressions)

All edits are scoped to `public/site/*`. Existing animations, sections, and styling stay; only the items below change. After implementation, run a self-check loop in the browser preview at each main page and fix any miss until everything is verified.

## 1. Top promo strip (all pages)
File: `public/site/page-shell.js`, `public/site/home.html` (mobile + desktop spans).
- Change `"Use code powerplus10 for 10% off"` → `"Use code powerplus10 for Extra 10% off"`.

## 2. Heritage stat label (home + about)
- `public/site/home.html` line ~120 and `public/site/about.html` line ~41: `Generations of Knowledge` → `Generations of Trust`.

## 3. Homepage "Shop by Category" — cartoon-style icons
- Swap the photo-style category cards in `data.js` (`cat-grid` block) for a cartoon-illustration version inspired by the reference: circular pastel-green chip + cartoon illustration + label below, horizontal scroll row. Use lightweight SVG/emoji illustrations (no new binary assets) so it stays cartoon-y. Keep the same category links (no routing change).

## 4. Product CTAs everywhere — two buttons
- In `data.js` `renderProductCard` and `shop.html` `cardHTML`: replace single `Order Now` with a button row:
  - Primary `Order Now` → product page.
  - Secondary `Add to Cart` (orange, matching brand orange in logo) → calls existing `window.Store.add(id)` (already used elsewhere) and toasts.
- Add a small `.btn-cart-orange` utility in `styles.css` (orange background, white text) — does not alter existing primary green.

## 5. Spotlight "FSSAI Approved" badge
- `public/site/home.html` `.spot-cert`: replace the inline check-circle SVG + "FSSAI Approved" text with a real FSSAI logo image (use the official FSSAI mark hosted via lovable-assets; if asset CLI fails, fall back to an inline SVG of the FSSAI mark). Same position/animation.

## 6. Redirection + product↔image audit
Bug reported: clicking Desi Ghee shows Honey and vice-versa.
- Audit `public/site/catalog.js`: confirm each product's `images[0]` matches its own product (the ghee/honey mix appears to come from products using placeholder category images like `assets/categories/desi-ghee.jpg` on Honey items, and vice versa). Replace mismatched placeholder paths with the correct product image already used elsewhere in catalog (e.g. honey items → existing honey PNGs, ghee items → `IMG.ghee`).
- Verify every category pill on `shop.html` (`Men's Wellness`, `Women's Wellness`, `Hair Care`, `Skin Care`, `Desi Ghee`, `Honey`, `Cold Pressed Oils`, `Wellness`, `Kitchen & Home`, `Weight Loss`) returns ≥1 product when clicked.
- Verify each homepage category card opens `shop.html?cat=<slug>` and the toolbar pill activates correctly.
- Verify each product card opens the correct `product.html?id=<id>` (no name/image swap).

## 7. Shop page restructure
File: `public/site/shop.html`.
- Keep Shop Pure Ayurveda hero + trust strip + search bar.
- Remove the entire "Shop by Category" section (`<section class="section shop-cats">`).
- Move the All-Products section (toolbar + grid) to be the first section below the hero.
- Then the Bestsellers strip (renamed in copy to keep "India's Favourite Bestseller — Veer Ved Max" intent) stays third.
- Shrink product card size by ~50%: reduce `.shop-grid` min card width and image height in `pages.css`/`store.css` (and bestsellers strip card) so many fit per screen.
- Stretch toolbar: in `.tb-inner`, push `count` further left and `sort-select` further right; allow `cat-filter-pills` to span full center width and wrap nicely.

## 8. Remove "What Our Family Says" on shop page
- Delete `<section class="section shop-testimonials">` block.

## 9. Shop page offer banner above footer
- Replace `Get 10% OFF your first order` → `Get 10% OFF on your first order`.
- Replace email input + Claim button with: a readonly code field showing `POWERPLUS10`, label `Use code POWERPLUS10 for Extra 10% off`, and a button `Copy this code` that copies to clipboard (vanilla JS).

## 10. About page tweaks
- (Done via step 2) `Generations of Knowledge` → `Generations of Trust`.
- "Our Promise — Why Thousands of Families Choose Daulatram's" cards on home + about: make text visible on dark background. Currently `.value-card` text on `--deep-green` is hard to read. Update card styling for dark background:
  - Background: subtle translucent surface (`rgba(255,255,255,0.06)` + 1px border).
  - Heading + body: white / off-white.
  - Replace emoji-only icons with cleaner stroke SVG icons (reuse the set already defined in `render.js` `values` array) so they look polished.

## 11. Mobile optimization (primary)
- Homepage "Our Promise" grid: on mobile show 2 cards per row (`grid-template-columns: repeat(2, 1fr)` ≤640px) instead of single column. Tighten paddings.
- General audit: ensure all sections use responsive grids (cards collapse to 2 cols on small phones, not 1, where it fits visually).
- Add `meta viewport` already exists — verify across pages.
- Touch targets ≥44px; horizontal scrolls for category rows use snap.

## 12. SEO + technical hygiene
- Add `public/site/robots.txt` allowing all and pointing to sitemap.
- Add `public/site/sitemap.xml` listing every `.html` page in `public/site/`.
- Each HTML page: verify unique `<title>`, `<meta description>`, canonical, OG + Twitter tags, JSON-LD (`Organization` on home/about, `Product` on product page via data, `WebSite` with SearchAction on home). Single H1 per page, alt text on key images, lazy loading already in place.

## 13. Verification loop
After edits, open the preview, navigate Home → Shop → each category → each product → About → Cart, and confirm every numbered item above is in place. If anything is missing or broken, re-edit and re-verify until clean. No regressions to existing animations, layout, or unrelated copy.

## Technical notes
- No backend or schema changes; pure static-site edits under `public/site/`.
- New utility CSS goes into existing `styles.css` / `pages.css`; no new build steps.
- Cartoon category icons rendered as inline SVG to avoid adding image assets.
- Add-to-cart uses existing `window.Store` already loaded on every page.
