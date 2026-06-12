## Fix plan

I’ll keep the sticky hero scroll effect active on **desktop and mobile**.

### What will change

1. **Desktop sticky hero stays exactly active**
   - Keep `.hero-banner.sticky-hero { position: sticky; top: 0; }` for desktop.
   - Do not remove or weaken the desktop scroll-stacking effect.

2. **Mobile hero moves below header, but remains sticky**
   - On mobile only, hero will start **under the announcement + header**, not behind it.
   - Mobile sticky offset will be set below the header:
     ```css
     @media (max-width: 768px) {
       .hero-banner { margin-top: 102px; }
       .hero-banner.sticky-hero { top: 102px; }
     }
     ```

3. **Mobile header will not cover the banner image**
   - On mobile, the home header will use solid header styling instead of transparent overlay.
   - Desktop can still keep the floating transparent header look.

4. **Hero image sizing remains clean**
   - Desktop: wide banner keeps current cinematic sticky behavior.
   - Mobile: portrait banner remains visible below header and still participates in sticky scroll reveal.

### File to edit
- `public/site/styles.css`

### Result
- Desktop: sticky hero effect visible.
- Mobile: sticky hero effect visible.
- Mobile hero image appears below the header, not hidden behind it.