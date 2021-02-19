import { prisma } from "@/api/db";
import { AppLayout } from "@/app/AppLayout";
import { createServerSideProps } from "@/app/data/ServerSideProps";
import { Pre } from "@/app/ui/Pre";
import { Project, Run, RunInstance } from "@prisma/client";
import { ReactElement } from "react";

export interface RunInstancePageProps {
  runInstance: RunInstance & { run: Run & { project: Project } };
}

export const getServerSideProps = createServerSideProps<
  RunInstancePageProps,
  { instanceId: string }
>(async ({ userId }, { params }) => {
  const instanceId = params?.instanceId;

  if (instanceId) {
    const runInstance = await prisma.runInstance.findFirst({
      include: { run: { include: { project: true } }, testResults: true },
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
  const { run } = runInstance;
  const { project } = run;

  return (
    <AppLayout
      breadcrumbs={[
        ["Projects", "/p"],
        [`${project.org}/${project.repo}`, `/p/${project.id}`],
        [run.commitMessage || run.ciBuildId, `/r/${run.id}`],
        runInstance.spec,
      ]}
    >
      <Pre>{JSON.stringify(runInstance, null, 2)}</Pre>
    </AppLayout>
  );
}
