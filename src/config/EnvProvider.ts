import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const SQLITE_DB_PATH = process.env.SQLITE_DB_PATH;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}
if (!SQLITE_DB_PATH) {
  throw new Error("SQLITE_DB_PATH environment variable is required");
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 3000),
  DATABASE_URL,
  SQLITE_DB_PATH,
} as const;

export const IN_DEVELOPMENT = env.NODE_ENV === "development";