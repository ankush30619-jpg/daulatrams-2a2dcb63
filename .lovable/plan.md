## Goal
Jab website open hoti hai (aur jab bhi page transition hota hai) wo deep-green wipe screen ke beech mein Daulatram's logo dikhna chahiye — ek subtle entrance animation ke saath, taaki brand reveal feel ho.

## Changes

### 1. `public/site/site.js` — transition overlay markup
Currently overlay ke andar ek leaf SVG hai (`<span class="pt-mark"><svg…leaf…/></span>`). Use replace karke logo image use karenge:

```html
<span class="pt-mark">
  <img src="<daulatrams-logo CDN url>" alt="Daulatram's" />
</span>
```

Logo URL `public/site/assets/daulatrams-logo.png.asset.json` se aayega (already uploaded asset).

### 2. `public/site/styles.css` — logo reveal styling
`.pt-mark img` ke liye styles:
- Width ~clamp(140px, 22vw, 240px), height auto
- Drop-shadow / subtle glow for depth on green bg
- Apna khud ka entrance animation: `ptLogoReveal` — fade + scale (0.85 → 1) + slight upward drift, ~700ms ease-out, slight delay (~150ms) so it appears after green panel slides in
- Exit animation: fade-out as panel wipes away
- `prefers-reduced-motion`: no scale/drift, just instant show

Existing wipe keyframes (`ptWipeIn` / `ptWipeOut`) aur timing untouched rehnge — sirf logo center mein add ho raha hai.

### 3. No other files touched
HTML pages, navbar, hero — sab same. Sirf transition overlay ka content + CSS update.

## Result
- Initial load: green panel upar se neeche slide karega, beech mein Daulatram's logo gracefully appear hoga, fir panel slide-out hoga revealing hero — premium brand reveal moment.
- Same effect every internal nav (Home ↔ Shop ↔ About etc.).
