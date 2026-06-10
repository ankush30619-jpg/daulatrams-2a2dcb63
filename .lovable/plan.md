## Goal
Home page ke "Our Heritage / Trust the Legacy" section me jo dayi taraf collage image hai (currently `assets/about-collage.webp`), usko aapki uploaded **`Untitled design.png`** (green-outlined family + heritage collage) se replace karna — reference image-3 jaisa fit, same area me, existing cream background ke saath properly blend hoke.

## Where
- File: `public/site/home.html` line 159 — `<img src="assets/about-collage.webp" ...>` inside `.collage` wrapper (right column of `.legacy-grid`).
- File: `public/site/styles.css` — `.collage` / `.collage img` rules (already define rounded card + shadow + badge circle). Mostly reuse.
- Reference image-3 dikhata hai: collage left side, text right side, ek orange "Since Decades of Healing" badge circle top-right pe. Aapke home page me already badge-circle aur same layout maujood hai — bas image swap + fit tweak.

## Changes

1. **Upload collage as CDN asset** (binary file, repo me nahi rakhenge):
   - `lovable-assets create --file /mnt/user-uploads/Untitled_design.png --filename heritage-collage.png > public/site/assets/heritage-collage.asset.json`
   - Read URL from that JSON.

2. **`public/site/home.html`** line 159:
   - Swap `src="assets/about-collage.webp"` → CDN URL from step 1.
   - Update `alt` to "Daulatram's heritage collage — three generations".

3. **`public/site/styles.css` — `.collage` / `.collage img` tuning** so image-3 jaisa dikhe:
   - Image is tall portrait (~4:5) with transparent/white bg → set `object-fit: contain` and `background: var(--cream)` (or section bg) so cream blend ho jaye, koi hard white box na dikhe.
   - Cap height (e.g. `max-height: 620px`) and center it so collage same column area me fit ho, page stretch na ho.
   - Keep existing `border-radius` + `box-shadow` for soft framed look (matches reference image-3 card).
   - Badge-circle (orange "Since Decades of Healing") already positioned top-right — no change.

4. **About page** (`public/site/about.html` line 29) bhi same `assets/about-collage.webp` use karta hai. Aapne sirf home ke baare me bola hai, isliye **about page ko touch nahi karenge** is turn me. Agar baad me wahan bhi chahiye, batana.

## Out of scope
- Text content / layout / fonts — koi change nahi.
- About page collage — untouched.
- Naya section ya naya badge — sirf image swap + fit polish.
