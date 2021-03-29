import { AppError } from "@/core/data/AppError";
import { createPageResponse } from "@/core/data/PageResponse";
import { createApiHandler } from "@/core/helpers/Api";
import { prisma } from "@/core/helpers/db";
import { GITHUB_CLIENT_ID, TASKS_API_SECRET } from "@/core/helpers/env";
import { parseGitUrl } from "@/core/helpers/Git";
import {
  findGitHubUserAvatar,
  obtainAccessToken,
  verifyGitHubRepoAccess,
} from "@/core/helpers/GitHub";
import { getRequestSession } from "@/core/helpers/Session";
import { Prisma } from "@prisma/client";
import { createHash } from "crypto";
import { startOfYesterday } from "date-fns";
import { deserialize, serialize } from "superjson";

export default createApiHandler((app) => {
  app.post("/api/auth", async (req, res) => {
    const state = req.session.get<string>("csrf-token");

    if (!state) {
      res.redirect(302, `/?error=${encodeURIComponent("Invalid CSRF token")}`);
      return;
    }

    const url = new URL("https://github.com/login/oauth/authorize");

    url.searchParams.set("state", state);
    url.searchParams.set("allow_signup", "false");
    url.searchParams.set("scope", "user read:org");
    url.searchParams.set("client_id", GITHUB_CLIENT_ID);

    res.redirect(302, url.toString());
  });

  app.post("/api/auth/destroy", async (req, res) => {
    req.session.destroy();
    await req.session.save();
    res.redirect(302, "/");
  });

  app.get("/api/auth", async (req, res) => {
    const { code } = req.query;

    if (typeof code !== "string") {
      res.redirect(302, `/?error=${encodeURIComponent("Invalid oAuth code")}`);
      return;
    }

    const state = req.session.get<string>("csrf-token");

    if (!state) {
      res.redirect(302, `/?error=${encodeURIComponent("Invalid CSRF token")}`);
      return;
    }

    try {
      const [accessToken, user] = await obtainAccessToken(code, state);

      const input: Prisma.UserAccountWhereUniqueInput["providerId_providerAccountId"] = {
        providerId: "github",
        providerAccountId: user.id.toString(),
      };

      const { userId } = await prisma.userAccount.upsert({
        select: { userId: true },
        where: { providerId_providerAccountId: input },
        update: { accessToken },
        create: { ...input, accessToken, user: { create: {} } },
      });

      req.session.set("userId", userId);
      await req.session.save();
      res.redirect(302, req.headers.referer || "/");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.stack && process.env.NODE_ENV === "development"
            ? error.stack
            : `${error.name}: ${error.message}`
          : "Unknown Error";

      res.redirect(302, `/?error=${encodeURIComponent(message)}`);
    }
  });

  app.post("/api/tasks/cleanup-runs", async (req, res) => {
    const { authorization } = req.headers;

    if (authorization !== `Token ${TASKS_API_SECRET}`) {
      throw new AppError("FORBIDDEN");
    }

    const oneDayAgo = startOfYesterday();

    const { count: runInstances } = await prisma.runInstance.deleteMany({
      where: { createdAt: { lte: oneDayAgo } },
    });

    const { count: runs } = await prisma.run.deleteMany({
      where: { createdAt: { lte: oneDayAgo } },
    });

    res.send(JSON.stringify({ runs, runInstances }));
  });

  app.get<{ params: { email: string } }>(
    "/api/avatar/:email",
    async (req, res) => {
      const { email } = req.params;

      const { userId } = getRequestSession(req);
      const avatarUrl = await findGitHubUserAvatar(userId, email);

      if (avatarUrl) {
        res.setHeader("Cache-Control", "public, immutable");
        res.redirect(301, avatarUrl);
        return;
      }

      // Fallback to Gravatar.
      const hash = createHash("md5").update(email.trim()).digest("hex");
      res.redirect(302, `https://www.gravatar.com/avatar/${hash}?s=256`);
    }
  );

  app.use("/api/projects", (req, res, done) => {
    if (typeof req.body == "object" && req.body != null && "json" in req.body) {
      req.body = deserialize(req.body);
    }

    res.json = (payload) => {
      res.send(serialize(payload));
    };

    done();
  });

  app.post("/api/projects", async (req, res) => {
    const { userId } = getRequestSession(req);
    const [providerId, org, repo] = parseGitUrl(req.body.repo);

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

    res.status(201).json(project);
  });

  app.get("/api/projects", async (req, res) => {
    const { userId } = getRequestSession(req);
    const where: Prisma.ProjectWhereInput = {
      users: { some: { id: userId } },
    };

    const response = await createPageResponse(req.query, {
      getCount: () => prisma.project.count({ where }),
      getNodes: (args) =>
        prisma.project.findMany({
          ...args,
          where,
          orderBy: { createdAt: "desc" },
        }),
    });

    res.json(response);
  });

  app.get<{ params: { projectId: string } }>(
    "/api/projects/:projectId",
    async (req, res) => {
      const { projectId } = req.params;
      const { userId } = getRequestSession(req);

      const project = await prisma.project.findFirst({
        rejectOnNotFound: true,
        where: { id: projectId, users: { some: { id: userId } } },
      });

      res.json(project);
    }
  );

  app.delete<{ params: { projectId: string } }>(
    "/api/projects/:projectId",
    async (req, res) => {
      const { projectId } = req.params;
      const { userId } = getRequestSession(req);

      const project = await prisma.project.update({
        select: null,
        where: { id: projectId },
        data: { users: { disconnect: { id: userId } } },
      });

      res.json(project);
    }
  );

  app.post<{ params: { projectId: string } }>(
    "/api/projects/:projectId/secrets",
    async (req, res) => {
      const { projectId } = req.params;
      const { userId } = getRequestSession(req);
      const project = await prisma.project.findFirst({
        rejectOnNotFound: true,
        where: { id: projectId, users: { some: { id: userId } } },
      });

      await verifyGitHubRepoAccess(userId, project.org, project.repo);

      await prisma.projectSecrets.deleteMany({ where: { projectId } });

      const projectSecrets = await prisma.projectSecrets.create({
        data: { projectId },
      });

      res.status(201).json(projectSecrets);
    }
  );

  app.get<{ params: { projectId: string } }>(
    "/api/projects/:projectId/secrets",
    async (req, res) => {
      const { projectId } = req.params;
      const { userId } = getRequestSession(req);
      const project = await prisma.project.findFirst({
        rejectOnNotFound: true,
        where: { id: projectId, users: { some: { id: userId } } },
      });

      await verifyGitHubRepoAccess(userId, project.org, project.repo);

      const projectSecrets = await prisma.projectSecrets.findUnique({
        rejectOnNotFound: true,
        where: { projectId: project.id },
      });

      res.json(projectSecrets);
    }
  );

  app.get<{ params: { projectId: string } }>(
    "/api/projects/:projectId/runs",
    async (req, res) => {
      const { projectId } = req.params;
      const { userId } = getRequestSession(req);

      const project = await prisma.project.findFirst({
        rejectOnNotFound: true,
        where: {
          id: projectId,
          users: { some: { id: userId } },
        },
      });

      await verifyGitHubRepoAccess(userId, project.org, project.repo);

      const where: Prisma.RunWhereInput = { projectId };

      const response = await createPageResponse(req.query, {
        getCount: () => prisma.run.count({ where }),
        getNodes: (args) =>
          prisma.run.findMany({
            ...args,
            where,
            orderBy: { createdAt: "desc" },
          }),
      });

      res.json(response);
    }
  );

  app.get<{ params: { runId: string; projectId: string } }>(
    "/api/projects/:projectId/runs/:runId",
    async (req, res) => {
      const { runId, projectId } = req.params;
      const { userId } = getRequestSession(req);

      const { project, ...run } = await prisma.run.findFirst({
        rejectOnNotFound: true,
        include: { project: true },
        where: {
          id: runId,
          project: { id: projectId, users: { some: { id: userId } } },
        },
      });

      await verifyGitHubRepoAccess(userId, project.org, project.repo);

      res.json(run);
    }
  );

  app.delete<{ params: { runId: string } }>(
    "/api/runs/:runId",
    async (req, res) => {
      const { runId } = req.params;
      const { userId } = getRequestSession(req);

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

      res.json(run);
    }
  );

  app.get<{ params: { runId: string; projectId: string } }>(
    "/api/projects/:projectId/runs/:runId/instances",
    async (req, res) => {
      const { exclude, ...pageInput } = req.query;
      const { runId, projectId } = req.params;
      const { userId } = getRequestSession(req);

      const { project } = await prisma.run.findFirst({
        rejectOnNotFound: true,
        select: { project: true },
        where: {
          id: runId,
          project: { id: projectId, users: { some: { id: userId } } },
        },
      });

      await verifyGitHubRepoAccess(userId, project.org, project.repo);

      const where: Prisma.RunInstanceWhereInput = {
        runId,
      };

      if (exclude === "passed") {
        where.OR = [
          { completedAt: null },
          { error: { not: null } },
          { totalFailed: { gt: 0 } },
        ];
      }

      const response = await createPageResponse(pageInput, {
        defaultNodesPerPage: 100,
        getCount: () => prisma.runInstance.count({ where }),
        getNodes: (args) =>
          prisma.runInstance.findMany({
            ...args,
            where,
            orderBy: [{ totalFailed: "desc" }, { claimedAt: "asc" }],
          }),
      });

      res.json(response);
    }
  );

  app.get<{
    params: { runId: string; projectId: string; runInstanceId: string };
  }>(
    "/api/projects/:projectId/runs/:runId/instances/:runInstanceId",
    async (req, res) => {
      const { runId, projectId, runInstanceId } = req.params;
      const { userId } = getRequestSession(req);

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

      res.json(runInstance);
    }
  );
});
