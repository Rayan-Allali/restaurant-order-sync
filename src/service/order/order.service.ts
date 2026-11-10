import { eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import { ordersSchema } from "../../db/schema/sqlite/orders";
import { sqliteDb } from "../../db/sqlite";
import type { OrderI, OrderStatus } from "../../types/order.type";
import { OrderSyncWorker } from "../orderSyncWorker/orderSyncWorker";

type CreateOrderInput = Pick<OrderI, "items" | "totalAmount">;

type UpdateOrderInput = Partial<
  Pick<OrderI, "items" | "totalAmount" | "status">
>;

export class OrderService {
  static async createOrder(order: CreateOrderInput) {
    const now = Date.now();

    const [newOrder] = await sqliteDb
      .insert(ordersSchema)
      .values({
        ...order,
        id: randomUUID(),
        status: "new",
        createdAt: now,
        updatedAt: now,
        syncStatus: "pending",
        version: 1,
        lastSyncedAt: null,
      })
      .returning();
    OrderSyncWorker.triggerSync();
    return newOrder;
  }

  static async updateOrder(id: string, updateData: UpdateOrderInput) {
    const [updatedOrder] = await sqliteDb
      .update(ordersSchema)
      .set({
        ...updateData,
        updatedAt: Date.now(),
        syncStatus: "pending",
        version: sql`${ordersSchema.version} + 1`,
      })
      .where(eq(ordersSchema.id, id))
      .returning();
    if (updatedOrder) {
      OrderSyncWorker.triggerSync();
    }
    return updatedOrder ?? null;
  }

  static async updateOrderStatus(id: string, status: OrderStatus) {
    return this.updateOrder(id, { status });
  }

  static async getOrderById(id: string) {
    const [order] = await sqliteDb
      .select()
      .from(ordersSchema)
      .where(eq(ordersSchema.id, id))
      .limit(1);

    return order ?? null;
  }

  static async getAllOrders() {
    return await sqliteDb.select().from(ordersSchema);
  }
}
