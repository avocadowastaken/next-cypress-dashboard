import { createRequestHandler } from "@s/http/RequestHandler";

export default createRequestHandler(async (req, res, { db }) => {
  res.json({
    request: {
      method: req.method,
    },
    projects: {
      count: await db.prisma.project.count(),
      last: await db.prisma.project.findFirst({
        orderBy: { createdAt: "desc" },
      }),
    },
  });
});
