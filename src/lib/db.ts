import { PrismaClient } from "@prisma/client";

// In dev, attach to global to survive HMR without leaking connections.
// In prod (Vercel), create a fresh client per server instance.
// DATABASE_URL must be a postgresql:// connection string (set in Vercel env vars).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = (() => {
  if (process.env.NODE_ENV === "production") return new PrismaClient();
  if (!globalForPrisma.prisma) globalForPrisma.prisma = new PrismaClient();
  return globalForPrisma.prisma;
})();
