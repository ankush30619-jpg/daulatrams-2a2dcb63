## Goal
Fix two mobile issues on `home.html` without touching desktop:
1. **"Our Heritage" (Trust the Legacy) section** — content is left-aligned and the 3 stats (`50,000+ Happy Customers` / `3 Generations of Knowledge` / `100% Natural Ingredients`) currently stack vertically, each on its own line, taking a lot of scroll.
2. **Footer** — on mobile it collapses to a single column (Brand → Shop → Company → Get in Touch all stacked), forcing too much scrolling.

All edits live in `public/site/styles.css` inside the existing `@media (max-width: 768px)` / `@media (max-width: 480px)` blocks. No HTML changes needed.

---

## Changes

### 1. `public/site/styles.css` — "Our Heritage" mobile fix

Add inside the mobile media block:

```css
@media (max-width: 768px) {
  /* Center the heritage / legacy text block on mobile */
  .legacy .sr { text-align: center; }
  .legacy h2 { text-align: center; }
  .legacy p.body { margin-left: auto; margin-right: auto; }
  .legacy .btn { margin: 0 auto; }

  /* Stats: 3 across in one row, no vertical stacking, no dividers */
  .stat-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin: 18px 0 24px;
    justify-items: center;
    text-align: center;
  }
  .stat {
    padding: 0 6px;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .stat:not(:last-child)::after { display: none; } /* remove vertical divider */
  .stat .num { font-size: 22px; }
  .stat .lbl {
    font-size: 11.5px;
    line-height: 1.25;
    margin-top: 6px;
    max-width: 100%;
  }
}
```

### 2. `public/site/styles.css` — Footer mobile optimization

Replace the existing weak mobile footer rules (lines ~1055–1061) with a compact 2-column layout that stays 2-col even at small widths, and tighten brand block:

```css
@media (max-width: 768px) {
  .footer-main {
    grid-template-columns: 1fr 1fr !important;
    gap: 22px 18px;
    padding: 36px 0 24px;
  }
  /* Brand spans full width, compact */
  .footer-col.footer-brand { grid-column: 1 / -1; text-align: center; }
  .footer-brand img { width: 130px; margin: 0 auto 12px; }
  .footer-brand .tagline { margin: 0 auto 14px; font-size: 13px; }
  .footer-social { justify-content: center; margin-bottom: 14px; }
  .footer-badges { justify-content: center; }

  /* Column headings tighter */
  .footer-col h4 { margin-bottom: 12px; font-size: 11.5px; }
  .footer-col ul { gap: 8px; }
  .footer-col ul a { font-size: 13px; }
  .footer-contact { font-size: 12.5px; line-height: 1.7; }

  /* "Get in Touch" spans full row so address/phone/email don't get cramped */
  .footer-col:last-child { grid-column: 1 / -1; }

  .footer-bottom .fb-inner { flex-direction: column; text-align: center; gap: 10px; font-size: 12px; }
}

/* Keep 2-col even at 480px (remove old single-col rule) */
@media (max-width: 480px) {
  .footer-main { grid-template-columns: 1fr 1fr !important; }
}
```

Resulting mobile footer layout:
```
[      Brand (centered, full width)      ]
[ Shop column     ][ Company column      ]
[      Get in Touch (full width)         ]
[          Bottom bar (centered)         ]
```

### 3. Cache-bust
Bump CSS version in `public/site/home.html` from `v=header-green-fix-1` → `v=mobile-heritage-footer-1`.

---

## Verification
After build, open `/site/home.html` at 390×844:
- Heritage section: heading, paragraph, button centered; the 3 stats sit in one horizontal row.
- Footer: brand centered up top, Shop + Company side-by-side, Get in Touch full-width below — roughly half the previous scroll length.
- Desktop (1366×768): unchanged.

## Files touched
- `public/site/styles.css`
- `public/site/home.html` (version bump only)
