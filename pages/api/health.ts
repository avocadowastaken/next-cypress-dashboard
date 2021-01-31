import { prisma } from "/api/db";
import { createRequestHandler } from "/api/http/RequestHandler";

export default createRequestHandler(async (req, res) => {
  const [projectsCount, lastProject] = await Promise.all([
    prisma.project.count(),
    prisma.project.findFirst({ orderBy: { createdAt: "desc" } }),
  ]);

  res.json({
    request: { method: req.method },
    projects: { count: projectsCount, last: await lastProject },
  });
});
