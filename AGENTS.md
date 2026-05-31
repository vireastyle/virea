# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

---

# Virea — Agent Handoff Notes

## Stack
- **Next.js 16.2.6** (App Router, Turbopack) + **React 19.2.4**
- **TypeScript** strict mode
- **Tailwind CSS v4** — CSS-first config via `@theme inline` in `globals.css`. No `tailwind.config.ts`.
- **Zustand v5** with `persist` middleware (localStorage)
- **Framer Motion v12**, **Lucide React v1**
- **Google Fonts** — loaded via CSS `@import` in `globals.css` (runtime); Cormorant Garamond (`--font-display`) + DM Sans (`--font-sans`, weights 300–800) defined in `tokens.css`
- **Prisma 7** + **Neon PostgreSQL** — serverless adapter via `@prisma/adapter-neon` + `ws` (tunnels over port 443)
- **JWT dual-token auth** — access token (15 min, in memory via `apiToken` registry), refresh token (7 days, httpOnly cookie at `/api/v1/auth`)
- **Cloudinary v2** — image uploads for vendor products
- **bcryptjs** (12 rounds) — password hashing
- **Zod v4** — all API request validation

## Design System
- All tokens in `src/styles/tokens.css` (colors, spacing, shape, elevation, motion)
- Color system: Viridian `#3B6F68` primary, Swan `#F6F1EB` background, Soft Gold `#C7A760` accent
- All components use **inline styles referencing CSS custom properties** — do NOT use Tailwind utility classes on components
- Fluid type scale via `clamp()` — display/headline roles scale between 320px–900px viewport
- Responsive layout via CSS classes in `globals.css` (not Tailwind breakpoints):
  - `.app-shell`, `.app-sidebar` (always hidden — replaced by top header), `.app-content`, `.app-topbar`, `.app-bottomnav`
  - `.vendor-shell`, `.vendor-sidebar`, `.vendor-content`, `.vendor-topbar`
  - `.product-grid` — 2 col mobile → 3 col ≥900px → 4 col ≥1200px
  - `.content-inner` — max-width **1280px**, centered on desktop
  - `.trending-card` — 160px mobile, 220px desktop
  - `.topbar-*` — responsive TopBar slots (see Layout Architecture below)
  - `.shop-sidebar` — hidden mobile, 200px desktop (categories + filters on shop page)
  - `.shop-sidebar-hide-tabs` — `flex` mobile, `none !important` desktop (category tabs, mobile filter button/panel)
  - `.product-detail-layout` — block mobile, 55/45 grid desktop
  - `.promo-inner` / `.promo-text` / `.promo-image` — responsive promo banner (column mobile → row desktop)
  - `.vendor-week-grid` — horizontal scroll mobile → 3-col desktop grid for Vendors of the Week
  - `.footer-grid` — 1-col mobile → 2-col tablet → 5-col desktop footer layout
  - `.vendor-dash-stats` — 2-col mobile → 4-col desktop (dashboard stat cards)
  - `.vendor-dash-body` — 1-col mobile → `3fr 1fr` desktop with `column-gap: var(--space-3)` — aligns with `.vendor-dash-stats` 4-col so left column ends at Revenue card and right column starts at Requests card
  - `.vendor-page` — `padding: space-4` mobile → `space-8` desktop; `max-width: 1280px`
  - `.vendor-products-grid` — 2-col → 3-col @480px → 5-col @1100px
  - `.grid-2-4` — 2-col → 3-col @640px → 4-col @900px (wishlist, saved looks, item pickers)
  - `.form-row-2` — 1-col mobile → 2-col @600px (form field pairs)
  - `.grid-pipeline` — 2×2 mobile → 4-col @600px (pipeline stats, summary cards)
  - `.grid-feature-cards` — 1-col mobile → 2-col @480px (promo feature cards)
  - `.hide-on-mobile` — `display: none !important` mobile → `display: inline !important` desktop (use to hide any element on mobile only)
  - `--topbar-height` CSS var — `64px` mobile, `68px` desktop; use for `top:` on any `position:sticky` element
  - `@keyframes marquee` — infinite `-50%` translateX; element must be 2× content wide for seamless loop
  - **Responsiveness rule**: never use inline `gridTemplateColumns` for multi-column layouts. Always add a CSS class to `globals.css` with `@media` breakpoints. Inline `display: flex/grid` overrides `display: none` on CSS classes — avoid putting `display` in inline styles on elements that use show/hide CSS classes.
  - **`.app-bottomnav`** — `display: grid; grid-template-columns: repeat(5, 1fr)` in CSS (not inline). Previously was `display: flex` which caused all 5 nav items to shrink-wrap.

## Layout Architecture
### Shopper (main)
- **Mobile** (`< 900px`): `TopBar` (64px, fixed) + `BottomNav` (64px, fixed)
  - TopBar layout: `[VIRÉA logo — abs center]` only — no icons. All nav is via BottomNav.
  - BottomNav: **Home | Shop (Shirt) | Cart (ShoppingBag+badge) | Saved→/wishlist (Heart+badge) | Profile**
  - Cart + Wishlist badges read from `useCartStore` + `useWishlistStore` in BottomNav
- **Desktop** (`≥ 900px`): `TopBar` (68px, fixed) only — no sidebar, no BottomNav
  - TopBar layout: `[VIRÉA logo]` · `[Shop · Studio — nav links]` · `[Search · Wishlist · Cart · Profile]`
  - Uses `.topbar-*` CSS classes for responsive slot switching (`.topbar-logo-mobile/desktop`, `.topbar-nav-links`, `.topbar-profile-link`)
  - Wishlist + Cart links in TopBar have `className="topbar-profile-link"` so they're desktop-only
- `AppShell` wraps only `.app-content` div (Sidebar removed); used in `src/app/(main)/layout.tsx`
- `(main)/layout.tsx` → `<ThemeProvider><TopBar /><AppShell>{children}<Footer /></AppShell><BottomNav /><ToastContainer />`

### Vendor Portal (vendor)
- Mobile: `VendorTopBar` (fixed, 56px) + `VendorDrawerNav` (slide-in from left)
- Desktop: `VendorSidebar` (sticky left column, 240px) — hidden on mobile via `.vendor-sidebar` CSS
- `VendorShell` wraps `<VendorSidebar>` + `.vendor-content` div; used in `src/app/(vendor)/layout.tsx`
- `(vendor)/layout.tsx` → `<ThemeProvider><VendorShell>{children}</VendorShell><ToastContainer />`

