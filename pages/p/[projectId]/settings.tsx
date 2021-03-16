import { AppLayout } from "@/core/components/AppLayout";
import { ErrorPage } from "@/core/components/ErrorPage";
import { Pre } from "@/core/components/Pre";
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
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Link,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
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

export default function ProjectSecretsPage(): ReactElement {
  const router = useRouter();
  const projectId = useRouterParam("projectId");
  const project = useProject(projectId);
  const projectSecrets = useProjectSecrets(project.data?.id);

  useErrorHandler(project.error || projectSecrets.error);

  if (project.status === "error") {
    return <ErrorPage error={project.error} />;
  }

  if (project.status !== "success") {
    return <AppLayout breadcrumbs={[["Projects", "/p"]]} />;
  }

  const errorCode = !projectSecrets.error
    ? null
    : extractErrorCode(projectSecrets.error);

  return (
    <AppLayout
      breadcrumbs={[
        ["Projects", "/p"],
        [formatProjectName(project.data), `/p/${project.data.id}`],
        "Settings",
      ]}
      actions={
        project.status === "success" && (
          <NextLink
            passHref={true}
            href={{
              pathname: router.pathname,
              query: { ...router.query, remove: "true" },
            }}
          >
            <Button>Delete</Button>
          </NextLink>
        )
      }
    >
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
          void router.replace(
            `/p?success=${encodeURIComponent(
              `${formatProjectName(project.data)} removed`
            )}`
          );
        }}
      />

      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell variant="head">
                Project ID
                <Typography variant="body2" display="block">
                  This <code>projectId</code> should be in your{" "}
                  <code>cypress.json</code>
                </Typography>
              </TableCell>

              <TableCell>
                <Pre
                  language="json"
                  code={JSON.stringify({ projectId: project.data.id }, null, 2)}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell variant="head">
                Record Key
                <Typography variant="body2" display="block">
                  Secret key, do not expose it, but if you did you can{" "}
                  <NextLink
                    passHref={true}
                    href={{
                      pathname: router.pathname,
                      query: { ...router.query, revoke: "true" },
                    }}
                  >
                    <Link>revoke</Link>
                  </NextLink>{" "}
                  it anytime
                </Typography>
              </TableCell>

              <TableCell>
                {errorCode ? (
                  <Alert
                    severity="error"
                    action={
                      errorCode === "GITHUB_REPO_NOT_FOUND" ||
                      errorCode === "GITHUB_REPO_ACCESS_DENIED" ? (
                        <NextLink
                          passHref={true}
                          href={{
                            pathname: router.pathname,
                            query: { ...router.query, remove: "true" },
                          }}
                        >
                          <Button color="inherit" type="submit">
                            Delete Project
                          </Button>
                        </NextLink>
                      ) : (
                        <NextLink
                          passHref={true}
                          href={{
                            pathname: router.pathname,
                            query: { ...router.query, revoke: "true" },
                          }}
                        >
                          <Button color="inherit">Regenerate</Button>
                        </NextLink>
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
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </AppLayout>
  );
}
