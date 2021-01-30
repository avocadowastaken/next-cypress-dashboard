import { Injectable } from "@/api/utils/DI";
import { PrismaClient } from "@prisma/client";

export class DBContainer extends Injectable {
  readonly prisma = new PrismaClient({
    log: ["info", "query", "error", "warn"],
  });
}
