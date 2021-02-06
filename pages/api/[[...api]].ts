import { createApiHandler } from "@/api/ApiHandler";
import { prisma } from "@/api/db";

export default createApiHandler((app) => {
  app.get<{
    Reply: {
      projects: { count: number };
    };
  }>("/api/health", async (request, reply) => {
    const projectsCount = await prisma.project.count();

    reply.send({
      projects: { count: projectsCount },
    });
  });
});
