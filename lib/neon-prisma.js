import { PrismaClient } from "@prisma/client";

// Separate Prisma client for Neon database (used for credits/Clerk-linked data)
const neonDatabaseUrl = process.env.NEON_DATABASE_URL;

const globalForNeonPrisma = globalThis;

export const neonDb =
  globalForNeonPrisma.neonPrisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: neonDatabaseUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForNeonPrisma.neonPrisma = neonDb;
}
