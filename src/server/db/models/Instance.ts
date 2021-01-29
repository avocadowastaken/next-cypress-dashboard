export interface AssetUploadInstruction {
  uploadUrl: string;
  readUrl: string;
}

export interface ScreenshotUploadInstruction extends AssetUploadInstruction {
  screenshotId: string;
}

export interface InstanceResult {
  stats: {
    suites: number;
    tests: number;
    passes: number;
    pending: number;
    skipped: number;
    failures: number;
    wallClockStartedAt: Date;
    wallClockEndedAt: Date;
    wallClockDuration: number;
  };
  tests: Array<Record<string, unknown>>;
  error: null | string;
  reporterStats: Record<string, unknown>;
  cypressConfig: Record<string, unknown>;
  video: boolean;
  videoUrl?: string;
  screenshots: Array<Record<string, unknown>>;
}

export interface Instance {
  runId: string;
  instanceId: string;
  results?: InstanceResult;
}

export class InstanceModel {
  static collection = "name";

  private instances = new Map<string, Instance>();

  async findSingle(id: string): Promise<Instance | undefined> {
    return this.instances.get(id);
  }

  async createSingle(values: Instance): Promise<Instance> {
    this.instances.set(values.instanceId, values);

    return values;
  }
}
