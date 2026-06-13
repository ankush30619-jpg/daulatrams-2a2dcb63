## 1. Hero — Rotating Badge

`public/site/home.html` (line 133): change the SVG `<textPath>` text from
`SINCE DECADES · OF HEALING ·` to `70 YEARS OF TRUST · DAULATRAM'S ·`.

`public/site/styles.css` (.badge-circle): tighten size, polish gradient ring (orange→deeper orange), slow rotation to ~22s, add subtle drop-shadow, and on mobile move it slightly inward so it sits cleanly on the collage corner instead of clipping.

## 2. Men's Wellness Spotlight (home.html)

In the spotlight section (`#spotlight` ~line 178–220):

- Pack selector default & visible behavior: when `60 Capsules` is chosen, render a new **Free Gift card** below the price block styled exactly like the user's reference (cream bg, gold dashed border, red "FREE" tag, product thumb, "100% FREE GIFT  ₹1250 Value", title "Daulatram's Shilajit Raisin (30ml)", description line).
  - Hidden when `30 Capsules` is selected.
  - New CSS class `.free-gift-card` in `styles.css` with the bordered/parchment look.
- CTA copy: change spotlight Buy Now button (line 200) and ALL other "Buy Now — …" CTAs on the spotlight to uppercase format: `BUY NOW — GET 15% OFF` (no extra spaces). Spot-off dynamic span fills in 15 or 22 based on pack.
- Replace the single all-ingredients image (line 209) with a **two-image stack**: Shilajit Raisin bottle + Veer Ved 60-cap bottle, with a small `+` divider and a "Includes Free Gift" ribbon when 60-pack is active. Use existing CDN images:
  - Shilajit: `IMG.shilajit` (already in data.js)
  - 60-cap pack: `IMG.shaktiAll`
- Tighten spacing: reduce gap between pills/benefits/rating, align price + save badge on one row at desktop, stack at mobile.

## 3. Product Page Image Fix (product.html / pdp.css)

Bug: `#main-img2` sometimes shows blank because `onerror` hides the `<img>` and the parent has no min-height.

- Give `.pdp-main-wrap` an aspect-ratio (1/1) and a parchment fallback background so the slot never collapses.
- Set `#main-img2` to `width:100%; height:100%; object-fit:contain` and remove the inline `onerror` that hides the element; instead swap to a placeholder data-URI on error so the slot still has visual content.
- Mobile: `.pdp-hero-inner` becomes single column under 880px; gallery sticks to top, thumbs scroll horizontally.

## 4. "You May Also Like" Redesign (product.html bottom + pdp.css)

- Convert `#related-grid` into a horizontally scrollable carousel on mobile (snap, no scrollbar) and a 4-up responsive grid on desktop using existing `renderProductCard`.
- New `.related-card` overlay class (in `pdp.css`) for premium look: soft shadow, rounded 18px, hover lift, "Bestseller" / discount chips visible, quick-view link.
- Section heading row: cleaner — eyebrow + heading left, "View All →" right; on mobile heading centered, link below.

## 5. About Page Polish (about.html / pages.css)

Typography, spacing, alignment:

- Page hero: add subtle parchment radial-glow background, increase H1 line-height, center description max-width 640px.
- "Trust the Legacy" grid: equalize column heights, raise collage corner radius, add gold underline accent under the H2.
- `.stat-row`: already centered on mobile; on desktop give each stat a faint vertical divider and even spacing.
- Values grid (deep-green section): polish `.value-card` — glassy bg, hover lift, consistent icon circle.
- Manufacturing section: replace placeholder block with a styled "Photo coming soon" plate matching the rest of the brand language.

### Timeline alternating animation (Our Journey)

Currently all `.tm-card`s slide in from the same side. Fix:

- `pages.css`: define `@keyframes slideInLeft` and `@keyframes slideInRight`. Use `.tm-item:nth-child(odd) .tm-card { animation: slideInLeft .8s cubic-bezier(.2,.7,.2,1) both }` and `:nth-child(even) .tm-card { animation: slideInRight ... }`, gated by an `.in-view` class.
- `site.js` (or inline script on about.html): IntersectionObserver adds `.in-view` to each `.tm-item` as it enters; ping dot animates with a delayed scale/pulse for a smoother stagger.
- Mobile (≤780px): the timeline stays a single vertical rail with the spine on the left, every card slides in from the right with the same observer — keeps it readable on phones.
- Spine: thinner (2px), gradient green→olive, dots get an outer ring matching the design in the reference image.

## 6. CTA Text Sweep

Across `home.html`, `product.html` and any sticky/floating CTA, normalize the "Buy Now — get 15 % Off" pattern to:

`BUY NOW — GET 15% OFF`  (uppercase, one em-dash, no inner spaces around %)

This applies to: `#spot-buy`, `#buy-btn` (when current variant has a 15% discount it reads `BUY NOW — GET 15% OFF`, else falls back to `BUY NOW — ORDER TODAY`), `#sum-price2` button label, and the rating-summary CTA.

## 7. Cache-bust

Bump CSS query string in every HTML that loads `styles.css`/`pages.css`/`pdp.css` from current value → `v=heritage-cta-fix-1` so users see the changes immediately.

## Verification Loop (after build)

Using the browser tool I'll:
1. Open `/site/home.html` at 1280×800 and 390×844 → confirm new badge text rotates smoothly, free-gift card appears when 60-cap selected, CTAs read `BUY NOW — GET 15% OFF`.
2. Open `/site/product.html?id=veer-ved-shakti-60` desktop + mobile → confirm main image renders (no blank slot), related grid is premium, sticky CTA wording correct.
3. Open `/site/about.html` desktop + mobile → scroll Our Journey, confirm cards alternate left/right with smooth fade-slide on each scroll-in, mobile shows single-rail timeline.
4. If any check fails, iterate on the same files until it passes — only then stop.

## Files Touched

- `public/site/home.html`
- `public/site/about.html`
- `public/site/product.html`
- `public/site/styles.css`
- `public/site/pages.css`
- `public/site/pdp.css`
- `public/site/site.js` (timeline IntersectionObserver only)

No backend, no schema, no new dependencies.
