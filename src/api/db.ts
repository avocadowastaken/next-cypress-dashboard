import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export const prisma = createPrisma();

function createPrisma(): PrismaClient {
  if (process.env.NODE_ENV === "production") {
    return new PrismaClient({ log: ["warn", "error"] });
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

// See https://www.prisma.io/docs/concepts/components/prisma-client/error-reference#error-codes
function isPrismaClientKnownRequestError(
  error: unknown
): error is PrismaClientKnownRequestError {
  return error instanceof PrismaClientKnownRequestError;
}

export function isUniqueConstraintError(error: unknown): boolean {
  return isPrismaClientKnownRequestError(error) && error.code === "P2002";
}
