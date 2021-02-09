import { createApiHandler } from "@/api/ApiHandler";
import { isUniqueConstraintError, prisma } from "@/api/db";
import { CYPRESS_RECORD_KEY } from "@/api/env";
import { BadRequestError, ForbiddenError } from "@/api/HTTPError";
import {
  CreateInstanceInput,
  CreateInstanceResponse,
  CreateRunInput,
  CreateRunResponse,
  UpdateInstanceInput,
  UpdateInstanceResponse,
} from "@/shared/cypress-types";
import { Prisma, Project, Run } from "@prisma/client";
import parseGitUrl from "git-url-parse";

const resourceProviderMap = new Map<string, string>().set(
  "github.com",
  "github"
);

async function obtainRunProject({
  projectId,
  commit: { remoteOrigin },
}: CreateRunInput): Promise<Project> {
  let project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) {
    if (!remoteOrigin) {
      throw new BadRequestError({
        "commit.remoteOrigin": "Empty Git remote url",
      });
    }

    const { resource, name: repo, organization: org } = parseGitUrl(
      remoteOrigin
    );

    if (!org || !repo || !resource) {
      throw new BadRequestError({
        "commit.remoteOrigin": "Invalid Git remote url",
      });
    }

    const providerId = resourceProviderMap.get(resource);

    if (!providerId) {
      throw new BadRequestError({
        "commit.remoteOrigin": "Unknown provider ID",
      });
    }

    try {
      project = await prisma.project.create({
        data: { org, repo, providerId },
      });
    } catch (error: unknown) {
      if (!isUniqueConstraintError(error)) {
        throw error;
      }

      project = await prisma.project.findUnique({
        rejectOnNotFound: true,
        where: { org_repo_providerId: { org, repo, providerId } },
      });
    }
  }

  return project;
}

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
  }>("/runs", async ({ body, headers }, reply) => {
    const {
      group,
      specs,
      recordKey,
      ciBuildId,
      commit: { defaultBranch, ...commit },
      platform: { osCpus, osMemory, ...platform },
    } = body;

    if (CYPRESS_RECORD_KEY != null && CYPRESS_RECORD_KEY !== recordKey) {
      throw new ForbiddenError();
    }

    const groupId = group || ciBuildId;
    const project = await obtainRunProject(body);

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

    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    reply.send({
      groupId,
      isNewRun,
      runId: run.id,
      machineId: run.machineId,
      runUrl: `${protocol}://${headers.host}/projects/${project.id}/runs/${run.id}`,
    });
  });

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
          where: { runId, groupId, claimed: false },
        }),

        prisma.runInstance.count({
          where: { runId, groupId, claimed: true },
        }),
      ]);

      response.claimedInstances = claimedInstances;

      if (firstUnclaimed) {
        const { count } = await prisma.runInstance.updateMany({
          data: { claimed: true },
          where: { id: firstUnclaimed.id, claimed: false },
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
