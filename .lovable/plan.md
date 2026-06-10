Plan:

1. Restore the footer/end section to normal scrolling
   - Remove the fixed `.page-end` reveal behavior.
   - Put newsletter + footer back into the normal page flow.
   - Remove the body padding script that was added only for the fixed footer.
   - Keep the footer design clean and consistent instead of changing its structure again.

2. Apply the sticky effect only to the hero banner
   - Keep the given hero banner image as the sticky/pinned visual.
   - As the user scrolls, the next content should slide over that hero image.
   - This effect is called Sticky Scroll Reveal, Scroll Stacking, or Peeling Scroll.

3. Make “Our Heritage” the section that comes over the hero
   - Ensure the reveal starts directly after the hero banner image.
   - Adjust the stacking so the “Our Heritage” section appears over the sticky hero image.
   - Avoid letting the entire website/footer participate in this effect.

4. Fix header impact without removing profile icon
   - Keep the profile/account icon.
   - Clean up the header positioning/layering so it does not break the hero reveal.
   - Preserve existing navigation and mobile menu behavior.

Technical changes:

- `public/site/home.html`
  - Remove the `.page-end` wrapper behavior.
  - Keep `.sticky-hero` only on the hero banner.
  - Make `.page-flow` start after the hero, with the Heritage section properly layered.

- `public/site/styles.css`
  - Replace the current broad sticky/footer rules with hero-only sticky reveal rules.
  - Remove `position: fixed` from `.page-end`.
  - Fix z-index/background layers so only the content after hero scrolls over the hero.
  - Restore footer to normal layout styling.

- `public/site/site.js`
  - Remove `syncEndSpace()` body padding logic because footer will no longer be fixed.
  - Keep existing header, drawer, carousel, and newsletter form scripts working.