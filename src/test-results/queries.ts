import { requestJSON } from "@/core/data/Http";
import {
  createPageInputParams,
  PageInput,
  PageResponse,
} from "@/core/data/PageResponse";
import { RunInstance, TestResult } from "@prisma/client";
import { useQuery, useQueryClient, UseQueryResult } from "react-query";

export function useTestResults(
  projectId: string | undefined,
  runId: string | undefined,
  runInstanceId: string | undefined,
  input: PageInput
): UseQueryResult<PageResponse<TestResult>> {
  const queryClient = useQueryClient();
  const staleTime = queryClient.getQueryData<RunInstance>([
    "runInstance",
    projectId,
    runId,
    runInstanceId,
  ])?.completedAt
    ? Infinity
    : undefined;

  return useQuery(
    ["testResults", projectId, runId, runInstanceId, input],
    () => {
      const params = createPageInputParams(input);

      return requestJSON(
        `/api/projects/${projectId}/runs/${runId}/instances/${runInstanceId}/results?${params}`
      );
    },
    {
      staleTime,
      keepPreviousData: true,
      enabled: !!(projectId && runId && runInstanceId),
    }
  );
}
