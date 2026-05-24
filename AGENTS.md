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
| `auth.store.ts` | `virea:session` | user session |
| `avatar.store.ts` | `virea:avatar` | avatar params (gender, body shape, skin tone, hair, size) |
| `wishlist.store.ts` | `virea:wishlist` | saved items |
| `cart.store.ts` | `virea:cart` | cart items + count |
| `ui.store.ts` | `virea:theme` | theme + `addToast()` |
| `outfits.store.ts` | `virea:outfits` | saved outfits |
| `orders.store.ts` | `virea:orders` | orders + pre-orders; `createOrder`, `createPreOrder`, `updatePreOrderStatus`, `updateOrderStatus`, `addVendorQuote` |
| `vendor.store.ts` | `virea:vendor` | vendor profile + `products[]` + `stylingRequests[]`; `signIn`, `signOut`, `updateVendor`, `addProduct`, `updateProduct`, `removeProduct`, `respondToStylingRequest`, `declineStylingRequest` |

> **Toast**: always use `useUIStore(s => s.addToast)(message, type)` — there is NO separate `useToastStore`

## localStorage Keys (outside Zustand)
| Key | Value | Set by |
|-----|-------|--------|
| `virea_user_selfie` | base64 data URI (JPEG, compressed to 768px) | Profile selfie upload |
| `virea_avatar_photo` | URL string (Replicate CDN webp) | Avatar builder + inline generation on try-on page |

## AI Try-On Architecture
Two modes on `/try-on`, both powered by **Replicate IDM-VTON** (`cuuupid/idm-vton`):

| Mode | Person image source | Input type |
|------|---------------------|------------|
| **Avatar** | FLUX.1-generated photo stored as `virea_avatar_photo` | `personImageUrl` (URL) |
| **Real Photo** | User's selfie stored as `virea_user_selfie` | `personImageB64` (base64) |

**`/api/tryon`** accepts either `personImageUrl` OR `personImageB64` — URL takes precedence.

**`/api/generate-avatar`** calls `black-forest-labs/flux-schnell` to generate a photorealistic full-body person photo from avatar params (gender, body shape, skin tone, height). Prompt is engineered for IDM-VTON compatibility (arms away from body, white seamless bodysuit, white studio background).

**`src/lib/replicate.ts`** — shared DNS resolution + IPv4 fetch utility used by both API routes. On Windows local dev, `REPLICATE_HOST_IP` env var bypasses broken DNS. Leave it unset on Vercel (Linux DNS works fine).

