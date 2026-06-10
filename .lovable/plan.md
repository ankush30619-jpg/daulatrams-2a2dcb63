## Goal
1. Header ko banner image ke upar transparent overlay banao (abhi neeche bada green strip hai — woh hatega). Announcement bar (FREE SHIPPING…) upar rahega.
2. Banner image lift karo taaki woh full visible ho aur header uske upar floating dikhe.
3. Cart icon ke side me **Profile icon** add karo.
4. Real **signup/login** + ek detailed **Profile page** banao jisme user apne orders, addresses, account info dekh sake. Iske liye **Lovable Cloud** enable hoga (database + auth).

---

## A) Header + Banner fix (visual)

**`public/site/styles.css`**
- `.header` — `position: fixed; top: 40px;` waisa hi, par `background: transparent; box-shadow: none;` default.
- `.header.scrolled` — yeh sirf scroll par dark-green hoga (jaisa pehle tha). Banner par scroll-top par transparent rahega.
- `.hero-banner` — `padding-top` hatao (abhi 116px hai, isi wajah se banner upar dabba dikh raha). Banner image direct announcement bar ke neeche se start hogi; header uske upar overlay rahega.
- Banner image full visible: kyunki header transparent + absolute-ish hai, image neeche se start hokar pura dikhega.

**`public/site/site.js`**
- Pehle wala "no `.hero` → always scrolled" tweak hata do — banner page par header transparent honi chahiye top par; sirf scroll on `.hero-banner` ke baad `.scrolled` add karo.

**`public/site/home.html`** + **`public/site/page-shell.js`** — markup waisa hi, sirf naya **Profile icon** add karenge (next step).

---

## B) Profile icon in header

`page-shell.js` aur `home.html` dono me `.nav-actions` me cart ke pehle (left side of cart) ya cart ke baad ek **profile icon** button add hoga:
```html
<a class="icon-btn icon-profile" href="/profile" aria-label="Profile">
  <svg ...user icon.../>
</a>
```
Logged-in user ka pehla letter ya green dot badge dikha sakte hain (server fn se).

---

## C) Lovable Cloud enable + Database schema

**Enable Cloud** (Supabase under the hood). Then migrations:

**`profiles` table** (auto-created on signup via trigger)
- `id uuid PK references auth.users on delete cascade`
- `full_name text`, `phone text`, `avatar_url text`, `created_at timestamptz default now()`
- Trigger `handle_new_user()` after insert on `auth.users` → insert profile row.
- RLS: user can `select/update` own row.

**`addresses` table**
- `id uuid PK default gen_random_uuid()`, `user_id uuid references auth.users on delete cascade`
- `label text` (Home/Office), `line1, line2, city, state, pincode, country`, `phone`, `is_default bool`
- RLS: user owns rows.

**`orders` table**
- `id uuid PK`, `user_id uuid`, `order_number text unique` (e.g. DR-2026-0001 via sequence/function)
- `status text` (pending/confirmed/shipped/delivered/cancelled), `subtotal numeric`, `shipping numeric`, `total numeric`
- `shipping_address jsonb`, `payment_method text`, `created_at`, `updated_at`
- RLS: user can SELECT own orders; INSERT allowed for own user_id.

**`order_items` table**
- `id uuid PK`, `order_id uuid references orders on delete cascade`, `product_id text`, `product_name text`, `image_url text`, `unit_price numeric`, `quantity int`, `line_total numeric`
- RLS: user can SELECT items where parent order belongs to them.

GRANTs to `authenticated` + `service_role` on all four tables (per Cloud rules).

---

## D) Auth page — `/auth`

New TanStack route `src/routes/auth.tsx`:
- Tabs: **Sign In** / **Sign Up**
- Email + password (default). Google sign-in button using `lovable.auth.signInWithOAuth("google", ...)` (we'll call `supabase--configure_social_auth` for Google in the same turn).
- On signup: `emailRedirectTo: window.location.origin + "/profile"`.
- After login → redirect to `?redirect=` param or `/profile`.
- Styled with site's brand (deep-green + cream + DM Sans). Logo on top.

---

## E) Profile page — `/_authenticated/profile`

Lovable's integration-managed `_authenticated/route.tsx` (auto) gates the subtree → unauth users redirect to `/auth`.

New route `src/routes/_authenticated/profile.tsx` — single page with side-tabs (vertical) and content panel:

**Header strip:** avatar circle (initials), full name, email, "Edit profile" button, "Sign out" button.

**Tab 1 — Overview**
- Quick stats cards: Total Orders, Pending, Delivered, Total Spent (₹).
- "Recent orders" mini-list (last 3 with status pill).

**Tab 2 — My Orders**
- List of orders: order number, date, items thumbnail row, status pill (color-coded), total, "View details" expandable accordion showing items + shipping address + payment + timeline.
- Empty state: "No orders yet — Shop Now" CTA.

**Tab 3 — Addresses**
- Cards of saved addresses; add/edit/delete; mark default.
- Modal form (zod-validated): label, line1, line2, city, state, pincode, phone.

**Tab 4 — Account Settings**
- Edit profile form: full_name, phone, avatar upload (Supabase storage `avatars` bucket, public).
- Change password.

**Tab 5 — Wishlist** (optional placeholder — abhi sirf "Coming soon" agar wishlist data nahi hai).

Data loading: `createServerFn` with `requireSupabaseAuth` middleware for each fetch (`getMyProfile`, `getMyOrders`, `getMyAddresses`, `upsertAddress`, `updateProfile`). Loaders prime TanStack Query cache; components read via `useSuspenseQuery`.

**Styling:** match site brand — deep-green header, cream bg, DM Sans body, Cormorant for headings, orange accent for CTAs/badges, soft shadows, generous spacing, card-based layout (NOT generic dashboard).

---

## F) Seed (optional)
Insert 2 sample orders for a test user when they sign up first time? Skip — let user see clean empty state with CTA.

---

## Out of scope (this turn)
- Actual checkout/payment integration (no Stripe yet — orders table sirf manual/admin/CSV ke liye ready hai; cart system existing static site me hai but writes to DB later).
- Wishlist DB-backed (placeholder only).
- Admin order management UI.
