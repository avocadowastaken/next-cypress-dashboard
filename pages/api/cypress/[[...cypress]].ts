import { TASKS_API_SECRET } from "@/core/secrets";
import { createApiHandler } from "@/lib/Api";
import { AppError } from "@/lib/AppError";
import {
  AddInstanceResultsInput,
  AddInstanceTestsInput,
  CreateInstanceInput,
  CreateInstanceResponse,
  CreateRunInput,
  InstanceTestResultInput,
  TestResult,
  toBrowser,
  toOS,
  toTestResultState,
  UpdateInstanceInput,
} from "@/lib/Cypress";
import { prisma } from "@/lib/db";
import { createGitHubStatusForRun, updateGitHubCheck } from "@/lib/GitHub";
import { trim } from "@/lib/Text";
import { createRunUrl } from "@/test-runs/helpers";
import { Prisma, Run } from "@prisma/client";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
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

async function fulfillRunStats(
  runId: string,
  completedAt: string
): Promise<void> {
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

    const run = await prisma.run.update({
      where: { id: runId },
      data: {
        completedAt,
        totalFailed: sum.totalFailed,
        totalPassed: sum.totalPassed,
        totalPending: sum.totalPending,
        totalSkipped: sum.totalSkipped,
      },
      include: {
        project: { include: { users: { take: 1 } } },
      },
    });

    if (run.project.users.length) {
      const [user] = run.project.users;
      await updateGitHubCheck(run, user, run.project).catch((error) => {
        console.error(error);
      });
    }
  }
}

export default createApiHandler((app) => {
  /**
   * Create a Run
   */
  app.post("/runs", async (req, res) => {
    let {
      group,
      specs,
      commit,
      platform,
      ciBuildId,
      recordKey,
      projectId,
    } = req.body as CreateRunInput;

    if (!recordKey || !projectId) {
      throw new AppError("FORBIDDEN");
    }

    if (!ciBuildId) {
      ciBuildId = commit.sha + "-" + Date.now();
    }

    const groupId = trim(group || ciBuildId);

    const projectWhereInput: Prisma.ProjectWhereInput =
      recordKey === TASKS_API_SECRET
        ? { id: projectId }
        : { id: projectId, secrets: { recordKey } };

    const project = await prisma.project.findFirst({
      rejectOnNotFound: true,
      where: projectWhereInput,
      include: { users: { take: 1 } },
    });

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

    if (isNewRun && project.users.length) {
      const [user] = project.users;
      await createGitHubStatusForRun(run, user, project).catch((error) => {
        console.error(error);
      });
    }

    res.send({
      groupId,
      isNewRun,
      runId: run.id,
      machineId: run.machineId,
      runUrl: createRunUrl(run),
    });
  });

  /**
   * Claim Instance for Run
   */
  app.post<{ params: { runId: string } }>(
    "/runs/:runId/instances",
    async (req, res) => {
      const { runId } = req.params;
      const { groupId } = req.body as CreateInstanceInput;

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
            res.json(response);
            return;
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

      res.json(response);
    }
  );

  /**
   * Fill instance results
   */
  app.put<{ params: { runInstanceId: string } }>(
    "/instances/:runInstanceId",
    async (req, res) => {
      const { runInstanceId } = req.params;
      const { error, stats, tests } = req.body as UpdateInstanceInput;

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

          testResults: tests?.map(
            (value): TestResult => ({
              id: value.testId,
              titleParts: value.title,
              displayError: value.displayError,
              state: toTestResultState(value.state),
            })
          ) as undefined | Prisma.JsonObject[],
        },
      });

      await fulfillRunStats(runId, stats.wallClockEndedAt);

      res.send({ screenshotUploadUrls: [] });
    }
  );

  /**
   * Add Instance Tests (cypress@^6.7.0)
   */
  app.post<{ params: { runInstanceId: string } }>(
    "/instances/:runInstanceId/tests",
    async (req, res) => {
      const { runInstanceId } = req.params;
      const { tests } = req.body as AddInstanceTestsInput;

      if (tests) {
        await prisma.runInstance.update({
          select: null,
          where: { id: runInstanceId },
          data: {
            totalPending: tests.length,
            testResults: tests.map(
              (value): Partial<TestResult> => ({
                state: "pending",
                displayError: null,
                id: value.clientId,
                titleParts: value.title,
              })
            ),
          },
        });
      }

      res.json({});
    }
  );

  /**
   * Add Instance Results (cypress@^6.7.0)
   */
  app.post<{ params: { runInstanceId: string } }>(
    "/instances/:runInstanceId/results",
    async (req, res) => {
      const { runInstanceId } = req.params;
      const { tests, stats, exception } = req.body as AddInstanceResultsInput;

      const runInstance = await prisma.runInstance.findUnique({
        rejectOnNotFound: true,
        where: { id: runInstanceId },
        select: { runId: true, testResults: true },
      });

      const testResults = runInstance.testResults as null | TestResult[];

      if (tests && testResults) {
        const testsMap = new Map<string, InstanceTestResultInput>(
          tests.map((test) => [test.clientId, test])
        );

        for (const testResult of testResults) {
          const test = testsMap.get(testResult.id);

          if (test) {
            testResult.displayError = test.displayError;
            testResult.state = toTestResultState(test.state);
          }
        }
      }

      await prisma.runInstance.update({
        select: null,
        where: { id: runInstanceId },
        data: {
          error: exception,
          totalPassed: stats.passes,
          totalFailed: stats.failures,
          totalPending: stats.pending,
          totalSkipped: stats.skipped,
          completedAt: stats.wallClockEndedAt,
          testResults: testResults as null | Prisma.JsonObject[],
        },
      });

      await fulfillRunStats(runInstance.runId, stats.wallClockEndedAt);

      res.json({});
    }
  );

  /**
   * Skip console output of the Cypress agent.
   */
  app.put("/instances/:instanceId/stdout", (_, res) => {
    res.json({});
  });
});
