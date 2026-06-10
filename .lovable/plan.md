## Goal
Home page ke current hero section (slider + heading + subtext + Shop Now button + scroll cue) ko hata kar uski jagah ek single full-width **banner image** lagana — bas image, no text/button overlay.

## Changes

1. **Upload banner image to CDN**
   `lovable-assets create --file /mnt/user-uploads/86a7bfdc-f7df-40c5-8638-b890766e2a6b.png --filename hero-banner.png > public/site/assets/hero-banner.png.asset.json`

2. **`public/site/home.html`** — replace the entire `<section class="hero">…</section>` block with:
   ```html
   <section class="hero-banner">
     <img src="<CDN url>" alt="Daulatram's — Ayurvedic Strength" />
   </section>
   ```
   Image text already says "Aurvedic Strength / Shop Now" so no overlay needed.

3. **`public/site/styles.css`** — add `.hero-banner` rule:
   - `display:block; width:100%; margin-top: <header height>;`
   - `.hero-banner img { width:100%; height:auto; display:block; }`
   
   Header is fixed/transparent over the old hero. Since new banner replaces hero, we add top padding/margin equal to header height so banner sits below header (not hidden behind it).

4. **`public/site/site.js`** — header scroll logic uses `.hero` for scrolled state / parallax. Since `.hero` is gone, header should stay in its "scrolled" (solid) state always on home. Quick tweak: if no `.hero` found, add `header.classList.add('scrolled','revealed')` on load and skip parallax. (No other JS depends on `.hero` for home.)

## Out of scope
- Other sections (concerns, products, testimonials, footer) — untouched.
- Header logo/colors — already fixed in previous turn.
- Other pages — unchanged.
