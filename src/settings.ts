import { ExitCodes } from "./config/Errors"
import { checkPostgresConnection, pgPool } from "./db/postgres"
import { sqliteClient } from "./db/sqlite"
import { exitProcess } from "./process"
import { OrderSyncWorker } from "./service/orderSyncWorker/orderSyncWorker"

export default class System {
  private static isShuttingDown = false;
  static async ProcessError(second: number) {
    setTimeout(()=>{

      exitProcess(ExitCodes.ERROR_GENERIC, { error: 'Manual termination after timeout' })
    }, second * 1000)
  }
 static async Start() {
  console.log("System is starting...");

  sqliteClient.prepare("SELECT 1").get();

  console.log("SQLite initialized successfully");

  try {
    await checkPostgresConnection();
    console.log("PostgreSQL connection available");
  } catch (error) {
    console.warn(
      "PostgreSQL unavailable. Continuing in offline mode.",
      error,
    );
  }

  OrderSyncWorker.start();
}
 static async Stop() {
    if (this.isShuttingDown) return;

    this.isShuttingDown = true;

    console.log("System is shutting down...");

    OrderSyncWorker.stop();

    sqliteClient.close();

    await pgPool.end();

    console.log("System stopped successfully");
  }
}