import { prisma } from "@/api/db";
import { toPageParam, toRowsPerPageParam } from "@/data/PaginationParams";
import { createServerSideProps } from "@/data/ServerSideProps";
import { AppLayout } from "@/ui/AppLayout";
import { Button } from "@material-ui/core";
import { Project, Run } from "@prisma/client";
import NextLink from "next/link";
import { ReactElement } from "react";

const ROWS_PER_PAGE = [5, 10];

interface ProjectPageProps {
  page: number;
  count: number;
  rowsPerPage: number;
  project: Project & { runs: Run[] };
}

export const getServerSideProps = createServerSideProps<
  ProjectPageProps,
  { projectId: string }
>(async ({ userId }, { query, params }) => {
  const projectId = params?.projectId;

  if (projectId) {
    const page = toPageParam(query.page);
    const rowsPerPage = toRowsPerPageParam(query.per_page, ROWS_PER_PAGE);

    const [count, project] = await Promise.all([
      prisma.run.count({ where: { projectId } }),
      prisma.project.findFirst({
        where: { id: projectId, users: { some: { id: userId } } },
        include: { runs: { take: rowsPerPage, skip: page * rowsPerPage } },
      }),
    ]);

    if (project) {
      return { props: { project, page, count, rowsPerPage } };
    }
  }

  return { notFound: true };
});

export default function ProjectPage({
  project,
}: ProjectPageProps): ReactElement {
  return (
    <AppLayout
      breadcrumbs={[
        ["Projects", "/app/projects"],
        project.providerId,
        project.org,
        project.repo,
      ]}
      actions={
        <>
          <NextLink
            passHref={true}
            href={`/app/projects/${project.id}/secrets`}
          >
            <Button>Secrets</Button>
          </NextLink>

          <NextLink passHref={true} href={`/app/projects/${project.id}/delete`}>
            <Button>Delete</Button>
          </NextLink>
        </>
      }
    >
      <pre>{JSON.stringify(project, null, 2)}</pre>
    </AppLayout>
  );
}