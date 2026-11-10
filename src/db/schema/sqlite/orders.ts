import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";
import { ORDER_STATUSES, type OrderItem } from "../../../types/order.type";

export const ordersSchema = sqliteTable("orders", {
  id: text("id").primaryKey().notNull(),
  items: text("items", { mode: "json" }).$type<OrderItem[]>().notNull(),
  totalAmount: integer("total_amount").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
  status: text("status", { enum: ORDER_STATUSES }).notNull().default("new"),
  syncStatus: text("sync_status", { enum: ["pending", "synced"] }).notNull().default("pending"),
  lastSyncedAt: integer("last_synced_at"),
  version: integer("version").notNull().default(0),
});