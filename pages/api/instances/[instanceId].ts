import { prisma } from "/api/db";
import { createAPIRequestHandler } from "/api/http/APIRequestHandler";

interface UpdateInstanceInput {
  stats: {
    suites: number;
    tests: number;
    passes: number;
    pending: number;
    skipped: number;
    failures: number;
    wallClockStartedAt: string;
    wallClockEndedAt: string;
    wallClockDuration: number;
  };

  tests: Array<Record<string, unknown>>;

  error: null | string;
  video: boolean;
  videoUrl?: string;

  screenshots: Array<Record<string, unknown>>;
  cypressConfig: Record<string, unknown>;
  reporterStats: Record<string, unknown>;
}

export interface UpdateInstanceResponse {
  videoUploadUrl?: string;
  screenshotUploadUrls: unknown[];
}

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
