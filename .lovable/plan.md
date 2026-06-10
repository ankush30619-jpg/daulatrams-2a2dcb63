## Goal
Header me jo white box dikh raha hai (purana JPEG ka white background tha) usko hatana, aur aapki nayi **transparent PNG logo** (`Untitled (2000 x 1000 px).png`) ko har jagah fit karna — header, mobile drawer, footer — sab pages pe.

## Where
Logo currently 2 jagah se aata hai:
- `public/site/page-shell.js` (3 references) — desktop header, mobile drawer, footer (yeh inject hota hai about/shop/product/contact pages me)
- `public/site/home.html` (3 references) — home page apna khud ka static header/drawer/footer rakhta hai

Sab me current src = previous JPEG asset (`/__l5e/assets-v1/d08a9c14-…/daulatrams-logo.jpeg`).

## Changes
1. **Upload nayi transparent PNG as CDN asset:**
   `lovable-assets create --file "/mnt/user-uploads/Untitled_2000_x_1000_px.png" --filename daulatrams-logo.png > public/site/assets/daulatrams-logo.png.asset.json`

2. **Find & replace** purani JPEG URL ko nayi PNG URL se — `page-shell.js` + `home.html` (one sed pass). White box gayab ho jayega kyunki naya logo transparent hai.

3. **Purana JPEG asset delete** karenge (CDN se bhi hat jayega) taaki orphan na rahe.

4. **No CSS change needed** — existing `.brand-logo img` height/spacing rules naye logo pe waise ke waise apply ho jayenge. Agar header me logo thoda chhota/bada dikha to ek chhota height tweak (`.brand-logo img { height: 40px; }` type) karenge — but pehle visually verify karenge.

## Out of scope
- Header background color / nav / announcement bar — untouched.
- Favicon update (alag turn me karenge agar mango).