## Route Groups
| Group | Routes | Auth guard |
|-------|--------|------------|
| `(auth)` | `/login`, `/register` | — |
| `(main)` | `/`, `/shop/[category]`, `/product/[id]`, `/bag`, `/orders`, `/pre-orders`, `/profile`, `/wishlist`, `/saved-looks`, `/try-on`, `/avatar-studio`, `/avatar-builder` | — |
| `(vendor-auth)` | `/vendor/login`, `/vendor/register` | — |
| `(vendor)` | `/vendor/dashboard`, `/vendor/products`, `/vendor/orders`, `/vendor/pre-orders`, `/vendor/styling-requests`, `/vendor/payouts`, `/vendor/profile` | `useEffect` redirect if `!isAuthenticated` |

## Server / Client Component Rules
- Pages are **server components** by default — no event handlers, no hooks
- Extract any hover/interactive logic to small `"use client"` components
- Pattern: `ProductCard`, `CategoryIconChip`, `ExploreCategoryLink` — client wrappers for hover state
- All vendor portal pages are `"use client"` (need store access)
- Stores (Zustand) are only accessed in client components
- Async params in dynamic routes: use `use(params)` — NOT `await params` (Next.js 16 pattern)

## Stores
| Store | Persist key | Contents |
|-------|-------------|----------|
| `auth.store.ts` | `virea:session` | `user`, `isAuthenticated`, `isGuest`; async `login(email,pw)`, `register(name,email,pw)`, `signOut()`; `signIn(user)` for local updates; `updateProfile(partial)` |
| `avatar.store.ts` | `virea:avatar` | avatar params (gender, body shape, skin tone, hair, size) |
| `wishlist.store.ts` | `virea:wishlist` | saved items |
| `cart.store.ts` | `virea:cart` | cart items + count |
| `ui.store.ts` | `virea:theme` | theme + `addToast()` |
| `outfits.store.ts` | `virea:outfits` | saved outfits |
| `orders.store.ts` | `virea:orders` | orders + pre-orders (mock); `createOrder`, `createPreOrder`, `updatePreOrderStatus`, `updateOrderStatus`, `addVendorQuote` |
| `vendor.store.ts` | `virea:vendor` | vendor profile + `products[]` + `stylingRequests[]`; async `login(email,pw)`, `register(data)`, `signOut()`; local CRUD: `addProduct`, `updateProduct`, `removeProduct`, `respondToStylingRequest`, `declineStylingRequest` |

> **Toast**: always use `useUIStore(s => s.addToast)(message, type)` — there is NO separate `useToastStore`

> **Access token**: stored only in memory via `src/lib/api-token.ts` — never in localStorage. Set by `login`/`register` actions; read by `apiFetch`. On page reload the token is gone but `isAuthenticated` persists; the first protected API call triggers silent refresh automatically.

## localStorage Keys (outside Zustand)
| Key | Value | Set by |
|-----|-------|--------|
| `virea_user_selfie` | base64 data URI (JPEG, compressed to 768px) | Profile selfie upload |
| `virea_avatar_photo` | URL string (Replicate CDN webp) | Avatar builder + inline generation on try-on page |

## Backend Architecture
All API logic lives in **Next.js Route Handlers** — no separate server. Deployed on Vercel alongside the frontend.

```
src/app/api/
├── tryon/route.ts                   ← Replicate IDM-VTON (Phase 17)
├── generate-avatar/route.ts         ← FLUX.1-schnell (Phase 17)
└── v1/                              ← All REST API routes (Phase 18-19)
    ├── auth/{login,register,refresh,logout}/
    ├── auth/vendor/{login,register}/
    ├── users/me/
    ├── avatars/
    ├── catalogue/ + [id]/
    ├── wishlist/ + [productId]/
    ├── bag/ + [itemId]/ + clear/
    ├── outfits/ + [id]/
    ├── orders/ + [orderId]/{cancel}/
    ├── pre-orders/ + [preOrderId]/{accept-quote,decline-quote,cancel}/
    ├── styling-requests/ + [requestId]/
    ├── vendor/products/ + [productId]/ + upload-image/
    ├── vendor/orders/ + [orderId]/advance/
    ├── vendor/pre-orders/ + [preOrderId]/{quote,advance}/
    └── vendor/styling-requests/ + [requestId]/{respond,decline}/
```

### Route handler pattern
```typescript
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = getAuth(req, "user");   // throws AppError on failure
    const data = await someService(auth.id, id);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return handleError(err);  // returns { success: false, error: { code, message } }
  }
}
```

### Services (`src/lib/services/`)
Business logic lives here — route handlers are thin wrappers.
| File | Responsibility |
|------|---------------|
| `auth.service.ts` | register/login/refresh/logout for user + vendor; `issueTokens()` persists refresh token to DB |
| `users.service.ts` | getMe, updateMe |
| `avatars.service.ts` | upsert avatar profile |
| `catalogue.service.ts` | list + get products (DB) |
| `wishlist.service.ts` | add/remove/list wishlist items |
| `bag.service.ts` | add/update/remove/clear bag items |
| `outfits.service.ts` | save/list/delete outfits |
| `orders.service.ts` | create order (validates vendor ownership, uses `$transaction`), advance status, cancel |
| `pre-orders.service.ts` | create, send quote, accept/decline quote, advance status, cancel |
| `styling-requests.service.ts` | create, respond, decline |
| `vendor-products.service.ts` | CRUD + Cloudinary upload; `assertOwnership()` guard |

