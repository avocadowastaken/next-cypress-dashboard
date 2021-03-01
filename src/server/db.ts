import { PrismaClient } from "@prisma/client";

export const prisma = createPrisma();

function createPrisma(): PrismaClient {
  if (process.env.NODE_ENV === "production") {
    return new PrismaClient({
      log: [
        { emit: "event", level: "query" },
        { emit: "stdout", level: "error" },
        { emit: "stdout", level: "info" },
        { emit: "stdout", level: "warn" },
      ],
    });
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
