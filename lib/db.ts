import { PrismaClient } from "@prisma/client";

export const prisma = createPrisma();

function createPrisma(): PrismaClient {
  if (process.env.NODE_ENV === "production") {
    return new PrismaClient({
      log: ["info", "query", "warn", "error"],
    });
  }

  // Ensure the previous prisma instance is disconnected.
  if ("prisma" in globalThis && "$disconnect" in globalThis["prisma"]) {
    // Wait for pending requests to complete
    setTimeout(() => {
      void globalThis["prisma"].$disconnect();
    }, 10 * 1000);
  }

  globalThis["prisma"] = new PrismaClient({
    errorFormat: "pretty",
    log: ["info", "query", "warn", "error"],
  });

  return globalThis["prisma"];
}
