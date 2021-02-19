import { prisma } from "@/api/db";
import { AppLayout } from "@/app/AppLayout";
import { createServerSideProps } from "@/app/data/ServerSideProps";
import { Pre } from "@/app/ui/Pre";
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
  return (
    <AppLayout
      breadcrumbs={[
        ["Projects", "/app/projects"],
        [
          `${run.project.org} / ${run.project.repo}`,
          `/app/projects/${run.project.id}`,
        ],

        `${run.ciBuildId}`,
      ]}
    >
      <Pre>{JSON.stringify(run, null, 2)}</Pre>
    </AppLayout>
  );
}
