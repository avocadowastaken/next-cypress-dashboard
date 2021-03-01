import { createApiHandler } from "@/server/ApiHandler";
import { prisma } from "@/server/db";
import { TASKS_API_SECRET } from "@/server/env";
import { createAppError } from "@/shared/AppError";
import { startOfYesterday } from "date-fns";

export default createApiHandler((app) => {
  app.post<{
    Reply: { runs: number; runInstances: number; testResults: number };
  }>("/api/tasks/cleanup-runs", async (request, reply) => {
    const { authorization } = request.headers;

    if (authorization !== `Token ${TASKS_API_SECRET}`) {
      throw createAppError("FORBIDDEN");
    }

    const oneDayAgo = startOfYesterday();

    const { count: testResults } = await prisma.testResult.deleteMany({
      where: { createdAt: { lte: oneDayAgo } },
    });

    const { count: runInstances } = await prisma.runInstance.deleteMany({
      where: { createdAt: { lte: oneDayAgo } },
    });

    const { count: runs } = await prisma.run.deleteMany({
      where: { createdAt: { lte: oneDayAgo } },
    });

    reply.send({ runs, runInstances, testResults });
  });
});
