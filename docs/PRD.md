# Product Requirements Document — Velvet Bloom

**AR-Powered Restaurant SaaS Platform**

| | |
|---|---|
| **Document status** | Draft v1.0 |
| **Last updated** | 2026-08-02 |
| **Product** | Velvet Bloom (working title) |
| **Platform type** | Multi-tenant B2B2C SaaS |

---

## 1. Overview

Velvet Bloom is a multi-tenant SaaS platform that lets restaurants offer a
**cinematic, AR-powered digital menu and table-side ordering experience**.
Diners scan a QR code at their table, browse an animated menu, preview dishes in
**3D / augmented reality**, place orders, and pay — all from their phone, with no
app install. Restaurant operators get an admin surface to manage their menu,
categories, coupons, tables/QR codes, and to track orders, revenue, and AR
engagement analytics.

The platform is delivered as two applications:

- **Client** — a React single-page web app (customer-facing storefront + admin).
- **Backend** — a Spring Boot / Java REST API serving multiple restaurants from
  one deployment.

### 1.1 Vision

Turn the printed menu into an interactive, photoreal storytelling surface that
increases average order value, reduces order errors, and gives operators
data they never had from paper menus (which dishes get previewed, what
converts, table-level revenue).

### 1.2 Goals

- Let a diner go from **QR scan → browse → AR preview → order** in under 2 minutes.
- Give operators **self-serve control** of menu, pricing, media (images + 3D
  models), coupons, and table QR codes.
- Provide **actionable analytics**: revenue, order volume, AR views, top items.
- Support **many restaurants on one backend** (multi-tenant) with role-based access.

### 1.3 Non-goals (current phase)

- Native mobile apps (the experience is mobile web).
- Delivery-logistics / rider dispatch (focus is dine-in / table-side).
- Full POS / accounting integration.
- Table reservations (a feature flag exists but is out of scope for v1).

---

## 2. Users & Roles

The backend enforces three roles (RBAC via Spring Security):

| Role | Who | Capabilities |
|---|---|---|
| **customer** | Diner at a table | Browse menu, AR preview, cart, place & track orders, manage own profile, favorites, reviews |
| **admin** | Restaurant owner/manager | Everything a customer can do + manage their restaurant's menu, categories, coupons, media, orders, and analytics |
| **superadmin** | Platform operator (Velvet Bloom) | Cross-tenant administration; seeded on first boot from `ADMIN_EMAIL` / `ADMIN_PASSWORD` |

### 2.1 Primary personas

- **Aanya, the diner** — wants to see what a dish actually looks like before
  ordering, order without waving down a waiter, and split nothing complicated.
- **Rohan, the restaurant owner** — wants his menu to look premium, wants to
  update prices/availability himself, and wants to know what's selling.

---

## 3. Core Features

### 3.1 Customer storefront

| Feature | Description | Status |
|---|---|---|
| **Home page** | Hero, quick category grid, today's specials carousel, featured dishes, reviews | Built |
| **Menu browsing** | Full menu with category filter (Veg, Non-Veg, Pizza, Burger, Salad, Pasta, Dessert, Drinks), search | Built |
| **Dish detail** | Images gallery, description, ingredients, allergens, nutrition facts, rating, prep time, price/MRP | Built |
| **AR / 3D viewer** | Preview dishes as 3D models (GLB/USDZ) via `react-three-fiber` / model-viewer | Built |
| **Search** | Modal search across dishes | Built |
| **Cart** | Add/remove/quantity, drawer + full page, live subtotal | Built |
| **Coupons** | Apply coupon code, discount reflected in totals | Built (client) / validated server-side |
| **Checkout** | Multi-step (delivery → payment → review), table number, payment method (Cash/UPI/Card) | Built |
| **Order tracking** | Track order by order number, status timeline | Backend ready |
| **User profile** | Sign in / register, edit name/phone/preferences, favorites, logout | Built |
| **Reviews** | Read reviews per dish; submit review with images | Backend ready |
| **Theme** | Light/dark mode, persisted | Built |

### 3.2 Restaurant admin

| Feature | Description | Status |
|---|---|---|
| **Menu management** | CRUD menu items (JSON), upload images & 3D models (multipart → Cloudinary) | Backend ready |
| **Category management** | CRUD categories, reorder, upload icon/image | Backend ready |
| **Coupon management** | Percentage/flat coupons, min-order, usage limits, validity window, item/category scoping | Backend ready |
| **Order management** | List restaurant orders, update status, order timeline | Backend ready |
| **QR code generation** | Per-table QR codes (ZXing, base64 data-URL) linking to the table's menu | Backend ready |
| **Analytics dashboard** | Revenue, order count, AR views, top items | Backend ready |
| **Restaurant profile** | Branding (logo, cover, theme colors), hours, cuisine, tables, tax/delivery config, features | Backend ready |

### 3.3 AR menu experience (differentiator)

