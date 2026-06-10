## Goal
Header me jo current "Daulatram's" logo dikh raha hai (external WordPress URL se aata hai) usko aapki uploaded **`daulatrams.jpeg`** (green+orange "daulatram's" wordmark) se replace karna — JPEG ka apna white background as-is rakhke (aapne "with background" bola).

## Where
Header logo 3 jagah render hota hai (har page ka apna copy hai, kyunki yeh static HTML site hai):
- `public/site/home.html` line 38 — desktop header
- `public/site/home.html` line 70 — mobile drawer
- `public/site/about.html` — same do jagah
- `public/site/shop.html` — same
- `public/site/product.html` — same
- `public/site/contact.html` — same

Sab me current `src` = `https://daulatrams.com/wp-content/uploads/2025/12/Daulatrams.webp`.

Footer me bhi same image use hoti hai (`home.html` line 392 etc.) — uska bhi same swap karenge taaki consistent rahe.

## Changes
1. **Upload logo as CDN asset:**
   `lovable-assets create --file /mnt/user-uploads/WhatsApp_Image_2026-05-04_at_12.29.26_PM.jpeg --filename daulatrams-logo.jpeg > public/site/assets/daulatrams-logo.jpeg.asset.json`
2. **Find & replace** the old WordPress URL with the new CDN URL across all 5 HTML files (one `sed` pass). White JPEG background bana rahega — user ne explicitly "with background" maanga hai.
3. **No CSS changes.** Existing `.brand-logo img` rules header me logo ko proper height/spacing pe rakhte hain — naya logo bhi same constraints follow karega.

## Out of scope
- Logo background transparent karna (user ne nahi maanga).
- Header layout / colors / nav links.
- Favicon update (alag asset, alag turn).