## Key Files
| Path | Purpose |
|------|---------|
| `src/styles/tokens.css` | All CSS custom property design tokens |
| `src/app/globals.css` | Tailwind + token imports, typography classes, responsive layout classes |
| `src/lib/api-token.ts` | In-memory access token registry — `apiToken.get()` / `apiToken.set()` |
| `src/lib/api.ts` | `apiFetch<T>(path, options)` — authenticated fetch with silent JWT refresh on 401 |
| `src/lib/prisma.ts` | Prisma singleton with Neon WebSocket adapter; uses `DATABASE_URL ?? ""` (no throw at build time) |
| `src/lib/jwt.ts` | `signAccessToken`, `verifyAccessToken`, `signRefreshToken`, `verifyRefreshToken`, `refreshCookieOptions()` |
| `src/lib/cloudinary.ts` | Lazy `getCloudinary()`; `uploadImage(buffer, {folder?, publicId?})` → secure URL |
| `src/lib/api-error.ts` | `AppError(statusCode, message, code?)` + `handleError(err): NextResponse` |
| `src/lib/auth-guard.ts` | `getAuth(req, role?)` — reads Bearer token, verifies JWT, throws AppError on failure |
| `prisma/schema.prisma` | 13 models: User, Vendor, Avatar, Product, WishlistItem, BagItem, Order, OrderItem, PreOrder, StylingRequest, SavedOutfit, PayoutRecord, RefreshToken |
| `prisma.config.ts` | Migration config (excluded from tsconfig); loads `.env.local` manually; uses `DIRECT_URL` (non-pooled) for DDL |
| `src/lib/replicate.ts` | Shared Replicate fetch utility — IPv4 DNS workaround + `replicateFetch()` + `sleep()` |
| `src/lib/mock/clothing.ts` | 20 mock ClothingItem objects (brands, ₦ prices, Unsplash images) |
| `src/lib/mock/feed.ts` | heroBanners, `getHomeFeed()`, categories array |
| `src/lib/mock/orders.ts` | 3 mock orders |
| `src/lib/mock/pre-orders.ts` | 2 mock pre-orders |
| `src/lib/mock/styling-requests.ts` | 3 mock styling requests |
| `src/lib/mock/vendors.ts` | 4 mock vendors |
| `src/types/vendor.ts` | `Vendor`, `VendorProduct`, `VendorProductCategory`, `StylingRequest`, `EventType` |
| `src/types/order.ts` | `Order`, `OrderStatus`, `PreOrder`, `PreOrderStatus`, `OrderItem` |
| `src/types/avatar.ts` | `Avatar`, `AvatarGender`, `BodyShape`, `SkinTone`, `HairStyle`, `HairColour`, `HeightRange`, `SizeRange` |
| `src/components/ui/` | Button, BottomSheet, BackLink, EmptyState, SizeChip, ColourSwatch, Badge, Toast, SkeletonCard, **FadeIn**, **ScrollRow** |
| `src/components/catalogue/` | ProductCard, CategoryIconChip |
| `src/components/layout/` | TopBar, BottomNav, AppShell, PageShell, ThemeProvider, ServiceWorkerRegistrar, Footer |
| `src/components/home/` | HeroSlider, MarqueeStrip, PromoSection, VendorsOfTheWeek |
| `src/components/vendor/` | VendorShell, VendorSidebar, VendorTopBar, VendorDrawerNav, DashboardStats, VendorProductCard, ProductUploadForm, OrderInboxItem, PreOrderInboxItem, StylingRequestItem |
| `src/components/catalogue/ShopFilters.tsx` | Client component — receives `items: ClothingItem[]` + `category` from server page; owns all search/filter/sort state; renders desktop sidebar (categories, sizes, body types, colour swatches, price brackets, new arrivals) + mobile filter panel + active tag pills + product grid; colour swatches are dynamic from `item.available_colours`; sidebar sections separated by dividers |
| `src/app/(main)/product/[id]/ShareButton.tsx` | Client component — native Web Share API with product image (`navigator.share({files})`); falls back to text-only share; falls back to clipboard copy with toast |
| `src/components/orders/` | CheckoutModal, OrderStatusTracker, OrderCard |
| `src/components/pre-orders/` | PreOrderForm, QuoteReviewModal |
| `src/components/try-on/` | TryOnView, LayerStack, TryOnActionBar, ColourSwitcher, AiTryOnPanel |
| `src/components/avatar-studio/` | AvatarStudio, LayerPanel, ItemLayerCard, SendToVendorModal |
| `src/hooks/useFashnTryOn.ts` | Real-photo try-on hook |
| `src/hooks/useAvatarTryOn.ts` | Avatar try-on hook |
| `src/hooks/useTryOn.ts` | Avatar Studio canvas layer management |
| `src/app/api/tryon/route.ts` | IDM-VTON virtual try-on; `maxDuration=60` |
| `src/app/api/generate-avatar/route.ts` | FLUX.1-schnell avatar generation; `maxDuration=60` |
| `public/sw.js` | Service worker — network-first pages, cache-first static assets |
| `public/manifest.json` | PWA manifest |

## Deployment
- **Live at:** `https://virea-seven.vercel.app`
- **GitHub:** `https://github.com/vireastyle/virea` (branch: `master`)
- **Vercel plan:** Pro required — IDM-VTON takes 15–30s; Hobby plan caps at 10s
- **Root directory:** `virea` (set in Vercel project settings)
- **No separate server** — everything runs as Vercel serverless functions
- **Env vars required on Vercel:**
  | Variable | Source |
  |----------|--------|
  | `DATABASE_URL` | Neon dashboard → pooled connection string |
  | `DIRECT_URL` | Neon dashboard → non-pooled (toggle off Connection Pooling) |
  | `JWT_SECRET` | `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
  | `JWT_REFRESH_SECRET` | Same command, run again |
  | `CLOUDINARY_CLOUD_NAME` | Cloudinary dashboard |
  | `CLOUDINARY_API_KEY` | Cloudinary → API Keys |
  | `CLOUDINARY_API_SECRET` | Cloudinary → API Keys |
  | `REPLICATE_API_TOKEN` | replicate.com/account/api-tokens |
  | `FLUTTERWAVE_SECRET_KEY` | Flutterwave dashboard → Settings → API Keys → Secret key |
  | `FLUTTERWAVE_SECRET_HASH` | A long random string **you choose** — paste it into both Vercel and the FLW dashboard Webhooks → Secret hash field |
  > Do NOT set `REPLICATE_HOST_IP` on Vercel (Linux DNS works fine there)
  > Flutterwave webhook URL on Vercel: `https://virea-seven.vercel.app/api/v1/webhooks/flutterwave`
  > Enable v3 webhooks + webhook retries in the FLW dashboard

## Database
- **Run migrations locally:** `npm run db:migrate` (uses `DIRECT_URL` from `.env.local`)
- **Deploy migrations to prod:** `npm run db:deploy` (CI/CD — uses `DIRECT_URL` env var)
- **`prisma.config.ts`** loads `.env.local` manually (Prisma CLI only reads `.env`)
- **Schema** at `prisma/schema.prisma` — no `url` in datasource block (Prisma 7 uses config file instead)
- **Neon connection:** pooled (`DATABASE_URL`) for runtime, direct (`DIRECT_URL`) for migrations

## Build Status
- **Build passes cleanly** (`npm run build`) — **54 routes**, zero type errors
- `serverExternalPackages` in `next.config.ts` — required for `@prisma/client`, `@prisma/adapter-neon`, `@neondatabase/serverless`, `bcryptjs`, `jsonwebtoken`, `cloudinary`, `ws`
- Google Fonts loaded via CSS `@import` at runtime (not build time)

