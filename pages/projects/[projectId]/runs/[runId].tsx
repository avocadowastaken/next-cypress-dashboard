import { AppLayout } from "@/ui/core/AppLayout";
import { ErrorPage } from "@/ui/core/ErrorPage";
import { TablePager } from "@/ui/core/TablePager";
import { useRouterParam } from "@/ui/core/useRouterParam";
import { formatProjectName } from "@/ui/projects/projectHelpers";
import { useProject } from "@/ui/projects/projectQueries";
import { RunAttributes } from "@/ui/projects/RunAttributes";
import { useDeleteRun, useRun } from "@/ui/projects/runQueries";
import { RunInstanceAttributes } from "@/ui/runs/RunInstanceAttributes";
import { useRunInstancesPage } from "@/ui/runs/runQueries";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  Skeleton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { Run } from "@prisma/client";
import { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";

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
          loading={isLoading}
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
    page: router.query["page"],
    exclude: router.query["exclude"],
  });

  const [modalState, setModalState] = useState<"delete">();

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
        <Button
          onClick={() => {
            setModalState("delete");
          }}
        >
          Delete
        </Button>
      }
    >
      <DeleteRunDialog
        run={run.data}
        open={modalState === "delete"}
        onClose={() => {
          setModalState(undefined);
        }}
        onSuccess={() => {
          void router.replace({
            pathname: `/projects/${run.data.projectId}`,
            query: { success: `"${run.data.ciBuildId}" run removed` },
          });
        }}
      />

      <Stack spacing={2}>
        <RunAttributes run={run.data} project={project.data} />

        <Divider />

        <FormControlLabel
          label="Hide successful tests"
          control={
            <Switch
              checked={router.query["exclude"] === "passed"}
              onChange={(event) => {
                void router.replace({
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    exclude: event.target.checked ? "passed" : [],
                  },
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
