## Goal
Sign-in ke baad user ko ek **modern, sundar, fully-functional account dashboard** milega (`account.html`). Abhi bahut basic hai — usse premium-feel wala dashboard banaunga with avatars, stats, gradients, animations aur naye features.

## Naya Layout

```
┌─────────────────────────────────────────────────┐
│  HERO BANNER (gradient + welcome + avatar)      │
│  "Namaste, Ankush"  ·  Member since Jun 2026    │
│  [Stats: 3 Orders · 12 Wishlist · 2 Addresses]  │
├──────────────┬──────────────────────────────────┤
│              │                                  │
│  SIDEBAR     │   ACTIVE PANEL                   │
│  ◉ Dashboard │   (smooth fade-in animation)     │
│  ◌ Profile   │                                  │
│  ◌ Orders    │                                  │
│  ◌ Addresses │                                  │
│  ◌ Wishlist  │                                  │
│  ◌ Security  │                                  │
│  ─────────── │                                  │
│  Sign Out    │                                  │
└──────────────┴──────────────────────────────────┘
```

## Tabs / Features

1. **Dashboard (new)** — Welcome card, recent order preview, quick links (Track order, Reorder, View wishlist), loyalty/savings widget.
2. **Profile** — Avatar upload (initials fallback), Full name, phone, email (locked), DOB (optional), Gender, "Save" with toast confirmation.
3. **Orders** — Order cards with status pill (color-coded: pending/shipped/delivered), thumbnails, "View Details" expandable, "Reorder" button (re-adds items to cart), "Download Invoice" stub.
4. **Addresses** — Card grid, "Add New" modal (not inline details), edit existing, set default, delete with confirm.
5. **Wishlist** — Grid with hover effects, "Move all to cart", individual move/remove.
6. **Security (new)** — Change password, sign out from all devices, delete account (with confirmation modal).

## Visual Design

- **Hero**: Daulatram's brand gradient (deep green → gold accent), large round avatar with initials, name in Cormorant Garamond.
- **Stat cards**: glass-morphism, subtle shadow-elegant, hover lift.
- **Sidebar**: pill-style active indicator that slides between tabs (CSS transition).
- **Panels**: card with rounded-2xl, soft shadow, fade-in + slide-up animation on tab change.
- **Empty states**: friendly illustration/emoji + CTA button.
- **Toast**: success toast on save (reuse `dr.store` toast).
- **Mobile**: sidebar collapses to horizontal scrollable pill nav at top.
- **Skeletons**: shimmer loaders instead of "Loading…".

## Files to edit

- `public/site/account.html` — full rewrite of layout + tabs + new Dashboard & Security sections.
- `public/site/store.css` — add account-dashboard styles (hero, stats, sidebar pills, cards, skeletons, animations).
- `public/site/page-shell.js` — ensure profile icon dropdown shows "My Account / My Orders / My Wishlist / Sign Out" when logged in (small polish).

## Out of scope

- Real invoice PDF generation (button only).
- Real avatar image upload to storage (initials avatar only — image upload can come later if needed).
- Email change flow (email stays locked to auth).
