import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Use WebSocket instead of raw TCP so the connection works on networks
// that block port 5432. Neon's serverless driver tunnels over port 443.
neonConfig.webSocketConstructor = ws;

function createPrismaClient() {
  // Don't throw here — Next.js imports modules at build time before env vars
  // are available. The Neon adapter will fail with a clear error at query time
  // if DATABASE_URL is missing.
  const connectionString = process.env.DATABASE_URL ?? "";

  const adapter = new PrismaNeon({ connectionString });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });
}

// Singleton — prevents connection leaks on Next.js hot-reload in dev.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
