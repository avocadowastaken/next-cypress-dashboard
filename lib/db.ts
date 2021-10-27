import { PrismaClient } from "@prisma/client";

export const prisma =
  process.env.NODE_ENV === "production"
    ? new PrismaClient({ log: ["info", "query", "warn", "error"] })
    : new PrismaClient({
        errorFormat: "pretty",
        log: ["info", "query", "warn", "error"],
      });
