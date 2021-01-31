import { prisma } from "@/api/db";
import { createAPIRequestHandler } from "@/api/http/APIRequestHandler";
import {
  UpdateInstanceInput,
  UpdateInstanceResponse,
} from "@/shared/cypress-types";

export default createAPIRequestHandler({
  async put(req): Promise<UpdateInstanceResponse> {
    const instanceId = req.query.instanceId as string;
    const { error, stats, tests } = req.body as UpdateInstanceInput;

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

    return { screenshotUploadUrls: [] };
  },
});
