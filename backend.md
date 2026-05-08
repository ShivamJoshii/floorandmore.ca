# Backend Document — Teranova Tile & Stone

## Overview

The backend serves a flooring/tile company website with product catalog browsing, quote cart management, sample requests, a project portfolio, and a business QR page. All data is stored in MySQL and accessed via tRPC routers with end-to-end type safety.

---

## Database Schema

### products
The core product catalog. Every tile, slab, fixture, and vanity.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PK | Auto-increment |
| name | varchar(255) | not null | Product display name |
| slug | varchar(255) | not null, unique | URL-friendly identifier |
| category | varchar(100) | not null | "tile", "slab", "vinyl_flooring", "sink", "faucet", "vanity", "mosaic", "trim" |
| subcategory | varchar(100) | | "wall_tile", "floor_tile", "outdoor_tile", "porcelain", "ceramic", "natural_stone" |
| collectionId | bigint | unsigned, nullable, FK → collections.id | Parent collection |
| room | varchar(100) | | "bathroom", "kitchen", "living", "commercial", "outdoor" |
| look | varchar(100) | | "marble", "concrete", "stone", "wood", "plain", "luxury", "modern" |
| colour | varchar(100) | | "white", "beige", "grey", "black", "gold", "green", "blue" |
| size | varchar(100) | | "12x24", "24x24", "24x48", "32x32", "48x48", "slab" |
| finish | varchar(100) | | "matte", "polished", "textured", "anti_slip", "honed" |
| useCase | varchar(100) | | "shower_wall", "shower_floor", "floor", "backsplash", "outdoor", "wall" |
| material | varchar(100) | | "porcelain", "ceramic", "natural_stone", "glass", "metal" |
| thickness | varchar(50) | | "6mm", "8mm", "9mm", "10mm", "12mm", "20mm" |
| rectified | boolean | default false | Edge type |
| indoorOutdoor | varchar(50) | | "indoor", "outdoor", "both" |
| floorWall | varchar(50) | | "floor", "wall", "both" |
| showerSafe | boolean | default false | |
| slipRating | varchar(50) | | "R9", "R10", "R11", "R12" |
| frostResistant | boolean | default false | |
| waterAbsorption | varchar(50) | | "<0.5%", "0.5-3%", ">3%" |
| countryOfOrigin | varchar(100) | | |
| cartonCoverage | decimal(8,2) | nullable | Square feet per box |
| piecesPerBox | int | nullable | |
| weightPerBox | decimal(6,2) | nullable | kg |
| sku | varchar(100) | not null, unique | Internal stock code |
| price | decimal(10,2) | not null | Price per sq ft or per piece |
| salePrice | decimal(10,2) | nullable | Clearance/sale price |
| stockStatus | varchar(50) | not null, default "in_stock" | "in_stock", "special_order", "low_stock", "clearance" |
| stockQuantity | int | default 0 | Available units |
| description | text | | Full HTML/rich text description |
| shortDescription | text | | Brief summary for cards |
| specSheetUrl | varchar(500) | | PDF link |
| brochureUrl | varchar(500) | | PDF link |
| installationGuideUrl | varchar(500) | | PDF link |
| featured | boolean | default false | Show on homepage |
| clearance | boolean | default false | Show in clearance |
| clearanceCategory | varchar(100) | | "clearance_tiles", "clearance_slabs", "clearance_vanities", "clearance_faucets", "contractor_deals", "last_quantity" |
| images | json | | Array of image URLs |
| rating | decimal(3,2) | default 0.00 | Average rating |
| reviewCount | int | default 0 | Number of reviews |
| createdAt | timestamp | default now() | |
| updatedAt | timestamp | default now() | |

### collections
Curated product collections/series.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PK | |
| name | varchar(255) | not null | Collection display name |
| slug | varchar(255) | not null, unique | URL-friendly identifier |
| description | text | | Rich text description |
| shortDescription | text | | Brief tagline |
| look | varchar(100) | | "marble", "concrete", "stone", "wood", "terrazzo" |
| category | varchar(100) | | "floor_wall", "slab", "mosaic" |
| images | json | | Array of lifestyle images |
| brochureUrl | varchar(500) | | PDF link |
| featured | boolean | default false | Show on homepage |
| meta | json | | Available colours, sizes, matching products as JSON |
| createdAt | timestamp | default now() | |
| updatedAt | timestamp | default now() | |

### projects
Portfolio entries for the /work page.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PK | |
| name | varchar(255) | not null | Project title |
| slug | varchar(255) | not null, unique | |
| category | varchar(100) | not null | "bathroom", "kitchen", "flooring", "commercial", "outdoor" |
| location | varchar(255) | | City/neighborhood |
| year | int | | Completion year |
| description | text | | Project narrative |
| productsUsed | text | | Comma-separated product names |
| images | json | | Array of project photos |
| featured | boolean | default false | |
| createdAt | timestamp | default now() | |

