import { createApiHandler } from "@/api/ApiHandler";
import { prisma } from "@/api/db";
import { Prisma } from "@prisma/client";

export default createApiHandler((app) => {
  app.get<{
    Reply: {
      projects: { count: number; fields: string[] };
    };
  }>("/api/health", async (request, reply) => {
    const projectsCount = await prisma.project.count();

    reply.send({
      projects: {
        count: projectsCount,
        fields: Object.keys(Prisma.ProjectScalarFieldEnum),
      },
    });
  });
});