## Completed Phases
- [x] Phase 1 — Scaffold (types, tokens, mock data, stores, PWA manifest)
- [x] Phase 2 — Core UI components (Button, chips, swatches, Toast)
- [x] Phase 3 — Catalogue pages (Home, Shop, Product Detail)
- [x] Phase 4 — User pages (Wishlist, Saved Looks, Profile, Avatar Builder, Login/Register)
- [x] Phase 5 — Desktop layout (Sidebar, AppShell, responsive shell CSS)
- [x] Phase 6 — Try-On Canvas Engine (`/try-on`)
- [x] Phase 7 — Avatar Studio (`/avatar-studio`)
- [x] Phase 8 — PWA & offline shell
- [x] Phase 9 — Orders & Pre-Orders (user side)
- [x] Phase 10 — Vendor Auth & Onboarding
- [x] Phase 11 — Vendor Portal (full CRUD)
- [x] Phase 12 — Animations & Motion (Framer Motion throughout)
- [x] Phase 13 — Polish & Accessibility
- [x] Phase 14 — Code Audit & Cleanup
- [x] Phase 15 — World-Standard UI Overhaul
- [x] Phase 16 — Home Page Elevation & Footer
- [x] Phase 17 — AI Try-On & Photorealistic Avatar (Replicate IDM-VTON + FLUX.1-schnell)
- [x] Phase 18 — Backend Core → **refactored to Next.js Route Handlers** (originally Express, migrated for Vercel simplicity)
  - **Prisma 7** + **Neon PostgreSQL** — 13 models
  - **JWT dual-token auth**, **bcrypt**, **Zod** validation on all routes
  - `src/lib/` — `prisma.ts`, `jwt.ts`, `cloudinary.ts`, `api-error.ts`, `auth-guard.ts`
  - `src/lib/services/` — 11 service files
  - `src/app/api/v1/` — 44 route handler files
  - `next.config.ts` updated: `serverExternalPackages` for native Node modules
  - `prisma.config.ts` at root (excluded from tsconfig) — migration adapter using `DIRECT_URL`
- [x] Phase 19 — Vendor Products CRUD + Cloudinary uploads + Orders/Pre-Orders/Styling Requests lifecycle
  - Vendor products: list, get, create, update, delete + `upload-image` → Cloudinary
  - User orders: create (validates vendor ownership, `$transaction`), list, get, cancel
  - Vendor orders: list, get, advance status (PLACED→CONFIRMED→PROCESSING→SHIPPED→DELIVERED)
  - User pre-orders: create, list, get, accept/decline quote, cancel
  - Vendor pre-orders: list, get, send quote, advance (QUOTE_ACCEPTED→IN_PRODUCTION→READY→DELIVERED)
  - User styling requests: create, list, get
  - Vendor styling requests: list, get, respond (OPEN→RESPONDED), decline (OPEN→DECLINED)
  - Flutterwave payments intentionally deferred — will be added after full product is complete
- [x] Phase 20 — Auth Wiring (Option C — real auth, mock content)
  - `src/lib/api-token.ts` — in-memory access token registry (never persisted to localStorage)
  - `src/lib/api.ts` — `apiFetch<T>()` with silent JWT refresh on 401; dynamic store sign-out on refresh failure
  - `auth.store.ts` — `login()`, `register()`, `signOut()` all hit real API; `accessToken` excluded from Zustand persist
  - `vendor.store.ts` — `login()`, `register()`, `signOut()` all hit real API
  - `LoginForm.tsx` — async with loading state + error display
  - `register/page.tsx` — calls real register API at step 0; body/style/selfie steps remain local (Phase 21 will wire them)
  - `vendor/register/page.tsx` — calls real register API on final submit

- [x] Phase 22 — Kobo price migration + Flutterwave Split Payments
  - **All monetary values stored as `Int` (kobo)** — never Float. Use `formatNaira(kobo)` to display, `nairaToKobo()` on form submit, `koboToNaira()` to prefill edit forms. All helpers in `src/lib/format.ts`.
  - DB migration `20260527170906_kobo_prices_and_flw` — ✅ applied to production 2026-05-27
  - New schema fields: `Vendor.flwSubaccountId`, `Order.txRef` (@unique), `Order.paidAt`
  - `src/lib/services/flutterwave.service.ts` — all FLW API calls
  - `POST /api/v1/vendor/subaccount` — register vendor as FLW subaccount (90/10 split; idempotent)
  - `POST /api/v1/payments/initiate` — save txRef to Order BEFORE calling FLW; returns paymentUrl
  - `POST /api/v1/webhooks/flutterwave` — verify sig → verify tx → 4 checks → confirm Order + PayoutRecord; P2002 = idempotent 200; always return 200
  - `CheckoutModal` — real apiFetch (POST /orders → POST /payments/initiate → window.location.href)
  - `/orders` page — "verifying payment" banner when `?ref=` in URL (display-only; webhook is the truth)
  - Skill: `skills/flutterwave-integration/SKILL.md` — load for any FLW task

- [x] Phase 21 — Full Frontend-Backend Wiring (hybrid DB-first + mock fallback throughout)
  - `src/lib/mappers.ts` — DB→frontend type mappers (mapDbProduct, mapDbProductToVendorProduct, mapDbOrder, mapDbPreOrder); also contains `COLOUR_HEX` lookup table (~80 fashion colour names → hex) + `colourNameToHex(name)` used by `mapDbProduct` so vendor colour names resolve to real swatches instead of `#888888`
  - `GET /api/v1/vendors` — public vendor list for PreOrderForm dropdown
  - Shop/product pages: Prisma service direct call (server component), mock fallback
  - Wishlist page: `apiFetch("/wishlist")` when authenticated
  - Orders store: `fetchOrders()` + `fetchPreOrders()` — DB-first, mock as initial state/fallback
  - User orders/pre-orders list + detail: `apiFetch` when authenticated, fall back to store
  - QuoteReviewModal: real `POST /pre-orders/:id/accept-quote` + `decline-quote` (optimistic)
  - PreOrderForm: real vendors from `GET /api/v1/vendors`, submits `POST /pre-orders`
  - vendor.store.ts: `fetchProducts()` → `GET /api/v1/vendor/products`
  - Vendor portal pages: `apiFetch` for orders/pre-orders, mock fallback
  - Vendor detail pages: fetch + advance/quote via real API (optimistic updates)

- [x] Phase 23 — Avatar DB Persistence
  - `avatar.store.ts`: added `loadFromDb()` — `GET /api/v1/avatars`, maps DB camelCase to frontend types, reconstructs `SkinTone`/`HairColour` objects from IDs, restores `virea_avatar_photo` to localStorage
  - `avatar-builder/page.tsx`: `handleSave` fires `POST /api/v1/avatars` with serialized params (skinTone.id, hairColour.id); after generation succeeds, upserts again with `photoUrl`
  - `src/components/layout/AvatarBootstrap.tsx` (new): invisible client component, calls `loadFromDb()` when `isAuthenticated` — placed in `(main)/layout.tsx` so it runs on every shopper page
  - Avatar now persists across devices and sessions for authenticated users

