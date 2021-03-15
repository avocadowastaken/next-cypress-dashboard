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

  app.get<{ Params: { projectId: string } }>(
    "/api/projects/:projectId",
    async (request, reply) => {
      const { userId } = await getRequestSession(request);
      const project = await prisma.project.findFirst({
        rejectOnNotFound: true,
        where: {
          id: request.params.projectId,
          users: { some: { id: userId } },
        },
      });

      reply.send(project);
    }
  );

  app.delete<{ Params: { projectId: string } }>(
    "/api/projects/:projectId",
    async (request, reply) => {
      const { projectId } = request.params;
      const { userId } = await getRequestSession(request);

      await prisma.project.update({
        where: { id: projectId },
        data: { users: { disconnect: { id: userId } } },
      });

      reply.send({ projectId });
    }
  );

  app.post<{ Params: { projectId: string } }>(
    "/api/projects/:projectId/secrets",
    async (request, reply) => {
      const { projectId } = request.params;
      const { userId } = await getRequestSession(request);
      const project = await prisma.project.findFirst({
        rejectOnNotFound: true,
        where: { id: projectId, users: { some: { id: userId } } },
      });

      await verifyGitHubRepoAccess(userId, project.org, project.repo);

      await prisma.projectSecrets.deleteMany({ where: { projectId } });

      const projectSecrets = await prisma.projectSecrets.create({
        data: { projectId },
      });

      reply.send(projectSecrets);
    }
  );

  app.get<{ Params: { projectId: string } }>(
    "/api/projects/:projectId/secrets",
    async (request, reply) => {
      const { userId } = await getRequestSession(request);
      const project = await prisma.project.findFirst({
        rejectOnNotFound: true,
        where: {
          id: request.params.projectId,
          users: { some: { id: userId } },
        },
      });

      await verifyGitHubRepoAccess(userId, project.org, project.repo);

      const projectSecrets = await prisma.projectSecrets.findUnique({
        rejectOnNotFound: true,
        where: { projectId: project.id },
      });

      reply.send(projectSecrets);
    }
  );

  app.get<{ Querystring: PageInput & { projectId?: string } }>(
    "/api/runs",
    async (request, reply) => {
      const { projectId, ...pageInput } = request.query;
      const { userId } = await getRequestSession(request);
      const where: Prisma.RunWhereInput = {
        project: {
          id: projectId,
          users: { some: { id: userId } },
        },
      };

      const response = await createPageResponse(pageInput, {
        getCount: () => prisma.run.count({ where }),
        getNodes: (args) => prisma.run.findMany({ ...args, where }),
      });

      reply.send(response);
    }
  );
});
