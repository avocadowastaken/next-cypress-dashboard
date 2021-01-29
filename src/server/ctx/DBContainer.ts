import { PrismaClient } from "@prisma/client";
import { Injectable } from "@s/utils/DI";

export class DBContainer extends Injectable {
  readonly prisma = new PrismaClient({
    log: ["info", "query", "error", "warn"],
  });
}
