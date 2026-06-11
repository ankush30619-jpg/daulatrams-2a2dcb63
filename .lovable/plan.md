## Changes

### 1. Promo bar coupon code
In `public/site/home.html`, `page-shell.js` (and any other page file using it), replace `Use code SHAKTI10 for 10% off` with `Use code powerplus10 for 10% off`.

### 2. "Shop by Concern / Find What Your Body Needs" — real images
Currently each category card uses an SVG/icon. Generate 6 real product/concept photos (AI generated, ~800×600 JPG) for the categories:
- Men's Wellness — herbal capsules + roots
- Women's Wellness — saffron/shatavari composition
- Desi Ghee — clay jar with ghee
- Hair Care — amla/bhringraj oil bottle
- Skin Care — kumkumadi/turmeric jar
- Honey & Ghee — honey jar with comb

Save under `public/site/assets/categories/*.jpg`. Update the category card markup in `home.html` (and `concern-grid` renderer in `site.js` if it injects them) to show the photo as a top thumbnail with hover zoom; keep the title, arrow and link. Tweak `styles.css` `.concern-card` for image-led layout (rounded image, gradient overlay, shadow already added).

### 3. Bestsellers carousel — left/right arrows
In `home.html` the "India's Favourites" / Bestsellers row currently renders as a static product-grid. Convert it into the same carousel pattern already used by New Arrivals: horizontal scroll-snap rail, left/right arrow buttons, autoplay every 4s with hover/touch pause. Reuse the existing `initCarousel` helper in `site.js` — just add the rail container + arrow buttons to the Bestsellers section markup and wire it up.

### 4. Product detail page — size dropdown (30 / 60 Caps)
On `product.html` for Veer Ved Max Shakti+:
- Replace the current single-size pill with a `<select>` dropdown offering:
  - `30 Caps — ₹2,495 (MRP ₹3,199)`
  - `60 Caps — ₹5,270 (MRP ₹6,200)`
- In `catalog.js`, consolidate the two Shakti+ entries so the main product has both size variants:
  ```js
  sizes: [
    { id:"veer-ved-shakti-30", label:"30 Caps", price:2495, orig:3199 },
    { id:"veer-ved-shakti-60", label:"60 Caps", price:5270, orig:6200 },
  ]
  ```
- Update `render.js` so changing the dropdown live-updates: price, MRP, save % badge, Buy Now / Add to Cart hrefs (carry `?id=…&size=…`), and the small detail line showing the selected pack.
- Default selection: 60 Caps (matches hero pricing of ₹2,495 stays for the 30 pack — but PDP defaults to 60 since that's the featured pack). Confirm default during build if needed.

### 5. Fix category redirects across the site
Audit every link going to a category and standardise to `shop.html?cat=<slug>` with slugs that match the filter logic in `shop.html`:
- Men's Wellness → `shop.html?cat=mens-wellness`
- Women's Wellness → `shop.html?cat=womens-wellness`
- Desi Ghee → `shop.html?cat=desi-ghee`
- Hair Care → `shop.html?cat=hair-care`
- Skin Care → `shop.html?cat=skin-care`
- Honey & Ghee → `shop.html?cat=honey`

Update:
- `home.html` "Shop by Concern" cards (currently they may point to `#` or wrong slug).
- Footer category links (already mostly correct, verify slugs).
- Header nav / mobile drawer if any category links exist.
- Verify `shop.html` reads `?cat=` query param and pre-filters; if not, add that logic so the redirect actually lands on the filtered view.

### Files touched
- `public/site/home.html`
- `public/site/page-shell.js`
- `public/site/product.html`
- `public/site/catalog.js`
- `public/site/render.js`
- `public/site/site.js`
- `public/site/shop.html` (cat query filter)
- `public/site/styles.css`
- New: `public/site/assets/categories/*.jpg` (6 images)

### Out of scope
Hero, herbs section, New Arrivals (already done), other product prices, fonts, dark-green theme.
