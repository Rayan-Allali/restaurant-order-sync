import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { env } from "../config/EnvProvider";
import { ordersSchema } from "./schema/sqlite/orders";

const dbPath = resolve(env.SQLITE_DB_PATH);

mkdirSync(dirname(dbPath), { recursive: true });

export const sqliteClient = new Database(dbPath);
sqliteClient.pragma("journal_mode = WAL");
sqliteClient.pragma("foreign_keys = ON");
export const sqliteDb = drizzle(sqliteClient,{schema: {orders: ordersSchema}});