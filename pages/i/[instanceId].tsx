import { prisma } from "@/api/db";
import { createServerSideProps } from "@/app/data/ServerSideProps";
import { AppLayout } from "@/ui/AppLayout";
import { DebugStepOver, SyncCircle } from "@/ui/icons";
import { RunBrowserChip, RunOSChip } from "@/ui/RunAttributes";
import { RunInstanceDurationChip } from "@/ui/RunInstanceDurationChip";
import {
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import { Check, Error } from "@material-ui/icons";
import { Project, Run, RunInstance, TestResult } from "@prisma/client";
import { ReactElement } from "react";

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
        testResults: true,
        run: { include: { project: true } },
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

  return (
    <AppLayout
      breadcrumbs={[
        ["Projects", "/p"],
        [`${project.org}/${project.repo}`, `/p/${project.id}`],
        [run.commitMessage || run.ciBuildId, `/r/${run.id}`],
        runInstance.spec,
      ]}
    >
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12}>
          <Grid container={true} spacing={1}>
            {runInstance.totalPassed > 0 && (
              <Grid item={true}>
                <Tooltip title="Passed">
                  <Chip icon={<Check />} label={runInstance.totalPassed} />
                </Tooltip>
              </Grid>
            )}

            {runInstance.totalFailed > 0 && (
              <Grid item={true}>
                <Tooltip title="Failed">
                  <Chip icon={<Error />} label={runInstance.totalFailed} />
                </Tooltip>
              </Grid>
            )}

            {runInstance.totalPending > 0 && (
              <Grid item={true}>
                <Tooltip title="Pending">
                  <Chip
                    icon={<SyncCircle />}
                    label={runInstance.totalPending}
                  />
                </Tooltip>
              </Grid>
            )}

            {runInstance.totalSkipped > 0 && (
              <Grid item={true}>
                <Tooltip title="Skipped">
                  <Chip
                    icon={<DebugStepOver />}
                    label={runInstance.totalSkipped}
                  />
                </Tooltip>
              </Grid>
            )}

            <Grid item={true}>
              <RunInstanceDurationChip
                claimedAt={runInstance.claimedAt}
                completedAt={runInstance.completedAt}
              />
            </Grid>

            <Grid item={true}>
              <RunOSChip os={run.os} osVersion={run.osVersion} />
            </Grid>

            <Grid item={true}>
              <RunBrowserChip
                browser={run.browser}
                browserVersion={run.browserVersion}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item={true} xs={12}>
          <TableContainer>
            <Table>
              <TableBody>
                {testResults.map((testResult: TestResult) => (
                  <TableRow key={testResult.id}>
                    <TableCell>{testResult.state}</TableCell>
                    <TableCell>{testResult.titleParts.join(" – ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </AppLayout>
  );
}
