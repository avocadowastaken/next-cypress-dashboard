import { prisma } from "@/api/db";
import { createServerSideProps } from "@/app/data/ServerSideProps";
import { AppLayout } from "@/ui/AppLayout";
import { DebugStepOver } from "@/ui/icons";
import { Pre } from "@/ui/Pre";
import { RunAttributes } from "@/ui/RunAttributes";
import { RunInstanceAttributes } from "@/ui/RunInstanceAttributes";
import {
  Box,
  Collapse,
  Divider,
  Grid,
  IconButton,
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
import { Project, Run, RunInstance, TestResult } from "@prisma/client";
import React, { Fragment, ReactElement, useState } from "react";

export interface RunInstancePageProps {
  runInstance: RunInstance & {
    testResults: TestResult[];
    run: Run & { project: Project };
  };
}

export const getServerSideProps = createServerSideProps<
  RunInstancePageProps,
  { instanceId: string }
>(async ({ userId }, { params }) => {
  const instanceId = params?.instanceId;

  if (instanceId) {
    const runInstance = await prisma.runInstance.findFirst({
      include: {
        run: { include: { project: true } },
        testResults: { orderBy: { testId: "asc" } },
      },
      where: {
        id: instanceId,
        run: { project: { users: { some: { id: userId } } } },
      },
    });

    if (runInstance) {
      return { props: { runInstance } };
    }
  }

  return { notFound: true };
});

export default function RunInstancePage({
  runInstance,
}: RunInstancePageProps): ReactElement {
  const {
    run,
    testResults,
    run: { project },
  } = runInstance;

  const [selectedResult, setSelectedResult] = useState<string>();

  return (
    <AppLayout
      breadcrumbs={[
        ["Projects", "/p"],
        [`${project.org}/${project.repo}`, `/p/${project.id}`],
      ]}
    >
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12}>
          <RunAttributes run={run} project={project} />
        </Grid>

        <Grid item={true} xs={12}>
          <Divider />
        </Grid>

        <Grid item={true} xs={12}>
          <RunInstanceAttributes runInstance={runInstance} />
        </Grid>

        <Grid item={true} xs={12}>
          <Divider />
        </Grid>

        {runInstance.error ? (
          <Grid item={true} xs={12}>
            <Pre code={runInstance.error} language="bash" />
          </Grid>
        ) : (
          <Grid item={true} xs={12}>
            <TableContainer>
              <Table>
                <TableBody>
                  {testResults.map((testResult: TestResult) => {
                    const isSelected = selectedResult === testResult.id;

                    return (
                      <Fragment key={testResult.id}>
                        <TableRow sx={{ "& > td": { borderBottom: "none" } }}>
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
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>
    </AppLayout>
  );
}
