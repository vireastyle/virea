import path from "node:path";
import { defineConfig } from "prisma/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrate: {
    async adapter() {
      // Migrations must use the direct (non-pooled) connection — poolers
      // don't support DDL statements needed for schema changes.
      return new PrismaNeon({
        connectionString: process.env.DIRECT_URL,
      });
    },
  },
});
