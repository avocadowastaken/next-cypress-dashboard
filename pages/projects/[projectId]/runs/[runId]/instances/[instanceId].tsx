import { DebugStepOver } from "@/core/components/icons";
import { Pre } from "@/core/components/Pre";
import { TablePager } from "@/core/components/TablePager";
import { AppLayout } from "@/core/layout/AppLayout";
import { ErrorPage } from "@/core/layout/ErrorPage";
import { useRouterParam } from "@/core/routing/useRouterParam";
import { formatProjectName } from "@/projects/helpers";
import { useProject } from "@/projects/queries";
import { useTestResults } from "@/test-results/queries";
import { RunInstanceAttributes } from "@/test-run-instances/components/RunInstanceAttributes";
import { useRunInstance } from "@/test-run-instances/queries";
import { RunAttributes } from "@/test-runs/components/RunAttributes";
import { useRun } from "@/test-runs/queries";
import {
  Box,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import {
  Check,
  Error,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@material-ui/icons";
import { useRouter } from "next/router";
import React, { Fragment, ReactElement, useState } from "react";

export default function RunInstancePage(): ReactElement {
  const router = useRouter();
  const runId = useRouterParam("runId");
  const projectId = useRouterParam("projectId");
  const instanceId = useRouterParam("instanceId");

  const project = useProject(projectId);
  const run = useRun(projectId, runId);
  const runInstance = useRunInstance(projectId, runId, instanceId);
  const testResults = useTestResults(projectId, runId, instanceId, {
    page: router.query.page,
  });

  const [selectedResult, setSelectedResult] = useState<string>();

  const pageError =
    run.error || project.error || runInstance.error || testResults.error;

  if (pageError) {
    return <ErrorPage error={pageError} />;
  }

  if (!project.data || !run.data || !runInstance.data) {
    return <AppLayout breadcrumbs={[["Projects", "/projects"], "…"]} />;
  }

  return (
    <AppLayout
      breadcrumbs={[
        ["Projects", "/projects"],
        [formatProjectName(project.data), `/projects/${projectId}`],
      ]}
    >
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12}>
          <RunAttributes run={run.data} project={project.data} />
        </Grid>

        <Grid item={true} xs={12}>
          <Divider />
        </Grid>

        <Grid item={true} xs={12}>
          <RunInstanceAttributes
            run={run.data}
            runInstance={runInstance.data}
          />
        </Grid>

        <Grid item={true} xs={12}>
          <Divider />
        </Grid>

        {runInstance.data.error ? (
          <Grid item={true} xs={12}>
            <Pre code={runInstance.data.error} language="bash" />
          </Grid>
        ) : (
          <Grid item={true} xs={12}>
            <TableContainer>
              <Table>
                {!testResults.data ? (
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
                      {testResults.data.nodes.map((testResult) => {
                        const isSelected = selectedResult === testResult.id;

                        return (
                          <Fragment key={testResult.id}>
                            <TableRow
                              sx={{ "& > td": { borderBottom: "none" } }}
                            >
                              <TableCell>
                                <Grid
                                  spacing={1}
                                  container={true}
                                  alignItems="center"
                                >
                                  <Grid item={true}>
                                    {testResult.state === "failed" ? (
                                      <Tooltip title="Failed">
                                        <Error color="error" fontSize="small" />
                                      </Tooltip>
                                    ) : testResult.state === "skipped" ? (
                                      <Tooltip title="Skipped">
                                        <DebugStepOver
                                          color="disabled"
                                          fontSize="small"
                                        />
                                      </Tooltip>
                                    ) : (
                                      <Check color="primary" fontSize="small" />
                                    )}
                                  </Grid>

                                  <Grid item={true}>
                                    {testResult.titleParts.join(" – ")}
                                  </Grid>

                                  {testResult.state === "failed" && (
                                    <Grid item={true}>
                                      <IconButton
                                        size="small"
                                        onClick={() => {
                                          setSelectedResult(
                                            !isSelected
                                              ? testResult.id
                                              : undefined
                                          );
                                        }}
                                      >
                                        {isSelected ? (
                                          <KeyboardArrowUp fontSize="small" />
                                        ) : (
                                          <KeyboardArrowDown fontSize="small" />
                                        )}
                                      </IconButton>
                                    </Grid>
                                  )}
                                </Grid>
                              </TableCell>
                            </TableRow>

                            <TableRow sx={{ "& > td": { paddingY: 0 } }}>
                              <TableCell>
                                <Collapse
                                  in={isSelected}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <Box paddingY={2}>
                                    {testResult.state === "failed" && (
                                      <Pre
                                        language="bash"
                                        code={
                                          testResult.displayError ||
                                          "Unknown error"
                                        }
                                      />
                                    )}
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          </Fragment>
                        );
                      })}
                    </TableBody>

                    {testResults.data.maxPage > 1 && (
                      <TablePager
                        page={testResults.data.page}
                        maxPage={testResults.data.maxPage}
                      />
                    )}
                  </>
                )}
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>
    </AppLayout>
  );
}
