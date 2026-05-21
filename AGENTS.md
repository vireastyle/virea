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
- **Google Fonts** — loaded via CSS `@import` in `globals.css` (runtime); Cormorant Garamond (`--font-display`) + DM Sans (`--font-sans`) defined in `tokens.css`

## Design System
- All tokens in `src/styles/tokens.css` (colors, spacing, shape, elevation, motion)
- Color system: Viridian `#3B6F68` primary, Swan `#F6F1EB` background, Soft Gold `#C7A760` accent
- All components use **inline styles referencing CSS custom properties** — do NOT use Tailwind utility classes on components
- Fluid type scale via `clamp()` — display/headline roles scale between 320px–900px viewport
- Responsive layout via CSS classes in `globals.css` (not Tailwind breakpoints):
  - `.app-shell`, `.app-sidebar`, `.app-content`, `.app-topbar`, `.app-bottomnav`
  - `.vendor-shell`, `.vendor-sidebar`, `.vendor-content`, `.vendor-topbar`
  - `.product-grid` — 2 col mobile → 3 col ≥900px → 4 col ≥1200px
  - `.content-inner` — max-width 1100px, centered on desktop
  - `.trending-card` — 160px mobile, 220px desktop

## Layout Architecture
### Shopper (main)
- Mobile: `TopBar` + `BottomNav` (fixed, 64px) — hidden on desktop via `.app-topbar` / `.app-bottomnav` CSS
- Desktop: `Sidebar` (fixed left column, 260px) — hidden on mobile via `.app-sidebar` CSS
- `AppShell` wraps `<Sidebar>` + `.app-content` div; used in `src/app/(main)/layout.tsx`
- `(main)/layout.tsx` → `<ThemeProvider><TopBar /><AppShell>{children}</AppShell><BottomNav /><ToastContainer />`

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
| `avatar.store.ts` | `virea:avatar` | avatar layers |
| `wishlist.store.ts` | `virea:wishlist` | saved items |
| `cart.store.ts` | `virea:cart` | cart items + count |
| `ui.store.ts` | `virea:theme` | theme + `addToast()` |
| `outfits.store.ts` | `virea:outfits` | saved outfits |
| `orders.store.ts` | `virea:orders` | orders + pre-orders; `createOrder`, `createPreOrder`, `updatePreOrderStatus`, `updateOrderStatus`, `addVendorQuote` |
| `vendor.store.ts` | `virea:vendor` | vendor profile + `products[]` + `stylingRequests[]`; `signIn`, `signOut`, `updateVendor`, `addProduct`, `updateProduct`, `removeProduct`, `respondToStylingRequest`, `declineStylingRequest` |

> **Toast**: always use `useUIStore(s => s.addToast)(message, type)` — there is NO separate `useToastStore`

## Key Files
| Path | Purpose |
|------|---------|
| `src/styles/tokens.css` | All CSS custom property design tokens |
| `src/app/globals.css` | Tailwind + token imports, typography classes, responsive layout classes (shopper + vendor shells) |
| `src/lib/mock/clothing.ts` | 20 mock ClothingItem objects (brands, ₦ prices, Unsplash images) |
| `src/lib/mock/feed.ts` | heroBanners, getHomeFeed(), categories array |
| `src/lib/mock/orders.ts` | 3 mock orders (vendor-001, vendor-002, vendor-003) |
| `src/lib/mock/pre-orders.ts` | 2 mock pre-orders |
| `src/lib/mock/styling-requests.ts` | 3 mock styling requests (all for vendor-001) |
| `src/lib/mock/vendors.ts` | 4 mock vendors (vendor-001 = Adire Studio = default sign-in) |
| `src/store/*.store.ts` | Zustand stores (see table above) |
| `src/types/vendor.ts` | `Vendor`, `VendorProduct`, `VendorProductCategory`, `StylingRequest`, `EventType` |
| `src/types/order.ts` | `Order`, `OrderStatus`, `PreOrder`, `PreOrderStatus`, `OrderItem` |
| `src/components/ui/` | Button, BottomSheet, BackLink, EmptyState, SizeChip, ColourSwatch, Badge, Toast, SkeletonCard |
| `src/components/catalogue/` | ProductCard, CategoryIconChip |
| `src/components/layout/` | TopBar, BottomNav, Sidebar, AppShell, PageShell, ThemeProvider, ServiceWorkerRegistrar |
| `src/components/vendor/` | VendorShell, VendorSidebar, VendorTopBar, VendorDrawerNav, DashboardStats, VendorProductCard, ProductUploadForm, OrderInboxItem, PreOrderInboxItem, StylingRequestItem |
| `src/components/orders/` | CheckoutModal, OrderStatusTracker, OrderCard |
| `src/components/pre-orders/` | PreOrderForm, QuoteReviewModal |
| `src/components/try-on/` | TryOnView, LayerStack, TryOnActionBar, ColourSwitcher |
| `src/components/avatar-studio/` | AvatarStudio, LayerPanel, ItemLayerCard, SendToVendorModal |
| `public/sw.js` | Service worker — network-first pages, cache-first static assets, offline fallback |
| `public/manifest.json` | PWA manifest with shortcuts and maskable icon |
| `src/app/offline/page.tsx` | Offline fallback page served by SW when navigation fails |

