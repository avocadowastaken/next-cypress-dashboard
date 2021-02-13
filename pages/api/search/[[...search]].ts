import { createApiHandler } from "@/api/ApiHandler";
import { GitHubClient } from "@/api/GitHubClient";
import { SecurityContext } from "@/api/SecurityContext";

export default createApiHandler((app) => {
  app.addHook("preHandler", async ({ raw }) => {
    await SecurityContext.create(raw);
  });

  app.get<{
    Querystring: { q: string };
    Reply: string[];
  }>(
    "/api/search/users",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            q: { type: "string", minLength: 1, maxLength: 64 },
          },
        },
      },
    },
    async ({ raw, query: { q } }, reply) => {
      const ctx = await SecurityContext.create(raw);
      const client = await GitHubClient.create(ctx);
      const users = await client.searchUser(q);

      reply.send(users.map((user) => user.login));
    }
  );

  app.get<{
    Querystring: { q: string; owner: string };
    Reply: string[];
  }>(
    "/api/search/repos",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            q: { type: "string", minLength: 1, maxLength: 64 },
            owner: { type: "string", minLength: 1, maxLength: 64 },
          },
        },
      },
    },
    async ({ raw, query: { q, owner } }, reply) => {
      const ctx = await SecurityContext.create(raw);
      const client = await GitHubClient.create(ctx);
      const repos = await client.searchRepo(owner, q);

      reply.send(repos.map((repo) => repo.name));
    }
  );
});