### quoteRequests
Quote cart submissions — the primary lead capture mechanism.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PK | |
| customerName | varchar(255) | not null | |
| phone | varchar(50) | not null | |
| email | varchar(320) | not null | |
| projectType | varchar(100) | | "bathroom", "kitchen", "flooring", "commercial", "outdoor", "other" |
| roomSize | varchar(100) | | e.g. "120 sq ft" |
| roomSizeUnit | varchar(20) | | "sq_ft", "sq_m" |
| city | varchar(255) | | |
| timeline | varchar(100) | | "asap", "1_3_months", "3_6_months", "planning" |
| customerType | varchar(100) | | "homeowner", "contractor", "designer" |
| notes | text | | Additional notes |
| products | json | | Array of {productId, quantity, productName} |
| status | varchar(50) | default "new" | "new", "contacted", "quoted", "won", "lost" |
| followUpStatus | varchar(50) | default "none" | "none", "day_1", "day_3", "day_7" |
| createdAt | timestamp | default now() | |
| updatedAt | timestamp | default now() | |

### sampleRequests
Sample request submissions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PK | |
| customerName | varchar(255) | not null | |
| phone | varchar(50) | not null | |
| email | varchar(320) | not null | |
| city | varchar(255) | | |
| deliveryMethod | varchar(50) | | "pickup", "delivery" |
| projectType | varchar(100) | | |
| timeline | varchar(100) | | |
| notes | text | | |
| products | json | | Array of {productId, productName, sku} |
| status | varchar(50) | default "new" | "new", "confirmed", "ready", "completed" |
| followUpStatus | varchar(50) | default "none" | |
| createdAt | timestamp | default now() | |

### showroomInfo
Showroom location and hours (single record).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PK | |
| name | varchar(255) | not null | "Teranova Showroom" |
| address | varchar(500) | not null | |
| city | varchar(255) | | |
| province | varchar(100) | | |
| postalCode | varchar(50) | | |
| phone | varchar(50) | | |
| whatsapp | varchar(50) | | |
| email | varchar(320) | | |
| hours | json | | Array of {day, open, close} |
| mapUrl | varchar(500) | | Google Maps embed URL |
| parkingInfo | text | | |
| images | json | | Array of showroom photos |
| createdAt | timestamp | default now() | |
| updatedAt | timestamp | default now() | |

### teamMembers
Team members shown on the /business-qr page.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PK | |
| name | varchar(255) | not null | |
| role | varchar(255) | not null | |
| avatarUrl | varchar(500) | | Photo URL |
| whatsappNumber | varchar(50) | | Direct WhatsApp number |
| sortOrder | int | default 0 | Display order |
| isActive | boolean | default true | |
| createdAt | timestamp | default now() | |

### contactSubmissions
General contact form submissions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PK | |
| name | varchar(255) | not null | |
| phone | varchar(50) | | |
| email | varchar(320) | not null | |
| subject | varchar(255) | not null | |
| message | text | not null | |
| status | varchar(50) | default "new" | |
| createdAt | timestamp | default now() | |

---

## API Design (tRPC Routers)

### productRouter

Handles product catalog queries, filtering, and search.

| Procedure | Type | Input | Output | Description |
|-----------|------|-------|--------|-------------|
| list | query | { category?, subcategory?, room?, look?, colour?, size?, finish?, useCase?, material?, stockStatus?, clearance?, search?, page?, limit?, sortBy? } | { products: Product[], total: number, hasMore: boolean } | Filtered, paginated product list |
| bySlug | query | { slug: string } | Product \| null | Single product by slug |
| byCollection | query | { collectionId: number, page?, limit? } | { products: Product[], total: number } | Products in a collection |
| featured | query | none | Product[] | Featured products for homepage |
| clearance | query | { category?: string, page?, limit? } | { products: Product[], total: number, hasMore: boolean } | Clearance products |

### collectionRouter

Handles collection/series data.

| Procedure | Type | Input | Output | Description |
|-----------|------|-------|--------|-------------|
| list | query | { featured?: boolean } | Collection[] | All collections, optionally featured only |
| bySlug | query | { slug: string } | Collection \| null | Single collection by slug |

### projectRouter

Portfolio/work page data.

| Procedure | Type | Input | Output | Description |
|-----------|------|-------|--------|-------------|
| list | query | { category?: string, page?, limit? } | { projects: Project[], total: number } | Filtered project list |
| bySlug | query | { slug: string } | Project \| null | Single project by slug |
| featured | query | none | Project[] | Featured projects for homepage/services teaser |

### quoteRouter

Quote cart submission and management.

| Procedure | Type | Input | Output | Description |
|-----------|------|-------|--------|-------------|
| create | mutation | { customerName, phone, email, projectType?, roomSize?, roomSizeUnit?, city?, timeline?, customerType?, notes?, products: {productId, quantity, productName}[] } | { id: number, status: string } | Submit a new quote request |

### sampleRouter

Sample request submission.

