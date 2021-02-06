import { isUniqueConstraintError, prisma } from "@/api/db";
import { CYPRESS_RECORD_KEY } from "@/api/env";
import { ForbiddenError } from "@/api/http/HTTPError";
import {
  CreateInstanceInput,
  CreateInstanceResponse,
  CreateRunInput,
  CreateRunResponse,
  UpdateInstanceInput,
  UpdateInstanceResponse,
} from "@/shared/cypress-types";
import { Run } from "@prisma/client";
import fastify, { HTTPMethods } from "fastify";
import { NextApiRequest } from "next";
import { NextApiResponse } from "next/dist/next-server/lib/utils";
import pino from "pino";

const app = fastify({
  logger: pino({
    prettyPrint: {},
    prettifier: require("pino-colada"),
  }),
});

//
// Create Run
//

app.post<{
  Body: CreateRunInput;
  Reply: CreateRunResponse;
}>("/runs", async (request, reply) => {
  const {
    group,
    specs,

    recordKey,
    ciBuildId,
    projectId,
    commit: { defaultBranch, ...commit },
    platform: { osCpus, osMemory, ...platform },
  } = request.body;

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
        project: { connect: { id: projectId } },
        commit: { create: { ...commit } },
        platform: { create: { ...platform } },
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
    run = await prisma.run.findUnique({
      rejectOnNotFound: true,
      where: {
        groupId_ciBuildId_projectId: {
          groupId,
          ciBuildId,
          projectId,
        },
      },
    });
  }

  reply.send({
    groupId,
    isNewRun,
    runId: run.id,
    machineId: run.machineId,
    runUrl: `http://${request.headers.host}/projects/${projectId}/runs/${run.id}`,
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

app.put("/instances/:instanceId/stdout", (_, reply) => {
  reply.send({});
});

export default async function CypressAPI(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { statusCode, body, headers } = await app.inject({
    url: req.url,
    query: req.query,
    payload: req.body,
    cookies: req.cookies,
    headers: req.headers,
    method: req.method as HTTPMethods,
  });

  res.status(statusCode);

  for (const [name, value] of Object.entries(headers)) {
    if (value) {
      res.setHeader(name, value);
    }
  }

  res.send(body);
}
