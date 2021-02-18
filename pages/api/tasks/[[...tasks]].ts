import { createApiHandler } from "@/api/ApiHandler";
import { prisma } from "@/api/db";
import { CYPRESS_RECORD_KEY } from "@/api/env";
import { createAppError } from "@/shared/AppError";

export default createApiHandler((app) => {
  app.addHook("preHandler", (request, reply, done) => {
    const { authorization } = request.headers;

    if (
      !authorization ||
      CYPRESS_RECORD_KEY == null ||
      authorization !== `Token ${CYPRESS_RECORD_KEY}`
    ) {
      throw createAppError("FORBIDDEN");
    }

    done();
  });

  app.post<{ Reply: { runs: number; runInstances: number } }>(
    "/api/tasks/cleanup-runs",
    async (_, reply) => {
      const oneDay = 24 * 60 * 60 * 1000;
      const oneDayAgo = new Date(Date.now() - oneDay);
      const response = { runs: 0, runInstances: 0 };

      for (const { id } of await prisma.run.findMany({
        take: 100,
        orderBy: { createdAt: "asc" },
        where: { createdAt: { lte: oneDayAgo } },
      })) {
        const { count } = await prisma.runInstance.deleteMany({
          where: { runId: id },
        });
        await prisma.run.delete({ where: { id } });

        response.runs += 1;
        response.runInstances += count;
      }

      reply.send(response);
    }
  );
});
