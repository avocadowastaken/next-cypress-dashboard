import { TablePager } from "@/core/components/TablePager";
import { AppLayout } from "@/core/layout/AppLayout";
import { ErrorPage } from "@/core/layout/ErrorPage";
import { Stack } from "@/core/layout/Stack";
import { useRouterParam } from "@/core/routing/useRouterParam";
import { formatProjectName } from "@/projects/helpers";
import { useProject } from "@/projects/queries";
import { RunInstanceAttributes } from "@/test-run-instances/components/RunInstanceAttributes";
import { useRunInstancesPage } from "@/test-run-instances/queries";
import { RunAttributes } from "@/test-runs/components/RunAttributes";
import { useDeleteRun, useRun } from "@/test-runs/queries";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  Skeleton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
import { Run } from "@prisma/client";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

export interface DeleteRunDialogProps {
  run: Run;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function DeleteRunDialog({
  run,
  open,
  onClose,
  onSuccess,
}: DeleteRunDialogProps): ReactElement {
  const { mutate, isLoading } = useDeleteRun({ onSuccess });

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
    exclude: router.query.exclude,
  });

  const pageError = run.error || project.error || runInstances.error;

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
        onSuccess={() => {
          void router.replace({
            pathname: `/projects/${run.data.projectId}`,
            query: {
              ...router.query,
              success: `"${run.data.ciBuildId}" run removed`,
            },
          });
        }}
      />

      <Stack spacing={2}>
        <RunAttributes run={run.data} project={project.data} />

        <Divider />

        <FormControlLabel
          label="Hide successful specs"
          control={
            <Switch
              checked={router.query.exclude === "passed"}
              onChange={(_, checked) => {
                void router.replace({
                  pathname: router.pathname,
                  query: { ...router.query, exclude: checked ? "passed" : [] },
                });
              }}
            />
          }
        />

        <Divider />

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
                  <TablePager
                    page={runInstances.data.page}
                    maxPage={runInstances.data.maxPage}
                  />
                )}
              </>
            )}
          </Table>
        </TableContainer>
      </Stack>
    </AppLayout>
  );
}
