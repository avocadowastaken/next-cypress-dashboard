import { AppLayout } from "@/core/components/AppLayout";
import { extractErrorCode, formatAppError } from "@/core/data/AppError";
import { requestJSON } from "@/core/data/Http";
import { PageResponse } from "@/core/data/PageResponse";
import { formatProjectName } from "@/projects/helpers";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Link,
  Pagination,
  PaginationItem,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { LoadingButton } from "@material-ui/lab";
import { Project } from "@prisma/client";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

const GITHUB_APP =
  process.env.NEXT_PUBLIC_GITHUB_APP || "next-cypress-dashboard";

interface AddProjectDialogProps {
  initialRepo: unknown;
  onClose: () => void;
  onSubmitSuccess: (project: Project) => void;
}

export function AddProjectDialog({
  initialRepo,
  onClose,
  onSubmitSuccess,
}: AddProjectDialogProps): ReactElement {
  const open = typeof initialRepo == "string";
  const queryClient = useQueryClient();
  const { error, reset, isLoading, mutate } = useMutation(
    "POST /api/projects",
    (repo: string) =>
      requestJSON<Project>("/api/projects", { method: "POST", data: { repo } }),
    {
      onSuccess: (project) => {
        onSubmitSuccess(project);
        queryClient.setQueryData(`/api/project/${project.id}`, project);
      },
    }
  );

  const errorCode = error && extractErrorCode(error);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <Dialog open={open} fullWidth={true} maxWidth="xs">
      <form
        method="POST"
        onSubmit={(event) => {
          event.preventDefault();

          const formData = new FormData(event.currentTarget);
          const repo = formData.get("repo");

          if (typeof repo == "string") {
            mutate(repo);
          }
        }}
      >
        {errorCode === "GITHUB_REPO_NOT_FOUND" ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" onClick={reset}>
                Close
              </Button>
            }
          >
            Repository not found, did you grant access for the{" "}
            <Link
              color="inherit"
              underline="always"
              href={`https://github.com/apps/${GITHUB_APP}/installations/new`}
            >
              {GITHUB_APP}
            </Link>{" "}
            app?
          </Alert>
        ) : (
          <>
            <DialogContent>
              <TextField
                name="repo"
                label="Repo URL"
                required={true}
                fullWidth={true}
                autoFocus={true}
                disabled={isLoading}
                error={!!errorCode}
                helperText={!!errorCode && formatAppError(errorCode)}
                placeholder="https://github.com/umidbekk/next-cypress-dashboard"
                defaultValue={typeof initialRepo == "string" ? initialRepo : ""}
              />
            </DialogContent>

            <DialogActions>
              <Button type="button" onClick={onClose} disabled={isLoading}>
                Dismiss
              </Button>

              <LoadingButton pending={isLoading}>Confirm</LoadingButton>
            </DialogActions>
          </>
        )}
      </form>
    </Dialog>
  );
}

export default function ProjectsPage(): ReactElement {
  const router = useRouter();
  const response = useQuery<PageResponse<Project>>(
    `/api/projects?page=${router.query.page}`,
    { keepPreviousData: true }
  );

  return (
    <AppLayout
      breadcrumbs={["Projects"]}
      actions={
        <NextLink passHref={true} href={{ pathname: "/p", query: { add: "" } }}>
          <Button size="small" endIcon={<Add />}>
            Add
          </Button>
        </NextLink>
      }
    >
      <AddProjectDialog
        initialRepo={router.query.add}
        onClose={() => {
          void router.replace({ query: { ...router.query, add: [] } });
        }}
        onSubmitSuccess={(project) => {
          void router.replace(`/p/${project.id}`);
        }}
      />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Provider</TableCell>
              <TableCell>Repo</TableCell>
            </TableRow>
          </TableHead>

          {response.status !== "success" ? (
            <TableBody>
              <TableRow>
                <TableCell>
                  <Skeleton />
                </TableCell>

                <TableCell>
                  <Skeleton />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <>
              <TableBody>
                {response.data.nodes.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.providerId}</TableCell>

                    <TableCell>
                      <NextLink passHref={true} href={`/p/${project.id}`}>
                        <Link>{formatProjectName(project)}</Link>
                      </NextLink>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              {response.data.maxPage > 1 && (
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Pagination
                        page={response.data.page}
                        count={response.data.maxPage}
                        renderItem={(item) => (
                          <NextLink
                            passHref={true}
                            href={{
                              pathname: "/p",
                              query: { ...router.query, page: item.page },
                            }}
                          >
                            <PaginationItem {...item} />
                          </NextLink>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </>
          )}
        </Table>
      </TableContainer>
    </AppLayout>
  );
}
