## Fix mobile spacing + restore sticky hero (desktop + mobile)

### Problems
1. **White strip between marquee and header (mobile):** header is still at `top: 40px` (desktop value) but mobile announcement is only `36px` tall → 4px white gap.
2. **White space between header and hero image (mobile):** previous fix set `.hero-banner { margin-top: 102px }` on top of `body { padding-top: 36px }` → pushed hero ~36px too far down.
3. **Sticky hero scroll-stacking effect broken** on both desktop and mobile.

### Changes (all inside `public/site/styles.css`)

Inside the existing `@media (max-width: 768px)` block at lines 1068–1096:

```css
@media (max-width: 768px) {
  /* Header sits flush under the 36px announcement bar */
  .header { top: 36px; }

  /* Solid mobile home header so it doesn't float over the portrait banner */
  .home-floating-header .header {
    background: var(--deep-green) !important;
    box-shadow: 0 6px 20px rgba(0,0,0,0.18) !important;
  }
  .home-floating-header .header .nav-center {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.16);
  }

  /* Body already has padding-top:36px (announcement). Hero only needs
     to clear the 76px header (66px when scrolled) — no extra gap. */
  .hero-banner { margin-top: 66px; }
  .hero-banner img {
    width: 100%;
    height: auto;
    max-height: calc(100svh - 102px);
    object-fit: cover;
  }

  /* Sticky scroll-stacking on mobile, pinned below header */
  .hero-banner.sticky-hero { top: 102px; }
}
```

Desktop stays untouched (`.header { top: 40px }`, hero margin-top 40px, `sticky-hero { top: 0 }` keeps the cinematic overlap working).

### Result
- Mobile marquee → header → hero are all flush (no white strips).
- Sticky hero scroll-stacking effect works on both desktop and mobile.
- Mobile header stays solid so the portrait banner image is visible just below it.

### File to edit
- `public/site/styles.css`
