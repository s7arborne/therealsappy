import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 (Rust-free client) requires a driver adapter.
// DATABASE_URL must be a postgresql:// connection string (set in Vercel env vars).
// In dev, attach to global to survive HMR without leaking connections.
// In prod (Vercel), create a fresh client per server instance.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const db = (() => {
  if (process.env.NODE_ENV === "production") return createClient();
  if (!globalForPrisma.prisma) globalForPrisma.prisma = createClient();
  return globalForPrisma.prisma;
})();
