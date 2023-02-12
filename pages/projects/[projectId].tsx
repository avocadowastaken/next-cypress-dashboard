import { extractErrorCode, formatAppError } from "@/lib/AppError";
import { AppLayout } from "@/ui/core/AppLayout";
import { useErrorHandler } from "@/ui/core/ErrorPage";
import { Pre } from "@/ui/core/Pre";
import { TablePager } from "@/ui/core/TablePager";
import { useRouterParam } from "@/ui/core/useRouterParam";
import { formatProjectName } from "@/ui/projects/projectHelpers";
import {
  useDeleteProject,
  useProject,
  useProjectSecrets,
  useRevokeProjectSecrets,
} from "@/ui/projects/projectQueries";
import { RunAttributes } from "@/ui/projects/RunAttributes";
import { useRunsPage } from "@/ui/projects/runQueries";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { Project } from "@prisma/client";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";

interface ProjectErrorDialogProps {
  error: unknown;
  projectId: string;
  onRetry: () => void;
  onDeleteSuccess: () => void;
}

function ProjectErrorDialog({
  error,
  projectId,
  onRetry,
  onDeleteSuccess,
}: ProjectErrorDialogProps) {
  const code = extractErrorCode(error);
  const { mutate, isLoading } = useDeleteProject({
    onSuccess: onDeleteSuccess,
  });

  useErrorHandler(error);

  return (
    <Dialog open={true}>
      <DialogContent>{formatAppError(code)}</DialogContent>

      <DialogActions>
        <Button onClick={onRetry} disabled={isLoading}>
          Retry
        </Button>
        <LoadingButton
          loading={isLoading}
          onClick={() => {
            mutate(projectId);
          }}
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

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
  const { mutate, isLoading } = useDeleteProject({
    onSuccess: onSubmitSuccess,
  });

  return (
    <Dialog open={open} onClose={!isLoading ? undefined : onClose}>
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
          loading={isLoading}
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
  const { mutate, isLoading } = useRevokeProjectSecrets({ onSuccess: onClose });

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
          loading={isLoading}
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
          <Stack spacing={1}>
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

          <Stack spacing={1}>
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

          <Stack spacing={1}>
            <Typography>Danger Zone</Typography>

            <Stack spacing={1} direction="row">
              <Button onClick={onRevokeClick}>Revoke Project Secrets</Button>
              <Button onClick={onRemoveClick}>Delete Project</Button>
            </Stack>
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
  const runs = useRunsPage(project.data?.id, { page: router.query["page"] });

  const [modalState, setModalState] = useState<
    "remove" | "revoke" | "settings"
  >();

  const pageError = project.error || runs.error;

  if (pageError) {
    return (
      <ProjectErrorDialog
        error={pageError}
        projectId={projectId}
        onRetry={() => {
          router.reload();
        }}
        onDeleteSuccess={() => {
          void router.replace({
            pathname: "/projects",
            query: { success: "Project removed" },
          });
        }}
      />
    );
  }

  if (!project.data) {
    return <AppLayout breadcrumbs={[["Projects", "/projects"], "…"]} />;
  }

  return (
    <AppLayout
      breadcrumbs={[["Projects", "/projects"], formatProjectName(project.data)]}
      actions={
        <Button
          onClick={() => {
            setModalState("settings");
          }}
        >
          Settings
        </Button>
      }
    >
      <ProjectSettingsDialog
        project={project.data}
        open={modalState === "settings"}
        onClose={() => {
          setModalState(undefined);
        }}
        onRemoveClick={() => {
          setModalState("remove");
        }}
        onRevokeClick={() => {
          setModalState("revoke");
        }}
      />

      <RevokeSecretsDialog
        project={project.data}
        open={modalState === "revoke"}
        onClose={() => {
          setModalState(undefined);
        }}
      />

      <DeleteProjectDialog
        project={project.data}
        open={modalState === "remove"}
        onClose={() => {
          setModalState(undefined);
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
                <TablePager page={runs.data.page} maxPage={runs.data.maxPage} />
              )}
            </>
          )}
        </Table>
      </TableContainer>
    </AppLayout>
  );
}
