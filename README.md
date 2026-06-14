# iPhone Marketplace

A single-tenant iPhone store. **Admins** manage the iPhone catalog (CRUD); **users** browse and buy.
There is **no payment gateway** — buyers pay by bank transfer and upload a *bukti transfer* (transfer
receipt); an admin reviews it and confirms or rejects the order.

---

## 1. Roles & Permissions

| Capability                          | Guest | User | Admin |
| ----------------------------------- | :---: | :--: | :---: |
| Browse catalog / view an iPhone     |   ✅   |  ✅  |   ✅   |
| Register / sign in                  |   ✅   |  —   |   —   |
| Place an order                      |   —   |  ✅  |   ✅   |
| Upload bukti transfer for own order |   —   |  ✅  |   ✅   |
| Cancel own pending order            |   —   |  ✅  |   ✅   |
| View own orders                     |   —   |  ✅  |   ✅   |
| Create / edit / delete iPhones      |   —   |  —   |   ✅   |
| View **all** orders                 |   —   |  —   |   ✅   |
| Confirm / reject / complete orders  |   —   |  —   |   ✅   |

Two roles only: `user` (default on signup) and `admin`. The role lives on `user.role`.
Authorization is enforced **twice**: in the route `beforeLoad` (for UX redirects) and on the oRPC
procedure (`adminProcedure` / `protectedProcedure`, the authoritative check).

---

## 2. iPhone Condition Rules

An iPhone is either **new** or **second** (pre-owned):

- `condition: "new"` → `conditionPercentage` **must be null**.
- `condition: "second"` → `conditionPercentage` **must be 1–100** (e.g. `98` for 98% condition).

This rule is enforced in one place — `application/iphone/iphone-condition-rule.ts` — and reused by
both the create and update use-cases. Second-hand prices in the seed are discounted in proportion to
their condition percentage.

---

## 3. Order Flow

```
                 user places order
                        │
                        ▼
                ┌─────────────────┐
                │ pending_payment │◀──────────────┐
                └─────────────────┘               │
              user uploads bukti transfer         │ admin rejects
                        │                          │ (with reason)
                        ▼                          │
                ┌─────────────────┐                │
                │ payment_review  │────────────────┘
                └─────────────────┘
                  │             ▲
     admin confirms│            │ (re-upload after rejection
     (stock −qty)  │            │  goes back to payment_review)
                   ▼
            ┌───────────┐   admin    ┌───────────┐
            │ confirmed │──────────▶ │ completed │
            └───────────┘ completes  └───────────┘

  user may cancel only while `pending_payment` → cancelled
```

- **Stock is only decremented when the admin confirms** the payment (atomic `decreaseStock`), so a
  pending/abandoned order never holds inventory. If stock ran out in the meantime, confirmation fails
  with `CONFLICT`.
- A rejected order can have a new receipt uploaded, returning it to `payment_review`.

---

## 4. Architecture

Hexagonal (clean) architecture. Dependencies point **inward**; the domain knows nothing about
frameworks.

```
apps/api/src/
  domain/          pure types + repository/port interfaces (no framework imports)
  application/     use-cases as makeX(deps) factories + shared errors/context/rules
  infrastructure/  concrete adapters: drizzle, better-auth, local file storage, env, logger
  presentation/    oRPC context/middleware/routers + the upload HTTP route + main.ts
```

**File-responsibility rule:** every file owns **1–3 responsibilities**, max. CRUD is split — e.g. the
iPhone repository is composed from `iphone-read-queries.ts`, `iphone-write-commands.ts`,
`iphone-stock-command.ts`, and a `iphone-row-mapper.ts`. Use-cases are one operation per file
(`create-iphone.ts`, `place-order.ts`, `confirm-order.ts`, …). Names are self-documenting.

The web app imports **types only** from `@saas/api`; all runtime calls go over HTTP (`/rpc`, `/api`).

---

## 5. Tech Stack

| Layer      | Tech                                                           |
| ---------- | ------------------------------------------------------------- |
| Monorepo   | moon + pnpm workspaces                                        |
| Backend    | Hono + oRPC, Drizzle ORM (PostgreSQL), better-auth            |
| Frontend   | React 19 + TanStack Router (file-based) + Vite + Tailwind v4  |
| Data fetch | TanStack Query + oRPC client (typed end-to-end via `@saas/api`) |
| Storage    | Local disk for bukti-transfer images (served at `/uploads`)  |
| Lint       | Biome (tabs, double quotes, semicolons as-needed)            |

---

## 6. Project Layout

```
apps/
  api/   @saas/api — backend (domain / application / infrastructure / presentation)
  web/   @saas/web — SPA (routes / components / libs)
.moon/   workspace + toolchain + shared tasks
docker-compose.dev.yml   Postgres for local dev
```

Routing pairs a layout file with a sibling folder: `_authenticated.tsx` (auth guard) +
`_authenticated/`, and `admin.tsx` (admin guard) + `admin/`. Underscore folders
(`_components`, `_apis`, `_hooks`) are invisible to the router.

---

## 7. Local Setup

### Prerequisites
- Node 22+, pnpm 10+, Docker (for Postgres)

### Steps

```bash
# 1. Start Postgres
docker compose -f docker-compose.dev.yml up -d

# 2. Create your env file
cp .env.example .env
#    then set BETTER_AUTH_SECRET — generate one with:  openssl rand -hex 32

# 3. Install dependencies
pnpm install

# 4. Create the database schema
pnpm db:push

# 5. Seed accounts + the iPhone catalog (models 10–17, new + second)
pnpm db:seed

# 6. Run API (:3001) and web (:3000)
pnpm dev
```

Open http://localhost:3000.

### Seeded accounts

| Role  | Email              | Password    |
| ----- | ------------------ | ----------- |
| Admin | admin@iphone.test  | admin12345  |
| User  | user@iphone.test   | user12345   |

The seed is idempotent — re-running `pnpm db:seed` will not duplicate the catalog.

---

## 8. Commands

| Command            | Description                                |
| ------------------ | ------------------------------------------ |
| `pnpm dev`         | Run API + web in watch mode                |
| `pnpm build`       | Build both apps                            |
| `pnpm check`       | Biome format + lint check                  |
| `pnpm db:push`     | Apply schema to the database (dev)         |
| `pnpm db:generate` | Generate a committed SQL migration         |
| `pnpm db:migrate`  | Run committed migrations (prod entrypoint) |
| `pnpm db:seed`     | Seed accounts + iPhone catalog             |

---

## 9. Key Conventions

1. Web imports **types only** from `@saas/api` — never runtime symbols.
2. Domain stays framework-free (no drizzle / hono / better-auth imports).
3. Use-cases receive dependencies as a parameter — never import `db`/`auth` directly.
4. All oRPC inputs validated with Zod; env validated with Zod at startup.
5. Authorization in two places: route `beforeLoad` (UX) **and** the procedure (authoritative).
6. Every file: 1–3 responsibilities, self-documenting names, `.ts`/`.tsx` extensions in imports.
```
