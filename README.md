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

### 3. Database: migrate and seed

Apply migrations (creates `dev.db` from `DATABASE_URL` and generates the Prisma Client):

```bash
npx prisma migrate dev
```

Then load demo content:

```bash
npm run db:seed
```

(`npm run db:seed` runs `prisma db seed`, which executes `tsx prisma/seed.ts` as configured in `prisma.config.ts`.)

`migrate dev` is for local development. On deploy or CI, use `npx prisma migrate deploy` instead (seed is optional in production).

The seed (`prisma/seed.ts`) upserts site settings and replaces all public content (socials, updates, projects, games, watched films, thoughts). Safe to re-run anytime you want fresh demo data.

### 4. Run the app

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) (path follows `ADMIN_PATH`)

## Reset the database from scratch

To drop the database, re-apply migrations, and re-seed in one step:

```bash
npx prisma migrate reset
```

This drops `dev.db`, runs all migrations in `prisma/migrations`, then runs the seed from `prisma.config.ts` automatically.

To reset without the interactive prompt:

```bash
npx prisma migrate reset --force
```

`dev.db` is gitignored. You can also delete it manually, then run `npx prisma migrate dev` followed by `npm run db:seed`.

To refresh demo content without dropping the schema:

```bash
npm run db:seed
```

## Prisma reference

Prisma 7 reads project config from `prisma.config.ts` (datasource URL and seed command). Models live in `prisma/schema.prisma`.

| Task | Command |
|------|---------|
| Apply migrations (dev) | `npx prisma migrate dev` |
| Apply migrations (prod / CI) | `npx prisma migrate deploy` |
| Regenerate client after schema changes | `npx prisma generate` |
| Seed demo data | `npm run db:seed` or `npx prisma db seed` |
| Reset DB + migrate + seed | `npx prisma migrate reset` |
| Browse data | `npx prisma studio` |
| Migration status | `npx prisma migrate status` |

Seed command is defined under `migrations.seed` in `prisma.config.ts` (not `package.json`).

### Schema overview

- **SiteSettings** — name, tagline, intro markdown, feature toggles
- **Social** — social / contact links
- **Update**, **Project**, **Game**, **Watched**, **Thought** — public page content

The app uses `@prisma/adapter-better-sqlite3` with a file URL from `DATABASE_URL`. Both the app and `prisma/seed.ts` use the shared client in `src/lib/db.ts`.

### Switching to Postgres (production)

1. In `prisma/schema.prisma`, set `provider = "postgresql"` on the datasource.
2. Set `DATABASE_URL` to your Postgres connection string in `.env`.
3. Install the Postgres adapter and driver: `@prisma/adapter-pg`, `pg`, `@types/pg`.
4. Update `src/lib/db.ts` to use `PrismaPg` instead of `PrismaBetterSqlite3` (see comments in `src/lib/db.ts`). The seed script imports that client automatically.
5. Run `npx prisma migrate dev` (or `deploy`) against the new database.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run db:seed` | Run `prisma/seed.ts` via `prisma db seed` |

## Project layout

```
prisma/
  schema.prisma      # models
  migrations/        # SQL migrations
  seed.ts            # demo data (run via npm run db:seed)
prisma.config.ts     # datasource URL, migration path, seed command
src/
  app/(public)/      # public pages
  app/admin/         # admin dashboard + login
  lib/db.ts          # Prisma client (SQLite adapter)
scripts/
  hash-password.ts   # admin password hash helper
```

## Deploy

Set the same environment variables on your host (especially `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_PASSWORD_HASH`, and `SITE_URL`). Run `npx prisma migrate deploy` as part of your build or release step before starting the app. Run `npm run db:seed` only if you want to populate an empty database with demo content (usually not needed in production).

For a hosted SQLite file, ensure the process can read and write the path in `DATABASE_URL`. For production traffic, Postgres is recommended (see above).
