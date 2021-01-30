import { prisma } from "api/db";
import { createRequestHandler } from "api/http/RequestHandler";

export default createRequestHandler(async (req, res) => {
  res.json({
    request: { method: req.method },
    projects: {
      count: await prisma.project.count(),
      last: await prisma.project.findFirst({
        orderBy: { createdAt: "desc" },
      }),
    },
  });
});