- Each menu item can carry a **3D model** (`glb`, `usdz`, `poster`).
- Diners open the AR viewer from a dish to see it in 3D / place it on their table.
- **AR views are tracked** per item (`arViews`) and surfaced in analytics.

---

## 4. Functional Requirements

### 4.1 Authentication & accounts

- Users can **register** (name, email, password ≥ 6 chars, optional phone).
- Users can **log in** and receive `{ user, accessToken, refreshToken }`.
- Separate **admin login** restricted to `admin` / `superadmin` roles.
- **JWT access token** on the `Authorization: Bearer` header for protected calls.
- **Refresh tokens** stored in Redis (one active per user, rotated on refresh);
  client auto-refreshes on 401 and retries the original request.
- Users can **fetch** (`/auth/me`) and **update** (`/auth/profile`) their profile
  (name, phone, preferences: language + notifications).
- **Logout** invalidates the refresh token server-side.

### 4.2 Menu & catalog

- Menu items belong to a **restaurant** and a **category**, and carry: price,
  discounted price, images, thumbnail, 3D model, type (veg/non-veg), spice level,
  prep time, calories, serving size, ingredients, allergens, nutrition facts,
  tags, availability, flags (featured/recommended/new), rating, review count,
  order count, AR views, and customizations (option groups with prices).
- Public read endpoints: full menu, **featured**, **recommended**, single item.
- Admin write endpoints: create/update/delete, image upload, 3D model upload.
- **AR view** recorded via `POST /api/menu/{id}/ar-view`.

### 4.3 Ordering

- An order captures: order number, restaurant, customer (userId/name/phone/email),
  table number, line items (with per-line customizations), status, payment method
  & status, coupon code + discount, subtotal, tax, delivery charges, total,
  special instructions, estimated prep time, and a **status timeline**.
- Coupon validation endpoint returns the computed discount for a subtotal.
- Order status is updatable by admin, appending to the timeline.
- Orders are **trackable by order number** without authentication.

### 4.4 Coupons

- Types: `percentage` or flat `value`, with `minimumOrder`, optional
  `maximumDiscount`, `usageLimit` / `usedCount`, validity window, and optional
  scoping to specific items or categories.

### 4.5 Reviews

- Reviews attach to a menu item (and optionally an order), carry a 1–5 rating,
  comment, and up to N images (multipart upload).
- Submitting a review **recomputes the item's average rating** and review count.
- Moderation flags: `isVerified`, `isApproved`.

### 4.6 Restaurants (tenants)

- A restaurant has slug, branding (logo/cover/theme colors), description, cuisine
  list, address (with coordinates), contact, timings, **tables** (number,
  capacity, QR code, active), rating, feature flags (AR / online ordering /
  reservations), social links, GSTIN, tax rate, delivery charges, minimum order,
  and owner.
- Public lookup by **slug**; QR codes generated per table.

### 4.7 Analytics

- Dashboard summary, revenue over time, and top items per restaurant
  (admin-only).

---

## 5. Non-Functional Requirements

| Area | Requirement |
|---|---|
| **Performance** | Menu/home first meaningful paint fast on mobile; lazy-loaded images; API reads cacheable |
| **Availability** | Client **degrades gracefully** — falls back to local mock data when the backend is unreachable (menu, restaurant, and auth demo session) |
| **Security** | BCrypt password hashing, JWT with separate access/refresh secrets (≥ 32 bytes), RBAC on every write, refresh-token rotation, CORS locked to `CLIENT_URL` |
| **Multi-tenancy** | Every catalog/order/analytics entity is scoped by `restaurantId` |
| **Responsiveness** | Mobile-first; works from a phone browser via QR with no install |
| **Accessibility** | Semantic controls, ARIA labels, keyboard-operable, light/dark themes |
| **Media** | Images and 3D models stored on Cloudinary; raw GLB/USDZ supported |
| **Observability** | Health endpoint (`/health`); standard `{ success, message, data }` envelope |

---

## 6. Technical Architecture

### 6.1 Frontend (`/client`)

- **React 19 + Vite 8**, **Tailwind CSS 4**, **Framer Motion** for animation.
- **AR/3D:** `three`, `@react-three/fiber`, `@react-three/drei`.
- **Routing:** `react-router-dom` 7.
- **Data:** `axios` (JWT interceptor + auto-refresh), `@tanstack/react-query`
  available, `zustand` available for state.
- **Extras:** `recharts` (analytics), `qrcode` / `react-qr-code`, `swiper`,
  `react-hook-form`, `react-hot-toast`, `react-helmet-async`, `date-fns`.
- **State contexts:** `RestaurantContext` (cart/theme/totals), `UIContext`
  (drawers/modals), `AuthContext` (user/session).

Key routes: `/` (home), `/menu`, `/menu/:id`, `/ar/:id`, `/cart`, `/checkout`,
`/profile`.

### 6.2 Backend (`/server-java`)

