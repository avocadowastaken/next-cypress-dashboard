import { createPageResponse, PageInput } from "@/core/data/PageResponse";
import { createApiHandler, getRequestSession } from "@/core/helpers/Api";
import { prisma } from "@/core/helpers/db";
import { Prisma } from "@prisma/client";
import { serialize } from "superjson";

export default createApiHandler((app) => {
  app.addHook("preSerialization", (request, reply, payload, done) => {
    try {
      done(null, serialize(payload));
    } catch (e) {
      done(e);
    }
  });

  app.get<{ Querystring: PageInput }>(
    "/api/projects",
    async (request, reply) => {
      const { userId } = await getRequestSession(request);
      const where: Prisma.ProjectWhereInput = {
        users: { some: { id: userId } },
      };
      const response = await createPageResponse(request.query, {
        maxNodesPerPage: 10,
        defaultNodesPerPage: 5,
        getCount: () => prisma.project.count({ where }),
        getNodes: (args) =>
          prisma.project.findMany({
            ...args,
            where,
            orderBy: { createdAt: "desc" },
          }),
      });

      reply.send(response);
    }
  );
});
