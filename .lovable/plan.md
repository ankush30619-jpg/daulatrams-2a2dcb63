## Goal
Rebuild the **Veer Ved Max Shakti+ Capsules** product page only, matching the reference screenshot section-by-section. Other 9 product pages come in a follow-up turn.

## Page section order (top → bottom)

1. **PDP Hero**
   - Left: product gallery (main image + thumbnails)
   - Right: category label, title "Veer Ved Max Shakti+ Capsules", short description, star rating row, badge chips (All Day Energy, Better Stamina, Josh, Vitality — copied from screenshot)
   - **Single variant selector** (remove the second one). Options: `30 Capsules`, `60 Capsules`, `90 Capsules`
   - When `60 Capsules` is selected → show a **"FREE Daulatram's Shilajit Resin"** bonus card under the variant
   - Price block, qty, Buy Now + Add to Cart, trust strip, payment chips

2. **Trust Legacy Strip (green band)**
   - Text: "Trust the legacy of Daulatram's — 3rd generation of Ayurveda, now backed by science."
   - Replace current emoji icons with the **5 uploaded certification badges** (FSSAI Approved, ISO 9001, 100% Ayurvedic, Plant Based, Made in India) from `ChatGPT_Image_Jun_13_2026_01_25_02_PM.png`
   - Upload as a single image via lovable-assets, then slice/display the 5 circular badges in a row on the green background

3. **You May Also Like** — carousel of 15–20 products (horizontal scroll/snap, premium card styling that already exists)

4. **Do You Feel Any Of These Problems?** — 5 problem cards (existing component)

5. **Doctor Endorsement** — doctor image left, product benefits list right (existing)

6. **14 Powerful Herbs — All in One Capsule** — ingredient cards grid (existing, no circular images per prior instruction)

7. **Over 50,000 Men Are Already Seeing Results** — rating summary (4.7 stars, breakdown bars)

8. **Real WhatsApp Conversations** — WhatsApp-style testimonial cards (existing)

9. **Customer Video Reviews** — 4 vertical video cards (existing)

10. **Bundle / Offers strip** — 2–3 product bundle cards with discount (new small section reusing product-card styling)

11. **FAQ** — accordion (existing, polish styling)

12. **Footer** (existing global footer — no CTA band above it for this page)

## Files to edit
- `public/site/product.html` — re-order sections to match above; remove duplicate variant selector
- `public/site/render.js` — render single variant selector; conditional Shilajit free-gift card on 60-capsule selection; render new trust-badges strip; render bundle section
- `public/site/pdp.css` — styles for: new trust-badges strip (green band with 5 circular badge images), free-gift card, bundle cards, section reorder spacing
- `public/site/catalog.js` — ensure Veer Ved Max has 3 variants (30/60/90) and a `freeGiftOn: "60"` flag
- `src/assets/cert-badges.png.asset.json` — upload the 5-badges image via lovable-assets

## Out of scope (this turn)
- Other 9 product pages (will replicate this layout in a follow-up once Veer Ved Max is approved)
- Changes to home page, shop page, or other routes

Confirm and I'll implement.
