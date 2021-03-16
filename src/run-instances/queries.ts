import { requestJSON } from "@/core/data/Http";
import {
  createPageInputParams,
  PageInput,
  PageResponse,
} from "@/core/data/PageResponse";
import { RunInstance } from "@prisma/client";
import { useQuery, UseQueryResult } from "react-query";
import { UseQueryOptions } from "react-query/types/react/types";

export function useRunInstancesPage(
  input: PageInput & { runId?: string },
  options?: Pick<
    UseQueryOptions<PageResponse<RunInstance>>,
    "enabled" | "keepPreviousData"
  >
): UseQueryResult<PageResponse<RunInstance>> {
  return useQuery(
    ["instances", input],
    () => {
      const params = createPageInputParams(input);

      if (input.runId) {
        params.set("runId", input.runId);
      }

      return requestJSON(`/api/instances?${params.toString()}`);
    },
    options
  );
}
