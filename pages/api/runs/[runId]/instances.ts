import { createAPIRequestHandler } from "@s/http/APIRequestHandler";

interface CreateInstanceInput {
  groupId: string;
}

interface CreateInstanceResponse {
  spec: null | string;
  instanceId: null | string;
  totalInstances: number;
  claimedInstances: number;
}

export default createAPIRequestHandler({
  async post(req, _, { db }): Promise<CreateInstanceResponse> {
    const runId = req.query.runId as string;
    const { groupId } = req.body as CreateInstanceInput;

    async function tryClaim(): Promise<CreateInstanceResponse> {
      const specs = await db.prisma.runInstance.findMany({
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
        const { count } = await db.prisma.runInstance.updateMany({
          data: { claimed: true },
          where: { id: response.instanceId, claimed: false },
        });

        // Race condition, start over;
        if (count === 0) {
          return tryClaim();
        }
      }

      return response;
    }

    return tryClaim();
  },
});
