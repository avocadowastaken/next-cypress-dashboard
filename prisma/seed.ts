import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({ log: ["info", "query", "warn", "error"] });

async function main() {
  await prisma.project.createMany({
    skipDuplicates: true,
    data: {
      providerId: "github",
      org: "umidbekk",
      repo: "next-cypress-dashboard",
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
