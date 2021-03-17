import { createPageResponse, PageInput } from "@/core/data/PageResponse";
import { createApiHandler, getRequestSession } from "@/core/helpers/Api";
import { prisma } from "@/core/helpers/db";
import { parseGitUrl } from "@/core/helpers/Git";
import {
  findGitHubUserAvatar,
  verifyGitHubRepoAccess,
} from "@/core/helpers/GitHub";
import { Prisma } from "@prisma/client";
import { createHash } from "crypto";
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

  app.get<{ Params: { email: string } }>(
    "/api/avatar/:email",
    async (request, reply) => {
      const { email } = request.params;

      const { userId } = await getRequestSession(request);
      const avatarUrl = await findGitHubUserAvatar(userId, email);

      if (avatarUrl) {
        return reply
          .header("Cache-Control", "public, immutable")
          .redirect(301, avatarUrl);
      }

      // Fallback to Gravatar.
      const hash = createHash("md5").update(email.trim()).digest("hex");
      return reply.redirect(
        302,
        `https://www.gravatar.com/avatar/${hash}?s=256`
      );
    }
  );

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
        select: null,
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

  app.get<{
    Querystring: PageInput;
    Params: { projectId: string };
  }>("/api/projects/:projectId/runs", async (request) => {
    const { projectId } = request.params;
    const { userId } = await getRequestSession(request);

    const project = await prisma.project.findFirst({
      rejectOnNotFound: true,
      where: {
        id: projectId,
        users: { some: { id: userId } },
      },
    });

    await verifyGitHubRepoAccess(userId, project.org, project.repo);

    const where: Prisma.RunWhereInput = { projectId };

    return createPageResponse(request.query, {
      getCount: () => prisma.run.count({ where }),
      getNodes: (args) =>
        prisma.run.findMany({ ...args, where, orderBy: { createdAt: "desc" } }),
    });
  });

  app.get<{ Params: { runId: string; projectId: string } }>(
    "/api/projects/:projectId/runs/:runId",
    async (request) => {
      const { runId, projectId } = request.params;
      const { userId } = await getRequestSession(request);

      const { project, ...run } = await prisma.run.findFirst({
        rejectOnNotFound: true,
        include: { project: true },
        where: {
          id: runId,
          project: { id: projectId, users: { some: { id: userId } } },
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

      await prisma.runInstance.deleteMany({ where: { runId } });
      await prisma.run.deleteMany({ where: { id: runId } });

      return run;
    }
  );

  app.get<{
    Querystring: PageInput;
    Params: { runId: string; projectId: string };
  }>("/api/projects/:projectId/runs/:runId/instances", async (request) => {
    const { runId, projectId } = request.params;
    const { userId } = await getRequestSession(request);

    const { project } = await prisma.run.findFirst({
      rejectOnNotFound: true,
      select: { project: true },
      where: {
        id: runId,
        project: { id: projectId, users: { some: { id: userId } } },
      },
    });

    await verifyGitHubRepoAccess(userId, project.org, project.repo);

    const where: Prisma.RunInstanceWhereInput = { runId };

    return createPageResponse(request.query, {
      defaultNodesPerPage: 100,
      getCount: () => prisma.runInstance.count({ where }),
      getNodes: (args) =>
        prisma.runInstance.findMany({
          ...args,
          where,
          orderBy: [{ totalFailed: "desc" }, { claimedAt: "asc" }],
        }),
    });
  });

  app.get<{
    Params: { runId: string; projectId: string; runInstanceId: string };
  }>(
    "/api/projects/:projectId/runs/:runId/instances/:runInstanceId",
    async (request) => {
      const { runId, projectId, runInstanceId } = request.params;
      const { userId } = await getRequestSession(request);

      const { run, ...runInstance } = await prisma.runInstance.findFirst({
        rejectOnNotFound: true,
        include: { run: { select: { project: true } } },
        where: {
          id: runInstanceId,
          run: {
            id: runId,
            project: { id: projectId, users: { some: { id: userId } } },
          },
        },
      });

      await verifyGitHubRepoAccess(userId, run.project.org, run.project.repo);

      return runInstance;
    }
  );
});