## Key Files
| Path | Purpose |
|------|---------|
| `src/styles/tokens.css` | All CSS custom property design tokens |
| `src/app/globals.css` | Tailwind + token imports, typography classes, responsive layout classes (shopper + vendor shells) |
| `src/lib/replicate.ts` | Shared Replicate fetch utility — IPv4 DNS workaround + `replicateFetch()` + `sleep()` |
| `src/lib/mock/clothing.ts` | 20 mock ClothingItem objects (brands, ₦ prices, Unsplash images) |
| `src/lib/mock/feed.ts` | heroBanners (2 slides, uppercase headlines for stacked display), getHomeFeed(), categories array |
| `src/lib/mock/orders.ts` | 3 mock orders (vendor-001, vendor-002, vendor-003) |
| `src/lib/mock/pre-orders.ts` | 2 mock pre-orders |
| `src/lib/mock/styling-requests.ts` | 3 mock styling requests (all for vendor-001) |
| `src/lib/mock/vendors.ts` | 4 mock vendors (vendor-001 = Adire Studio = default sign-in) |
| `src/store/*.store.ts` | Zustand stores (see table above) |
| `src/types/vendor.ts` | `Vendor`, `VendorProduct`, `VendorProductCategory`, `StylingRequest`, `EventType` |
| `src/types/order.ts` | `Order`, `OrderStatus`, `PreOrder`, `PreOrderStatus`, `OrderItem` |
| `src/types/avatar.ts` | `Avatar`, `AvatarGender`, `BodyShape`, `SkinTone`, `HairStyle`, `HairColour`, `HeightRange`, `SizeRange` |
| `src/components/ui/` | Button, BottomSheet, BackLink, EmptyState, SizeChip, ColourSwatch, Badge, Toast, SkeletonCard, **FadeIn** (whileInView scroll-reveal wrapper) |
| `src/components/catalogue/` | ProductCard (white bg, objectFit:contain, brand label, Cormorant name, colour dots), CategoryIconChip |
| `src/components/layout/` | TopBar, BottomNav, AppShell, PageShell, ThemeProvider, ServiceWorkerRegistrar, **Footer** |
| `src/components/home/` | HeroSlider, MarqueeStrip, PromoSection, VendorsOfTheWeek |
| `src/app/(main)/product/[id]/ProductGallery.tsx` | Client image carousel — prev/next arrows + thumbnail strip from colour variants |
| `src/components/vendor/` | VendorShell, VendorSidebar, VendorTopBar, VendorDrawerNav, DashboardStats, VendorProductCard, ProductUploadForm, OrderInboxItem, PreOrderInboxItem, StylingRequestItem |
| `src/components/orders/` | CheckoutModal, OrderStatusTracker, OrderCard |
| `src/components/pre-orders/` | PreOrderForm, QuoteReviewModal |
| `src/components/try-on/` | **TryOnView** (Avatar\|Real Photo toggle), LayerStack, TryOnActionBar, ColourSwitcher, **AiTryOnPanel** (loading overlay + result display) |
| `src/components/avatar-studio/` | AvatarStudio, LayerPanel, ItemLayerCard, SendToVendorModal |
| `src/hooks/useFashnTryOn.ts` | Real-photo try-on hook — reads `virea_user_selfie`, compresses, calls `/api/tryon` with `personImageB64` |
| `src/hooks/useAvatarTryOn.ts` | Avatar try-on hook — reads `virea_avatar_photo`, calls `/api/tryon` with `personImageUrl`; `saveAvatarPhoto(url)` persists new photos |
| `src/hooks/useTryOn.ts` | Avatar Studio canvas layer management (addLayer, removeLayer, swapColour, exportSnapshot) |
| `src/app/api/tryon/route.ts` | IDM-VTON virtual try-on — accepts `personImageUrl` OR `personImageB64`; polls until result; `maxDuration=60` |
| `src/app/api/generate-avatar/route.ts` | FLUX.1-schnell avatar photo generation from body params; `maxDuration=60` |
| `public/sw.js` | Service worker — network-first pages, cache-first static assets, offline fallback |
| `public/manifest.json` | PWA manifest with shortcuts and maskable icon |
| `src/app/offline/page.tsx` | Offline fallback page served by SW when navigation fails |

## Deployment
- **Live at:** `https://virea-seven.vercel.app`
- **GitHub:** `https://github.com/vireastyle/virea` (branch: `master`)
- **Vercel plan:** Pro required — IDM-VTON takes 15–30s per generation; Hobby plan hard-caps Node.js functions at 10s
- **Root directory:** `virea` (set in Vercel project settings — the repo root has design docs, not the Next.js app)
- **Env vars on Vercel:** `REPLICATE_API_TOKEN` only — do NOT set `REPLICATE_HOST_IP` (Linux DNS works fine on Vercel)

## Build Status
- **Build passes cleanly** (`npm run build`) — 29 routes, no type errors
- All server/client boundary issues resolved
- Google Fonts loaded via CSS `@import` in `globals.css` (runtime, not build-time) — build environment cannot reach Google CDN

## Completed Phases
- [x] Phase 1 — Scaffold (types, tokens, mock data, stores, PWA manifest)
- [x] Phase 2 — Core UI components (Button, chips, swatches, Toast)
- [x] Phase 3 — Catalogue pages (Home, Shop, Product Detail)
- [x] Phase 4 — User pages (Wishlist, Saved Looks, Profile, Avatar Builder, Login/Register)
- [x] Phase 5 — Desktop layout (Sidebar, AppShell, responsive shell CSS)
- [x] Phase 6 — Try-On Canvas Engine (`/try-on` with `TryOnView`, `LayerStack`, `TryOnActionBar`, `ColourSwitcher`)
- [x] Phase 7 — Avatar Studio (`/avatar-studio` with `AvatarStudio`, `LayerPanel`, `ItemLayerCard`, `SendToVendorModal`)
- [x] Phase 8 — PWA & offline shell
  - `public/sw.js` — manual service worker (network-first navigation, cache-first static assets)
  - `public/icons/icon.svg` + `icon-maskable.svg` — SVG icons (any size, maskable)
  - `public/manifest.json` — full manifest with shortcuts, categories
  - `src/components/layout/ServiceWorkerRegistrar.tsx` — client component, registers SW on mount
  - `src/app/offline/page.tsx` — offline fallback page
  - `src/app/(main)/try-on/TryOnContent.tsx` — Suspense boundary fix for `useSearchParams`
