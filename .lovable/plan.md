## Overview

Your uploaded zip contains a complete, beautifully designed static HTML/CSS/JS website for **Daulatram's** (Ayurvedic wellness brand) with 5 pages: Home, About, Shop, Product Detail, and Contact.

However, this Lovable project runs on **TanStack Start (React)**, which uses file-based React routes — not direct static HTML files. To get your site live, the pages need to be converted from `.html` to React `.tsx` route components. The design, content, animations, and interactivity will remain **identical** to what you built.

## What We'll Build

Convert each static HTML page into a TanStack Start route component, preserving all existing styling, layout, and behavior:

1. **Homepage** (`/`) — Sticky hero, marquee, legacy section, categories, new arrivals carousel, flagship spotlight, shop-by-concern tabs, UGC grid, testimonials, newsletter
2. **About** (`/about`) — Founder story, heritage collage, timeline, values grid, manufacturing section
3. **Shop** (`/shop`) — Category filter pills, sort dropdown, product grid with add-to-cart/wishlist
4. **Product Detail** (`/product/$id`) — Gallery, variants, ingredients, reviews, FAQ, sticky CTA
5. **Contact** (`/contact`) — Contact cards, form, map placeholder

## Shared Components to Extract

- Announcement bar (marquee)
- Header (logo, nav-center, icon actions)
- Mobile drawer (hamburger menu)
- Footer (brand, links, contact, payment badges)
- WhatsApp floating button
- Social proof toast

## Styling Strategy

- Port `styles.css`, `pages.css`, and `pdp.css` into the project's `src/styles.css` as additional CSS layers, preserving all custom properties and animations
- Keep the brand design system intact (colors, fonts, shadows, spacing tokens)
- All scroll-reveal, carousel, and tab interactions become React `useEffect` hooks or component state

## Data & Logic Port

- Convert `catalog.js`, `data.js`, and `render.js` into TypeScript data modules (`src/lib/catalog.ts`, `src/lib/products.ts`)
- Port `site.js` interactions into React hooks (`useScrollReveal`, `useCarousel`, `useCountUp`, `useHeaderScroll`, etc.)
- Port `page-shell.js` DOM injection into shared React layout components

## Asset Handling

- Upload local images (`assets/hero-bg.jpg`, `assets/about-collage.webp`, `assets/logo.jpg`) to Lovable CDN
- External images (from `daulatrams.com`) remain as direct URLs
- Screenshots and reference images stay as-is (not part of the live site)

## SEO & Metadata

- Route-specific `head()` metadata for every page (title, description, OG tags)
- Update root `__root.tsx` with proper site title and description

## Publishing

- Build and publish to the free Lovable URL
- After live, you can request changes ("mujhe trse kuch kuch changes karane ha")

## Technical Notes

- Navigation uses TanStack `<Link>` for client-side routing (no full page reloads)
- Product filtering/sorting uses React state instead of DOM manipulation
- PDP variant selection, quantity picker, and image gallery use React state
- All existing animations (hero reveal, scroll triggers, count-up, carousels) are reimplemented with `useEffect` + `IntersectionObserver`

## Timeline

Single implementation session — all 5 pages, shared components, styling, and data modules in one batch. Build verification before publish.