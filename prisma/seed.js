"use strict";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({ log: ["info", "query", "warn", "error"] });

async function main() {
  await prisma.project.upsert({
    create: {
      id: "next-cypress-dashboard",
      org: "umidbekk",
      providerId: "github",
      repo: "next-cypress-dashboard",
      secrets: { create: {} },
    },
    update: { id: "next-cypress-dashboard" },
    where: {
      org_repo_providerId: {
        org: "umidbekk",
        providerId: "github",
        repo: "next-cypress-dashboard",
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
