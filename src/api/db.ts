import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export const prisma = new PrismaClient();

// See https://www.prisma.io/docs/concepts/components/prisma-client/error-reference#error-codes
function isPrismaClientKnownRequestError(
  error: unknown
): error is PrismaClientKnownRequestError {
  return error instanceof PrismaClientKnownRequestError;
}

export function isUniqueConstraintError(error: unknown): boolean {
  return isPrismaClientKnownRequestError(error) && error.code === "P2002";
}
