import { requestJSON } from "@/core/data/Http";
import {
  createPageInputParams,
  PageInput,
  PageResponse,
} from "@/core/data/PageResponse";
import { Run, RunInstance } from "@prisma/client";
import { useQuery, useQueryClient, UseQueryResult } from "react-query";

export function useRunInstancesPage(
  projectId: string | undefined,
  runId: string | undefined,
  input: PageInput
): UseQueryResult<PageResponse<RunInstance>> {
  const queryClient = useQueryClient();
  const isComplete = !!queryClient.getQueryData<Run>(["run", projectId, runId])
    ?.completedAt;

  return useQuery(
    ["runInstances", projectId, runId, input],
    () => {
      const params = createPageInputParams(input);

      return requestJSON(
        `/api/projects/${projectId}/runs/${runId}/instances?${params}`
      );
    },
    {
      keepPreviousData: true,
      enabled: !!projectId && !!runId,
      refetchInterval: !isComplete && 5 * 1000,
      staleTime: isComplete ? Infinity : undefined,
    }
  );
}

export function useRunInstance(
  projectId: string | undefined,
  runId: string | undefined,
  runInstanceId: string | undefined
): UseQueryResult<RunInstance> {
  const queryClient = useQueryClient();
  const key = ["runInstance", projectId, runId, runInstanceId] as const;
  const isComplete = !!queryClient.getQueryData<Run>(["run", projectId, runId])
    ?.completedAt;

  return useQuery(
    key,
    () =>
      requestJSON(
        `/api/projects/${projectId}/runs/${runId}/instances/${runInstanceId}`
      ),
    {
      refetchInterval: !isComplete && 5 * 1000,
      staleTime: isComplete ? Infinity : undefined,
      enabled: !!(runId && projectId && runInstanceId),
      initialData: () => {
        for (const query of queryClient
          .getQueryCache()
          .findAll(["runInstances", projectId, runId])) {
          if (query.state.data != null) {
            const runInstances = query.state.data as PageResponse<RunInstance>;

            for (const runInstance of runInstances.nodes) {
              if (runInstance.id === runInstanceId) {
                return runInstance;
              }
            }
          }
        }

        return undefined;
      },
    }
  );
}
