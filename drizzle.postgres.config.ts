import { defineConfig } from "drizzle-kit";
import { env } from "./src/config/EnvProvider";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/postgres/orders.ts",
  out: "./drizzle/postgres",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});