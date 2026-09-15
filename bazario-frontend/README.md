# Bazario Frontend

React + Vite + Tailwind storefront for the Bazario multi-vendor marketplace.
Pairs with the Bazario Django backend — see that repo's README for API docs.

## ⚠️ A note on how this was built

This project was hand-written rather than scaffolded with `npm create vite`
and verified with `npm install` — the environment it was built in had no
network access to npm's registry. Every file was verified with `esbuild`
instead: every `.jsx`/`.js` file compiles individually, and the full app
bundles successfully with every `@/` import resolving correctly. What was
**not** verified: that the pinned dependency versions in `package.json` are
still current/compatible, and the app has never actually run in a browser.
Run `npm install && npm run dev` and treat the first `npm run build` as the
real first test — if anything comes up, it's very likely a dependency
version mismatch rather than a logic error, since every import graph and
piece of JSX syntax has already been checked.

## Setup

```bash
npm install
cp .env.example .env      # only needed if your backend isn't on :8000
npm run dev
```

The dev server proxies `/api` to `http://127.0.0.1:8000` (see
`vite.config.js`), so run the Django backend alongside this with no CORS
setup needed in dev.

## Stack

- React 18 + Vite 6
- Tailwind CSS (design tokens in `tailwind.config.js`)
- React Router 6 (role-based routing, see `src/routes/`)
- Axios (JWT attach + automatic refresh-on-401, see `src/api/axiosClient.js`)

## Project layout

Mirrors the backend's app structure — `features/products` here talks to
`apps/products` there, and so on.

```
src/
  api/            axios client + centralized endpoint URLs
  features/       one folder per domain (auth, products, cart, ...)
    auth/
      customer/   CustomerLogin, CustomerRegister
      vendor/     VendorLogin, VendorRegister
      admin/      AdminLogin (no register — matches the backend)
  layouts/        AuthLayout (centered card), CustomerLayout (navbar+footer)
  routes/         ProtectedRoute (role-gated), App-level route wiring
  components/ui/  Button, Input, Badge — shared, role-agnostic
  utils/          tokenStorage, parseApiError, vendorAccent
```

## Design system

- **Palette:** indigo primary, amber accent, teal success, coral danger, on
  a cool off-white paper background — deliberately not the cream+terracotta
  combo that's become an AI-generated-design cliché. Echoes the color
  scheme already used in the backend's Swagger docs for cross-stack
  consistency.
- **Type:** Space Grotesk (display), Inter (body), JetBrains Mono (SKUs,
  order numbers, prices — rendered as the system-generated codes they are).
- **Signature element — the "stall" system:** every vendor gets a
  deterministic accent color computed from their id (`src/utils/
  vendorAccent.js`), shown as a colored strip on every card that represents
  them. It's not decoration — it's the one thing that makes "this is a
  multi-vendor marketplace, not a single catalog" visible at a glance,
  everywhere a vendor's products appear.

## What's built vs. what's next

**Built:** design system, axios client with auto token-refresh, all three
roles' login/register pages, the public storefront/browse page (search +
category filter + product grid), role-based route protection, and the full
customer purchase loop: product detail (variants, quantity, add to cart) →
cart (update quantity, remove, save-for-later) → checkout (shipping +
delivery/payment method + coupon) → order confirmation → order list/detail
with a status-step tracker. Cart count lives in the navbar in real time via
`CartContext`.

**Not yet built** (stubbed with a placeholder screen so routing/auth can
still be tested end-to-end):
- Vendor dashboard (products, orders, inventory, analytics)
- Admin dashboard (vendor/product moderation, platform analytics)
- Wishlist, reviews, messaging, notifications UI

The service/hook pattern is established (see `features/products/
productService.js`, `features/cart/cartService.js`, `features/orders/
orderService.js`) — each remaining feature follows the same shape:
`*Service.js` for API calls, a page component, reusable pieces in
`components/`.
