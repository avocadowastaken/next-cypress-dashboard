import { requestJSON } from "@/lib/Http";
import { PageInput, PageResponse } from "@/lib/PageResponse";
import { Project, ProjectSecrets } from "@prisma/client";
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

export function useProjectsPage(
  input: PageInput
): UseQueryResult<PageResponse<Project>> {
  return useQuery(
    ["projects", input],
    () => requestJSON(`/api/projects?page=${input.page || 1}`),
    { keepPreviousData: true }
  );
}

export function useProject(
  projectId: string | undefined
): UseQueryResult<Project> {
  const queryClient = useQueryClient();
  return useQuery<Project>(
    ["project", projectId],
    () => requestJSON(`/api/projects/${projectId}`),
    {
      staleTime: Infinity,
      enabled: !!projectId,
      initialData: () => {
        for (const query of queryClient.getQueryCache().findAll("projects")) {
          if (query.state.data != null) {
            const projects = query.state.data as PageResponse<Project>;

            for (const project of projects.nodes) {
              if (project.id === projectId) {
                return project;
              }
            }
          }
        }

        return undefined;
      },
    }
  );
}

export function useAddProject(
  options?: Pick<UseMutationOptions<Project, Error, string>, "onSuccess">
): UseMutationResult<Project, Error, string> {
  const queryClient = useQueryClient();

  return useMutation(async (repo: string) => {
    const project = await requestJSON<Project>("/api/projects", {
      method: "POST",
      data: { repo },
    });

    await queryClient.invalidateQueries("projects");
    queryClient.setQueryData(["project", project.id], project);

    return project;
  }, options);
}

export function useDeleteProject(
  options?: Pick<UseMutationOptions<Project, Error, string>, "onSuccess">
): UseMutationResult<Project, Error, string> {
  const queryClient = useQueryClient();
  return useMutation(async (projectId: string) => {
    const project = await requestJSON<Project>(`/api/projects/${projectId}`, {
      method: "DELETE",
    });

    await queryClient.invalidateQueries("projects");

    return project;
  }, options);
}

export function useProjectSecrets(
  projectId: string | undefined,
  {
    enabled = !!projectId,
    ...options
  }: Pick<UseQueryOptions<ProjectSecrets>, "enabled"> = {}
): UseQueryResult<ProjectSecrets> {
  return useQuery(
    ["project", projectId, "secrets"],
    () => requestJSON(`/api/projects/${projectId}/secrets`),
    { ...options, enabled }
  );
}

export function useRevokeProjectSecrets(
  options?: Pick<UseMutationOptions<ProjectSecrets, Error, string>, "onSuccess">
): UseMutationResult<ProjectSecrets, Error, string> {
  const queryClient = useQueryClient();

  return useMutation(async (projectId) => {
    const projectSecrets = await requestJSON<ProjectSecrets>(
      `/api/projects/${projectId}/secrets`,
      { method: "POST" }
    );

    queryClient.setQueryData(
      ["project", projectSecrets.projectId, "secrets"],
      projectSecrets
    );

    return projectSecrets;
  }, options);
}
