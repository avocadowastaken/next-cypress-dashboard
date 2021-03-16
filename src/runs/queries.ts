import { requestJSON } from "@/core/data/Http";
import {
  createPageInputParams,
  PageInput,
  PageResponse,
} from "@/core/data/PageResponse";
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
  input: PageInput & { projectId?: string },
  options?: Pick<UseQueryOptions<PageResponse<Run>>, "enabled">
): UseQueryResult<PageResponse<Run>> {
  return useQuery(
    ["runs", input],
    () => {
      const params = createPageInputParams(input);

      if (input.projectId) {
        params.set("projectId", input.projectId);
      }

      return requestJSON(`/api/runs?${params.toString()}`);
    },
    options
  );
}

export function useRun(runId: string | undefined): UseQueryResult<Run> {
  const queryClient = useQueryClient();

  return useQuery(["run", runId], () => requestJSON(`/api/runs/${runId}`), {
    enabled: !!runId,
    initialData: () => {
      for (const query of queryClient.getQueryCache().findAll("runs")) {
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
  });
}

export function useDeleteRun(
  options?: Pick<UseMutationOptions<unknown, Error, string>, "onSuccess">
): UseMutationResult<Project, Error, string> {
  return useMutation(
    ["run", "delete"],
    (runId: string) =>
      requestJSON<Project>(`/api/runs/${runId}`, { method: "DELETE" }),
    options
  );
}
