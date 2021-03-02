import { PrismaClient } from "@prisma/client";
import debug from "debug";

export const prisma = createPrisma();

function createPrisma(): PrismaClient {
  if (process.env.NODE_ENV === "production") {
    const logInfo = debug("app:db:info");
    const logError = debug("app:db:error");
    const logWarning = debug("app:db:warn");

    const prismaClient = new PrismaClient({
      log: [
        { emit: "event", level: "error" },
        { emit: "event", level: "info" },
        { emit: "event", level: "warn" },
      ],
    });

    prismaClient.$on("error", ({ message }) => {
      logError(message);
    });

    prismaClient.$on("info", ({ message }) => {
      logInfo(message);
    });

    prismaClient.$on("warn", ({ message }) => {
      logWarning(message);
    });

    return prismaClient;
  }

  // Ensure the previous prisma instance is disconnected.
  if ("prisma" in globalThis && "$disconnect" in globalThis["prisma"]) {
    void globalThis["prisma"].$disconnect();
  }

  globalThis["prisma"] = new PrismaClient({
    log: ["info", "query", "warn", "error"],
  });

  return globalThis["prisma"];
}
