import { prisma } from "@/api/db";
import { CYPRESS_RECORD_KEY } from "@/api/env";
import { createAPIRequestHandler } from "@/api/http/APIRequestHandler";
import { ForbiddenError, ResourceNotFoundError } from "@/api/http/HTTPError";
import { CreateRunInput, CreateRunResponse } from "@/shared/cypress-types";
import cuid from "cuid";

export default createAPIRequestHandler({
  async get(req) {
    const runId = req.query.runId as string;

    const run = await prisma.run.findUnique({
      where: { id: runId },
      include: { project: true },
    });

    if (!run) {
      throw new ResourceNotFoundError("Run not found", { runId });
    }

    return run;
  },

  async delete(req) {
    const runId = req.query.runId as string;

    await prisma.runInstance.deleteMany({
      where: { runId },
    });

    const { commitId, platformId } = await prisma.run.delete({
      where: { id: runId },
    });

    await prisma.runCommit.delete({
      where: { id: commitId },
    });

    await prisma.runPlatform.delete({
      where: { id: platformId },
    });

    return {};
  },

  async post(req): Promise<CreateRunResponse> {
    const {
      group,
      specs,
      commit,
      recordKey,
      ciBuildId,
      projectId,
      platform: { osName, osVersion, browserName, browserVersion },
    } = req.body as CreateRunInput;

    if (recordKey !== CYPRESS_RECORD_KEY) {
      throw new ForbiddenError();
    }

    const groupId = group || ciBuildId;

    const updatedAt = new Date();

    try {
      await prisma.project.create({ data: { id: projectId } });
    } catch (e) {}

    const run = await prisma.run.upsert({
      select: { id: true, updatedAt: true },
      where: { ciBuildId_projectId: { ciBuildId, projectId } },
      update: { updatedAt },
      create: {
        groupId,
        ciBuildId,
        commit: { create: commit },
        platform: {
          create: { osName, osVersion, browserName, browserVersion },
        },
        instances: { create: specs.map((spec) => ({ spec, groupId })) },
        project: { connect: { id: projectId } },
      },
    });

    return {
      groupId,
      runId: run.id,
      machineId: cuid(),
      runUrl: `/projects/${projectId}/runs/${run.id}`,
      isNewRun: run.updatedAt.getTime() !== updatedAt.getTime(),
    };
  },
});
