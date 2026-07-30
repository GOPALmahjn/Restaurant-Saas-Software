# Restaurant AR — Java / Spring Boot Backend

A Java (Spring Boot 3.3, Java 21) rewrite of the original Node/Express backend.
It replaces MongoDB with **PostgreSQL**, adds **JWT auth with RBAC**, uses
**Redis (Cloud)** for refresh-token storage, and **Cloudinary** for image / 3D
model uploads. The REST contract (paths + `{ success, message, data }` envelope)
matches what the React client (`../client`) expects.

## Tech stack

| Concern            | Choice                                             |
|--------------------|----------------------------------------------------|
| Language / runtime | Java 21, Spring Boot 3.3                            |
| Database           | PostgreSQL (JSONB for embedded documents)          |
| Auth               | Spring Security + JWT (access + refresh), BCrypt    |
| RBAC roles         | `customer`, `admin`, `superadmin`                  |
| Refresh tokens     | Redis (one active token per user, rotated on use)  |
| File storage       | Cloudinary (images + raw GLB/USDZ models)          |
| QR codes           | ZXing (base64 data-URL, same as the Node version)  |

## Prerequisites

- JDK 21+ (the Maven wrapper `./mvnw` downloads Maven itself)
- PostgreSQL and Redis — either your own / cloud instances, or run the bundled
  `docker compose up -d` (starts Postgres on 5432 and Redis on 6379).

## Configuration

Copy `.env.example` to `.env` and fill it in (loaded automatically via
`spring-dotenv`). Key variables:

- `POSTGRES_URL`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
- `REDIS_URL` — for Redis Cloud use `rediss://default:<password>@<host>:<port>`
- `JWT_SECRET`, `JWT_REFRESH_SECRET` (≥ 32 bytes each)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `CLIENT_URL` — CORS origin + base for generated QR links
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` — seeded super-admin on first startup

## Run

```bash
docker compose up -d        # optional: local postgres + redis
./mvnw spring-boot:run      # starts on http://localhost:5000
```

Health check: `GET http://localhost:5000/health`

On first boot the schema is created (`ddl-auto: update`) and a super-admin is
seeded from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## Auth flow

- `POST /api/auth/register | /login | /admin/login` → `{ user, accessToken, refreshToken }`
- Send `Authorization: Bearer <accessToken>` on protected calls.
- `POST /api/auth/refresh` with `{ "refreshToken": "..." }` → new `{ accessToken, refreshToken }`
  (validated against Redis; the old refresh token is invalidated).
- `POST /api/auth/logout` clears the refresh token from Redis.

RBAC is enforced in `SecurityConfig`: public reads (menu / categories /
restaurant / reviews / order tracking), authenticated user routes (`/me`,
`/profile`, order-by-id), and admin-only writes / analytics.

## Notable differences from the Node version

These are intentional adaptations to Postgres/Java; the client contract is
preserved:

1. **IDs are UUID strings** (Postgres `uuid`) instead of Mongo ObjectIds.
2. **Embedded documents** (address, tables, customizations, order items,
   timeline, nutrition, etc.) are stored as **JSONB** columns.
3. **Create / update** of menu items, categories and restaurants take a **JSON
   body**; binary uploads use dedicated multipart endpoints that return the
   stored URL:
   - `POST /api/menu/{id}/images`, `POST /api/menu/{id}/model`
   - `POST /api/categories/{id}/image`
   - `POST /api/restaurants/{id}/images`
   (Reviews still accept `multipart/form-data` with `images`, matching the
   original route.)
4. **Refresh tokens** live in Redis, not on the user row.
5. Admin **order search** matches on order number (Postgres JSONB customer
   search was left out for simplicity).

The original Node backend in `../server` is superseded by this project and can
be removed once you've migrated.
