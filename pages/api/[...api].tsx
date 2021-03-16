import { createPageResponse, PageInput } from "@/core/data/PageResponse";
import { createApiHandler, getRequestSession } from "@/core/helpers/Api";
import { prisma } from "@/core/helpers/db";
import { parseGitUrl } from "@/core/helpers/Git";
import { verifyGitHubRepoAccess } from "@/core/helpers/GitHub";
import { Prisma } from "@prisma/client";
import { deserialize, serialize } from "superjson";
import { SuperJSONResult } from "superjson/dist/types";

export default createApiHandler((app) => {
  app.addHook("preValidation", (request, _, done) => {
    if (
      typeof request.body == "object" &&
      request.body != null &&
      "json" in request.body
    ) {
      request.body = deserialize(request.body as SuperJSONResult);
    }

    done();
  });

  app.addHook("preSerialization", (_, __, payload, done) => {
    try {
      done(null, serialize(payload));
    } catch (e) {
      done(e);
    }
  });

  app.post<{ Body: { repo: string } }>("/api/projects", async (request) => {
    const { userId } = await getRequestSession(request);
    const [providerId, org, repo] = parseGitUrl(request.body.repo);

    await verifyGitHubRepoAccess(userId, org, repo);

    return prisma.project.upsert({
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
  });

  app.get<{ Querystring: PageInput }>("/api/projects", async (request) => {
    const { userId } = await getRequestSession(request);
    const where: Prisma.ProjectWhereInput = {
      users: { some: { id: userId } },
    };

    return createPageResponse(request.query, {
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
  });

  app.get<{ Params: { projectId: string } }>(
    "/api/projects/:projectId",
    async (request) => {
      const { userId } = await getRequestSession(request);

      return prisma.project.findFirst({
        rejectOnNotFound: true,
        where: {
          id: request.params.projectId,
          users: { some: { id: userId } },
        },
      });
    }
  );

  app.delete<{ Params: { projectId: string } }>(
    "/api/projects/:projectId",
    async (request) => {
      const { projectId } = request.params;
      const { userId } = await getRequestSession(request);

      await prisma.project.update({
        where: { id: projectId },
        data: { users: { disconnect: { id: userId } } },
      });

      return { projectId };
    }
  );

  app.post<{ Params: { projectId: string } }>(
    "/api/projects/:projectId/secrets",
    async (request) => {
      const { projectId } = request.params;
      const { userId } = await getRequestSession(request);
      const project = await prisma.project.findFirst({
        rejectOnNotFound: true,
        where: { id: projectId, users: { some: { id: userId } } },
      });

      await verifyGitHubRepoAccess(userId, project.org, project.repo);

      await prisma.projectSecrets.deleteMany({ where: { projectId } });

      return prisma.projectSecrets.create({ data: { projectId } });
    }
  );

  app.get<{ Params: { projectId: string } }>(
    "/api/projects/:projectId/secrets",
    async (request) => {
      const { userId } = await getRequestSession(request);
      const project = await prisma.project.findFirst({
        rejectOnNotFound: true,
        where: {
          id: request.params.projectId,
          users: { some: { id: userId } },
        },
      });

      await verifyGitHubRepoAccess(userId, project.org, project.repo);

      return prisma.projectSecrets.findUnique({
        rejectOnNotFound: true,
        where: { projectId: project.id },
      });
    }
  );

  app.get<{ Querystring: PageInput & { projectId?: string } }>(
    "/api/runs",
    async (request) => {
      const { projectId, ...pageInput } = request.query;
      const { userId } = await getRequestSession(request);
      const where: Prisma.RunWhereInput = {
        project: {
          id: projectId,
          users: { some: { id: userId } },
        },
      };

      return createPageResponse(pageInput, {
        getCount: () => prisma.run.count({ where }),
        getNodes: (args) => prisma.run.findMany({ ...args, where }),
      });
    }
  );

  app.get<{ Params: { runId: string } }>(
    "/api/runs/:runId",
    async (request) => {
      const { runId } = request.params;
      const { userId } = await getRequestSession(request);

      const { project, ...run } = await prisma.run.findFirst({
        rejectOnNotFound: true,
        include: { project: true },
        where: {
          id: runId,
          project: { users: { some: { id: userId } } },
        },
      });

      await verifyGitHubRepoAccess(userId, project.org, project.repo);

      return run;
    }
  );

  app.delete<{ Params: { runId: string } }>(
    "/api/runs/:runId",
    async (request) => {
      const { runId } = request.params;
      const { userId } = await getRequestSession(request);

      const run = await prisma.run.findFirst({
        rejectOnNotFound: true,
        select: { project: true },
        where: {
          id: runId,
          project: { users: { some: { id: userId } } },
        },
      });

      await verifyGitHubRepoAccess(userId, run.project.org, run.project.repo);

      await prisma.testResult.deleteMany({ where: { runInstance: { runId } } });
      await prisma.runInstance.deleteMany({ where: { runId } });
      await prisma.run.deleteMany({ where: { id: runId } });

      return run;
    }
  );

  app.get<{ Querystring: PageInput & { runId?: string } }>(
    "/api/instances",
    async (request) => {
      const { runId, ...pageInput } = request.query;
      const { userId } = await getRequestSession(request);
      const where: Prisma.RunInstanceWhereInput = {
        run: { id: runId, project: { users: { some: { id: userId } } } },
      };

      return createPageResponse(pageInput, {
        maxNodesPerPage: 100,
        defaultNodesPerPage: 100,
        getCount: () => prisma.runInstance.count({ where }),
        getNodes: (args) =>
          prisma.runInstance.findMany({
            ...args,
            where,
            orderBy: [{ totalFailed: "desc" }, { claimedAt: "asc" }],
          }),
      });
    }
  );
});
