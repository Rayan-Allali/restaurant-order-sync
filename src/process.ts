import { formatString } from './String'
import { ExitCodes } from './config/Errors'
import System from './settings';
import type { ICode } from './types/errors.type'
import type { Server } from "node:http";

export async function exitProcess(code: ICode, moreData: Record<string, string> = {}) {
  const exitCode = code || ExitCodes.ERROR_GENERIC
  const message = formatString(exitCode.message, moreData)
  console.error(message, { code: exitCode.code, type: 'ExitCode' })
  console.error(`📛 Exiting with code: ${exitCode.code}`)
  console.error('❌ Reason:', message)
  process.exit(exitCode.code)
}


export class ProcessManager {
  private static isShuttingDown = false;

  static register(server: Server) {
    process.on("SIGINT", () => {
      void this.shutdown(server, "SIGINT");
    });

    process.on("SIGTERM", () => {
      void this.shutdown(server, "SIGTERM");
    });
  }

  private static async shutdown(server: Server, signal: string) {
    if (this.isShuttingDown) return;

    this.isShuttingDown = true;

    console.log(`${signal} received. Shutting down...`);

    try {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });

      await System.Stop();

      console.log("Graceful shutdown completed");
      process.exit(0);
    } catch (error) {
      console.error("Shutdown failed:", error);
      process.exit(1);
    }
  }
}
