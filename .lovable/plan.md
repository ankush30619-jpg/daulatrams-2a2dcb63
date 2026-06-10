## Goal
"Daulatram's" ke niche jo green underline SVG hai, usko aisa banayenge ki jab user scroll karke "Our Heritage" section tak aaye, tab woh line **left se right invisible pen se draw** hoti hui dikhe — taaki dhyaan seedha "Daulatram's" pe jaaye.

## Where
- File: `public/site/home.html` — section `#trust-legacy` (line 144) me already SVG `<path>` maujood hai inside `.underline-word`.
- File: `public/site/styles.css` — `.legacy .underline-word svg path` styles already defined hain.
- Existing scroll-reveal system: parent `.sr` element ko `site.js` IntersectionObserver `.in` class deta hai jab woh viewport me aata hai. Isi trigger ko reuse karenge — koi naya JS nahi chahiye.

## Changes (sirf CSS — 1 file edit)

In `public/site/styles.css`, `.legacy .underline-word svg path` ke baad add karenge:

1. Default state: `stroke-dasharray: 300; stroke-dashoffset: 300;` (line poori chhupi hui — invisible pen).
2. Jab parent `.sr.in` ho jaye (section viewport me aaya): `stroke-dashoffset: 0` with `transition: stroke-dashoffset 900ms ease-out 250ms` — chhoti si delay ke baad line left→right draw hoti hai.
3. Reduced-motion users ke liye fallback: `@media (prefers-reduced-motion: reduce)` me line turant visible (no animation).

## Out of scope
- Koi naya JS / IntersectionObserver nahi.
- Baaki pages (about, shop, etc.) ka koi underline animation nahi — sirf home page ka heritage section.
- Underline ka color/shape same rahega, sirf draw-in effect add hoga.
