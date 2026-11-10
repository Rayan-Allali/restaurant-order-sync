import { and, eq, asc } from "drizzle-orm";

import { sqliteDb } from "../../db/sqlite";
import { ordersSchema as localOrders } from "../../db/schema/sqlite/orders";

import { pgDb } from "../../db/postgres";
import { ordersSchema as cloudOrders } from "../../db/schema/postgres/orders";
import { getErrorMessage } from "../../utils/getErrorMessage";

export class OrderSyncWorker {
  private static isStarted = false;
  private static isRunning = false;
  private static syncRequestedWhileRunning = false;

  private static retryTimer: NodeJS.Timeout | null = null;

  private static readonly INITIAL_RETRY_DELAY_MS = 5_000;
  private static readonly MAX_RETRY_DELAY_MS = 5 * 60 * 1000;

  private static retryDelayMs = this.INITIAL_RETRY_DELAY_MS;

  static start() {
    if (this.isStarted) return;

    this.isStarted = true;

    console.log("Order sync worker started");

    this.triggerSync();
  }

  static stop() {
    this.isStarted = false;

    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }

    console.log("Order sync worker stopped");
  }

  static triggerSync() {
    if (!this.isStarted) return;

    if (this.isRunning) {
      this.syncRequestedWhileRunning = true;
      return;
    }

    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }

    void this.syncPendingOrders();
  }

  private static scheduleRetry() {
    if (!this.isStarted || this.retryTimer) return;

    const delay = this.retryDelayMs;

    console.log(`Next sync attempt in ${delay / 1000} seconds`);

    this.retryTimer = setTimeout(() => {
      this.retryTimer = null;
      this.triggerSync();
    }, delay);

    this.retryDelayMs = Math.min(
      this.retryDelayMs * 2,
      this.MAX_RETRY_DELAY_MS,
    );
  }
  static getStatus() {
    return {
      isRunning: this.isRunning,
      isStarted: this.isStarted,
    };
  }
  private static async syncPendingOrders() {
    if (this.isRunning || !this.isStarted) return;

    this.isRunning = true;

    let failed = false;

    try {
      const pendingOrders = await sqliteDb
        .select()
        .from(localOrders)
        .where(eq(localOrders.syncStatus, "pending"))
        .orderBy(asc(localOrders.createdAt));

      for (const order of pendingOrders) {
        const syncedVersion = order.version;

        await pgDb
          .insert(cloudOrders)
          .values({
            id: order.id,
            items: order.items,
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
          })
          .onConflictDoUpdate({
            target: cloudOrders.id,
            set: {
              items: order.items,
              totalAmount: order.totalAmount,
              status: order.status,
              updatedAt: order.updatedAt,
            },
          });

        const result = sqliteDb
          .update(localOrders)
          .set({
            syncStatus: "synced",
            lastSyncedAt: Date.now(),
          })
          .where(
            and(
              eq(localOrders.id, order.id),
              eq(localOrders.version, syncedVersion),
              eq(localOrders.syncStatus, "pending"),
            ),
          )
          .run();

        if (result.changes === 0) {
          console.log(`Order ${order.id} changed during synchronization.`);
          continue;
        }

        console.log(`Order ${order.id} synchronized successfully.`);
      }

      this.retryDelayMs = this.INITIAL_RETRY_DELAY_MS;
    } catch (error) {
      failed = true;
      console.error(`[Sync] Failed: ${getErrorMessage(error)}`);
    } finally {
      this.isRunning = false;

      if (this.isStarted) {
        if (failed) {
          this.scheduleRetry();
        } else if (this.syncRequestedWhileRunning) {
          this.syncRequestedWhileRunning = false;
          this.triggerSync();
        }
      }
    }
  }
}
