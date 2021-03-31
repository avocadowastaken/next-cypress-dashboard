import { requestJSON } from "@/lib/Http";
import {
  createPageInputParams,
  PageInput,
  PageResponse,
} from "@/lib/PageResponse";
import { Project, Run } from "@prisma/client";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import {
  UseMutationOptions,
  UseQueryOptions,
} from "react-query/types/react/types";

export function useRunsPage(
  projectId: string | undefined,
  input: PageInput
): UseQueryResult<PageResponse<Run>> {
  return useQuery(
    ["runs", projectId, input],
    () => {
      return requestJSON(
        `/api/projects/${projectId}/runs?${createPageInputParams(
          input
        ).toString()}`
      );
    },
    { enabled: !!projectId, keepPreviousData: true }
  );
}

export function useRun(
  projectId: string | undefined,
  runId: string | undefined,
  options?: UseQueryOptions<Run>
): UseQueryResult<Run> {
  const queryClient = useQueryClient();
  const key = ["run", projectId, runId] as const;
  const isComplete = !!queryClient.getQueryData<Run>(key)?.completedAt;

  return useQuery(
    key,
    () => requestJSON<Run>(`/api/projects/${projectId}/runs/${runId}`),
    {
      ...options,
      refetchInterval: !isComplete && 5 * 1000,
      staleTime: isComplete ? Infinity : undefined,
      enabled: !!runId && !!projectId,
      initialData: () => {
        for (const query of queryClient
          .getQueryCache()
          .findAll(["runs", projectId])) {
          if (query.state.data != null) {
            const runs = query.state.data as PageResponse<Run>;

            for (const run of runs.nodes) {
              if (run.id === runId) {
                return run;
              }
            }
          }
        }

        return undefined;
      },
    }
  );
}

export function useDeleteRun(
  options?: Pick<UseMutationOptions<unknown, Error, string>, "onSuccess">
): UseMutationResult<Project, Error, string> {
  const queryClient = useQueryClient();

  return useMutation(async (runId: string) => {
    const response = await requestJSON<Project>(`/api/runs/${runId}`, {
      method: "DELETE",
    });

    await queryClient.invalidateQueries("runs");

    return response;
  }, options);
}
