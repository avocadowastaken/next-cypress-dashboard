import { prisma } from "@/api/db";
import { AppLayout } from "@/app/AppLayout";
import { createServerSideProps } from "@/app/data/ServerSideProps";
import { RunAttributes } from "@/app/runs/RunAttributes";
import { Pre } from "@/app/ui/Pre";
import { CreateRunInput } from "@/shared/cypress-types";
import { Grid } from "@material-ui/core";
import { Project, Run, RunInstance } from "@prisma/client";
import React, { ReactElement } from "react";

interface RunPageProps {
  run: Run & { project: Project; instances: RunInstance[] };
}

export const getServerSideProps = createServerSideProps<
  RunPageProps,
  { runId: string; projectId: string }
>(async ({ userId }, { params }) => {
  const { runId, projectId } = params || {};

  if (runId && projectId) {
    const run = await prisma.run.findFirst({
      include: { project: true, instances: true },
      where: {
        id: runId,
        projectId,
        project: { users: { some: { id: userId } } },
      },
    });

    if (run) {
      return { props: { run } };
    }
  }

  return { notFound: true };
});

export default function RunPage({ run }: RunPageProps): ReactElement {
  const commit = run.commit as CreateRunInput["commit"];

  return (
    <AppLayout
      breadcrumbs={[
        ["Projects", "/app/projects"],
        [
          `${run.project.org} / ${run.project.repo}`,
          `/app/projects/${run.project.id}`,
        ],
        [commit.message, `/app/projects/${run.project.id}/runs/${run.id}`],
      ]}
    >
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12}>
          <RunAttributes run={run} project={run.project} />
        </Grid>

        <Grid item={true} xs={12}>
          <Pre>{JSON.stringify(run.instances, null, 2)}</Pre>
        </Grid>
      </Grid>
    </AppLayout>
  );
}
