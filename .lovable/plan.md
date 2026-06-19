## Scope

Applies ONLY to product.html when `id` starts with `veer-ved-shakti` (existing `.vv-only` gate). All other SKUs keep the current layout untouched.

Files touched:
- `public/site/product.html` — new sections + sticky bars
- `public/site/pdp.css` — new styles, bump cache version to `pdp-vv-5`
- `public/site/assets/pdp-vv/*` — regenerate / add images (Gemini)
- No `data.js` schema changes; prices read from existing catalog (₹2,495 / 30 caps, ₹5,270 / 60 caps). Add a derived 90-cap price in the pack selector UI only (computed, no catalog change).

## New page structure (top → bottom, Veer Ved only)

1. **Sticky top promo bar** — saffron strip: "🔥 Buy 2 Get 1 FREE · Free shipping ₹999+ · 90-day money back". Dismissible (sessionStorage).
2. **Hero / above-the-fold buy box** (replaces current hero block on this SKU)
   - Left: main product image + 4 thumbnails + 1 video-placeholder thumb (swipeable on mobile).
   - Right:
     - Breadcrumb · rating chip `★ 4.7 · 12,480 Verified Reviews · 1 Lakh+ Men`
     - H1 product name + sub `Natural T-Booster · 14 Ayurvedic Herbs · 30/60 Caps`
     - Price: strike MRP, sale price, red `SAVE x%` badge, tax/shipping line
     - Pack selector tabs: `30 Caps ₹2,495` · `60 Caps ₹5,270 (POPULAR)` · `90 Caps ₹7,499 (BEST VALUE)` — switching 30↔60 navigates to that SKU; 90 routes to 60 + qty hint (no SKU yet).
     - Urgency block: rolling 24h countdown (per-visitor `localStorage`, resets each day) + static `Only 47 units left at this price`
     - Qty stepper
     - Primary CTA full-width: `🛒 ADD TO CART — ₹<price>` (wires to existing `data-cart-add`)
     - Secondary CTA outline: `⚡ BUY NOW`
     - Guarantee strip: 90-Day MBG · Free Ship · FSSAI · 100% Ayurvedic
     - Payment icons row (reuse existing pay assets)
3. **Trust banner** — keep existing 3rd-gen / FSSAI / ISO band.
4. **The Quiet Struggle (problem)** — keep existing 4-card grid; swap to new realistic photo set (4 new Gemini images).
5. **The Solution intro** — "14 ancient herbs. One modern capsule." + 3-column icon strip + new lifestyle capsule shot.
6. **Comparison table** — Veer Ved Shakti+ vs Other Brands (6 rows: herbs, shilajit, heritage, certification, steroids, MBG).
7. **Ingredients deep dive** — 6 featured herbs with dosages (Shilajit 40mg, Ashwagandha 300mg, Gokshura 250mg, Safed Musli 200mg, Kaunch Beej 150mg, Vidarikand 150mg) + `View all 14 ingredients` accordion. Reuse existing `/assets/herbs/*.jpg` images.
8. **How to Use (NEW)** — 3-step visual (2 caps · after meals · 90 days) + 4-milestone timeline graphic (Week 1-2 / 3-4 / Month 2 / Month 3). New timeline infographic image.
9. **Proof block (consolidated)** — top stat bar + tabbed UI: Text Reviews / WhatsApp / Video. Reuse existing WhatsApp + video assets; add 3 featured text reviews.
10. **Doctor endorsement** — keep card, add full quote in blockquote. Reuse existing doctor headshot.
11. **The Guarantee** — full-bleed dark band with shield/badge graphic + CTA `START YOUR 90-DAY TRIAL — ₹<price>`. New badge image.
12. **FAQ (filled)** — 6 accordions covering safety, timeline, stacking, pack difference, COD, refund.
13. **Cross-sell** — keep existing "Complete Your Stack" (max 3, compact).
14. **Sticky bottom CTA bar** — already exists; restyle with thumbnail + name + price + ATC, visible on mobile only.

Non–Veer-Ved SKUs: all 14 new sections are inside `.vv-only`, hidden via existing toggle script. Default sections that were shown for all SKUs (current generic hero/specs/reviews) get a complementary `.vv-hide` class so they hide on Veer Ved, keeping that page focused.

## Images to generate (Gemini, green/saffron/cream theme — matches site colors)

Regenerate/replace these under `public/site/assets/pdp-vv/`:
- `hero-bottle.jpg` — bottle on dark wood with shilajit/ashwagandha/gokshura, warm golden hour (new, replaces broken hero)
- `hero-thumb-1..4.jpg` — label closeup, capsules flatlay, herbs flatlay, lifestyle (4 new)
- `problem-fatigue.jpg` — tired man at desk with coffee (regenerate realistic)
- `problem-stamina.jpg` — runner stopped, hands on knees (regenerate)
- `problem-confidence.jpg` — couple silhouette on bed (regenerate)
- `problem-drive.jpg` — blank whiteboard scene (regenerate)
- `solution-capsules.jpg` — open bottle, capsules + herbs, soft morning light (new)
- `timeline-90day.jpg` — 4-milestone infographic, dark + saffron accents (new)
- `guarantee-badge.png` — 90-day MBG gold seal on dark green, transparent bg (new)

Keep existing lifestyle-energy / stamina / confidence images for the 90-day ritual cards.

## Urgency / countdown details

- Pure client-side, per-visitor 24h rolling timer stored in `localStorage` (`vv_offer_end`). On expiry, hide the timer (no fake reset loop user can detect).
- Stock-left line is static copy ("Only 47 units left") — not wired to backend.

## Cache busting

- Bump CSS link in product.html from `pdp-vv-4` → `pdp-vv-5`.

## Out of scope (call out so user can request later)

- No real inventory wiring (stock count is copy only).
- No new 90-cap SKU in catalog (`data.js` unchanged); the pack tab is UI only.
- No backend/DB changes.
- Other product pages and other site pages unchanged.

After approval I'll execute uploads + edits in batched parallel calls (images first, then HTML/CSS).