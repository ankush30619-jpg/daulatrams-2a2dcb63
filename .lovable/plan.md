## Goal
Home page par 5 changes karne ha — naye product carousels, real herb images (14 ancient herbs), product details Excel se update, aur new arrivals carousel me autoplay + arrow buttons.

## Changes

### 1. Naye product rows on home page (2 extra carousels)
`public/site/home.html` me 2 naye sections add karenge (Best Sellers ke neeche / strategic positions par):

- **"Trending Now"** — cold-pressed oils + premium honey mix (Coconut, Badam Rogan, Sesame, Flax Seed oils + Van Tulsi, Multiflora, Wild Forest honey). Carousel format with arrows + autoplay.
- **"Wellness Essentials"** — capsules & juices (Shaktiplus, Shilajit Drop, Ashwagandha Shilajit Capsule, Moringa Capsules, Nari Kalp, Amla Aloevera Juice, Spirulina). Carousel with arrows + autoplay.

`public/site/data.js` me naye arrays `trendingNow` aur `wellnessEssentials` add karenge with proper IDs, sizes, descriptions (Excel se).

### 2. Real herbs image in "Nature's Most Powerful Herbs" (ingredients section)
Current ingredients section me emoji icons hain. Plan:
- 14 herb ki real photo-realistic images generate karenge (AI se, premium quality) — har herb ke liye 1 image (~800×800 PNG, white bg):
  Shilajit, Semal Musli, Safed Musli, Makhana, Gokshura, Beej Bandh, Bhilawa Shudh, Talamakhana, Ashwagandha, Vidhara, Lojwanti, Kaunch Beej, Bang Bhasam, Loh Bhasam
- `lovable-assets` se upload, asset pointers `public/site/assets/herbs/<name>.png.asset.json` me save
- `public/site/data.js` ke `__INGREDIENTS` object ko expand karenge — sab 14 herbs add, har ek me `image` field (asset URL)
- `public/site/site.js` (ya jo bhi ingredients render karta hai) update karke `emoji` ki jagah `<img>` use kare. Ingredient list cards aur detail panel dono me real images dikhe.

### 3. Spotlight "Feel the Strength of 14 Ancient Herbs" — pills update
Currently ye section me kuch ingredient pills hain (`#ingredient-pills`). Update karke saare 14 herbs as pills with thumbnail (small herb image + name) dikhayenge. Same generated herb images use honge — no extra image generation.

### 4. Update product details from Excel
`public/site/data.js` ke product entries ko Excel ke according refresh karenge:
- **Name** — Excel ke exact names (e.g. "Veer Ved Max Shakti+ (30 Caps)" jaisa rahega kyunki ye home spotlight ka product hai, baaki names Excel se)
- **Sizes / qty** — Excel ke quantity column se (e.g. "100ml / 250ml / 500ml / 1ltr")
- **Description & benefits** — Excel se (product card par short desc, product page par full)
- **Prices — same rakhenge** (Excel me prices nahi hain, jaisa user ne kaha)
- New IDs ID_MAP me add hongi naye products ke liye
- Existing products (Shakti+, Nari Kalp, Amla Bhringraj, etc.) ke description/sizes Excel se refresh
- Product detail page (`public/site/product.html` + `catalog.js`/`render.js`) bhi naye descriptions read karega — naya `description`, `benefits` (array), `sizes` field schema introduce karenge

### 5. New Arrivals carousel — arrows + autoplay
`#new-arrivals-carousel` already HTML me arrows (`.car-btn.prev/next`) hain but possibly non-functional ya not wired. Plan:
- `public/site/site.js` (ya carousel module) me ensure prev/next buttons scroll the carousel by one card-width
- Add **autoplay**: every 4 seconds next slide pe move kare; user hover karne par pause; manual click karne par 8s ke liye pause; infinite loop (last → first wrap)
- Smooth scroll behaviour, dots indicator optional add
- Same treatment Best Sellers, Trending Now, Wellness Essentials carousels ko bhi denge (consistency)

## Files touched
- `public/site/home.html` — 2 new carousel sections
- `public/site/data.js` — 2 new product arrays, expanded `__INGREDIENTS` (14 herbs with image), refreshed product names/sizes/descriptions/benefits from Excel, new ID_MAP entries
- `public/site/site.js` — ingredient render uses `<img>` instead of emoji; spotlight pills show 14 herbs; carousel autoplay + arrow logic
- `public/site/styles.css` — small styles for new herb image cards, carousel autoplay polish
- 14 new asset pointer files in `public/site/assets/herbs/`

## Out of scope
- Excel ke 100+ products me se sirf relevant home-page wale products update honge. Pura shop catalog overhaul abhi nahi (alag bada task hai — agar chahiye to baad me).
- Prices unchanged.
- Hero, header, footer, dark-green sections untouched.

## Result
Home page lambi aur richer feels — 2 extra product carousels (Trending + Wellness Essentials) with smooth auto-rotating carousels, "Nature's Most Powerful Herbs" me real herb photos (no emojis), 14 Ancient Herbs spotlight me visual herb pills, aur sab products ke names/sizes/descriptions Excel ke according fresh.
