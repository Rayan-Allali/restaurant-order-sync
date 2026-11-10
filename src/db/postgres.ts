
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../config/EnvProvider";
import { ordersSchema } from "./schema/postgres/orders";

export const pgPool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

export const pgDb = drizzle(pgPool,{ schema: {
  orders: ordersSchema,
} });

export async function checkPostgresConnection(): Promise<void> {
  await pgPool.query("SELECT 1");
  console.log("🟢 Neon PostgreSQL connected");
}

pgPool.on("error", (error) => {
  console.error("PostgreSQL pool error:", error);
});