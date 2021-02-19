import { JsonObject, JsonValue } from "type-fest";

export interface CreateRunInput {
  specs: string[];
  group?: string | null;
  ciBuildId: string;
  projectId: string;
  recordKey?: string | null;
  commit: {
    sha: string;
    branch: string;
    authorName: string;
    authorEmail: string;
    message: string;
    remoteOrigin: string;
    defaultBranch: null | string;
  };
  platform: {
    osName: string;
    osVersion: string;
    osCpus: JsonObject[];
    osMemory: JsonObject;
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

export interface UpdateInstanceInput {
  error: null | string;

  hooks: Array<Record<string, unknown>>;

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

  tests: Array<{
    body: string;
    state: string;
    title: string[];
    testId: string;
    attempts: JsonObject[];
    displayError: JsonValue;
  }>;

  video: boolean;
  videoUrl?: string;
  screenshots: JsonObject[];
  cypressConfig: JsonObject;
  reporterStats: JsonObject;
}

export interface UpdateInstanceResponse {
  videoUploadUrl?: string;
  screenshotUploadUrls: unknown[];
}
