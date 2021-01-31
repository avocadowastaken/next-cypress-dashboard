import { prisma } from "@/api/db";
import { createAPIRequestHandler } from "@/api/http/APIRequestHandler";
import {
  CreateInstanceInput,
  CreateInstanceResponse,
} from "@/shared/cypress-types";

async function claimInstance(
  runId: string,
  groupId: string
): Promise<CreateInstanceResponse> {
  const [
    firstUnclaimed,
    totalInstances,
    claimedInstances,
  ] = await prisma.$transaction([
    prisma.runInstance.findFirst({
      where: { runId, groupId, claimed: false },
    }),

    prisma.runInstance.count({
      where: { runId, groupId },
    }),

    prisma.runInstance.count({
      where: { runId, groupId, claimed: true },
    }),
  ]);

  const response: CreateInstanceResponse = {
    spec: null,
    instanceId: null,

    totalInstances,
    claimedInstances,
  };

  if (firstUnclaimed) {
    const { count } = await prisma.runInstance.updateMany({
      data: { claimed: true },
      where: { id: firstUnclaimed.id, claimed: false },
    });

    // Another process claimed this instance, retry…
    if (count === 0) {
      return claimInstance(runId, groupId);
    }

    response.claimedInstances += 1;
    response.spec = firstUnclaimed.spec;
    response.instanceId = firstUnclaimed.id;
  }

  return response;
}

export default createAPIRequestHandler({
  async post(req, _): Promise<CreateInstanceResponse> {
    const runId = req.query.runId as string;
    const { groupId } = req.body as CreateInstanceInput;

    return claimInstance(runId, groupId);
  },
});
