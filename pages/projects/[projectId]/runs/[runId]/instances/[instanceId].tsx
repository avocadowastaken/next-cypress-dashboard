import { DebugStepOver, SyncCircle } from "@/core/components/icons";
import { Pre } from "@/core/components/Pre";
import { TestResult } from "@/core/helpers/Cypress";
import { AppLayout } from "@/core/layout/AppLayout";
import { ErrorPage } from "@/core/layout/ErrorPage";
import { Inline } from "@/core/layout/Inline";
import { Stack } from "@/core/layout/Stack";
import { useRouterParam } from "@/core/routing/useRouterParam";
import { formatProjectName } from "@/projects/helpers";
import { useProject } from "@/projects/queries";
import { RunInstanceAttributes } from "@/test-run-instances/components/RunInstanceAttributes";
import { useRunInstance } from "@/test-run-instances/queries";
import { RunAttributes } from "@/test-runs/components/RunAttributes";
import { useRun } from "@/test-runs/queries";
import {
  Box,
  Collapse,
  Divider,
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
import React, { Fragment, ReactElement, useState } from "react";

export default function RunInstancePage(): ReactElement {
  const runId = useRouterParam("runId");
  const projectId = useRouterParam("projectId");
  const instanceId = useRouterParam("instanceId");

  const project = useProject(projectId);
  const run = useRun(projectId, runId);
  const runInstance = useRunInstance(projectId, runId, instanceId);

  const [selectedResult, setSelectedResult] = useState<string>();

  const pageError = run.error || project.error || runInstance.error;

  if (pageError) {
    return <ErrorPage error={pageError} />;
  }

  if (!project.data || !run.data || !runInstance.data) {
    return <AppLayout breadcrumbs={[["Projects", "/projects"], "…"]} />;
  }

  const testResults = runInstance.data.testResults as null | TestResult[];

  return (
    <AppLayout
      breadcrumbs={[
        ["Projects", "/projects"],
        [formatProjectName(project.data), `/projects/${projectId}`],
      ]}
    >
      <Stack spacing={2}>
        <RunAttributes run={run.data} project={project.data} />

        <Divider />

        <RunInstanceAttributes run={run.data} runInstance={runInstance.data} />

        <Divider />

        {runInstance.data.error ? (
          <Pre code={runInstance.data.error} language="bash" />
        ) : (
          <TableContainer>
            <Table>
              {!testResults ? (
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {testResults.map((testResult) => {
                    const isSelected = selectedResult === testResult.id;

                    return (
                      <Fragment key={testResult.id}>
                        <TableRow sx={{ "& > td": { borderBottom: "none" } }}>
                          <TableCell>
                            <Inline>
                              {testResult.state === "passed" ? (
                                <Check color="primary" fontSize="small" />
                              ) : testResult.state === "failed" ? (
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
                                <Tooltip title="Pending">
                                  <SyncCircle
                                    fontSize="small"
                                    color="disabled"
                                  />
                                </Tooltip>
                              )}

                              <span>{testResult.titleParts.join(" – ")}</span>

                              {testResult.state === "failed" && (
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setSelectedResult(
                                      !isSelected ? testResult.id : undefined
                                    );
                                  }}
                                >
                                  {isSelected ? (
                                    <KeyboardArrowUp fontSize="small" />
                                  ) : (
                                    <KeyboardArrowDown fontSize="small" />
                                  )}
                                </IconButton>
                              )}
                            </Inline>
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
                                      testResult.displayError || "Unknown error"
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
              )}
            </Table>
          </TableContainer>
        )}
      </Stack>
    </AppLayout>
  );
}
