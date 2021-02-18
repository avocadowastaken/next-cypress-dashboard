import { createApiHandler } from "@/api/ApiHandler";
import { isUniqueConstraintError, prisma } from "@/api/db";
import { TASKS_API_SECRET } from "@/api/env";
import { createAppError } from "@/shared/AppError";
import {
  CreateInstanceInput,
  CreateInstanceResponse,
  CreateRunInput,
  CreateRunResponse,
  UpdateInstanceInput,
  UpdateInstanceResponse,
} from "@/shared/cypress-types";
import { parseGitUrl } from "@/shared/GitUrl";
import { Prisma, Run } from "@prisma/client";

async function obtainRun(
  input: Prisma.RunUncheckedCreateInput
): Promise<[run: Run, isNewRun: boolean]> {
  let run: Run;
  let isNewRun = true;

  try {
    run = await prisma.run.create({ data: input });
  } catch (error: unknown) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    isNewRun = false;
    run = await prisma.run.findUnique({
      rejectOnNotFound: true,
      where: {
        groupId_ciBuildId_projectId: {
          groupId: input.groupId,
          ciBuildId: input.ciBuildId,
          projectId: input.projectId,
        },
      },
    });
  }

  return [run, isNewRun];
}

export default createApiHandler((app) => {
  //
  // Create Run
  //

  app.post<{
    Body: CreateRunInput;
    Reply: CreateRunResponse;
  }>(
    "/runs",
    async (
      {
        headers,
        body: {
          group,
          specs,
          recordKey,
          ciBuildId,
          projectId,
          commit: { defaultBranch, ...commit },
          platform: { osCpus, osMemory, ...platform },
        },
      },
      reply
    ) => {
      if (!recordKey || !projectId) {
        throw createAppError("FORBIDDEN");
      }

      if (recordKey === TASKS_API_SECRET) {
        const [providerId, org, repo] = parseGitUrl(commit.remoteOrigin);

        ({ id: projectId } = await prisma.project.findUnique({
          select: { id: true },
          rejectOnNotFound: true,
          where: { org_repo_providerId: { providerId, org, repo } },
        }));
      }

      const groupId = group || ciBuildId;
      const project = await prisma.project.findFirst({
        rejectOnNotFound: true,
        where: { id: projectId, secrets: { recordKey } },
      });

      const [run, isNewRun] = await obtainRun({
        groupId,
        ciBuildId,
        commit: { ...commit },
        platform: { ...platform },
        projectId: project.id,
        instances: {
          create: specs.map((spec) => ({ spec, groupId })),
        },
      });

      const protocol =
        process.env.NODE_ENV === "development" ? "http" : "https";

      reply.send({
        groupId,
        isNewRun,
        runId: run.id,
        machineId: run.machineId,
        runUrl: `${protocol}://${headers.host}/r/${run.id}`,
      });
    }
  );

  //
  // Claim Instance for Run
  //

  app.post<{
    Params: { runId: string };
    Body: CreateInstanceInput;
    Reply: CreateInstanceResponse;
  }>("/runs/:runId/instances", async (request, reply) => {
    const { runId } = request.params;
    const { groupId } = request.body;

    const totalInstances = await prisma.runInstance.count({
      where: { runId, groupId },
    });

    const response: CreateInstanceResponse = {
      spec: null,
      instanceId: null,

      totalInstances,
      claimedInstances: 0,
    };

    while (response.totalInstances > response.claimedInstances) {
      const [firstUnclaimed, claimedInstances] = await prisma.$transaction([
        prisma.runInstance.findFirst({
          where: { runId, groupId, claimedAt: null },
        }),

        prisma.runInstance.count({
          where: { runId, groupId, claimedAt: { not: null } },
        }),
      ]);

      response.claimedInstances = claimedInstances;

      if (firstUnclaimed) {
        const { count } = await prisma.runInstance.updateMany({
          data: { claimedAt: new Date() },
          where: { id: firstUnclaimed.id, claimedAt: null },
        });

        // Task successfully claimed, update response and exit loop.
        if (count === 1) {
          response.claimedInstances += 1;
          response.spec = firstUnclaimed.spec;
          response.instanceId = firstUnclaimed.id;
          break;
        }
      }
    }

    reply.send(response);
  });

  //
  // Fill instance results
  //

  app.put<{
    Params: { instanceId: string };
    Body: UpdateInstanceInput;
    Reply: UpdateInstanceResponse;
  }>("/instances/:instanceId", async (request, reply) => {
    const { instanceId } = request.params;
    const { error, stats, tests } = request.body;

    await prisma.runInstance.update({
      where: { id: instanceId },
      data: {
        result: {
          error,
          stats,
          tests: tests.map(({ state, title, displayError }) => ({
            state,
            title,
            displayError,
          })),
        },
      },
    });

    reply.send({ screenshotUploadUrls: [] });
  });

  //
  // Skip console output of the Cypress agent.
  //

  app.put("/instances/:instanceId/stdout", (_, reply) => {
    reply.send({});
  });
});
