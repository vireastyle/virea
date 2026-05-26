import path from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { defineConfig } from "prisma/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Prisma CLI only loads `.env`, not `.env.local`.
// Load `.env.local` manually so DIRECT_URL is available during migrations.
if (existsSync(".env.local")) {
  const content = readFileSync(".env.local", "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    // Strip surrounding quotes
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    // Don't overwrite vars already set in the environment
    if (!process.env[key]) process.env[key] = val;
  }
}

neonConfig.webSocketConstructor = ws;

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
  migrate: {
    async adapter() {
      // Migrations require the direct (non-pooled) connection —
      // poolers don't support DDL statements.
      return new PrismaNeon({
        connectionString: process.env.DIRECT_URL,
      });
    },
  },
});
