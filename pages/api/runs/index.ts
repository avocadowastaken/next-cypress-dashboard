import { isUniqueConstraintError, prisma } from "@/api/db";
import { CYPRESS_RECORD_KEY } from "@/api/env";
import { createAPIRequestHandler } from "@/api/http/APIRequestHandler";
import { ForbiddenError, ResourceNotFoundError } from "@/api/http/HTTPError";
import { CreateRunInput, CreateRunResponse } from "@/shared/cypress-types";
import { Run } from "@prisma/client";

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

      recordKey,
      ciBuildId,
      projectId,
      platform: { osName, osVersion, browserName, browserVersion },
      commit: {
        sha,
        branch,
        message,
        authorName,
        authorEmail,
        remoteOrigin,
        defaultBranch,
      },
    } = req.body as CreateRunInput;

    if (CYPRESS_RECORD_KEY != null && CYPRESS_RECORD_KEY !== recordKey) {
      throw new ForbiddenError();
    }

    const groupId = group || ciBuildId;

    try {
      await prisma.project.create({ data: { id: projectId } });
    } catch (e: unknown) {
      if (!isUniqueConstraintError(e)) {
        throw e;
      }
    }

    let run: Run;
    let isNewRun = true;

    try {
      run = await prisma.run.create({
        data: {
          groupId,
          ciBuildId,
          project: {
            connect: {
              id: projectId,
            },
          },
          commit: {
            create: {
              sha,
              branch,
              message,
              authorName,
              authorEmail,
              remoteOrigin,
              defaultBranch,
            },
          },
          platform: {
            create: {
              osName,
              osVersion,
              browserName,
              browserVersion,
            },
          },
          instances: {
            create: specs.map((spec) => ({ spec, groupId })),
          },
        },
      });
    } catch (e: unknown) {
      if (!isUniqueConstraintError(e)) {
        throw e;
      }
      isNewRun = false;
      run = (await prisma.run.findUnique({
        rejectOnNotFound: true,
        where: {
          groupId_ciBuildId_projectId: {
            groupId,
            ciBuildId,
            projectId,
          },
        },
      })) as Run /* TODO: `rejectOnNotFound` should handle that */;
    }

    return {
      groupId,
      isNewRun,
      runId: run.id,
      machineId: run.machineId,
      runUrl: `http://${req.headers.host}/projects/${projectId}/runs/${run.id}`,
    };
  },
});
