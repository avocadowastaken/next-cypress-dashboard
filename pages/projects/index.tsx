import { TablePager } from "@/core/components/TablePager";
import { AppLayout } from "@/core/layout/AppLayout";
import { ErrorPage, useErrorHandler } from "@/core/layout/ErrorPage";
import { extractErrorCode, formatAppError } from "@/lib/AppError";
import { formatProjectName } from "@/projects/helpers";
import { useAddProject, useProjectsPage } from "@/projects/queries";
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
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { LoadingButton } from "@material-ui/lab";
import { Project } from "@prisma/client";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

const GITHUB_APP =
  process.env.NEXT_PUBLIC_GITHUB_APP || "next-cypress-dashboard";

interface AddProjectDialogProps {
  initialRepo: unknown;
  onClose: () => void;
  onSuccess: (project: Project) => void;
}

function AddProjectDialogForm({
  onClose,
  onSuccess,
  initialRepo,
}: AddProjectDialogProps): ReactElement {
  const { error, reset, isLoading, mutate } = useAddProject({ onSuccess });

  const errorCode = error && extractErrorCode(error);

  useErrorHandler(errorCode);

  return (
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
            <Button onClick={onClose} disabled={isLoading}>
              Dismiss
            </Button>

            <LoadingButton type="submit" pending={isLoading}>
              Confirm
            </LoadingButton>
          </DialogActions>
        </>
      )}
    </form>
  );
}

export function AddProjectDialog({
  initialRepo,
  onClose,
  onSuccess,
}: AddProjectDialogProps): ReactElement {
  const open = typeof initialRepo == "string";

  return (
    <Dialog open={open} fullWidth={true} maxWidth="xs">
      <AddProjectDialogForm
        onClose={onClose}
        initialRepo={initialRepo}
        onSuccess={onSuccess}
      />
    </Dialog>
  );
}

export default function ProjectsPage(): ReactElement {
  const router = useRouter();
  const projects = useProjectsPage({ page: router.query.page });

  if (projects.error) {
    return <ErrorPage error={projects.error} />;
  }

  return (
    <AppLayout
      breadcrumbs={["Projects"]}
      actions={
        <NextLink
          passHref={true}
          href={{ pathname: router.pathname, query: { add: "" } }}
        >
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
        onSuccess={(project) => {
          void projects.refetch();
          void router.replace({ query: { ...router.query, add: [] } });
          void router.replace(`/projects/${project.id}`);
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

          {!projects.data ? (
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
                {projects.data.nodes.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.providerId}</TableCell>

                    <TableCell>
                      <NextLink
                        passHref={true}
                        href={`/projects/${project.id}`}
                      >
                        <Link>{formatProjectName(project)}</Link>
                      </NextLink>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              {projects.data.maxPage > 1 && (
                <TablePager
                  page={projects.data.page}
                  maxPage={projects.data.maxPage}
                />
              )}
            </>
          )}
        </Table>
      </TableContainer>
    </AppLayout>
  );
}
