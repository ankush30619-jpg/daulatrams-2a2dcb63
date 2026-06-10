## Restore "Sticky Reveal" effect + Newsletter background

Wapas wahi effect laana hai jisme hero aur footer/newsletter section apni jagah **fixed** rehte hain aur beech ka content unke upar scroll hoke aata hai (sticky reveal / scroll-overlay).

### 1) Hero — sticky reveal wapas
`public/site/styles.css` me:
- `.hero-banner` → `position: sticky; top: 0; z-index: 0;` (height viewport-based)
- Next sections wrapper → `position: relative; z-index: 2; background: var(--cream);` taaki hero ke upar slide hoke aaye

### 2) Newsletter section — background image + white overlay + sticky reveal
- Newsletter ke liye ek lush ayurveda/leaves background image generate karunga (`src/assets/newsletter-bg.jpg` via lovable-assets)
- `.newsletter` CSS:
  - `background-image: url(...)` cover/center
  - `::before` pseudo → `background: rgba(255,255,255,0.85)` white overlay
  - Text colors flip: deep-green heading, dark body (currently white-on-green)
- Footer wrapper sticky: footer + newsletter ko `position: sticky; bottom: 0;` pattern me rakhunga so previous section uske upar scroll hoke khatam ho

### 3) Layering order
```text
[hero sticky top:0 z:0]
[middle sections z:2 bg:cream]   ← scrolls over hero
[newsletter sticky bottom:0 z:0]
[footer normal]
```

### Technical name (jo aap puchh rahe the)
Is effect ko **"Sticky Scroll Reveal"** ya **"Scroll Stacking / Layered Scroll"** kehte hain. CSS me `position: sticky` + `z-index` layering se banta hai. Kuch log ise **"Peeling Scroll"** ya **"Reveal-on-Scroll"** bhi bolte hain.

### Files to change
- `public/site/styles.css` — sticky rules + newsletter bg/overlay
- `public/site/home.html` — wrap middle content in `<div class="scroll-stack">` if needed
- `src/assets/newsletter-bg.jpg.asset.json` — new bg image

Koi backend / logic change nahi.
