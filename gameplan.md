# Floor and More — Game Plan

Status snapshot of the **existing website only**. This is a starting point we are sending back to the client so they can supply real content (product catalog, photos, contact info, etc.) before the next round of work.

---

## Done

These pages and flows are wired end-to-end (UI + tRPC + database). They render whatever data lives in the DB and will work once real content is loaded.

- **Home page** — hero, featured products, featured collections, featured projects, "why choose us" section, services highlight, contact CTA.
- **Products page** (`/products`) — list view with filters (category, room, look, colour, size). Reads from `product.list`.
- **Product detail page** (`/products/:slug`) — full spec view, related products, add to quote cart.
- **Collections page** (`/collections`) and **collection detail** (`/collections/:slug`) — collection grid + member products.
- **Clearance page** (`/clearance`) — filtered product list driven by the `clearance` flag.
- **Work page** (`/work`) — project portfolio grid driven by the `projects` table.
- **Services page** (`/services`) — service descriptions + featured projects.
- **Showroom page** (`/showroom`) — address, phone, hours pulled from the `showroomInfo` table.
- **Contact page** (`/contact`) — contact form posts to the DB; address/phone block reads from showroom info.
- **Quote cart** — `QuoteCartContext` persists the cart in localStorage, surfaces an item count in the navbar, and renders the cart on `/quote`. Submitting writes to `quoteRequests`.
- **Sample request** (`/samples`) — form posts to `sampleRequests`.
- **Business QR landing** (`/business-qr`) — standalone card with social/contact links and team members.
- **Navbar + Footer + persistent QuoteBar** — shared layout, mobile menu, scroll-aware styling.
- **404 page**.
- **Database schema** — products, collections, projects, quoteRequests, sampleRequests, contactSubmissions, showroomInfo, teamMembers, users (Drizzle ORM, MySQL).
- **tRPC API** — typed routers for product, collection, project, quote, sample, contact, showroom, team, auth.
- **Build + deploy config** — Vite + Hono server, Netlify config, Dockerfile for the Node server.

## Not done — marked "Coming soon" on the live site

These are visible to visitors but the underlying capability is not real yet. We replaced the placeholder UI with a "Coming soon" message so the client and end-users aren't misled.

- **Customer login / account** (`/login`) — currently wired to a placeholder OAuth provider (Kimi) that doesn't apply to Floor and More. No real auth, no account pages, no order history.

## Not done — backend / operational gaps (invisible to visitors)

Lead capture forms write to the database, but nothing happens after that. Before launch we still need:

- **Email notifications** to staff when a quote, sample request, or contact form is submitted. Right now leads go into the DB and sit there unseen.
- **Confirmation emails** to the customer after they submit a form.
- **Admin / staff dashboard** to view leads, manage their pipeline, and edit catalog content. There is no admin UI yet.
- **Real authentication system** for staff (the current Kimi OAuth stub is not usable for Floor and More).
- **Spam protection** on public form submissions (rate limiting, honeypot, captcha).
- **Image upload pipeline** — schema references images by URL, but there is no upload UI; images are static files in `app/public/`.

## Not done — content the client needs to provide

Everything below is live in the codebase as **demo seed data** so the layout can be reviewed. None of it is real Floor and More content.

- **Product catalog** — every tile, slab, vinyl, sink, faucet, vanity, mosaic, trim with pricing, SKU, specs, photos, and PDFs (spec sheet, brochure, installation guide).
- **Collections** — names, descriptions, lifestyle photos, brochure PDFs.
- **Project portfolio** (Work page) — completed jobs with photos, location, year, products used.
- **Showroom info** — real address, phone, email, hours, parking notes, map embed.
- **Team members** (used on the Business QR page).
- **Services copy** and any service-specific photos.
- **Hero / lifestyle photos** for the home page and section banners.
- **Logo files** (SVG ideal, plus a square mark for the favicon and QR page).
- **Brand colours** — current palette (forest green, ivory, gold, stone, linen) is a placeholder; confirm or replace.
- **Social media handles**, real email addresses, and the production domain for footer/QR links.
- **Legal copy** — privacy policy, terms of service, returns/exchanges policy.

## Not done — pre-launch polish

To do once real content is loaded but before publishing:

- **SEO**: per-page meta titles/descriptions, Open Graph images, sitemap.xml, robots.txt, structured data for products and the local business.
- **Analytics**: Plausible or GA4 plus conversion tracking on form submits.
- **Error monitoring**: Sentry (frontend + server).
- **Favicon and app icons** based on the real logo.
- **Accessibility pass**: keyboard nav, focus states, alt text audit, colour contrast.
- **Performance pass**: image compression / responsive sizes, lazy loading, Lighthouse check.
- **Cross-device QA** on iOS Safari, Android Chrome, and common desktop browsers.

---

## What's next

1. Client reviews this version, supplies the product catalog and content listed above.
2. We load real content, finish the backend gaps (email notifications, admin dashboard, real auth, spam protection), and run the pre-launch polish list.
3. Ship.
