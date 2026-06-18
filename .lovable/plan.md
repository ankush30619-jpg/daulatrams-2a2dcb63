# Rebuild PDP for `veer-ved-shakti-30` to match Rasayanam reference exactly

The target page is `product.html?id=veer-ved-shakti-30` (Veer Ved Max Shakti+ — 30 Capsules). We copy the reference layout 1:1, but populate with Daulatram's Veer Ved Max copy and freshly generated photography.

## Section order (top → bottom, exact mirror of reference)

1. **Sticky header** (unchanged)
2. **Hero buy box** — vertical thumb rail · large product shot · title + 4.8★ rating + "1,842 verified ratings" · benefit chip strip (All-Day Energy / Better Stamina / Josh & Vitality / 100% Ayurvedic) · **2 pack variant cards** (30 Caps default / 60 Caps with "MOST POPULAR" ribbon + free Shilajit gift) · ₹2,495 price + SAVE ₹704 (22% OFF) · qty stepper · BUY NOW + Add to Cart · trust icons row (Free Ship ₹1000+ · FSSAI · Secure Pay · Easy Returns) · payment logo strip
3. **Dark band "T-BOOSTER FOR PEAK PERFORMANCE"** — full-bleed dark lifestyle photo (male hand holding bottle) on left, headline + 3 icon pillars on right: All-Day Energy · Stamina & Strength · Josh & Vitality
4. **"EVERY MAN HAS FELT THIS, BUT RARELY SAYS IT"** — 4 mood-photo cards on cream: Low Energy · Poor Recovery · Low Drive · Constant Fatigue, with "Reclaim Your Vitality →" CTA
5. **Dark band "NOT ALL T-BOOSTERS ARE BUILT EQUAL"** — left photo (capsules + raw herbs), right 3 check-bullet differentiators: 14 Time-Tested Herbs · 3rd Generation Ayurveda · FSSAI Approved Manufacturing
6. **Mega-stat "100,000+"** — full-bleed dark, single huge number + "Men trust Daulatram's every month"
7. **Dark "THE FEARLESS MOST MEN NOTICE"** — 3 chocolate cards with orange circular icons: Sharper Drive · Stronger Stamina · Better Recovery
8. **"SUPPORT THAT SHOWS UP EVERYWHERE"** — 3 tall lifestyle cards (gym / desk / bedroom) with caption overlays
9. **"See what people say about us"** — 4 dark video testimonial cards in a carousel (reuse existing `assets/videos/*`)
10. **"WHAT'S INSIDE — AND WHY IT MATTERS"** — horizontal hero herb shot + ingredient chips for all 14 herbs (uses existing `assets/herbs/*.jpg`)
11. **Dark "BACKED BY SCIENCE · PROVEN BY PEOPLE"** — 4 stat tiles: 70% felt more energy · 30% better stamina · 23.3% improved recovery · 26% increased vitality (with "in 90 days, self-reported" subline)
12. **Cream band "We don't just sell capsules…"** — capsule-on-powder hero photo left, brand promise + Order CTA right
13. **FAQ split** — dark left column with bottle photo + "FAQ", right cream accordion (8 Q&A pulled from existing data)
14. **Verified reviews** — rating summary header (4.8 + bars) + 5 review cards
15. **"Explore Our Range"** — 4-card product carousel (reuse You-May-Also-Like)
16. **"Expert Wellness Ambassadors"** — 3 doctor/expert cards on cream
17. **Footer + orange "TOWARDS A BETTER YOU" strip** (unchanged)

## Files to change

- `public/site/product.html` — replace section markup with the 17-section structure above (keep existing hero buy-box JS, variant logic, sticky ATC, breadcrumbs, gallery init)
- `public/site/pdp.css` — append new section styles:
  - `.pdp-darkband` (chocolate `#2A1B12`, cream type, orange accent rule)
  - `.pdp-pillars`, `.pdp-problems-grid`, `.pdp-differentiator`, `.pdp-megastat`, `.pdp-benefits-dark`, `.pdp-lifestyle`, `.pdp-video-dark`, `.pdp-ingredient-strip`, `.pdp-science-stats`, `.pdp-brand-promise`, `.pdp-faq-split`, `.pdp-ambassadors`
  - Hero refinement: vertical thumb rail at ≥1024px, "MOST POPULAR" ribbon on variant card, compact benefit chips row
  - Mobile breakpoints: 1024 / 720 / 480
- `public/site/data.js` — add 6 content arrays scoped to Veer Ved Max:
  - `VV_PROBLEMS` (4), `VV_DIFFERENTIATORS` (3), `VV_BENEFITS_DARK` (3), `VV_LIFESTYLE` (3), `VV_SCIENCE_STATS` (4), `VV_AMBASSADORS` (3)
- `public/site/catalog.js` — adjust default-variant logic so PDP opens with **30 Caps** selected when `id=veer-ved-shakti-30`
- No backend / route changes

## Images to generate (Gemini, via `imagegen--generate_image` premium tier)

All saved into `public/site/assets/pdp-vv/` then uploaded with `lovable-assets` so the markup uses CDN URLs. Each prompt specifies warm cinematic light, deep-chocolate/cream palette, FSSAI-approved Indian Ayurvedic aesthetic, no on-image text.

1. `hero-darkband.jpg` (16:9) — strong Indian man's hand holding amber Veer Ved Max bottle, moody chocolate background, golden rim light
2. `problem-low-energy.jpg`, `problem-poor-recovery.jpg`, `problem-low-drive.jpg`, `problem-fatigue.jpg` (4:3) — desaturated portraits of Indian men in their 30s expressing each state
3. `differentiator-capsules.jpg` (4:3) — open capsules spilling onto raw shilajit + ashwagandha roots, dark velvet surface
4. `benefit-drive.jpg`, `benefit-stamina.jpg`, `benefit-recovery.jpg` (1:1) — symbolic close-ups (heart-rate band on wrist / running shoes mid-stride / man stretching at sunrise)
5. `lifestyle-gym.jpg`, `lifestyle-work.jpg`, `lifestyle-home.jpg` (3:4) — same male model, three contexts: gym push-up, focused at desk, with partner at home (tasteful)
6. `brand-promise-capsule.jpg` (16:9) — single amber capsule lying on golden herb powder, soft daylight
7. `faq-bottle.jpg` (3:4) — Veer Ved Max bottle on dark wood with subtle herb sprigs, vertical
8. `ambassador-1.jpg`, `ambassador-2.jpg`, `ambassador-3.jpg` (1:1) — three credible Indian wellness experts (Ayurvedic doctor in white coat / male fitness coach / yoga teacher) headshots

Total: **15 generated images**. Existing `assets/herbs/*`, `assets/videos/*`, `assets/pdp/veerved-primary.png`, and payment logos are reused as-is.

## Build order

1. Generate the 15 Gemini images into `public/site/assets/pdp-vv/`, upload each via `lovable-assets create`, save `.asset.json` pointers, delete the raw binaries
2. Add the 6 content arrays to `data.js`
3. Append all new section CSS to `pdp.css`
4. Rewrite `product.html` body with the 17-section structure, wiring asset URLs and data arrays
5. Patch `catalog.js` default-variant selector to honour `?id=veer-ved-shakti-30`
6. Verify on the preview: scroll the whole PDP at desktop (1280) + mobile (390) viewports

## Out of scope

- Landing page (`home.html`) restyle — handled in a follow-up, this pass is PDP-only
- Catalog schema changes, checkout flow, backend code
- New video shoots — existing WhatsApp/video testimonials reused
