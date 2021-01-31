import { prisma } from "@/api/db";
import { CYPRESS_RECORD_KEY } from "@/api/env";
import { createAPIRequestHandler } from "@/api/http/APIRequestHandler";
import { BadRequestError, ForbiddenError } from "@/api/http/HTTPError";

async function cleanupRuns(): Promise<void> {
  const twoHours = 2 * 60 * 60 * 1000;
  const twoHoursAgo = new Date(Date.now() - twoHours);

  for (const { id, commitId, platformId } of await prisma.run.findMany({
    take: 100,
    orderBy: { createdAt: "asc" },
    where: { createdAt: { lte: twoHoursAgo } },
    select: { id: true, commitId: true, platformId: true },
  })) {
    await prisma.runInstance.deleteMany({ where: { runId: id } });
    await prisma.run.deleteMany({ where: { id } });
    await Promise.all([
      prisma.runCommit.delete({ where: { id: commitId } }),
      prisma.runPlatform.delete({ where: { id: platformId } }),
    ]);
  }
}

export default createAPIRequestHandler({
  async post(req) {
    const startTime = Date.now();
    const { authorization } = req.headers;

    const { name } = req.body as { name?: string };

    if (
      !authorization ||
      CYPRESS_RECORD_KEY == null ||
      authorization !== `Token ${CYPRESS_RECORD_KEY}`
    ) {
      throw new ForbiddenError();
    }

    if (!name) {
      throw new BadRequestError({ name: "Field is required" });
    }

    if (name === "cleanup-runs") {
      await cleanupRuns();
    } else {
      throw new BadRequestError({ name: "Unknown name" });
    }

    const duration = Date.now() - startTime;

    return {
      duration,
      start: new Date(startTime),
      finish: new Date(),
    };
  },
});
