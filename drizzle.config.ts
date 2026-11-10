import { defineConfig } from "drizzle-kit";
import { env } from "./src/config/EnvProvider";
import { resolve, dirname } from "node:path";
import { mkdirSync } from "node:fs";

const dbPath = resolve(env.SQLITE_DB_PATH);

mkdirSync(dirname(dbPath), { recursive: true });

export default defineConfig({
  dialect: "sqlite",
  schema:  "./src/db/schema/sqlite/orders.ts",
  out: "./drizzle/sqlite",
  dbCredentials: {
    url: dbPath,
  },
});
