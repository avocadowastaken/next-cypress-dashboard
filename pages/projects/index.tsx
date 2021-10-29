import { extractErrorCode, formatAppError } from "@/lib/AppError";
import { AppLayout } from "@/ui/core/AppLayout";
import { ErrorPage, useErrorHandler } from "@/ui/core/ErrorPage";
import { TablePager } from "@/ui/core/TablePager";
import { formatProjectName } from "@/ui/projects/projectHelpers";
import { useAddProject, useProjectsPage } from "@/ui/projects/projectQueries";
import { Add } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
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
  TextField,
} from "@mui/material";
import { Project } from "@prisma/client";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";

const GITHUB_APP =
  process.env["NEXT_PUBLIC_GITHUB_APP"] || "next-cypress-dashboard";

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

            <LoadingButton type="submit" loading={isLoading}>
              Confirm
            </LoadingButton>
          </DialogActions>
        </>
      )}
    </form>
  );
}

export function AddProjectDialog({
  onClose,
  onSuccess,
  initialRepo,
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
  const projects = useProjectsPage({ page: router.query["page"] });

  const [addRepo, setAddRepo] = useState<string>();

  useEffect(() => {
    if (typeof router.query["add"] == "string") setAddRepo(router.query["add"]);
  }, [router.query["add"]]);

  if (projects.error) {
    return <ErrorPage error={projects.error} />;
  }

  return (
    <AppLayout
      breadcrumbs={["Projects"]}
      actions={
        <Button
          size="small"
          endIcon={<Add />}
          onClick={() => {
            setAddRepo("");
          }}
        >
          Add
        </Button>
      }
    >
      <AddProjectDialog
        initialRepo={addRepo}
        onClose={() => {
          setAddRepo(undefined);
        }}
        onSuccess={(project) => {
          setAddRepo(undefined);
          void projects.refetch();
          void router.replace(`/projects/${project.id}`);
        }}
      />

      <TableContainer>
        <Table>
          {!projects.data ? (
            <TableBody>
              <TableRow>
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
                    <TableCell>
                      <NextLink
                        passHref={true}
                        href={`/projects/${project.id}`}
                      >
                        <Link>
                          {formatProjectName(project)} ({project.providerId})
                        </Link>
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