| Procedure | Type | Input | Output | Description |
|-----------|------|-------|--------|-------------|
| create | mutation | { customerName, phone, email, city?, deliveryMethod?, projectType?, timeline?, notes?, products: {productId, productName, sku}[] } | { id: number, status: string } | Submit a sample request |

### showroomRouter

Showroom location info.

| Procedure | Type | Input | Output | Description |
|-----------|------|-------|--------|-------------|
| info | query | none | ShowroomInfo \| null | Get showroom details |

### teamRouter

Team member data for /business-qr.

| Procedure | Type | Input | Output | Description |
|-----------|------|-------|--------|-------------|
| list | query | none | TeamMember[] | Active team members ordered by sortOrder |

### contactRouter

General contact form.

| Procedure | Type | Input | Output | Description |
|-----------|------|-------|--------|-------------|
| submit | mutation | { name, phone?, email, subject, message } | { id: number, status: string } | Submit contact form |

---

## Data Flow

### Product Browsing Flow
1. User visits Product Finder page
2. Frontend calls `trpc.product.list.useQuery()` with filter params from URL
3. Backend queries `products` table with Drizzle `where` clauses
4. Results returned with pagination metadata
5. Frontend renders product grid with filter pills reflecting active state

### Quote Cart Flow
1. User clicks "Add to Quote" on a product card or detail page
2. Product is added to localStorage-based cart state (React context)
3. Sticky quote bar appears at bottom with item count
4. User navigates to /quote page
5. Frontend reads cart state, displays selected products
6. User fills project form, clicks "Submit Quote Request"
7. Frontend calls `trpc.quote.create.useMutation()` with cart products + form data
8. Backend inserts into `quoteRequests` table
9. Cart is cleared, success state shown

### Sample Request Flow
1. User clicks "Request Sample" on a product
2. Redirected to /samples with product pre-filled
3. User can add more samples via search
4. Form submitted via `trpc.sample.create.useMutation()`
5. Backend inserts into `sampleRequests` table

### Project Portfolio Flow
1. User visits /work page
2. Frontend calls `trpc.project.list.useQuery()`
3. Backend returns all projects with images
4. User filters by category, frontend refetches with category param
5. Clicking a project opens modal with detail data

### Business QR Flow
1. User scans QR code, lands on /business-qr
2. Frontend calls `trpc.team.list.useQuery()` and `trpc.showroom.info.useQuery()`
3. Page renders linktree with team member WhatsApp links
4. All links are client-side hrefs (no backend call needed)

---

## Seed Data Strategy

The seed script (`db/seed.ts`) should populate the database with realistic data so the site looks live immediately.

### Collections (6 items)
1. Pietra Marble — Marble-look porcelain, 4 colours, 6 sizes
2. Urban Concrete — Concrete-effect tiles, industrial modern
3. Coastal Stone — Soft, natural stone-look porcelain
4. Heritage Wood — Wood-look planks, warm tones
5. Terrazzo Remix — Bold terrazzo patterns
6. Casa Terra — Mediterranean-inspired clay tones

### Products (40+ items)
Distribute across:
- 15 floor tiles (various sizes, marble/concrete/stone/wood looks)
- 10 wall tiles (subway, mosaic, large format)
- 5 slabs (marble/quartz-look porcelain)
- 5 mosaics (hex, penny, herringbone)
- 3 sinks and 2 faucets
Mix of stock statuses: ~60% in_stock, 30% special_order, 10% clearance.

### Projects (12 items)
One for each of the 12 portfolio images, across all 5 categories (bathroom, kitchen, flooring, commercial, outdoor).

### Showroom (1 item)
Teranova Showroom at 1500 Dundas Street East, Toronto.

### Team Members (3 items)
Marco R. (Sales Manager), Elena S. (Design Consultant), James T. (Project Coordinator).

---

## Implementation Order

1. **Schema**: Create all tables in `db/schema.ts`
2. **Seed data**: Write `db/seed.ts` with realistic product/collection/project data
3. **Routers** (in priority order):
   - `productRouter` — list, bySlug, byCollection, featured, clearance
   - `collectionRouter` — list, bySlug
   - `projectRouter` — list, bySlug, featured
   - `quoteRouter` — create
   - `sampleRouter` — create
   - `showroomRouter` — info
   - `teamRouter` — list
   - `contactRouter` — submit
4. **Frontend integration**: Wire each page to its corresponding tRPC queries

---

## Local State Management

The quote cart uses React Context + localStorage (not the database), since it's a client-side shopping experience:

- **QuoteCartContext**: Stores array of `{ productId, name, slug, image, price, salePrice, quantity, sku, size, colour, collectionName }`
- **localStorage key**: `teranova_quote_cart`
- **Persist**: On every cart change, serialize to localStorage
- **Restore**: On app mount, read from localStorage and populate context
- The quote form submission sends the cart items as part of the `products` JSON field

This keeps the cart fast and offline-capable while still capturing the data on submission.
