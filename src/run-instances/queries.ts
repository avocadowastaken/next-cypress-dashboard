import { requestJSON } from "@/core/data/Http";
import {
  createPageInputParams,
  PageInput,
  PageResponse,
} from "@/core/data/PageResponse";
import { RunInstance } from "@prisma/client";
import { useQuery, UseQueryResult } from "react-query";

export function useRunInstancesPage(
  projectId: string | undefined,
  runId: string | undefined,
  input: PageInput
): UseQueryResult<PageResponse<RunInstance>> {
  return useQuery(
    ["instances", projectId, runId, input],
    () => {
      const params = createPageInputParams(input);

      return requestJSON(
        `/api/projects/${projectId}/runs/${runId}/instances?${params}`
      );
    },
    { keepPreviousData: true, enabled: !!projectId && !!runId }
  );
}
