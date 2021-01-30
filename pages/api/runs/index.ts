import { RunCommit } from "@prisma/client";
import { prisma } from "api/db";
import { createAPIRequestHandler } from "api/http/APIRequestHandler";
import { ResourceNotFoundError } from "api/http/HTTPError";
import cuid from "cuid";

interface CreateRunInput {
  specs: string[];
  group?: string;
  ciBuildId: string;
  projectId: string;
  recordKey: string;
  commit: RunCommit;
  platform: {
    osCpus: unknown[];
    osName: string;
    osMemory: unknown;
    osVersion: string;
    browserName: string;
    browserVersion: string;
  };
}

interface CreateRunResponse {
  groupId: string;
  machineId: string;
  runId: string;
  runUrl: string;
  isNewRun: boolean;
}

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

  async post(req, _): Promise<CreateRunResponse> {
    const {
      group,
      specs,
      commit,
      platform: { osName, osVersion, browserName, browserVersion },
      ciBuildId,
      projectId,
    } = req.body as CreateRunInput;
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