- [x] Phase 9 — Orders & Pre-Orders (user side)
  - `/bag`, `/orders`, `/orders/[id]`, `/pre-orders`, `/pre-orders/new`, `/pre-orders/[id]`
  - `CheckoutModal` (1s mock delay → createOrder → clear cart → toast → redirect)
  - `OrderStatusTracker`, `OrderCard`, `PreOrderForm`, `QuoteReviewModal`
  - `orders.store.ts` persisted as `virea:orders`
- [x] Phase 10 — Vendor Auth & Onboarding
  - `/vendor/login` (signs in as mockVendors[0]), `/vendor/register` (3-step wizard)
  - `VendorAccountStep`, `VendorCategoryStep`, `VendorBankStep`
  - `vendor.store.ts` persisted as `virea:vendor`; `buildMockVendor()` helper
- [x] Phase 11 — Vendor Portal
  - `(vendor)/layout.tsx` with `VendorShell` (sidebar desktop / drawer mobile)
  - `/vendor/dashboard` — live stats, quick actions, recent orders snippet
  - `/vendor/products` + `/new` + `/[id]/edit` — full CRUD via `ProductUploadForm`
  - `/vendor/orders` + `/[id]` — order inbox, advance status flow (PLACED → DELIVERED)
  - `/vendor/pre-orders` + `/[id]` — inbox + send-quote form + status progression
  - `/vendor/styling-requests` + `/[id]` — respond or decline
  - `/vendor/payouts` — settled/pending summary + mock payout history
  - `/vendor/profile` — edit business name, bio, categories
- [x] Phase 12 — Animations & Motion
  - `src/lib/motionTokens.ts` — JS constants mirroring CSS `--duration-*` / `--easing-*` tokens for Framer Motion
  - `src/app/(main)/template.tsx` — fade+slide-up page transition on every shopper navigation
  - `CheckoutModal`, `QuoteReviewModal`, `SendToVendorModal` — `AnimatePresence` with backdrop fade + bottom sheet slide-up/down
  - `ToastContainer` — `AnimatePresence` replaces CSS keyframe; scale+y slide in/out per toast
  - `BottomNav` — `motion.span layoutId="nav-pill"` slides the active pill between nav items
  - `AvatarBuilderPage` + `VendorRegisterPage` — `AnimatePresence mode="wait"` + directional x slide between steps
  - `LayerStack` — `AnimatePresence` with height+x+opacity for try-on layer enter/exit
- [x] Phase 13 — Polish & Accessibility
  - `ThemeProvider` wraps with `<MotionConfig reducedMotion="user">` — auto-disables animations when OS reduces motion
  - `:focus-visible` ring uses `!important` to override inline `outline:none`
  - Vendor empty states upgraded with icon + headline + descriptive copy
  - `(main)/shop/[category]/loading.tsx` + `(main)/loading.tsx` — `SkeletonCard` grids for perceived performance
- [x] Phase 14 — Code Audit & Cleanup
  - Shared form field CSS classes (`.field`, `.field--textarea`, `.field--select`, `.field-label`, `.field-error`)
  - Modal refactor — all modals use shared `BottomSheet` wrapper with render prop
  - Store IDs switched from `Date.now()` to `crypto.randomUUID()`
  - Dead code removed; type cleanup; hover states unified
- [x] Phase 15 — World-Standard UI Overhaul
  - Top header replaces desktop sidebar; `TopBar` visible at all breakpoints
  - `ProductCard` redesign — white bg, `objectFit:contain`, brand label, colour dots
  - `ProductGallery` — image carousel + thumbnail strip on product detail page
  - Product detail full redesign with `product-detail-layout` grid
  - Shop page sidebar (categories + filters) on desktop
- [x] Phase 16 — Home Page Elevation & Footer
  - `HeroSlider` — full client carousel with per-word stacked headline animation
  - `FadeIn` — reusable `whileInView` scroll-reveal wrapper
  - `MarqueeStrip`, `PromoSection`, `VendorsOfTheWeek`
  - `Footer` — dark footer with marquee watermark, 4 link columns, email subscribe
