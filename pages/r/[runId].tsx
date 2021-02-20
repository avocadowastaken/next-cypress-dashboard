import { prisma } from "@/api/db";
import { createServerSideProps } from "@/app/data/ServerSideProps";
import { AppLayout } from "@/ui/AppLayout";
import { RunAttributes } from "@/ui/RunAttributes";
import { RunInstanceDurationChip } from "@/ui/RunInstanceDurationChip";
import {
  Chip,
  Divider,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@material-ui/core";
import { Check } from "@material-ui/icons";
import { Project, Run, RunInstance } from "@prisma/client";
import NextLink from "next/link";
import React, { ReactElement } from "react";

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

export default function RunPage({ run }: RunPageProps): ReactElement {
  return (
    <AppLayout
      breadcrumbs={[
        ["Projects", "/p"],
        [`${run.project.org} / ${run.project.repo}`, `/p/${run.project.id}`],
      ]}
    >
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12}>
          <RunAttributes run={run} project={run.project} />
        </Grid>

        <Grid item={true} xs={12}>
          <Divider />
        </Grid>

        <Grid item={true} xs={12}>
          <TableContainer>
            <Table>
              <TableBody>
                {run.instances.map((runInstance: RunInstance) => (
                  <TableRow key={runInstance.id}>
                    <TableCell align="center" padding="checkbox">
                      <Chip icon={<Check />} label={runInstance.totalPassed} />
                    </TableCell>

                    <TableCell align="center" padding="checkbox">
                      <RunInstanceDurationChip
                        claimedAt={runInstance.claimedAt}
                        completedAt={runInstance.completedAt}
                      />
                    </TableCell>

                    <TableCell>
                      <NextLink passHref={true} href={`/i/${runInstance.id}`}>
                        <Link>{runInstance.spec}</Link>
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
