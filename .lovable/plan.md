## 1. Heritage image swap (About page)

In `public/site/about.html` (line 29), the left side of the "Our Heritage / Trust the Legacy of Daulatram's" section currently uses `assets/about-collage.webp` (the tilted card mockup in the screenshot).

Replace it with the same collage used on the homepage:
- URL: `/__l5e/assets-v1/6bf56d2e-bc36-4665-853c-605922d157c0/heritage-collage.png`
- Keep the same wrapper, alt text, rounded corners and card shadow so the layout doesn't shift.

## 2. "Our Journey" timeline — richer animations

Currently each `.tm-item` only has a plain `sr` (scroll-reveal fade-up). The vertical line, dots and cards all appear with the same generic motion.

Upgrades, all in `public/site/about.html` + `public/site/pages.css` (no JS framework, pure CSS + IntersectionObserver already wired via `sr`):

**Vertical spine**
- Animate the gradient line drawing top→bottom as the section enters the viewport (`clip-path: inset(0 0 100% 0)` → `inset(0)`), 1.4s ease-out.
- Add a soft pulsing glow behind the gradient.

**Dots**
- Each `.tm-dot` gets a delayed pop-in (`scale(0)` → `scale(1)`, cubic-bezier overshoot) staggered by item index (0.15s, 0.3s, 0.45s, 0.6s).
- Add a continuous "ping" ring (`@keyframes tm-ping`) around the active/visible dot — orange → green alternating with the timeline gradient.
- On hover, dot scales to 1.4 with brand-orange glow.

**Cards**
- Left-side cards slide in from `translateX(-40px)`, right-side from `translateX(40px)`, with a slight rotate (`rotate(-1.5deg)` → `rotate(0)`) for a hand-placed feel.
- Stagger matches the dot stagger so the dot lands first, then the card unfolds.
- Hover: card lifts (`translateY(-6px)`), shadow deepens, the `.tm-year` label shifts color from orange → deep green with a subtle underline-grow.

**"The Beginning" first card highlight**
- Add a small decorative leaf/sparkle SVG (inline) in the corner that gently rotates (`@keyframes tm-leaf-sway`, 6s infinite).
- The `.tm-year` text gets a typewriter-style reveal (CSS `@keyframes tm-typing` with `clip-path`) on first scroll-in.

**Section header**
- "Our Journey" label gets a fade-up + letter-spacing tighten animation.
- "From One Shop to Every Indian Home" heading splits into two lines with a staggered slide-up.

**Implementation notes**
- All new keyframes (`tm-line-draw`, `tm-dot-pop`, `tm-ping`, `tm-card-slide-left`, `tm-card-slide-right`, `tm-leaf-sway`) added to `pages.css` under a `/* timeline animations */` block.
- Reuse existing `IntersectionObserver` from `site.js` (the `.sr` class) — add a new `.sr-timeline` modifier on `.timeline-inner` so the spine + cards trigger together when 30% visible.
- Respect `prefers-reduced-motion`: wrap continuous animations (ping, leaf-sway) in a media query that disables them.
- Mobile: keep slide-in but reduce distance to `translateX(-20px)` and disable the rotate for cleaner stacking.

### Files touched
- `public/site/about.html` — heritage `<img>` src swap; add small SVG decoration on the first `.tm-card`; add `sr-timeline` class on `.timeline-inner`.
- `public/site/pages.css` — new keyframes + hover/entry styles for `.tm-item`, `.tm-dot`, `.tm-card`, `.tm-year`, `.timeline-inner::before`.
- `public/site/site.js` — extend the existing scroll-reveal observer to also toggle a `.in-view` class on `.sr-timeline` (so the spine draw + staggered children fire together).

### Out of scope
Content rewrites in the timeline cards, layout restructure, dark mode, other About page sections (founder stats, values grid, etc.).