- [x] UX Polish Batch (2026-05-27)
  - **Cart rename** — "Bag" → "Cart" across all user-facing text: product detail (`ProductActions.tsx`), wishlist, try-on action bar (`TryOnActionBar.tsx`), try-on view toast, avatar studio, `/bag` page header
  - **Try-On mode toggle** — pill replaced with minimal underline tab style (Avatar | Real Photo); 44px height, `borderBottom: 2px solid` indicator, framer-standard color transition
  - **Studio infusion** — `/avatar-studio` converted to `"use client"` page with two top-level tabs:
    - **Canvas**: existing `AvatarStudio` component (SVG layers, save look, send to vendor)
    - **Try On**: item picker grid (2-col, 8 items from `mockClothing`) → full `TryOnView` inline (both Avatar AI + Real Photo modes); "← Change item" button to go back
  - **PromoSection** — Build My Avatar button padding increased (`space-4 × space-10`); feature cards redesigned: lucide icons (Sparkles, Infinity, Gem, Heart), tinted gradient backgrounds, alternating primary/gold accents, `whileHover` lift
  - **HeroSlider** — announcement bar removed; hero height `calc(100vh - var(--topbar-height))`; headline `clamp(52px, 9vw, 130px)`
  - **ScrollRow** (`src/components/ui/ScrollRow.tsx`) — reusable horizontal scroll container with fade-edge overlays and arrow buttons; `ResizeObserver` + scroll listener for button visibility; used in Trending Now on home page
  - **TopBar nav active state** — `navLinks` uses per-route `match()` functions; `background: "transparent"` added to Link style prop (prevents hover ghost on navigation); `onMouseLeave` always resets both color + background

- [x] UX Polish Batch 2 (2026-05-28)
  - **`/new-in` page** — `src/app/(main)/new-in/page.tsx` (server) + `src/components/new-in/NewInContent.tsx` (client); editorial header; sticky underline filter chips (All / 30 / 14 / 7 days); `AnimatePresence` stagger on filter change; mock-first (`getNewArrivals()`); 12 items shown
  - **`/vendors` page** — `src/app/(main)/vendors/page.tsx` (server) + `src/components/vendors/VendorCard.tsx` (client); editorial header; `.vendor-grid` CSS class (1 col → 2 col 640px → 3 col 900px); staggered `FadeIn`; "Shop Store →" links to vendor's primary category
  - **`.vendor-grid` CSS class** added to `globals.css` — responsive 1→2→3 column grid for the vendors page
  - **Home links wired** — New In "View all" → `/new-in`; VendorsOfTheWeek "Browse all →" → `/vendors`; hero "Shop New Arrivals" CTA → `/new-in`
  - **Studio item picker denser** — switched from 2 → 3 columns, gap `space-3` → `space-2`, items 8 → 12, `sizes` updated to `33vw`
  - **Studio Canvas avatar replaced** — `AvatarSVG` swapped for Cloudinary placeholder image (`male-avatar_med0is.png`) pending Replicate API keys; `svgRef`/`clothingLayers`/`avatar` destructures removed
  - **TopBar nav simplified** — "Try On" removed; nav is now Shop | Studio. Try-on is accessed from product pages and Studio's Try On tab
  - **ScrollRow arrow fix** — `top: "50%"` → `top: "38%"` so arrow centres in the image area of product cards, not below it
  - **Mock data encoding fix** — `"RubÄ""` → `"Rubē"` and `"TÃ³bi Adekoya"` → `"Tóbi Adekoya"` (Windows-1252 mojibake fixed in `clothing.ts`)

- [x] Polish Batch 3 (2026-05-28)
  - **`next.config.ts`** — added `res.cloudinary.com` to `images.remotePatterns` so Cloudinary-hosted images (avatar placeholder, vendor uploads) render via `next/image`
  - **ScrollRow arrows** — moved from absolutely-positioned overlay (overlapped cards) to a row below the scroll container; right-aligned ← → buttons, only visible when content is scrollable in that direction; fades still indicate scroll edges
  - **LayerPanel (Canvas "Add to look")** — `repeat(2, 1fr)` → `repeat(3, 1fr)`, gap `space-3` → `space-2`, image container changed from `aspectRatio: "3/4"` to fixed `height: 120px`
  - **Try On picker (avatar-studio/page.tsx)** — image container changed from `aspectRatio: "3/4"` to fixed `height: 120px`; `sizes` updated to `33vw`
  - **Broken image fix** — Ankara Print Midi (`item-004`) had dead Unsplash URLs; replaced with working ones
  - **Replicate connected** — Vercel integration active; `REPLICATE_API_TOKEN` auto-injected. Test: `/avatar-builder` (FLUX.1-schnell) + product page Try On (IDM-VTON). Local dev requires `REPLICATE_HOST_IP` set to IPv4 of `api.replicate.com`

- [x] Polish Batch 4 (2026-05-28)
  - **sw.js clone bug** — `response.clone()` moved before `.then()` (was inside async callback — body already consumed); CACHE_VERSION bumped v1 → v2 to clear stale cached broken manifest
  - **manifest.json** — removed trailing comma in icons array (invalid JSON; was causing SW parse errors)
  - **Register error messages** — API error codes mapped to user-friendly strings in `src/app/(auth)/register/page.tsx`; "Email already in use" prompts user to sign in instead
  - **Atomic registration** (`src/lib/services/auth.service.ts`) — deletes orphaned user if `issueTokens` throws after creation. Root cause was missing `JWT_REFRESH_SECRET` on Vercel — now documented as required env var.
  - **Avatar builder** (`src/app/(main)/avatar-builder/page.tsx`) — switched `<Image>` → `<img>` for generated Replicate photo; pre-fills existing avatar store data for returning users; button label "Update & Regenerate" when avatar exists
  - **`next.config.ts`** — added bare `replicate.delivery` hostname to `images.remotePatterns`
  - **Flutterwave: optional subaccount** — `flutterwave.service.ts` + `/api/v1/payments/initiate` skip the split when vendor has no `flwSubaccountId` (test convenience; full amount goes to platform)
  - **Dev seed endpoint** — `src/app/api/dev/seed/route.ts` upserts a test vendor + product for payment testing. **Remove or gate behind `NODE_ENV !== "production"` before going live.**
  - **AvatarStudio** (`src/components/avatar-studio/AvatarStudio.tsx`) — shows real `virea_avatar_photo` from localStorage; "Build your avatar →" link when none exists
  - **AvatarSVG.tsx deleted** — `src/components/ui/AvatarSVG.tsx` removed; Replicate FLUX.1-schnell photos are the canonical avatar representation going forward
  - **useTryOn.ts** — all AvatarSVG dead code removed (svgRef, clothingLayers, avatar); now pure layer-list management only
  - **`/my-avatar` page** — `src/app/(main)/my-avatar/page.tsx` created; shows Replicate photo from localStorage + avatar profile details (gender, body shape, skin tone, hair) + "Update avatar" CTA + "Try on clothes in Studio" CTA
  - **Profile page** — "My Avatar" menu item links to `/my-avatar` (was `/avatar-builder`)
  - **Try On picker columns** (avatar-studio page) — `repeat(3, 1fr)` → `repeat(4, 1fr)`
  - **LayerPanel columns** ("Add to look" grid) — `repeat(3, 1fr)` → `repeat(4, 1fr)`
  - **SelfieUploadStep** (`src/components/auth/SelfieUploadStep.tsx`) — removed auto-advance on photo upload; skin tone stored in local state; "Build avatar →" filled CTA appears after processing; "Skip this step" replaces it until a photo is loaded