## Build Status
- **Build passes cleanly** (`npm run build`) — 33 routes, no type errors
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
  - `VendorShell`, `VendorSidebar`, `VendorTopBar`, `VendorDrawerNav` in `src/components/vendor/`
  - `/vendor/dashboard` — live stats, quick actions, recent orders snippet
  - `/vendor/products` + `/new` + `/[id]/edit` — full CRUD via `ProductUploadForm`
  - `/vendor/orders` + `/[id]` — order inbox, advance status flow (PLACED → DELIVERED)
  - `/vendor/pre-orders` + `/[id]` — inbox + send-quote form + status progression
  - `/vendor/styling-requests` + `/[id]` — respond or decline
  - `/vendor/payouts` — settled/pending summary + mock payout history
  - `/vendor/profile` — edit business name, bio, categories

- [x] Phase 12 — Animations & Motion
  - `src/lib/motionTokens.ts` — JS constants mirroring CSS `--duration-*` / `--easing-*` tokens for Framer Motion
  - `src/app/(main)/template.tsx` — fade+slide-up page transition on every shopper navigation (Next.js template re-mounts per route); `(vendor)/template.tsx` intentionally absent — vendor nav is instant SPA-style
  - `CheckoutModal`, `QuoteReviewModal`, `SendToVendorModal` — `AnimatePresence` with backdrop fade + bottom sheet slide-up/down; internal `visible` state for coordinated exit before unmount
  - `ToastContainer` — `AnimatePresence` replaces CSS keyframe; scale+y slide in/out per toast
  - `BottomNav` — `motion.span layoutId="nav-pill"` slides the active pill between nav items
  - `AvatarBuilderPage` + `VendorRegisterPage` — `AnimatePresence mode="wait"` + directional x slide between steps; `motion.div` animated progress bar width
  - `LayerStack` — `AnimatePresence` with height+x+opacity for try-on layer enter/exit

- [x] Phase 13 — Polish & Accessibility
  - `ThemeProvider` now wraps with `<MotionConfig reducedMotion="user">` — Framer Motion auto-disables all animations when OS reduces motion
  - `globals.css` — `:focus-visible` uses `!important` to override inline `outline:none`; separate `input/textarea/select:focus-visible` rule uses `border-color + box-shadow` ring (no outline box conflict with custom borders)
  - `VendorDrawerNav` — `aria-label="Close menu"` on close button; `role="dialog" aria-modal aria-hidden` on panel; `aria-hidden` on backdrop overlay
  - `wishlist/page.tsx` — "Add to Bag" button gets `aria-label={`Add ${item.name} to bag`}`
  - Vendor empty states upgraded: `/vendor/orders`, `/vendor/pre-orders`, `/vendor/styling-requests` — icon + headline + descriptive copy, matching shopper-side quality
  - `(main)/shop/[category]/loading.tsx` + `(main)/loading.tsx` — `SkeletonCard` grids for instant perceived performance when backend is wired

