import { createAppError } from "@/core/data/AppError";
import { createApiHandler } from "@/core/helpers/Api";
import {
  CreateInstanceInput,
  CreateInstanceResponse,
  CreateRunInput,
  CreateRunResponse,
  UpdateInstanceInput,
  UpdateInstanceResponse,
} from "@/core/helpers/cypress-types";
import { prisma } from "@/core/helpers/db";
import { TASKS_API_SECRET } from "@/core/helpers/env";
import { parseGitUrl } from "@/core/helpers/Git";
import { Browser, OS, Prisma, Run, TestResultState } from "@prisma/client";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function trim(input: unknown): string {
  if (typeof input == "string") {
    return input.trim();
  }

  return "";
}

function toOS(input: unknown): OS {
  const os = trim(input).toLocaleLowerCase() as OS;

  switch (os) {
    case "linux":
    case "darwin":
    case "windows":
      return os;
  }

  return "unknown";
}

function toBrowser(input: unknown): Browser {
  const browser = trim(input).toLocaleLowerCase() as Browser;

  switch (browser) {
    case "chrome":
    case "chromium":
    case "edge":
    case "electron":
    case "firefox":
      return browser;
  }

  return "unknown";
}

function toTestResultState(input: unknown): TestResultState {
  const state = trim(input).toLocaleLowerCase() as TestResultState;

  switch (state) {
    case "failed":
    case "passed":
    case "skipped":
      return state;
  }

  return "passed";
}

async function obtainRun(
  runInput: Prisma.RunCreateManyInput,
  runInstanceInputs: Array<Omit<Prisma.RunInstanceCreateManyInput, "runId">>
): Promise<[run: Run, isNewRun: boolean]> {
  const { count } = await prisma.run.createMany({
    data: runInput,
    skipDuplicates: true,
  });
  const isNewRun = count === 1;
  const run = await prisma.run.findUnique({
    rejectOnNotFound: true,
    where: {
      groupId_ciBuildId_projectId: {
        groupId: runInput.groupId,
        ciBuildId: runInput.ciBuildId,
        projectId: runInput.projectId,
      },
    },
  });

  if (isNewRun) {
    await prisma.runInstance.createMany({
      skipDuplicates: true,
      data: runInstanceInputs.map((input) => ({ ...input, runId: run.id })),
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
          commit,
          platform,
          recordKey,
          ciBuildId,
          projectId,
        },
      },
      reply
    ) => {
      if (!recordKey || !projectId) {
        throw createAppError("FORBIDDEN");
      }

      if (!ciBuildId) {
        ciBuildId = commit.sha + "-" + Date.now();
      }

      const groupId = trim(group || ciBuildId);

      if (recordKey === TASKS_API_SECRET) {
        const [providerId, org, repo] = parseGitUrl(commit.remoteOrigin);

        ({ id: projectId } = await prisma.project.findUnique({
          select: { id: true },
          rejectOnNotFound: true,
          where: { org_repo_providerId: { providerId, org, repo } },
        }));
      } else {
        await prisma.project.findFirst({
          select: null,
          rejectOnNotFound: true,
          where: { id: projectId, secrets: { recordKey } },
        });
      }

      const [run, isNewRun] = await obtainRun(
        {
          groupId,
          ciBuildId,
          projectId,

          os: toOS(platform.osName),
          osVersion: trim(platform.osVersion),

          browser: toBrowser(platform.browserName),
          browserVersion: trim(platform.browserVersion),

          commitSha: trim(commit.sha),
          commitBranch: trim(commit.branch),
          commitMessage: trim(commit.message),
          commitAuthorName: trim(commit.authorName),
          commitAuthorEmail: trim(commit.authorEmail),
        },
        specs.map((spec) => ({ spec, groupId }))
      );

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

    const response: CreateInstanceResponse = {
      spec: null,
      instanceId: null,
      totalInstances: 0,
      claimedInstances: 0,
    };

    let attempts = 0;
    while (response.totalInstances === 0) {
      attempts += 1;
      response.totalInstances = await prisma.runInstance.count({
        where: { runId, groupId },
      });

      if (response.totalInstances === 0) {
        if (attempts > 3) {
          return response;
        }

        await wait(500 * attempts);
      }
    }

    while (response.claimedInstances < response.totalInstances) {
      const [firstUnclaimed, claimedInstances] = await Promise.all([
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
    Body: UpdateInstanceInput;
    Reply: UpdateInstanceResponse;
    Params: { runInstanceId: string };
  }>("/instances/:runInstanceId", async (request, reply) => {
    const { runInstanceId } = request.params;
    const { error, stats, tests } = request.body;

    const { runId } = await prisma.runInstance.update({
      select: { runId: true },
      where: { id: runInstanceId },
      data: {
        error,
        totalPassed: stats.passes,
        totalFailed: stats.failures,
        totalPending: stats.pending,
        totalSkipped: stats.skipped,
        completedAt: stats.wallClockEndedAt,
      },
    });

    if (tests) {
      await prisma.testResult.createMany({
        skipDuplicates: true,
        data: tests.map(({ title, state, testId, displayError }) => ({
          testId,
          displayError,
          runInstanceId,
          titleParts: title,
          state: toTestResultState(state),
        })),
      });
    }

    const incompleteRunInstanceCount = await prisma.runInstance.count({
      where: { runId, completedAt: null },
    });

    if (incompleteRunInstanceCount === 0) {
      const { sum } = await prisma.runInstance.aggregate({
        where: { runId },
        sum: {
          totalFailed: true,
          totalPassed: true,
          totalPending: true,
          totalSkipped: true,
        },
      });

      await prisma.run.update({
        select: null,
        where: { id: runId },
        data: {
          totalFailed: sum.totalFailed,
          totalPassed: sum.totalPassed,
          totalPending: sum.totalPending,
          totalSkipped: sum.totalSkipped,
          completedAt: stats.wallClockEndedAt,
        },
      });
    }

    reply.send({ screenshotUploadUrls: [] });
  });

  //
  // Skip console output of the Cypress agent.
  //

  app.put("/instances/:instanceId/stdout", (_, reply) => {
    reply.send({});
  });
});
