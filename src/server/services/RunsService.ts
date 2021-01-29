import { ScreenshotUploadInstruction } from "@s/db/models/Instance";
import { BaseService } from "@s/services/base/BaseService";

export interface CreateInstanceInput {
  groupId: string;
}

export interface CreateInstanceResponse {
  spec: null | string;
  instanceId: null | string;
  totalInstances: number;
  claimedInstances: number;
}

export interface UpdateInstanceResponse {
  videoUploadUrl?: string;
  screenshotUploadUrls: ScreenshotUploadInstruction[];
}

export class RunsService extends BaseService {
  // async getRun(runId: string): Promise<Run> {
  //   const run = await this.collections.runs.findOne({ runId });
  //
  //   if (!run) {
  //     throw new ResourceNotFoundError("Run not found", { runId });
  //   }
  //
  //   return run;
  // }
  // async getInstance(instanceId: string): Promise<Instance> {
  //   const instance = await this.collections.instances.findOne({ instanceId });
  //
  //   if (!instance) {
  //     throw new ResourceNotFoundError("Instance not found", { instanceId });
  //   }
  //
  //   return instance;
  // }
  // async findUnclaimedSpec(runId: string, groupId: string) {
  //   const run = await this.getRun(runId);
  //
  //   return run.specs.filter(
  //     (spec) => spec.groupId === groupId && !spec.claimed
  //   );
  // }
  // async createRun(input: CreateRunInput): Promise<CreateRunResponse> {
  //   const machineId = getUUID();
  //   const groupId = input.group || input.ciBuildId;
  //   const runId = sha1(
  //     "hex",
  //     input.projectId,
  //     input.ciBuildId,
  //     input.commit.sha
  //   );
  //
  //   await this.collections.projects.updateOne(
  //     { projectId: input.projectId },
  //     { projectId: input.projectId },
  //     { upsert: true }
  //   );
  //
  //   const project = await this.models.project.ensureProject(input.projectId);
  //
  //   const response: CreateRunResponse = {
  //     runId,
  //     groupId,
  //     machineId,
  //     warnings: [],
  //     isNewRun: true,
  //     runUrl: `/projects/${project.projectId}/runs/${runId}`,
  //   };
  //
  //   const run = await this.models.run.findSingle(runId);
  //
  //   // specs: await this.models.run.createRunSpecs(
  //   //   groupId,
  //   //   machineId,
  //   //   input.specs
  //   // ),
  //
  //   if (!run) {
  //     // this.models.run.collection
  //     // await this.models.run.insertOne({
  //     //   runId,
  //     //   groupId,
  //     //   commit: input.commit,
  //     //   platform: input.platform,
  //     //   ciBuildId: input.ciBuildId,
  //     //   projectId: input.projectId,
  //     // });
  //   } else {
  //     response.isNewRun = false;
  //
  //     const existingGroupSpecs = run.specs
  //       .filter((spec) => spec.groupId === groupId)
  //       .map((spec) => spec.spec);
  //     const newSpecs = difference(input.specs, existingGroupSpecs);
  //
  //     if (newSpecs.length) {
  //       if (existingGroupSpecs.length) {
  //         response.warnings.push({
  //           newSpecs: newSpecs.join(", "),
  //           originalSpecs: existingGroupSpecs.join(", "),
  //           message: `Group ${groupId} has different specs for the same run. Make sure each group in run has the same specs.`,
  //         });
  //       } else {
  //         const runSpecs = await this.models.run.createRunSpecs(
  //           groupId,
  //           machineId,
  //           newSpecs
  //         );
  //
  //         run.specs.push(...runSpecs);
  //       }
  //     }
  //   }
  //
  //   return response;
  // }
  // async createInstance(
  //   runId: string,
  //   { groupId }: CreateInstanceInput
  // ): Promise<CreateInstanceResponse> {
  //   const run = await this.getRun(runId);
  //   const response: CreateInstanceResponse = {
  //     spec: null,
  //     instanceId: null,
  //     totalInstances: 0,
  //     claimedInstances: 0,
  //   };
  //
  //   for (const spec of run.specs) {
  //     if (spec.groupId === groupId) {
  //       response.totalInstances += 1;
  //
  //       if (spec.claimed) {
  //         response.claimedInstances += 1;
  //       } else if (!response.spec) {
  //         response.spec = spec.spec;
  //         response.instanceId = spec.instanceId;
  //       }
  //     }
  //   }
  //
  //   if (response.instanceId) {
  //     await this.models.instance.createSingle({
  //       runId,
  //       instanceId: response.instanceId,
  //     });
  //   }
  //
  //   return response;
  // }
  // async updateInstanceResults(
  //   instanceId: string,
  //   results: InstanceResult
  // ): Promise<UpdateInstanceResponse> {
  //   const response: UpdateInstanceResponse = {
  //     screenshotUploadUrls: [],
  //     videoUploadUrl: undefined,
  //   };
  //
  //   const instance = await this.getInstance(instanceId);
  //
  //   instance.results = results;
  //
  //   return response;
  // }
}
