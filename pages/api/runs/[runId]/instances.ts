import { prisma } from "/api/db";
import { createAPIRequestHandler } from "/api/http/APIRequestHandler";
import {
  CreateInstanceInput,
  CreateInstanceResponse,
} from "/shared/cypress-types";

async function tryClaim(
  runId: string,
  groupId: string
): Promise<CreateInstanceResponse> {
  const specs = await prisma.runInstance.findMany({
    where: { runId, groupId },
  });

  const response: CreateInstanceResponse = {
    spec: null,
    instanceId: null,
    claimedInstances: 0,
    totalInstances: specs.length,
  };

  for (const spec of specs) {
    if (spec.claimed) {
      response.claimedInstances += 1;
    } else {
      response.spec = spec.spec;
      response.instanceId = spec.id;
    }
  }

  if (response.instanceId) {
    const { count } = await prisma.runInstance.updateMany({
      data: { claimed: true },
      where: { id: response.instanceId, claimed: false },
    });

    // Race condition, start over;
    if (count === 0) {
      return tryClaim(runId, groupId);
    }
  }

  return response;
}

export default createAPIRequestHandler({
  async post(req, _): Promise<CreateInstanceResponse> {
    const runId = req.query.runId as string;
    const { groupId } = req.body as CreateInstanceInput;

    return tryClaim(runId, groupId);
  },
});