- [x] Phase 14 — Code Audit & Cleanup
  - **Shared form field CSS classes** — removed all inline `inputStyle`/`labelStyle`/`errorStyle` constant objects across `BodyProfileStep`, `VendorCategoryStep`, `PreOrderForm`, `RegisterPage`, `VendorProfilePage`, `VendorPreOrderDetailPage`, `VendorStylingRequestDetailPage`; replaced with `.field`, `.field--textarea`, `.field--select`, `.field-label`, `.field-error` CSS classes from `globals.css`
  - **Modal refactor** — `CheckoutModal`, `QuoteReviewModal`, `SendToVendorModal` rewritten to use the shared `BottomSheet` wrapper; `BottomSheet` extended to accept `children: ReactNode | ((close: () => void) => ReactNode)` render prop so action buttons inside can trigger animated close
  - **BackLink applied** — vendor detail pages (`/vendor/pre-orders/[id]`, `/vendor/styling-requests/[id]`) now use `<BackLink>` component instead of inline back-navigation markup
  - **Store ID safety** — `orders.store.ts` + `vendor.store.ts` switched from `Date.now()` suffix IDs to `crypto.randomUUID()` (ORM-ready, collision-safe)
  - **Dead code removed** — `src/components/ui/CategoryChip.tsx` (zero imports), `src/app/(vendor)/template.tsx` (caused unwanted page transitions in vendor portal)
  - **Type cleanup** — `style_preferences: StyleTag[]` removed from `User` type and `mockUser` (was legacy, unused field)
  - **Hover states** — `Button` component handles `onMouseEnter`/`onMouseLeave` internally per variant (filled: boxShadow + translateY; outlined: primary-container bg; text: surface-container bg); profile menu rows, sidebar nav links, stat cards, and CTAs all wire `onMouseEnter`/`onMouseLeave` directly on elements
  - **Vendor portal entry** — authenticated profile: "Sell on Virea" card (`/vendor/login`); unauthenticated profile: "Are you a vendor? Go to your store →" link; profile page Sign In button changed to `variant="outlined"` to match Create Account
  - **Auth form brand links** — "virea" heading in `LoginForm`, `RegisterPage`, `VendorRegisterPage` changed from static text to `<Link href="/">` routing home

## Up Next
- [ ] **Phase 15** — Backend Core (Express + Prisma + JWT auth)

## Backend (after all frontend phases are complete)
- [ ] Phase 15 — Backend Core (Express + Prisma + JWT auth)
- [ ] Phase 16 — Orders, Pre-Orders, Styling Requests + Flutterwave split payments
- [ ] Phase 17 — Background Jobs (BullMQ + Redis — notifications, payment verify fallback)
- [ ] Phase 18 — Frontend-Backend Wiring (swap mock data for React Query hooks)

## Gotchas
- `next/image` requires `images.remotePatterns` in `next.config.ts` for Unsplash — already configured
- Zustand `persist` uses named keys: `virea:session`, `virea:avatar`, `virea:wishlist`, `virea:cart`, `virea:theme`, `virea:outfits`, `virea:orders`, `virea:vendor`
- `localStorage` is only available in client components; stores hydrate on mount
- All prices are in Nigerian Naira (₦); format with `.toLocaleString("en-NG")`
- Toast: `useUIStore(s => s.addToast)` — NOT a separate store
- Vendor portal auth guard: `useEffect(() => { if (!isAuthenticated) router.replace("/vendor/login"); }, [isAuthenticated, router])` pattern used in every vendor page
- Dynamic route params: `const { id } = use(params)` (Next.js 16 — params is a Promise)
- **Hover states use JS, not CSS** — all components use inline styles, so CSS `:hover` rules cannot reliably override them. Always wire `onMouseEnter`/`onMouseLeave` directly on elements and mutate `e.currentTarget.style.*`. Never rely on CSS class hover rules for interactive feedback on inline-styled elements.
- **`BottomSheet` render prop** — accepts `children: ReactNode | ((close: () => void) => ReactNode)`. Pass a function child when action buttons inside the sheet need to trigger the animated close sequence (e.g. `CheckoutModal`, `QuoteReviewModal`).
- **`Button` filled variant mouseLeave** — never clear `el.style.background` on leave for `filled` buttons. Only `boxShadow` and `transform` are set on enter; clearing background removes React's inline primary color and makes the button transparent until next render.
