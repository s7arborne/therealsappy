import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

// To switch to Postgres for production:
//   npm install @prisma/adapter-pg pg @types/pg
//   import { PrismaPg } from "@prisma/adapter-pg"
//   Replace the adapter below with: new PrismaPg({ connectionString: process.env.DATABASE_URL })
function createClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";
  const filePart = dbUrl.replace(/^file:/, "");
  const url = path.isAbsolute(filePart) ? filePart : path.resolve(process.cwd(), filePart);
  const adapter = new PrismaBetterSqlite3({ url });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any);
}

// In dev, attach to global to survive HMR without leaking connections.
// In prod, create fresh per server instance.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = (() => {
  if (process.env.NODE_ENV === "production") return createClient();
  if (!globalForPrisma.prisma) globalForPrisma.prisma = createClient();
  return globalForPrisma.prisma;
})();
