import { prisma } from "api/db";
import { createAPIRequestHandler } from "api/http/APIRequestHandler";

export default createAPIRequestHandler({
  get: (req, _) => {
    const projectId = req.query.projectId as string;

    const project = prisma.project.findUnique({ where: { id: projectId } });

    if (!project) {
    }
  },
  delete: () => {},
});
