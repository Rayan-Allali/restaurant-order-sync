import {
  pgTable,
  uuid,
  integer,
  bigint,
  jsonb,
  text,
} from "drizzle-orm/pg-core";

import { ORDER_STATUSES, type OrderItem } from "../../../types/order.type";

export const ordersSchema = pgTable("orders", {
  id: uuid("id").primaryKey().notNull(),

  items: jsonb("items").$type<OrderItem[]>().notNull(),

  totalAmount: integer("total_amount").notNull(),

  status: text("status", {
    enum: ORDER_STATUSES,
  })
    .notNull()
    .default("new"),

  createdAt: bigint("created_at", { mode: "number" }).notNull(),

  updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
});