- [x] Bug Fix (2026-05-28) — Checkout "Vendor not found"
  - **Root cause** — `ClothingItem.vendor_id` was `undefined` on all mock items; `CheckoutModal` sent `vendorId: ""` → `orders.service.ts` `findUnique({ id: "" })` returned `null` → 404
  - **`src/lib/mock/clothing.ts`** — added `const MOCK_VENDOR_ID = "vendor-virea-test"` and `vendor_id: MOCK_VENDOR_ID` to all 20 items
  - **`/api/dev/seed`** — rebuilt: upserts vendor with fixed `id: "vendor-virea-test"` (predictable, not random UUID); detects and deletes any stale test vendor with same email but different id; upserts all 20 mock products by their real item IDs (`item-001`…`item-020`) using `mockClothing` import; safe to run multiple times. After one seed call all mock shop items are checkout-ready.

- [x] Polish Batch 5 (2026-05-28) — UX & Auth polish
  - **Race-condition logout fix** (`src/lib/api.ts`) — singleton `refreshPromise` pattern: concurrent 401s share one refresh call instead of each consuming the single-use rotated refresh token
  - **Cart flash fix** (`CheckoutModal.tsx`) — removed `close()` before `window.location.href = paymentUrl`; page navigation handles teardown
  - **BodyProfileStep gap** (`src/components/auth/BodyProfileStep.tsx`) — `--space-7` (doesn't exist) → `--space-10`
  - **Gender selector in register flow** — gender card grid (Male/Female) added before body type; `Gender = "female" | "male"` type added to `src/types/user.ts`; female body types: hourglass/pear/apple/rectangle/inverted-triangle; male: rectangle/inverted-triangle/oval/athletic; `handleGenderSelect` resets bodyType if incompatible; `setAvatarGender` called on complete
  - **Selfie step copy** (`SelfieUploadStep.tsx`) — subtitle now references Try On feature, not avatar generation
  - **Avatar builder Skip** (`avatar-builder/page.tsx`) — "Skip" button top-right in header calls `router.push("/")`
  - **Avatar builder label fix** — button uses `isComplete` flag (not `existingAvatar`) to decide "Save & Generate Avatar" vs "Update & Regenerate"; `existingAvatar` was truthy for new users because `setAvatarGender` creates partial avatar object in store
  - **Full-body avatar generation** (`src/app/api/generate-avatar/route.ts`) — aspect ratio `"3:4"` → `"2:3"` (832×1216); prompt strengthened with "feet flat on floor, legs and feet fully visible, no cropping"
  - **Garment thumbnail in try-on** (`TryOnView.tsx`) — 72×90px absolute top-left overlay (zIndex 10), visible when no result and not loading; replaces garment-as-background (which caused flash before avatar hydrated from localStorage)
  - **Real Photo panel** (`TryOnView.tsx`, `useFashnTryOn.ts`) — shows `virea_user_selfie` as full background when available; shows upload icon + Link to `/profile` when no selfie; `selfieUrl` added to hook return
  - **Back links** — `<BackLink href="/profile" label="Profile" />` added to `/orders`, `/pre-orders`, `/wishlist`, `/saved-looks`, `/my-avatar`
  - **Guest button removed** — "Continue as Guest (Demo)" removed from `LoginForm.tsx` and `profile/page.tsx`
  - **Vendor back navigation** — `LoginForm.tsx` vendor back: `<button onClick={() => router.back()}>← Back</button>` (was hardcoded `href="/"`); `vendor/register/page.tsx` step 0 back: `router.back()` button above logo
  - **"Sell on Virea"** (`profile/page.tsx`) — href changed `/vendor/login` → `/vendor/register`

- [x] Polish Batch 6 (2026-05-28) — Compact grid pages
  - **Saved Looks** (`src/app/(main)/saved-looks/page.tsx`) — 2-col list → 4-col grid (`repeat(4, 1fr)`), gap `space-2`, `borderRadius: shape-sm`, padding `space-2`, `label-small` name text, 10px delete button, image `sizes="25vw"`
  - **Wishlist** (`src/app/(main)/wishlist/page.tsx`) — horizontal card list → 4-col grid (`repeat(4, 1fr)`), aspect-ratio image, compact name + price + "+ Cart" button (24px) + heart remove (24px); loading skeletons match grid shape; `ShoppingBag` icon removed

- [x] Polish Batch 7 (2026-05-29) — Vendor portal UI improvements
  - **Vendor products grid** (`src/app/(vendor)/vendor/products/page.tsx`) — 2-col → 3-col grid, gap `space-3` → `space-2`
  - **VendorProductCard** (`src/components/vendor/VendorProductCard.tsx`) — `shape-lg` → `shape-md` radius; padding `space-3` → `space-2`; gap `space-2` → `space-1`; name: `title-small` → `label-medium`; category removed (redundant at small size); price: `body-small` → `label-small`; stock: `body-small` → `label-small`; action buttons: 36px → 28px, icons 13-14px → 11-12px
  - **Vendor dashboard greeting** (`src/app/(vendor)/vendor/dashboard/page.tsx`) — time-based greeting: "Good morning/afternoon/evening, [FirstName]" (hour < 12 / < 17 / else); store name moved to subdued label above; subtext "Here's what's happening with your store."
  - **DashboardStats** (`src/components/vendor/DashboardStats.tsx`) — extended Stat type with `Icon: LucideIcon`, `bgColor`, `fgColor`; each card now has tinted background + semi-transparent icon badge (`rgba(255,255,255,0.28)`); 4 stat colors: Products=primary-container, Orders=secondary-container, Revenue=tertiary-container, Requests=error-container
  - **Order status badges** (dashboard recent orders) — plain text replaced with pill badges; status→color map: PLACED=primary-container, CONFIRMED=secondary-container, PROCESSING=tertiary-container, SHIPPED=secondary-container, DELIVERED=rgba green, CANCELLED=error-container; orders now grouped in single surface card with dividers (not separate floating cards); shows 4 orders (was 3)

- [x] Polish Batch 8 (2026-05-30) — Dashboard redesign, search systems, image upload, responsiveness audit
  - **Vendor dashboard full redesign** (`dashboard/page.tsx` + `DashboardStats.tsx`) — removed `maxWidth: 700px`; 4 stat cards stretch full width via `.vendor-dash-stats`; 2-col desktop body via `.vendor-dash-body` (left: recent orders table + pipeline, right: best sellers bar chart + pre-orders/styling mini-cards + quick actions); "Add product" pill button in header; uses `.vendor-page` for responsive padding
  - **`DashboardStats`** — cards now horizontal (label/value/sub left, icon badge right) using `.vendor-dash-stats` responsive class
  - **Vendor products search system** — full search bar (by name/category/colour), sort dropdown (6 options), category chips with counts, status chips (All/Active/Inactive), stock chips (All/Low/Out), active filter tags with × remove, live result count, empty state; inventory summary bar (6 metrics)
  - **Vendor products grid** — `repeat(3, 1fr)` → `.vendor-products-grid` (2→3→5 col responsive); `VendorProductCard` action buttons icon-only (no "Edit" text label)
  - **Input field styling** — `.field` base: `var(--color-surface-dim)` (off-white); `:not(:placeholder-shown)` + `:focus`: pure `#ffffff`; background transitions smoothly
  - **Product image upload** (`ProductUploadForm.tsx`) — replaced URL text input with drag-and-drop / click-to-upload zone; local preview on selection; hover overlay with "Change image" + remove; on submit uploads to `POST /api/v1/vendor/products/upload-image` (uses raw `fetch` with auth token — NOT `apiFetch` which forces `Content-Type: application/json`); button disabled during upload showing "Uploading image…"; edit form preserves existing image if no new file selected
  - **Shop search & filters** (`ShopFilters.tsx` new client component) — server page fetches items, passes to `ShopFilters`; desktop sidebar: category nav + size chips + colour swatches (dynamic from items) + price brackets (radio) + new arrivals toggle; mobile: search + "Filters (N)" expand button + panel; active filter tags (individual remove); sort dropdown; live result count; no-results empty state
  - **Mobile responsiveness audit** — 7 new CSS classes added to `globals.css`; all hardcoded inline `gridTemplateColumns` replaced with responsive CSS classes; `display:` never set inline on elements using show/hide CSS classes (avoids specificity conflict)
  - **Files fixed for mobile**: `wishlist/page.tsx` → `.grid-2-4`; `saved-looks/page.tsx` → `.grid-2-4`; `avatar-studio/page.tsx` item picker → `.grid-2-4`; `vendor/products/page.tsx` → `.vendor-products-grid` + `.vendor-page`; `vendor/dashboard/page.tsx` → `.vendor-page` + `.grid-pipeline`; `ProductUploadForm.tsx` category/price row → `.form-row-2`; `vendor/payouts/page.tsx` summary cards → `.form-row-2`; `PromoSection.tsx` feature cards → `.grid-feature-cards`; `ShopFilters.tsx` sidebar aside — removed inline `display` to let `.shop-sidebar` CSS control visibility; `.shop-sidebar-hide-tabs` class added to CSS (mobile show / desktop hide)

- [x] Polish Batch 9 (2026-05-31) — UX polish, body types feature, mobile nav overhaul
  - **Body types feature** — `bodyTypes String[]` Prisma column (migration `20260531_add_body_types`); `body_types?: string[]` on `ClothingItem`, `body_types: string[]` on `VendorProduct`; empty array = fits all bodies; 7 types: hourglass/pear/apple/rectangle/inverted-triangle/oval/athletic; colour tokens: tertiary-container for body type pills (vs primary-container for size chips)
  - **Colour name → hex** — `colourNameToHex()` in `mappers.ts`; ~80 fashion colour names; used in `mapDbProduct` so DB product colour swatches are real colours not grey
  - **ShopFilters** — dividers between sidebar sections; dynamic colour swatches; body type filter section; "Explore more" rows have white card bg
  - **ShareButton** — `src/app/(main)/product/[id]/ShareButton.tsx`; tries `navigator.share({files:[image]})` → `navigator.share({url})` → clipboard copy with toast
  - **Multi-image upload** — `ProductUploadForm` supports up to 6 images; 88×88 thumbnail strip; star badge + teal ring on primary; click to promote; `images?: string[]` added to `VendorProduct` type
  - **VendorCategoryStep** — custom category text input; Enter/click Add to add; chips are auto-selected; `toLabel()` for title-case display
  - **Mobile TopBar** — left search icon removed; Wishlist + Cart given `topbar-profile-link` (desktop-only); mobile shows VIRÉA logo only
  - **BottomNav** — Home | Shop (Shirt) | Cart (/bag, badge) | Saved (/wishlist, badge) | Profile; Studio removed from bottom nav
  - **ProductCard name** — 15px → 13px; fixed `height: calc(13px * 1.3 * 2)` for equal card heights
  - **Hero** — "Explore Collections" link hidden on mobile via `.hide-on-mobile` class
  - **VendorsOfTheWeek** — header margin space-7 → space-10

## Up Next
- [ ] Vendor subaccount auto-trigger on first vendor login (deferred)
- [ ] Remove or gate `/api/dev/seed` before real production launch
- [ ] End-to-end testing on live Vercel deployment
- [ ] Re-run `/api/dev/seed` on Vercel to populate `bodyTypes` on existing DB products

## Gotchas
- `next/image` requires `images.remotePatterns` in `next.config.ts` — Unsplash + Replicate CDN already configured
- Zustand `persist` uses named keys: `virea:session`, `virea:avatar`, `virea:wishlist`, `virea:cart`, `virea:theme`, `virea:outfits`, `virea:orders`, `virea:vendor`
- `localStorage` is only available in client components; stores hydrate on mount
- **All prices in kobo (Int).** Display with `formatNaira(kobo)` from `src/lib/format.ts`. Never use `.toLocaleString("en-NG")` directly on a price value.
- Toast: `useUIStore(s => s.addToast)` — NOT a separate store
- Vendor portal auth guard: `useEffect(() => { if (!isAuthenticated) router.replace("/vendor/login"); }, [isAuthenticated, router])` in every vendor page
- Dynamic route params: `const { id } = use(params)` — NOT `await params` (Next.js 16, client components); route handlers use `const { id } = await params` (server-side)
- **Sticky elements must use `top: var(--topbar-height)`** — TopBar is 64px mobile / 68px desktop
- **Hover states use JS, not CSS** — always wire `onMouseEnter`/`onMouseLeave` on elements; never use CSS `:hover` on inline-styled components
- **`BottomSheet` render prop** — `children: ReactNode | ((close: () => void) => ReactNode)`
- **`Button` filled variant mouseLeave** — never clear `el.style.background`; only `boxShadow`/`transform` are set on enter
- **`next/image fill` inside `AnimatePresence`** — always wrap in inner `<div style={{ position: "relative", width: "100%", height: "100%" }}>`
- **Marquee seamless loop** — render content twice side-by-side, animate `translateX(0) → translateX(-50%)`
- **DM Sans 800** — use `fontFamily: "var(--font-sans)", fontWeight: 800`; Cormorant tops out at 600
- **`virea_avatar_photo` vs `virea_user_selfie`** — two separate localStorage keys; never mix them
- **FLUX prompt engineering** — always include "arms slightly away from body" + "white seamless bodysuit"
- **Vercel Pro required** — `maxDuration = 60` on AI routes; Hobby caps at 10s
- **`REPLICATE_HOST_IP`** — local Windows dev only; never set on Vercel
- **Flutterwave amounts** — FLW API sends/receives naira (major unit). DB stores kobo. Always divide by 100 before sending to FLW, multiply by 100 when reading back. The verify endpoint also returns naira.
- **`FLUTTERWAVE_SECRET_HASH`** — you set this string yourself in the FLW dashboard (Webhooks → Secret hash). Must exactly match the env var. Without it the webhook handler rejects all incoming webhooks with 401.
- **Save `txRef` to Order before calling FLW** — generate it, persist to DB, then call `createPaymentLink()`. If the FLW call fails and is retried, the txRef is already there and won't duplicate.
- **Webhook always returns 200** — even on failed checks or DB errors. Returning non-200 causes FLW to retry indefinitely. Log errors; never let them bubble to a 500.
- **Vendor must have `flwSubaccountId`** — `POST /api/v1/payments/initiate` throws `VENDOR_NO_SUBACCOUNT` if not set. Vendor must call `POST /api/v1/vendor/subaccount` first (once, during onboarding).
- **`prisma.config.ts` excluded from tsconfig** — Prisma 7 `defineConfig` types conflict with tsconfig strict mode; excluded via `"exclude": [..., "prisma.config.ts"]`
- **Prisma 7 schema has no `url` in datasource** — URL comes from `prisma.config.ts` `datasource.url` field, not `schema.prisma`
- **`DATABASE_URL ?? ""`** in `prisma.ts` — never throw at module load time; Next.js imports modules at build time before env vars exist; real error surfaces at query time
- **`apiFetch` silent refresh** — on page reload `accessToken` is null but `isAuthenticated` is true (from localStorage); first 401 triggers `/api/v1/auth/refresh` automatically; no manual `initSession` needed
- **Vendor `accountName`** — the register form doesn't have a separate account name field; `ownerName` is sent as `accountName` to the API
- **Zod v4** — import from `"zod"` not `"zod/v4"`; API is slightly different from v3 (e.g. `.min()` error messages)
- **Underline tab pattern** — for mode toggles (Try-On, Studio tabs) use `borderBottom: "2px solid var(--color-primary)"` on active, `"2px solid transparent"` on inactive, `marginBottom: "-1px"` so the indicator sits flush with the container's bottom border. Never use filled pill/capsule toggles on new UI.
- **Bag → Cart** — the word "Cart" is canonical everywhere user-facing. Internal function/prop names (`handleAddToBag`, `onAddToBag`) can stay as-is since they're not visible to users.
- **Mock clothing `vendor_id`** — all 20 items in `src/lib/mock/clothing.ts` have `vendor_id: "vendor-virea-test"`. After running `GET /api/dev/seed` once, every mock shop item is a valid DB product and checkout works end-to-end.
- **`/api/dev/seed` uses fixed vendor ID** — vendor is upserted with `id: "vendor-virea-test"` (not a random cuid). This lets mock data reference it statically. If a stale test vendor exists with same email but different id, seed deletes it first.
- **Write tool encoding** — on Windows the Write tool can produce UTF-8 BOM + Unicode curly quotes (`”` `”`) instead of straight ASCII `”`. TypeScript reports TS1127 “Invalid character”. Fix with: `node -e “const fs=require('fs');let c=fs.readFileSync(p,'utf8');if(c.charCodeAt(0)===0xFEFF)c=c.slice(1);c=c.replace(/”/g,'\”').replace(/”/g,'\”');fs.writeFileSync(p,c,'utf8')”`. Prefer Edit tool for targeted changes to avoid this.
- **Body types convention** — `bodyTypes` (camelCase) in Prisma schema + DB + service layer; `body_types` (snake_case) in all frontend types (`ClothingItem`, `VendorProduct`). `body_types: []` semantically means “fits all body types” — items with empty arrays always pass the body type filter. Colour tokens: `--color-tertiary-container` / `--color-on-tertiary-container` for body type pills (to distinguish from size chips which use primary-container).
- **Mobile nav architecture** — TopBar on mobile shows ONLY the VIRÉA logo (no icons). All navigation is via BottomNav (Home | Shop | Cart | Saved/Wishlist | Profile). Never add icons back to TopBar mobile without also removing them from BottomNav. BottomNav uses `useCartStore` + `useWishlistStore` for live badges.
- **`topbar-profile-link` wrapper pattern** — desktop-only TopBar elements must be wrapped in a single `<div className="topbar-profile-link">` with NO `display` in its inline style. CSS class controls `display: none` mobile / `display: flex` desktop. Never put `topbar-profile-link` on individual links that also have `display: flex` in their inline `style` prop — inline wins over CSS and the element stays visible on mobile.
- **Multi-image products** — `VendorProduct.images?: string[]` stores all image URLs, `image_url` is always the primary (first). DB `Product.images String[]` already supported this. `ProductUploadForm` uploads all new files sequentially before submit, reorders so primary is at index 0.
- **`.hide-on-mobile` class** — use `className=”hide-on-mobile”` to hide any element on mobile (< 900px) and show inline on desktop. Do NOT use `topbar-profile-link` for non-TopBar elements even though the behaviour is identical.
