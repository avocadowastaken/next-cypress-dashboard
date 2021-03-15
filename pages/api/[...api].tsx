import { createPageResponse, PageInput } from "@/core/data/PageResponse";
import { createApiHandler, getRequestSession } from "@/core/helpers/Api";
import { prisma } from "@/core/helpers/db";
import { parseGitUrl } from "@/core/helpers/Git";
import { verifyGitHubRepoAccess } from "@/core/helpers/GitHub";
import { Prisma } from "@prisma/client";
import { deserialize, serialize } from "superjson";
import { SuperJSONResult } from "superjson/dist/types";

export default createApiHandler((app) => {
  app.addHook("preValidation", (request, reply, done) => {
    if (
      typeof request.body == "object" &&
      request.body != null &&
      "json" in request.body
    ) {
      request.body = deserialize(request.body as SuperJSONResult);
    }

    done();
  });

  app.addHook("preSerialization", (request, reply, payload, done) => {
    try {
      done(null, serialize(payload));
    } catch (e) {
      done(e);
    }
  });

  app.post<{ Body: { repo: string } }>(
    "/api/projects",
    async (request, reply) => {
      const { userId } = await getRequestSession(request);
      const [providerId, org, repo] = parseGitUrl(request.body.repo);

      await verifyGitHubRepoAccess(userId, org, repo);

      const project = await prisma.project.upsert({
        update: { users: { connect: { id: userId } } },
        where: { org_repo_providerId: { org, repo, providerId } },
        create: {
          org,
          repo,
          providerId,
          secrets: { create: {} },
          users: { connect: { id: userId } },
        },
      });

      reply.send(project);
    }
  );

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
