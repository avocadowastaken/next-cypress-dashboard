import { RunCommit } from "@prisma/client";
import { createAPIRequestHandler } from "@s/http/APIRequestHandler";
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
  async post(req, _, { db }): Promise<CreateRunResponse> {
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
    const run = await db.prisma.run.upsert({
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
        instances: {
          create: specs.map((spec) => ({ spec, groupId })),
        },
        project: {
          connectOrCreate: {
            create: { id: projectId },
            where: { id: projectId },
          },
        },
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