- [x] Phase 17 — AI Try-On & Photorealistic Avatar
  - **Replicate IDM-VTON integration** — `src/app/api/tryon/route.ts`; accepts garment URL + person image (base64 or URL); polls until result; deployed and live
  - **FLUX.1-schnell avatar generation** — `src/app/api/generate-avatar/route.ts`; builds prompt from gender/body shape/skin tone/height; stores result as `virea_avatar_photo` in localStorage
  - **Shared Replicate util** — `src/lib/replicate.ts`; IPv4 DNS workaround used by both routes
  - **Try-on mode toggle** — pill toggle on `/try-on`: **Avatar** (FLUX photo + IDM-VTON) | **Real Photo** (selfie + IDM-VTON)
  - **Avatar mode 3 states**: no avatar built → prompt to `/avatar-builder`; avatar built, no photo → inline generation (~10s); photo ready → show avatar + "See it on your avatar" CTA
  - **Regenerate button** — lets user refresh their avatar photo from the try-on page
  - **Avatar builder updated** — SVG cartoon preview removed; "Save & Generate Avatar" auto-generates FLUX photo as final step; shows result with option to regenerate or skip
  - **`AiTryOnPanel`** — shared loading overlay (spinner + pulsing dots) and result display (AI badge + back button) used by both modes
  - **`useFashnTryOn`** — real-photo hook (compresses selfie to 768px JPEG before sending)
  - **`useAvatarTryOn`** — avatar hook (`saveAvatarPhoto(url)` persists generated photos)
  - **`next.config.ts`** — `*.replicate.delivery` + `pbxt.replicate.delivery` added to `remotePatterns`

## Up Next
- [ ] **Phase 18** — Backend Core (Express + Prisma + JWT auth)
- [ ] Phase 19 — Orders, Pre-Orders, Styling Requests + Flutterwave split payments
- [ ] Phase 20 — Background Jobs (BullMQ + Redis — notifications, payment verify fallback)
- [ ] Phase 21 — Frontend-Backend Wiring (swap mock data for React Query hooks)

## Gotchas
- `next/image` requires `images.remotePatterns` in `next.config.ts` — Unsplash + Replicate CDN (`*.replicate.delivery`) already configured
- Zustand `persist` uses named keys: `virea:session`, `virea:avatar`, `virea:wishlist`, `virea:cart`, `virea:theme`, `virea:outfits`, `virea:orders`, `virea:vendor`
- `localStorage` is only available in client components; stores hydrate on mount
- All prices are in Nigerian Naira (₦); format with `.toLocaleString("en-NG")`
- Toast: `useUIStore(s => s.addToast)` — NOT a separate store
- Vendor portal auth guard: `useEffect(() => { if (!isAuthenticated) router.replace("/vendor/login"); }, [isAuthenticated, router])` pattern used in every vendor page
- Dynamic route params: `const { id } = use(params)` (Next.js 16 — params is a Promise)
- **Sticky elements must use `top: var(--topbar-height)`** — the fixed TopBar is 64px mobile / 68px desktop
- **Hover states use JS, not CSS** — all components use inline styles; always wire `onMouseEnter`/`onMouseLeave` directly on elements. Never rely on CSS class hover rules.
- **`BottomSheet` render prop** — accepts `children: ReactNode | ((close: () => void) => ReactNode)`. Pass a function child when buttons inside need to trigger animated close.
- **`Button` filled variant mouseLeave** — never clear `el.style.background` on leave. Only `boxShadow` and `transform` are set on enter; clearing background makes the button transparent.
- **`next/image fill` inside `AnimatePresence`** — always wrap `<Image fill>` in an inner `<div style={{ position: "relative", width: "100%", height: "100%" }}>` inside the motion wrapper.
- **Marquee seamless loop** — render content twice side-by-side, animate `translateX(0) → translateX(-50%)`. Single-copy marquee jumps at end of cycle.
- **DM Sans 800** — loaded in Google Fonts `@import`. Use `fontFamily: "var(--font-sans)", fontWeight: 800` for hero headlines. Cormorant tops out at 600.
- **`virea_avatar_photo` vs `virea_user_selfie`** — two separate localStorage keys. Avatar photo is a Replicate CDN URL (string). Selfie is a base64 data URI (string). Never mix them: `useAvatarTryOn` reads `virea_avatar_photo` and passes it as `personImageUrl`; `useFashnTryOn` reads `virea_user_selfie` and passes it as `personImageB64`.
- **`/api/tryon` person image** — accepts `personImageUrl` (URL string, e.g. Replicate CDN) OR `personImageB64` (base64 data URI). URL takes precedence. IDM-VTON accepts both natively.
- **FLUX prompt engineering** — always include "arms slightly away from body" and "white seamless bodysuit" in the avatar generation prompt. IDM-VTON needs clear arm separation for garment segmentation and a light undergarment for clean replacement.
- **Vercel Pro required** — API routes use `maxDuration = 60`. IDM-VTON takes 15–30s, FLUX takes 5–10s. Hobby plan caps Node.js functions at 10s and will always timeout.
- **`REPLICATE_HOST_IP` env var** — local Windows dev only; bypasses broken DNS. Refresh with `Resolve-DnsName api.replicate.com -Type A`. Never set this on Vercel.
