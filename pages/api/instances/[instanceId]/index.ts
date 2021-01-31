import { prisma } from "/api/db";
import { createAPIRequestHandler } from "/api/http/APIRequestHandler";
import { UpdateInstanceResponse } from "/shared/cypress-types";

export default createAPIRequestHandler({
  async put(req): Promise<UpdateInstanceResponse> {
    const instanceId = req.query.instanceId as string;

    await prisma.runInstance.update({
      where: { id: instanceId },
      data: { result: req.body },
    });

    return { screenshotUploadUrls: [] };
  },
});
