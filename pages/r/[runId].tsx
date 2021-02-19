import { prisma } from "@/api/db";
import { AppLayout } from "@/app/AppLayout";
import { createServerSideProps } from "@/app/data/ServerSideProps";
import { RunAttributes } from "@/app/runs/RunAttributes";
import {
  Chip,
  Grid,
  Link,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@material-ui/core";
import { Check, Timer } from "@material-ui/icons";
import { Project, Run, RunInstance } from "@prisma/client";
import { format as formatDate, setMilliseconds, startOfToday } from "date-fns";
import NextLink from "next/link";
import React, { ReactElement, useMemo } from "react";

interface RunPageProps {
  run: Run & { project: Project; instances: RunInstance[] };
}

export const getServerSideProps = createServerSideProps<
  RunPageProps,
  { runId: string }
>(async ({ userId }, { params }) => {
  const runId = params?.runId;

  if (runId) {
    const run = await prisma.run.findFirst({
      where: {
        id: runId,
        project: { users: { some: { id: userId } } },
      },
      include: {
        project: true,
        instances: { orderBy: { claimedAt: "asc" } },
      },
    });

    if (run) {
      return { props: { run } };
    }
  }

  return { notFound: true };
});

interface RunInstanceDurationProps {
  instance: RunInstance;
}

function RunInstanceDuration({
  instance: { claimedAt, completedAt },
}: RunInstanceDurationProps): ReactElement {
  const duration = useMemo(() => {
    if (claimedAt && completedAt) {
      const diff = completedAt.getTime() - claimedAt.getTime();

      if (diff) {
        return formatDate(setMilliseconds(startOfToday(), diff), "mm:ss");
      }
    }

    return null;
  }, [claimedAt, completedAt]);

  return (
    <Chip icon={<Timer />} label={duration || <Skeleton width="33px" />} />
  );
}

export default function RunPage({ run }: RunPageProps): ReactElement {
  return (
    <AppLayout
      breadcrumbs={[
        ["Projects", "/p"],
        [`${run.project.org} / ${run.project.repo}`, `/p/${run.project.id}`],
        [run.commitMessage || run.ciBuildId, `/r/${run.id}`],
      ]}
    >
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12}>
          <RunAttributes run={run} project={run.project} />
        </Grid>

        <Grid item={true} xs={12}>
          <TableContainer>
            <Table>
              <TableBody>
                {run.instances.map((instance: RunInstance) => (
                  <TableRow key={instance.id}>
                    <TableCell align="center" padding="checkbox">
                      <Chip icon={<Check />} label={instance.totalPassed} />
                    </TableCell>

                    <TableCell align="center" padding="checkbox">
                      <RunInstanceDuration instance={instance} />
                    </TableCell>

                    <TableCell>
                      <NextLink passHref={true} href={`/i/${instance.id}`}>
                        <Link>{instance.spec}</Link>
                      </NextLink>
                    </TableCell>
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
