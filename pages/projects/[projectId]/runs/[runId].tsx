import { AppLayout } from "@/core/components/AppLayout";
import { ErrorPage } from "@/core/components/ErrorPage";
import { RunAttributes } from "@/core/components/RunAttributes";
import { RunInstanceAttributes } from "@/core/components/RunInstanceAttributes";
import { useErrorHandler } from "@/core/data/AppError";
import { useRouterParam } from "@/core/routing/useRouterParam";
import { formatProjectName } from "@/projects/helpers";
import { useProject } from "@/projects/queries";
import { useRunInstancesPage } from "@/run-instances/queries";
import { useDeleteRun, useRun } from "@/runs/queries";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Pagination,
  PaginationItem,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableRow,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
import { Run } from "@prisma/client";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect } from "react";

export interface DeleteRunDialogProps {
  run: Run;
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

function DeleteRunDialog({
  run,
  open,
  onClose,
  onSubmitSuccess,
}: DeleteRunDialogProps): ReactElement {
  const { reset, mutate, isLoading } = useDeleteRun({
    onSuccess: onSubmitSuccess,
  });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={isLoading ? undefined : onClose}>
      <DialogContent>
        This action cannot be undone. This will permanently remove test run, run
        instances and test results. Running tests associated with the run will
        fail.
      </DialogContent>

      <DialogActions>
        <Button disabled={isLoading} onClick={onClose}>
          Dismiss
        </Button>

        <LoadingButton
          pending={isLoading}
          onClick={() => {
            mutate(run.id);
          }}
        >
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default function RunPage(): ReactElement {
  const router = useRouter();
  const runId = useRouterParam("runId");
  const projectId = useRouterParam("projectId");
  const run = useRun(projectId, runId);
  const project = useProject(projectId);
  const runInstances = useRunInstancesPage(projectId, runId, {
    page: router.query.page,
  });

  const pageError = run.error || project.error || runInstances.error;

  useErrorHandler(pageError);

  if (pageError) {
    return <ErrorPage error={pageError} />;
  }

  if (!run.data || !project.data) {
    return <AppLayout breadcrumbs={[["Projects", "/p"], "…"]} />;
  }

  return (
    <AppLayout
      breadcrumbs={[
        ["Projects", "/projects"],
        [formatProjectName(project.data), `/projects/${project.data.id}`],
      ]}
      actions={
        <NextLink
          href={{
            pathname: router.pathname,
            query: { ...router.query, delete: "true" },
          }}
        >
          <Button>Delete</Button>
        </NextLink>
      }
    >
      <DeleteRunDialog
        run={run.data}
        open={router.query.delete === "true"}
        onClose={() => {
          void router.replace({
            pathname: router.pathname,
            query: { ...router.query, delete: [] },
          });
        }}
        onSubmitSuccess={() => {
          void router.replace({
            pathname: `/projects/${run.data.projectId}`,
            query: {
              ...router.query,
              success: `"${run.data.ciBuildId}" run removed`,
            },
          });
        }}
      />

      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12}>
          <RunAttributes run={run.data} project={project.data} />
        </Grid>

        <Grid item={true} xs={12}>
          <Divider />
        </Grid>

        <Grid item={true} xs={12}>
          <TableContainer>
            <Table>
              {!runInstances.data ? (
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
                    {runInstances.data.nodes.map((runInstance) => (
                      <TableRow key={runInstance.id}>
                        <TableCell>
                          <RunInstanceAttributes
                            run={run.data}
                            runInstance={runInstance}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                  {runInstances.data.maxPage > 1 && (
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={3}>
                          <Pagination
                            page={runInstances.data.page}
                            count={runInstances.data.maxPage}
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
        </Grid>
      </Grid>
    </AppLayout>
  );
}