- **Spring Boot 3.3, Java 21.**
- **PostgreSQL** with **JSONB** columns for embedded documents (address, tables,
  order items, timeline, nutrition, customizations, etc.); IDs are **UUID**.
- **Spring Security + JWT** (access + refresh), **BCrypt**.
- **Redis** for refresh-token storage (rotated on use).
- **Cloudinary** for image + 3D model uploads.
- **ZXing** for QR-code generation (base64 data-URL).
- Standard response envelope: `{ success, message, data, pagination? }`.

**Domains:** `auth`, `user`, `restaurant`, `category`, `menu`, `order`,
`coupon`, `review`, `analytics`.

> Note: A legacy **Node/Express + MongoDB** backend exists in `/server` and is
> **superseded** by `/server-java`; it can be removed post-migration.

### 6.3 API surface (summary)

| Group | Endpoints |
|---|---|
| **Auth** | `POST /register`, `/login`, `/admin/login`, `/refresh`, `/logout`; `GET /me`; `PUT /profile` |
| **Menu** | `GET /restaurant/{id}`, `/restaurant/{id}/featured`, `/restaurant/{id}/recommended`, `/{id}`; `POST` (create), `PUT /{id}`, `DELETE /{id}`; `POST /{id}/images`, `/{id}/model`, `/{id}/ar-view` |
| **Categories** | `GET /restaurant/{id}`; `POST`; `PUT /reorder`, `/{id}`; `POST /{id}/image`; `DELETE /{id}` |
| **Orders** | `POST` (create); `GET /restaurant/{id}`, `/track/{orderNumber}`, `/{id}`; `PUT /{id}/status`; `POST /validate-coupon` |
| **Restaurants** | `GET /slug/{slug}`, `/{id}`, `/{id}/qr-codes`, `/{restaurantId}/qr/{tableNumber}`; `POST`; `PUT /{id}`; `POST /{id}/images` |
| **Reviews** | `GET /menu-item/{id}`; `POST` (multipart); `DELETE /{id}` |
| **Analytics** | `GET /restaurant/{id}/dashboard`, `/revenue`, `/top-items` |
| **System** | `GET /health` |

---

## 7. User Flows

### 7.1 Diner: scan → order
1. Scan table QR → lands on restaurant menu (table number captured).
2. Browse by category / search; open a dish for detail.
3. (Optional) Open **AR viewer** to preview the dish in 3D.
4. Add items to cart; apply a coupon.
5. Checkout: confirm table, choose payment, review, place order.
6. Track order status via order number.

### 7.2 Diner: account
1. Tap profile → sign in or register.
2. Edit name/phone, set language & notification preferences, save.
3. Session persists (tokens in storage; auto-refresh on expiry).

### 7.3 Admin: manage & measure
1. Admin login.
2. Manage menu items (incl. image/3D uploads), categories, coupons.
3. Generate/print table QR codes.
4. Monitor orders and update statuses.
5. Review analytics (revenue, orders, AR views, top items).

---

## 8. Success Metrics

| Metric | Why it matters |
|---|---|
| **AR view → add-to-cart conversion** | Validates the core AR differentiator |
| **Average order value (AOV)** | Does richer menu presentation upsell? |
| **Time from scan to order placed** | Frictionless ordering |
| **Order accuracy / error rate** | Self-ordering reduces mistakes |
| **Menu self-edit frequency (operators)** | Self-serve adoption |
| **Active restaurants / retention** | SaaS health |

---

## 9. Open Questions & Future Work

- **Admin UI in the client:** backend admin endpoints exist; a dedicated
  admin dashboard UI in the React app is the next major build-out.
- **Payments:** payment method is captured, but real payment-gateway
  integration (UPI/card capture, settlement) is not yet wired.
- **Table reservations:** feature flag present, not implemented.
- **Favorites UX:** the data model supports favorites; surfacing them in the UI
  is pending.
- **Real-time order updates:** consider websockets/SSE for live kitchen/diner
  status instead of polling.
- **Backend consolidation:** remove the legacy Node/`/server` backend.
- **Internationalization:** preference stores a language; UI strings are not yet
  localized.

---

## 10. Appendix — Data Model Highlights

- **User:** name, email, password (hashed), phone, role, avatar, restaurantId,
  isActive, lastLogin, **preferences** (language, notifications), **favorites**,
  timestamps.
- **MenuItem:** pricing, media (images + `model3d`), dietary info, nutrition,
  customizations, engagement counters (`rating`, `totalOrders`, `arViews`).
- **Order:** customer, table, line items w/ customizations, status + timeline,
  payment, coupon, computed totals.
- **Restaurant:** branding/theme, address+coordinates, timings, **tables w/ QR**,
  tax/delivery config, feature flags, owner.
- **Coupon:** type/value, min-order, max-discount, usage limits, validity,
  item/category scoping.
- **Review:** rating, comment, images, moderation flags; recomputes item rating.
