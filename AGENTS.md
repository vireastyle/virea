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
  - `.product-detail-layout` — block mobile, 55/45 grid desktop
  - `.promo-inner` / `.promo-text` / `.promo-image` — responsive promo banner (column mobile → row desktop)
  - `.vendor-week-grid` — horizontal scroll mobile → 3-col desktop grid for Vendors of the Week
  - `.footer-grid` — 1-col mobile → 2-col tablet → 5-col desktop footer layout
  - `--topbar-height` CSS var — `64px` mobile, `68px` desktop; use for `top:` on any `position:sticky` element
  - `@keyframes marquee` — infinite `-50%` translateX; element must be 2× content wide for seamless loop

## Layout Architecture
### Shopper (main)
- **Mobile** (`< 900px`): `TopBar` (64px, fixed) + `BottomNav` (64px, fixed)
  - TopBar layout: `[Search icon]` · `[VIRÉA logo — abs center]` · `[Wishlist + Cart]`
- **Desktop** (`≥ 900px`): `TopBar` (68px, fixed) only — no sidebar, no BottomNav
  - TopBar layout: `[VIRÉA logo]` · `[Shop · Try On · Studio — nav links]` · `[Search · Wishlist · Cart · Profile]`
  - Uses `.topbar-*` CSS classes for responsive slot switching (`.topbar-logo-mobile/desktop`, `.topbar-nav-links`, `.topbar-search-mobile`, `.topbar-profile-link`)
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
  - `src/lib/mappers.ts` — DB→frontend type mappers (mapDbProduct, mapDbProductToVendorProduct, mapDbOrder, mapDbPreOrder)
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

## Up Next
- [ ] Vendor subaccount auto-trigger on first vendor login (deferred)
- [ ] Restore AvatarSVG in Studio Canvas once Replicate avatar generation is verified working
- [ ] End-to-end testing on live Vercel deployment

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
