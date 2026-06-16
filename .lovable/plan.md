## Adjust product card sizes to medium (shop page)

Current shop-grid cards were compressed to 6 columns with 13 px names and 10 px body padding. The user wants a balanced medium — not as large as the original, not as small as now.

### Changes in `public/site/pages.css`

**Shop grid layout**
- Reduce columns from 6 → 5 on large screens, stepping down 4 / 3 / 2 instead of 5 / 4 / 3.
- Increase gap from 14 px → 18 px.

**Card text & spacing (shop grid)**
- `.pc-name`: 13 px → 16 px
- `.pc-price .sale`: 15 px → 18 px  
- `.pc-price .orig`: 13 px → 14 px
- `.pc-body`: padding 10 px 10 px 12 px → 14 px 14 px 16 px; gap 6 px → 8 px
- `.pc-rating`: 11.5 px → 12 px
- `.btn-sm`: padding 8 px 14 px → 9 px 16 px; font-size 11 px → 12 px

**Bestsellers strip**
- Cap width from minmax(140 px, 180 px) → minmax(180 px, 220 px)
- Apply the same medium font / padding values as the shop grid above.

No other pages or components are touched.