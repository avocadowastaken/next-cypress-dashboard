import { AppLayout } from "@/core/components/AppLayout";
import { ErrorPage } from "@/core/components/ErrorPage";
import { Inline } from "@/core/components/Inline";
import { Pre } from "@/core/components/Pre";
import { RunAttributes } from "@/core/components/RunAttributes";
import { Stack } from "@/core/components/Stack";
import {
  extractErrorCode,
  formatAppError,
  useErrorHandler,
} from "@/core/data/AppError";
import { useRouterParam } from "@/core/routing/useRouterParam";
import { formatProjectName } from "@/projects/helpers";
import {
  useDeleteProject,
  useProject,
  useProjectSecrets,
  useRevokeProjectSecrets,
} from "@/projects/queries";
import { useRunsPage } from "@/runs/queries";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  PaginationItem,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableRow,
  Typography,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
import { Project } from "@prisma/client";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect } from "react";

interface DeleteProjectDialogProps {
  project: Project;
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

function DeleteProjectDialog({
  open,
  project,
  onClose,
  onSubmitSuccess,
}: DeleteProjectDialogProps) {
  const { reset, mutate, isLoading } = useDeleteProject({
    onSuccess: onSubmitSuccess,
  });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose}>
      <form method="POST">
        <DialogContent>
          This action cannot be undone. This will permanently revoke your access
          to the{" "}
          <Typography color="primary">
            {project.org}/{project.repo}
          </Typography>{" "}
          project.
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Dismiss
          </Button>
          <LoadingButton
            pending={isLoading}
            onClick={() => {
              mutate(project.id);
            }}
          >
            Confirm
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

interface RevokeSecretsDialogProps {
  project: Project;
  open: boolean;
  onClose: () => void;
}

function RevokeSecretsDialog({
  open,
  project,
  onClose,
}: RevokeSecretsDialogProps): ReactElement {
  const { reset, mutate, isLoading } = useRevokeProjectSecrets({
    onSuccess: onClose,
  });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={isLoading ? undefined : onClose}>
      <DialogContent>
        This action cannot be undone. This will permanently revoke access for
        the current record key to the{" "}
        <Typography color="primary">
          {project.org}/{project.repo}
        </Typography>{" "}
        project.
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Dismiss
        </Button>

        <LoadingButton
          pending={isLoading}
          onClick={() => {
            mutate(project.id);
          }}
        >
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

interface ProjectSettingsDialogProps {
  project: Project;
  open: boolean;
  onClose: () => void;
  onRemoveClick: () => void;
  onRevokeClick: () => void;
}

function ProjectSettingsDialog({
  open,
  project,
  onClose,
  onRemoveClick,
  onRevokeClick,
}: ProjectSettingsDialogProps): ReactElement {
  const projectSecrets = useProjectSecrets(project.id, { enabled: open });
  const errorCode = !projectSecrets.error
    ? null
    : extractErrorCode(projectSecrets.error);

  useErrorHandler(projectSecrets.error);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Settings</DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          <Stack>
            <Typography>Project ID</Typography>
            <Typography variant="body2" display="block">
              This <code>projectId</code> should be in your{" "}
              <code>cypress.json</code>
            </Typography>

            <Pre
              language="json"
              code={JSON.stringify({ projectId: project.id }, null, 2)}
            />
          </Stack>

          <Stack>
            <Typography>Record Key</Typography>
            <Typography variant="body2" display="block">
              Secret key, do not expose it, but if you did you can revoke it
              anytime
            </Typography>
            {errorCode ? (
              <Alert
                severity="error"
                action={
                  errorCode === "GITHUB_REPO_NOT_FOUND" ||
                  errorCode === "GITHUB_REPO_ACCESS_DENIED" ? (
                    <Button color="inherit" onClick={onRemoveClick}>
                      Delete Project
                    </Button>
                  ) : (
                    <Button color="inherit" onClick={onRevokeClick}>
                      Regenerate
                    </Button>
                  )
                }
              >
                {formatAppError(errorCode)}
              </Alert>
            ) : projectSecrets.status !== "success" ? (
              <Skeleton />
            ) : (
              <Pre
                language="bash"
                code={`cypress run --record --key ${projectSecrets.data.recordKey}`}
              />
            )}
          </Stack>

          <Stack>
            <Typography>Danger Zone</Typography>

            <Inline>
              <Button onClick={onRevokeClick}>Revoke Project Secrets</Button>
              <Button onClick={onRemoveClick}>Delete Project</Button>
            </Inline>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ProjectPage(): ReactElement {
  const router = useRouter();
  const projectId = useRouterParam("projectId");
  const project = useProject(projectId);
  const runs = useRunsPage(project.data?.id, { page: router.query.page });

  useErrorHandler(project.error || runs.error);

  if (project.status === "error") {
    return <ErrorPage error={project.error} />;
  }

  if (project.status !== "success") {
    return <AppLayout breadcrumbs={[["Projects", "/projects"], "…"]} />;
  }

  return (
    <AppLayout
      breadcrumbs={[["Projects", "/projects"], formatProjectName(project.data)]}
      actions={
        <NextLink
          passHref={true}
          href={{
            pathname: router.pathname,
            query: { ...router.query, settings: "true" },
          }}
        >
          <Button>Settings</Button>
        </NextLink>
      }
    >
      <ProjectSettingsDialog
        project={project.data}
        open={router.query.settings === "true"}
        onClose={() => {
          void router.replace({
            pathname: router.pathname,
            query: { ...router.query, settings: [] },
          });
        }}
        onRemoveClick={() => {
          void router.push({
            pathname: router.pathname,
            query: { ...router.query, remove: "true" },
          });
        }}
        onRevokeClick={() => {
          void router.push({
            pathname: router.pathname,
            query: { ...router.query, revoke: "true" },
          });
        }}
      />

      <RevokeSecretsDialog
        project={project.data}
        open={router.query.revoke === "true"}
        onClose={() => {
          void router.replace({
            pathname: router.pathname,
            query: { ...router.query, revoke: [] },
          });
        }}
      />

      <DeleteProjectDialog
        project={project.data}
        open={router.query.remove === "true"}
        onClose={() => {
          void router.replace({
            pathname: router.pathname,
            query: { ...router.query, remove: [] },
          });
        }}
        onSubmitSuccess={() => {
          void router.replace({
            pathname: "/projects",
            query: { success: `${formatProjectName(project.data)} removed` },
          });
        }}
      />

      <TableContainer>
        <Table>
          {runs.status !== "success" ? (
            <TableBody>
              <TableRow>
                <TableCell>
                  <Skeleton />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : runs.data.count === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography color="textSecondary" align="center">
                    No Runs
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <>
              <TableBody>
                {runs.data.nodes.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell>
                      <RunAttributes run={run} project={project.data} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              {runs.data.maxPage > 1 && (
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Pagination
                        page={runs.data.page}
                        count={runs.data.maxPage}
                        renderItem={(item) => (
                          <NextLink
                            passHref={true}
                            href={{
                              pathname: router.pathname,
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
