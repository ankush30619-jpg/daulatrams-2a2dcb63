## Goal
Cream-coloured section backgrounds (Find What Your Body Needs, Legacy, Concern, Testimonials, Ingredients, Media Trust) ko clean white karna, aur sab cards/boxes ke piche ek subtle elevated shadow add karna taaki wo white bg par "float" karein aur premium feel aaye.

## Changes — sirf `public/site/styles.css`

### 1. Section backgrounds → white
Inhe `#fff` kar denge (cream/cream-deep hata ke):
- `.legacy` (Trust the Legacy)
- `.cat-sec` (Find What Your Body Needs)
- `.concern` (Find Your Wellness)
- `.testi` (What Our Family Says)
- `.ingredients` (Nature's Most Powerful Herbs)
- `.media-trust` (press logos strip)

Cream rahega: hero overlay, dark-green sections (spotlight, ugc, why-choose, footer), product image placeholders inside cards (taaki cards par image bg natural rahe).

### 2. Cards par soft elevated shadow
White bg par cards visible/premium dikhein iske liye:
- `.cat-card` (concern circles) → `box-shadow: 0 8px 24px rgba(11,81,50,0.08), 0 2px 6px rgba(0,0,0,0.04)`; hover par deeper (`0 14px 36px rgba(11,81,50,0.14)`) + slight translateY(-4px)
- `.pc-card` (product cards) → same elevated shadow scale; hover deeper
- `.testi-card` → soft shadow same family
- `.ing-detail` panel → same
- Border thin `1px solid rgba(11,81,50,0.06)` add karenge taaki edges crisp lagein

### 3. Subtle separation between white sections
Saari sections white hone se monotony na lage — `.legacy`, `.cat-sec` etc. ke beech ek hair-thin divider feel ke liye section ke top par `border-top: 1px solid rgba(11,81,50,0.05)` (sirf alternating white sections par, optional).

## Out of scope
- HTML markup, JS, hero, dark-green sections, fonts, layout — sab untouched.
- Cream tokens (`--cream-warm`, `--cream-deep`) variables file me rahenge (other components use karte hain), bas section-level usages override honge.

## Result
Page ka rhythm: dark hero → white (legacy) → white (categories, cards float karte hue) → white (new arrivals) → dark green spotlight → white (concern) → dark green ugc → white (testi) → white (bestsellers) → dark green why-choose → white (ingredients) → white (media trust) → dark footer. Cards visibly elevated, clean modern e-commerce feel.
