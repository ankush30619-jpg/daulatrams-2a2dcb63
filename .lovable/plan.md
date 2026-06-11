
# Make Static Site Fully Active (End-to-End with Lovable Cloud)

Static site lives in `public/site/*.html` (vanilla JS/CSS, no React). I'll keep that stack and wire it to Lovable Cloud (Supabase) for auth + orders. Cart/wishlist stay in `localStorage` (industry standard for guest carts) and merge into orders on checkout.

## What "fully active" will mean after this

Every header icon and every product CTA works on every page (home, shop, product, about, contact, new pages below).

### 1. Cart (localStorage + mini-drawer)
- New `public/site/store.js`: shared cart/wishlist store (`getCart`, `addItem`, `removeItem`, `updateQty`, badges sync via `storage` + custom `cart:change` event).
- `page-shell.js`: clicking cart icon opens a **mini-cart side drawer** with line items, qty steppers, subtotal, "View Cart" + "Checkout" buttons. Badge auto-updates on every page.
- Every "Add to Cart" / "Buy Now" button (home carousels, shop grid, product page) wired through `store.addItem`. Toast confirmation.
- New page `public/site/cart.html`: full cart with qty edit, coupon field (`powerplus10` = 10% off), shipping calc (free >₹1000), proceed-to-checkout.

### 2. Wishlist
- Same store handles wishlist. Heart icon on every product card toggles + animates. Badge in header reflects count.
- New page `public/site/wishlist.html`: grid of saved products with "Move to Cart" / "Remove".

### 3. Search
- Search icon opens a full-screen overlay (built in `page-shell.js`) with input + live results from `catalog.js` (title/category/keyword filter). Keyboard nav, Esc closes.

### 4. Auth (Lovable Cloud)
- New page `public/site/auth.html`: email/password + Google sign-in (Lovable managed). Tabs for Sign In / Create Account. Forgot password flow.
- `page-shell.js`: profile icon → if signed-out, go to `auth.html`; if signed-in, dropdown with "My Account / Orders / Addresses / Sign Out".
- Loads supabase-js v2 via CDN, uses publishable key (already in env). Session persisted in localStorage.

### 5. Account area (auth-gated client-side)
- New page `public/site/account.html`: tabs for **Profile**, **Orders**, **Addresses**, **Wishlist**.
  - Profile: read/update `profiles` (full_name, phone, avatar).
  - Orders: list from `orders` + `order_items` for the signed-in user.
  - Addresses: full CRUD on `addresses` table (already exists).
- Redirects to `auth.html?redirect=account.html` if not signed in.

### 6. Checkout + Orders
- New page `public/site/checkout.html`: 3 steps (Address → Review → Payment-stub).
  - Requires sign-in (else redirect to auth with return URL).
  - Address picker from `addresses` or inline new-address form.
  - On "Place Order": insert into `orders` (uses existing `generate_order_number` trigger) + `order_items`, clear cart, redirect to `order-confirmation.html?order=DR-...`.
- New page `public/site/order-confirmation.html`: shows order number, items, total, address, "Track Order" CTA.
- Payment: stub only ("Cash on Delivery" + "Pay Online (coming soon)"). Real Razorpay/Stripe is a separate ask.

### 7. Blog (placeholder)
- New `public/site/blog.html`: simple list of 3 static articles so the "Blog" nav link no longer points to `home.html#watch-shop`. Update `page-shell.js` href.

### 8. Database (small additions)
One migration:
- `wishlists` table (user_id, product_id, created_at) + RLS + GRANTs — so wishlist survives device changes for logged-in users (auto-syncs from localStorage on login).
- `coupons` table seeded with `powerplus10` (10% off, min ₹0) so the rule lives in DB, not just JS.
- Profiles already exists; no change.

## Files to create
- `public/site/store.js` — cart/wishlist store
- `public/site/auth.js` — supabase client + session helpers
- `public/site/cart.html`, `wishlist.html`, `auth.html`, `account.html`, `checkout.html`, `order-confirmation.html`, `blog.html`

## Files to edit
- `public/site/page-shell.js` — wire icons, mini-cart drawer, search overlay, profile dropdown, badge updaters, load `store.js` + `auth.js`
- `public/site/render.js` + `data.js` — make add-to-cart / wishlist buttons call store
- `public/site/shop.html`, `product.html`, `home.html` — ensure buttons have correct data-product-id attributes
- `public/site/styles.css` / `pages.css` — styles for drawer, overlay, auth, account, checkout

## Out of scope
- Real payment gateway integration (Razorpay/Stripe) — stub only
- Admin dashboard for orders
- Reviews/ratings backend (display-only stays as is)
- Migrating the static site to TanStack/React
- Email notifications on order placed

This is a large change spanning ~7 new pages + 1 migration. After approval I'll build it in one pass.
