import { prisma } from "@/api/db";
import { createServerSideProps } from "@/app/data/ServerSideProps";
import { AppLayout } from "@/ui/AppLayout";
import { RunAttributes } from "@/ui/RunAttributes";
import { RunInstanceAttributes } from "@/ui/RunInstanceAttributes";
import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@material-ui/core";
import { Project, Run, RunInstance } from "@prisma/client";
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
                {run.instances.map((runInstance) => (
                  <TableRow key={runInstance.id}>
                    <TableCell align="center">
                      <RunInstanceAttributes runInstance={runInstance} />
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
