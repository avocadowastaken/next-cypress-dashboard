export interface CreateRunInput {
  specs: string[];
  group?: string | null;
  ciBuildId: string;
  projectId: string;
  recordKey?: string | null;
  commit: {
    sha: string;
    branch?: string | null;
    authorName?: string | null;
    authorEmail?: string | null;
    message?: string | null;
    remoteOrigin?: string | null;
    defaultBranch?: string | null;
  };
  platform: {
    osName: string;
    osVersion: string;
    osCpus?: unknown[];
    osMemory?: unknown;
    browserName: string;
    browserVersion: string;
  };
}

export interface CreateRunResponse {
  groupId: string;
  machineId: string;
  runId: string;
  runUrl: string;
  isNewRun: boolean;
}

export interface CreateInstanceInput {
  groupId: string;
}

export interface CreateInstanceResponse {
  spec: null | string;
  instanceId: null | string;
  totalInstances: number;
  claimedInstances: number;
}

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
