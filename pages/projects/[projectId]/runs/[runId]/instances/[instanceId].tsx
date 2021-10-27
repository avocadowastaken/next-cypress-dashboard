import { TestResult } from "@/lib/Cypress";
import { AppLayout } from "@/ui/core/AppLayout";
import { ErrorPage } from "@/ui/core/ErrorPage";
import { DebugStepOver, SyncCircle } from "@/ui/core/icons";
import { Pre } from "@/ui/core/Pre";
import { useRouterParam } from "@/ui/core/useRouterParam";
import { formatProjectName } from "@/ui/projects/projectHelpers";
import { useProject } from "@/ui/projects/projectQueries";
import { RunAttributes } from "@/ui/projects/RunAttributes";
import { useRun } from "@/ui/projects/runQueries";
import { RunInstanceAttributes } from "@/ui/runs/RunInstanceAttributes";
import { useRunInstance } from "@/ui/runs/runQueries";
import {
  Check,
  Error,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Divider,
  FormControlLabel,
  IconButton,
  Skeleton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from "@mui/material";
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

        <FormControlLabel
          label="Hide successful tests"
          control={
            <Switch
              checked={router.query.exclude === "passed"}
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
                    if (
                      testResult.state === "passed" &&
                      router.query.exclude === "passed"
                    ) {
                      return null;
                    }

                    const isSelected = selectedResult === testResult.id;

                    return (
                      <Fragment key={testResult.id}>
                        <TableRow sx={{ "& > td": { borderBottom: "none" } }}>
                          <TableCell>
                            <Stack
                              spacing={1}
                              direction="row"
                              alignItems="center"
                            >
                              <Box height="20px">
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
                              </Box>

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
                            </Stack>
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
