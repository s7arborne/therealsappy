# therealsappy

Personal site and admin dashboard built with [Next.js](https://nextjs.org), [Prisma](https://www.prisma.io), and SQLite (via the Better SQLite3 driver adapter).

## Prerequisites

- [Node.js](https://nodejs.org) 20+
- npm (or pnpm / yarn / bun)

## Start from scratch

These steps assume a fresh clone with no local database yet.

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Edit `.env` and set at least:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | SQLite file path (default `file:./dev.db`) |
| `AUTH_SECRET` | Random string (32+ chars) for admin session JWTs |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash of your admin password (see below) |
| `SITE_URL` | Public URL (e.g. `http://localhost:3000` in dev) |
| `ADMIN_PATH` | URL segment for admin routes (default `admin`) |

Generate an admin password hash:

```bash
npx tsx scripts/hash-password.ts your-password
```

Paste the printed `ADMIN_PASSWORD_HASH=...` line into `.env`. Use the escaped `$` form exactly as printed — Next.js strips unescaped `$` in `.env` values.

### 3. Database: migrate, generate client, seed

Apply migrations (creates `dev.db` from `DATABASE_URL`), generate the Prisma Client, and run the seed script:

```bash
npx prisma migrate dev
npx prisma db seed
```

`migrate dev` is for local development. On deploy or CI, use `npx prisma migrate deploy` instead.

The seed (`prisma/seed.ts`) inserts demo content: site settings, social links, updates, projects, games, watched films, and a sample thought. It is meant to run on an **empty** database (see reset below).

### 4. Run the app

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) (path follows `ADMIN_PATH`)

## Reset the database from scratch

To wipe all data, re-apply migrations, and re-seed:

```bash
npx prisma migrate reset
```

This drops the database, runs all migrations in `prisma/migrations`, then runs the seed defined in `package.json` automatically.

To reset without the interactive prompt:

```bash
npx prisma migrate reset --force
```

`dev.db` is gitignored; deleting it manually and running `npx prisma migrate dev` also works, but you must run `npx prisma db seed` afterward if you do not use `migrate reset`.

## Prisma reference

| Task | Command |
|------|---------|
| Apply migrations (dev) | `npx prisma migrate dev` |
| Apply migrations (prod) | `npx prisma migrate deploy` |
| Regenerate client after schema changes | `npx prisma generate` |
| Seed data | `npx prisma db seed` |
| Browse data | `npx prisma studio` |
| Migration status | `npx prisma migrate status` |

Configuration lives in `prisma/schema.prisma` and `prisma.config.ts` (datasource URL from `DATABASE_URL`).

### Schema overview

- **SiteSettings** — name, tagline, intro markdown, feature toggles
- **Social** — social / contact links
- **Update**, **Project**, **Game**, **Watched**, **Thought** — public page content

The app uses `@prisma/adapter-better-sqlite3` with a file URL from `DATABASE_URL`. Client setup is in `src/lib/db.ts`; the seed script mirrors that adapter setup in `prisma/seed.ts`.

### Switching to Postgres (production)

1. In `prisma/schema.prisma`, set `provider = "postgresql"` on the datasource.
2. Set `DATABASE_URL` to your Postgres connection string in `.env`.
3. Install the Postgres adapter and driver: `@prisma/adapter-pg`, `pg`, `@types/pg`.
4. Update `src/lib/db.ts` and `prisma/seed.ts` to use `PrismaPg` instead of `PrismaBetterSqlite3` (see comments in `src/lib/db.ts`).
5. Run `npx prisma migrate dev` (or `deploy`) against the new database.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |

## Project layout

```
prisma/
  schema.prisma      # models
  migrations/        # SQL migrations
  seed.ts            # demo data
src/
  app/(public)/      # public pages
  app/admin/         # admin dashboard + login
  lib/db.ts          # Prisma client (SQLite adapter)
scripts/
  hash-password.ts   # admin password hash helper
```

## Deploy

Set the same environment variables on your host (especially `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_PASSWORD_HASH`, and `SITE_URL`). Run `npx prisma migrate deploy` as part of your build or release step before starting the app.

For a hosted SQLite file, ensure the process can read and write the path in `DATABASE_URL`. For production traffic, Postgres is recommended (see above).
