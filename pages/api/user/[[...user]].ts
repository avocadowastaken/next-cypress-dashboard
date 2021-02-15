import { createApiHandler } from "@/api/ApiHandler";
import { prisma } from "@/api/db";
import { GitHubClient } from "@/api/GitHubClient";
import { SecurityContext } from "@/api/SecurityContext";

export default createApiHandler((app) => {
  app.addHook("preHandler", async ({ raw }) => {
    await SecurityContext.create(raw);
  });

  app.post<{ Body: { owner: string; repo: string } }>(
    "/api/user/projects",
    async ({ raw, body: { repo, owner } }, reply) => {
      const { userId } = await SecurityContext.create(raw);
      const client = await GitHubClient.create(userId);

      await client.getRepo(owner, repo);

      const project = await prisma.project.findUnique({
        where: {
          org_repo_providerId: {
            repo,
            org: owner,
            providerId: "github",
          },
        },
      });

      if (!project) {
        await prisma.project.create({
          data: {
            repo,
            org: owner,
            providerId: "github",
            userProjects: { create: { userId } },
          },
        });
      } else {
        const userProject = prisma.userProject.findUnique({
          where: {
            userId_projectId: { userId, projectId: project.id },
          },
        });

        if (!userProject) {
          await prisma.userProject.create({
            data: { projectId: project.id, userId },
          });
        }
      }

      reply.send({});
    }
  );
});
