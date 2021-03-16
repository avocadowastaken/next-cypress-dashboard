import { AppLayout } from "@/core/components/AppLayout";
import { DebugStepOver } from "@/core/components/icons";
import { Pre } from "@/core/components/Pre";
import { RunAttributes } from "@/core/components/RunAttributes";
import { RunInstanceAttributes } from "@/core/components/RunInstanceAttributes";
import { prisma } from "@/core/helpers/db";
import { verifyGitHubRepoAccess } from "@/core/helpers/GitHub";
import {
  createServerSideProps,
  redirectToSignIn,
} from "@/core/ServerSideProps";
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
>(async ({ userId }, context) => {
  const instanceId = context.params?.instanceId;

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
      try {
        await verifyGitHubRepoAccess(
          userId,
          runInstance.run.project.org,
          runInstance.run.project.repo
        );
      } catch {
        return redirectToSignIn(context);
      }

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
        ["Projects", "/projects"],
        [`${project.org}/${project.repo}`, `/projects/${project.id}`],
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
          <RunInstanceAttributes run={run} runInstance={runInstance} />
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
